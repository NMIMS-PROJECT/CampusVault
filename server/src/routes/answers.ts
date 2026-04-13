import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { addCredits, spendCredits } from "../services/credits.js";

export const answersRouter = Router();

answersRouter.post("/:id/unlock", requireAuth, async (req, res) => {
  const answerId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!answerId) {
    return res.status(400).json({ message: "Invalid answer id." });
  }
  const auth = (req as AuthedRequest).auth;
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    include: { question: true },
  });
  if (!answer) {
    return res.status(404).json({ message: "Answer not found." });
  }
  if (!answer.isPremium) {
    return res.json({ content: answer.content, charged: 0 });
  }
  if (answer.userId === auth.id) {
    return res.json({ content: answer.content, charged: 0 });
  }

  const unlockCost = answer.creditsToUnlock;
  try {
    await prisma.$transaction(async (tx: any) => {
      const existingUnlock = await tx.answerUnlock.findFirst({
        where: { answerId: answer.id, userId: auth.id },
      });
      if (existingUnlock) {
        return;
      }
      await spendCredits(tx, auth.id, unlockCost, `Unlocked premium answer ${answer.id}`);
      await addCredits(tx, answer.userId, unlockCost, `Premium answer unlocked ${answer.id}`);
      await tx.answerUnlock.create({
        data: { answerId: answer.id, userId: auth.id, cost: unlockCost },
      });
    });
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Unlock failed." });
  }

  return res.json({ content: answer.content, charged: unlockCost });
});

answersRouter.post("/:id/upvote", requireAuth, async (req, res) => {
  const answerId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!answerId) {
    return res.status(400).json({ message: "Invalid answer id." });
  }
  const answer = await prisma.answer.update({
    where: { id: answerId },
    data: { upvotes: { increment: 1 } },
    select: { id: true, upvotes: true, userId: true },
  });

  if (answer.upvotes % 10 === 0) {
    await prisma.$transaction(async (tx: any) => {
      await addCredits(tx, answer.userId, 5, `Upvote milestone (${answer.upvotes}) on answer ${answer.id}`);
    });
  }

  return res.json(answer);
});


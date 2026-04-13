import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { spendCredits } from "../services/credits.js";
import { notifyUser } from "../services/socket.js";

const bookSchema = z.object({
  mentorId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  durationMin: z.number().int().min(15).max(120).default(30),
  isFree: z.boolean().default(false),
  creditsUsed: z.number().int().min(0).max(100).default(0),
});

export const sessionsRouter = Router();

sessionsRouter.post("/book", requireAuth, async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized." });
  }
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid booking payload." });
  }
  try {
    const session = await prisma.$transaction(async (tx: any) => {
      if (!parsed.data.isFree && parsed.data.creditsUsed > 0) {
        await spendCredits(tx, auth.id, parsed.data.creditsUsed, "Booked mentor session");
      }
      return tx.mentorSession.create({
        data: {
          menteeId: auth.id,
          mentorId: parsed.data.mentorId,
          scheduledAt: new Date(parsed.data.scheduledAt),
          durationMin: parsed.data.durationMin,
          isFree: parsed.data.isFree,
          creditsUsed: parsed.data.creditsUsed,
        },
      });
    });
    notifyUser(parsed.data.mentorId, "session-booked", session);
    notifyUser(auth.id, "session-booked", session);
    return res.status(201).json(session);
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Booking failed." });
  }
});

sessionsRouter.get("/my", requireAuth, async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized." });
  }
  const sessions = await prisma.mentorSession.findMany({
    where: { menteeId: auth.id },
    orderBy: { scheduledAt: "desc" },
  });
  return res.json(sessions);
});


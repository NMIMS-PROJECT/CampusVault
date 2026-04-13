import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, optionalAuth, type AuthedRequest } from "../middleware/auth.js";
import { spendCredits, addCredits } from "../services/credits.js";

export const companiesRouter = Router();

companiesRouter.get("/", async (req, res) => {
  const branch = typeof req.query.branch === "string" ? req.query.branch : undefined;
  const gpa = typeof req.query.gpa === "string" ? Number(req.query.gpa) : undefined;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;

  const companies = await prisma.company.findMany({
    where: {
      ...(branch ? { eligibleBranches: { has: branch } } : {}),
      ...(typeof gpa === "number" && Number.isFinite(gpa)
        ? {
            OR: [{ minGpa: { lte: gpa } }, { minGpa: null }],
          }
        : {}),
      ...(search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),
    },
    orderBy: { name: "asc" },
  });

  return res.json(companies);
});

companiesRouter.get("/:id", optionalAuth, async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  const companyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      questions: {
        select: {
          id: true,
          content: true,
          round: true,
          year: true,
          isPremium: true,
          creditsToUnlock: true,
        },
      },
    },
  });

  if (!company) {
    return res.status(404).json({ message: "Company not found." });
  }

  // Check if user has unlocked this company's bundle
  let isUnlocked = false;
  if (auth) {
    const unlock = await prisma.companyUnlock.findUnique({
      where: {
        companyId_userId: { companyId: company.id, userId: auth.id },
      },
    });
    isUnlocked = !!unlock;
  }

  return res.json({
    ...company,
    isUnlocked,
    bundleStatus: isUnlocked ? "unlocked" : "locked",
  });
});

companiesRouter.get("/:id/questions", optionalAuth, async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  const companyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return res.status(404).json({ message: "Company not found." });
  }

  // Check if user has unlocked this company's bundle
  let isUnlocked = false;
  if (auth) {
    const unlock = await prisma.companyUnlock.findUnique({
      where: {
        companyId_userId: { companyId: company.id, userId: auth.id },
      },
    });
    isUnlocked = !!unlock;
  }

  const questions = await prisma.question.findMany({
    where: { companyId: companyId },
    orderBy: { year: "desc" },
  });

  // If user hasn't unlocked the bundle, redact question content
  const filteredQuestions = isUnlocked
    ? questions
    : questions.map((q) => ({
        ...q,
        content: "[Locked] Unlock this company's question bundle to view content",
      }));

  return res.json({ questions: filteredQuestions, isUnlocked });
});

companiesRouter.post("/:id/unlock-bundle", requireAuth, async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const companyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    return res.status(404).json({ message: "Company not found." });
  }

  try {
    const bundlePrice = company.bundlePrice || 50;

    let alreadyUnlocked = false;

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: auth.id } });
      if (!user || user.credits < bundlePrice) {
        throw new Error("Insufficient credits to unlock this bundle.");
      }

      const existingUnlock = await tx.companyUnlock.findUnique({
        where: {
          companyId_userId: { companyId: company.id, userId: auth.id },
        },
      });

      if (existingUnlock) {
        alreadyUnlocked = true;
        return;
      }

      await spendCredits(tx, auth.id, bundlePrice, `Unlocked ${company.name} question bundle`);
      await tx.companyUnlock.create({
        data: {
          companyId: company.id,
          userId: auth.id,
          cost: bundlePrice,
        },
      });
    });

    if (alreadyUnlocked) {
      return res.status(200).json({ message: "Bundle already unlocked.", creditsSpent: 0 });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { credits: true },
    });

    return res.status(200).json({
      message: `Successfully unlocked ${company.name} question bundle!`,
      creditsSpent: company.bundlePrice || 50,
      remainingCredits: updatedUser?.credits,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error instanceof Error ? error.message : "Unlock failed." });
  }
});


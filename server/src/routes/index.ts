import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { answersRouter } from "./answers.js";
import { analyzerRouter } from "./analyzer.js";
import { assessmentRouter } from "./assessment.js";
import { authRouter } from "./auth.js";
import { companiesRouter } from "./companies.js";
import { creditsRouter } from "./credits.js";
import { mentorsRouter } from "./mentors.js";
import { questionsRouter } from "./questions.js";
import { sessionsRouter } from "./sessions.js";
import { usersRouter } from "./users.js";

export const apiRouter = Router();

// Enhanced health check with DB status
apiRouter.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      ok: true,
      service: "placementos-api",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      service: "placementos-api",
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown database error",
      timestamp: new Date().toISOString(),
    });
  }
});

apiRouter.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ ok: true, database: "connected" });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      database: "disconnected",
      error: error instanceof Error ? error.message : "Unknown database error",
    });
  }
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/assessment", assessmentRouter);
apiRouter.use("/companies", companiesRouter);
apiRouter.use("/questions", questionsRouter);
apiRouter.use("/answers", answersRouter);
apiRouter.use("/mentors", mentorsRouter);
apiRouter.use("/sessions", sessionsRouter);
apiRouter.use("/analyzer", analyzerRouter);
apiRouter.use("/credits", creditsRouter);


import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";        
import { prisma } from "../lib/prisma.js";
import { spendCredits } from "../services/credits.js";
import { env } from "../config/env.js";

const upload = multer({ storage: multer.memoryStorage() });

// Validation schema for analyzer response
const AnalyzerResultSchema = z.object({
  profileScore: z.object({
    projects: z.number().min(0).max(100),
    skills: z.number().min(0).max(100),
    dsa: z.number().min(0).max(100),
    communication: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
  }),
  salaryRange: z.string().min(5),
  gaps: z.array(z.string()).min(3).max(5),
});

type AnalyzerResult = z.infer<typeof AnalyzerResultSchema>;

export const analyzerRouter = Router();

analyzerRouter.post("/run", requireAuth, upload.single("resumePdf"), async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized." });
  }
  
  // Future Implementation: Actually parse the PDF Buffer via external service or Cloudinary upload
  // Right now, we fallback to resumeText if provided, else just dummy string
  const resumeText = req.body.resumeText || (req.file ? "Parsed PDF text mock" : "");
  if (resumeText.length < 10 && !req.file) {
    return res.status(400).json({ message: "Provide either a resume PDF or pasted text (min 10 chars)." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        githubUrl: true, linkedinUrl: true, targetRoles: true,
        strongConcepts: true, gpa: true,
        projects: { select: { title: true, techStack: true } },
        certifications: { select: { name: true } }
      }
    });

    const ollamaUrl = env.OLLAMA_URL;
    const ollamaModel = env.OLLAMA_MODEL;

    const profileData = {
      resume: resumeText,
      githubUrl: user?.githubUrl,
      linkedinUrl: user?.linkedinUrl,
      projects: user?.projects,
      certifications: user?.certifications,
      targetRoles: user?.targetRoles,
      gpa: user?.gpa,
    };

    const systemPrompt = "You are a career strategist specializing in Indian campus placements. Analyze the user profile and provide: 1) A score (0-100) for each category: DSA, Projects, Skills, Communication, Experience. 2) An estimated salary range for Indian tech companies (e.g. '₹8 - 14 LPA'). 3) Top 3-5 specific gaps to address as an array of strings. Return valid JSON only with keys shape: { profileScore: { projects: number, skills: number, dsa: number, communication: number, experience: number }, salaryRange: string, gaps: string[] }.";

    const ollamaResponse = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: JSON.stringify(profileData),
          }
        ],
        stream: false,
        temperature: 0.3,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.statusText}`);
    }

    const ollamaData = await ollamaResponse.json();
    const raw = ollamaData.message?.content;
    if (!raw) {
      throw new Error("Ollama returned an empty response.");
    }

    console.log("📊 Raw Ollama response:", raw.substring(0, 200) + "...");

    // Extract JSON from response (handles markdown code blocks)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in Ollama response.");
    }

    const cleaned = jsonMatch[0];
    let result: any;
    
    try {
      result = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      throw new Error("Failed to parse Ollama response as JSON.");
    }

    // Validate against schema
    let validatedResult: AnalyzerResult;
    try {
      validatedResult = AnalyzerResultSchema.parse(result);
      console.log("✅ Analysis validated successfully:", validatedResult);
    } catch (validationError) {
      console.error("❌ Validation Error:", validationError);
      throw new Error(
        `Invalid analysis format: ${
          validationError instanceof z.ZodError
            ? (validationError.issues[0]?.message ?? "Unknown validation error")
            : "Unknown error"
        }`,
      );
    }

    // Ensure scores are reasonable based on user data
    if (user?.gpa && user.gpa >= 8) {
      validatedResult.profileScore.dsa = Math.max(validatedResult.profileScore.dsa, 60);
    }
    if (user?.projects && user.projects.length > 0) {
      validatedResult.profileScore.projects = Math.max(validatedResult.profileScore.projects, 65);
    }

    await prisma.resume.upsert({
      where: { userId: auth.id },
      update: { analysisJson: validatedResult, salaryEst: validatedResult.salaryRange },
      create: {
        userId: auth.id,
        fileUrl: req.file ? "mock-cloudinary-url.pdf" : "inline://resume-text",
        analysisJson: validatedResult,
        salaryEst: validatedResult.salaryRange,
      },
    });

    return res.json(validatedResult);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Analyzer Error:", errorMessage);
    
    // Return more specific error messages for debugging
    if (errorMessage.includes("ECONNREFUSED")) {
      return res.status(503).json({ message: "Ollama service not available. Make sure Ollama is running on " + env.OLLAMA_URL });
    }
    if (errorMessage.includes("not found")) {
      return res.status(503).json({ message: `Ollama model '${env.OLLAMA_MODEL}' not found. Run: ollama pull ${env.OLLAMA_MODEL}` });
    }
    if (errorMessage.includes("JSON")) {
      return res.status(400).json({ message: "Invalid response format from AI. Please try again." });
    }
    
    return res.status(500).json({ message: errorMessage || "Failed to analyze profile." });
  }
});

analyzerRouter.post("/deep-dive", requireAuth, async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  try {
    await prisma.$transaction(async (tx: any) => {
      await spendCredits(tx, auth.id, 50, "Deep-dive AI analysis");
    });
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Could not run deep dive." });
  }

  return res.json({
    summary: "Deep-dive generated",
    recommendations: ["Improve STAR bullets", "Add measurable outcomes", "Target role-aligned projects"],
  });
});


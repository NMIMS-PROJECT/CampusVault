import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const companies = [
  {
    name: "Google India",
    minGpa: 7.5,
    eligibleBranches: ["CSE", "IT", "AIML"],
    roles: ["Software Engineer", "Data Engineer", "SRE"],
    requiredSkills: ["DSA", "System Design", "Python", "C++", "SQL"],
    package: "80+ LPA",
    description: "Google India's campus hiring program for engineering graduates",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
  },
  {
    name: "Microsoft India",
    minGpa: 7.0,
    eligibleBranches: ["CSE", "IT", "ECE"],
    roles: ["Software Engineer", "Cloud Engineer", "AI Engineer"],
    requiredSkills: ["DSA", "OOP", "C#", "Azure", "REST APIs"],
    package: "70+ LPA",
    description: "Microsoft's premier engineering roles for campus graduates",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
  },
  {
    name: "Amazon India",
    minGpa: 7.2,
    eligibleBranches: ["CSE", "IT"],
    roles: ["SDE", "SDE-2", "Operations Engineer"],
    requiredSkills: ["DSA", "Java", "AWS", "Distributed Systems", "DBMS"],
    package: "75+ LPA",
    description: "Amazon's campus hiring for software development engineers",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
  },
  {
    name: "Goldman Sachs India",
    minGpa: 7.8,
    eligibleBranches: ["CSE", "IT"],
    roles: ["Analyst", "Software Developer", "Quantitative Analyst"],
    requiredSkills: ["DSA", "C++", "Java", "Financial Systems", "Algorithms"],
    package: "60+ LPA",
    description: "Goldman Sachs technology division campus recruitment",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Goldman_Sachs.svg/1200px-Goldman_Sachs.svg.png",
  },
  {
    name: "Flipkart",
    minGpa: 7.0,
    eligibleBranches: ["CSE", "IT", "AIML"],
    roles: ["Software Engineer", "Data Scientist", "Backend Engineer"],
    requiredSkills: ["DSA", "Java", "Python", "Scaling", "Databases"],
    package: "50+ LPA",
    description: "India's e-commerce leader campus hiring program",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flipkart_new_logo.svg/1200px-Flipkart_new_logo.svg.png",
  },
  {
    name: "Infosys",
    minGpa: 6.5,
    eligibleBranches: ["CSE", "IT", "ECE"],
    roles: ["Systems Engineer", "Associate", "Developer"],
    requiredSkills: ["DSA", "Java", "C++", "SQL", "OOPS"],
    package: "30+ LPA",
    description: "Infosys campus recruitment for engineering graduates",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1200px-Infosys_logo.svg.png",
  },
  {
    name: "TCS",
    minGpa: 6.3,
    eligibleBranches: ["CSE", "IT", "ECE"],
    roles: ["Assistant System Engineer", "Software Developer"],
    requiredSkills: ["DSA", "C", "Java", "SQL", "Databases"],
    package: "28+ LPA",
    description: "Tata Consultancy Services campus hiring",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/1200px-Tata_Consultancy_Services_Logo.svg.png",
  },
  {
    name: "Accenture India",
    minGpa: 6.5,
    eligibleBranches: ["CSE", "IT"],
    roles: ["Associate Software Engineer", "Developer", "Analyst"],
    requiredSkills: ["C", "Java", "Python", "SQL", "problem-solving"],
    package: "35+ LPA",
    description: "Accenture's campus recruitment for technology roles",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture_logo.svg/1200px-Accenture_logo.svg.png",
  },
  {
    name: "Walmart (PhonePe)",
    minGpa: 7.0,
    eligibleBranches: ["CSE", "IT", "AIML"],
    roles: ["Software Engineer", "Data Engineer", "Backend Developer"],
    requiredSkills: ["Java", "C++", "DSA", "Microservices", "Scala"],
    package: "55+ LPA",
    description: "Walmart's fintech and technology hiring in India",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Walmart_logo_2018.svg/1200px-Walmart_logo_2018.svg.png",
  },
  {
    name: "Uber India",
    minGpa: 7.3,
    eligibleBranches: ["CSE", "IT"],
    roles: ["Senior Software Engineer", "Backend Engineer", "ML Engineer"],
    requiredSkills: ["DSA", "System Design", "Python", "Go", "Distributed Systems"],
    package: "60+ LPA",
    description: "Uber's campus hiring for engineering positions",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/1200px-Uber_logo_2018.svg.png",
  },
];

const interviewQuestions = [
  // Google-style questions
  {
    company: "Google India",
    questions: [
      { content: "Design a rate limiter that can handle 10K requests per second", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement LRU Cache with O(1) get and put operations", round: "Technical", year: 2023, isPremium: true, creditsToUnlock: 5 },
      { content: "Find the median of two sorted arrays", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design a recommendation system for YouTube videos", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement autocomplete feature for search", round: "Technical", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "How would you handle a database with 1 billion records?", round: "System Design", year: 2023, isPremium: true, creditsToUnlock: 5 },
      { content: "Given a sorted array, remove duplicates in place", round: "Technical", year: 2022, isPremium: false, creditsToUnlock: 0 },
      { content: "Design Google Drive - storage sync system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
    ],
  },
  // Microsoft-style questions
  {
    company: "Microsoft India",
    questions: [
      { content: "Design a distributed cache system for Azure", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement a chat application architecture", round: "System Design", year: 2023, isPremium: true, creditsToUnlock: 5 },
      { content: "Reverse a linked list", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design a task scheduling system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Find all permutations of a string", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design notification delivery system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement Trie data structure", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "How to scale a microservices architecture?", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
    ],
  },
  // Amazon-style questions
  {
    company: "Amazon India",
    questions: [
      { content: "Design Amazon warehouse management system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Find maximum profit from stocks with cooldown", round: "Technical", year: 2023, isPremium: true, creditsToUnlock: 5 },
      { content: "Design e-commerce product catalog", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement LFU Cache", round: "Technical", year: 2023, isPremium: true, creditsToUnlock: 5 },
      { content: "Number of islands in 2D grid", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design Amazon shopping cart system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Merge k sorted lists", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "How to handle high traffic sales events?", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
    ],
  },
  // Goldman Sachs-style questions
  {
    company: "Goldman Sachs India",
    questions: [
      { content: "Design a trading platform with real-time data feeds", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement matrix chain multiplication", round: "Technical", year: 2023, isPremium: true, creditsToUnlock: 5 },
      { content: "Calculate maximum profit from stock trades", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design risk management and compliance system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement ternary search algorithm", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design fraud detection system for transactions", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
    ],
  },
  // Flipkart-style questions
  {
    company: "Flipkart",
    questions: [
      { content: "Design Flipkart search engine", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement word break algorithm", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design product recommendation system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Build an inventory management system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Longest substring without repeating characters", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design payment processing system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
    ],
  },
  // Infosys-style questions
  {
    company: "Infosys",
    questions: [
      { content: "Design enterprise integration system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 3 },
      { content: "Implement binary search tree", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design client-server architecture", round: "System Design", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Implement heap sort algorithm", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design database backup system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 3 },
    ],
  },
  // TCS-style questions
  {
    company: "TCS",
    questions: [
      { content: "Implement quick sort algorithm", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design data processing pipeline", round: "System Design", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Implement merge sort with analysis", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design logging and monitoring system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 3 },
      { content: "Find nth Fibonacci number efficiently", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
    ],
  },
  // Accenture-style questions
  {
    company: "Accenture India",
    questions: [
      { content: "Implement stack using queue", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design multi-tenant application", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 3 },
      { content: "Check balanced parentheses", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
      { content: "Design API gateway system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 3 },
      { content: "Implement graph traversal (BFS/DFS)", round: "Technical", year: 2023, isPremium: false, creditsToUnlock: 0 },
    ],
  },
  // PhonePe-style questions
  {
    company: "Walmart (PhonePe)",
    questions: [
      { content: "Design payment gateway for high volume transactions", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement consistent hashing", round: "Technical", year: 2023, isPremium: true, creditsToUnlock: 5 },
      { content: "Design wallet system with settlement", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Build fraud detection for payments", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement distributed transaction management", round: "Technical", year: 2023, isPremium: true, creditsToUnlock: 5 },
    ],
  },
  // Uber-style questions
  {
    company: "Uber India",
    questions: [
      { content: "Design location-based services for Uber", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement geohashing for location partitioning", round: "Technical", year: 2023, isPremium: true, creditsToUnlock: 5 },
      { content: "Design matching and dispatch system", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Handle real-time tracking at scale", round: "System Design", year: 2024, isPremium: true, creditsToUnlock: 5 },
      { content: "Implement surge pricing algorithm", round: "Technical", year: 2023, isPremium: true, creditsToUnlock: 5 },
    ],
  },
];

async function main() {
  const demoPasswordHash = await bcrypt.hash("Demo12345!", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@placementos.dev" },
    update: {
      name: "Demo Student",
      passwordHash: demoPasswordHash,
      branch: "CSE",
      gpa: 8.1,
      tier: "INTERMEDIATE",
      credits: 500,
      targetRoles: ["SWE", "Frontend Dev"],
      languages: ["JavaScript", "Python", "C++"],
      strongConcepts: ["DSA", "DBMS", "OS"],
    },
    create: {
      email: "demo@placementos.dev",
      name: "Demo Student",
      passwordHash: demoPasswordHash,
      branch: "CSE",
      gpa: 8.1,
      tier: "INTERMEDIATE",
      credits: 500,
      targetRoles: ["SWE", "Frontend Dev"],
      languages: ["JavaScript", "Python", "C++"],
      strongConcepts: ["DSA", "DBMS", "OS"],
    },
  });

  await prisma.creditTransaction.createMany({
    data: [
      { userId: demoUser.id, amount: 200, reason: "Registration welcome bonus" },
      { userId: demoUser.id, amount: 300, reason: "Premium features credit" },
    ],
    skipDuplicates: true,
  });

  // Create all real companies
  const createdCompanies = [];
  for (const company of companies) {
    const existing = await prisma.company.findFirst({ where: { name: company.name } });
    if (existing) {
      createdCompanies.push(existing);
      continue;
    }
    const created = await prisma.company.create({ data: company });
    createdCompanies.push(created);
  }

  // Create questions for each company from the dynamic questions array
  for (const questionSet of interviewQuestions) {
    const company = createdCompanies.find((c) => c.name === questionSet.company);
    if (!company) continue;

    for (const question of questionSet.questions) {
      const existing = await prisma.question.findFirst({
        where: {
          companyId: company.id,
          content: question.content,
        },
      });

      if (!existing) {
        await prisma.question.create({
          data: {
            companyId: company.id,
            postedById: demoUser.id,
            content: question.content,
            round: question.round,
            year: question.year,
            isPremium: question.isPremium,
            creditsToUnlock: question.creditsToUnlock,
          },
        });
      }
    }
  }

  const mentorEmails = Array.from({ length: 5 }).map((_, idx) => `mentor${idx + 1}@placementos.dev`);
  for (let idx = 0; idx < mentorEmails.length; idx += 1) {
    const email = mentorEmails[idx];
    const hash = await bcrypt.hash(`MentorPass${idx + 1}!`, 10);
    await prisma.user.upsert({
      where: { email },
      update: {
        name: `Mentor ${idx + 1}`,
        passwordHash: hash,
        tier: "PLACEMENT_READY",
        branch: "CSE",
        gpa: 9,
        credits: 1000,
        targetRoles: ["SWE"],
        languages: ["JavaScript", "Python"],
        strongConcepts: ["DSA", "System Design"],
      },
      create: {
        email,
        name: `Mentor ${idx + 1}`,
        passwordHash: hash,
        tier: "PLACEMENT_READY",
        branch: "CSE",
        gpa: 9,
        credits: 1000,
        targetRoles: ["SWE"],
        languages: ["JavaScript", "Python"],
        strongConcepts: ["DSA", "System Design"],
      },
    });
  }

  const totalQuestions = interviewQuestions.reduce((sum, qs) => sum + qs.questions.length, 0);
  console.log(`Seed complete: demo user, ${createdCompanies.length} real companies, ${totalQuestions} authentic questions, 5 mentors.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


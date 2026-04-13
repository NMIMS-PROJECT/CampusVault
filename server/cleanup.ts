import "dotenv/config";
import { prisma } from "./src/lib/prisma.js";

async function cleanup() {
  // Delete all AnswerUnlock records
  const deletedUnlocks = await prisma.answerUnlock.deleteMany({});
  console.log(`Deleted ${deletedUnlocks.count} answer unlock records`);
  
  // Delete all Answer records
  const deletedAnswers = await prisma.answer.deleteMany({});
  console.log(`Deleted ${deletedAnswers.count} answers`);
  
  // Delete all Question records  
  const deletedQuestions = await prisma.question.deleteMany({});
  console.log(`Deleted ${deletedQuestions.count} questions`);
  
  // Get final count
  const remaining = await prisma.question.count();
  console.log(`Remaining questions: ${remaining}`);
  
  await prisma.$disconnect();
  process.exit(0);
}

cleanup().catch(e => {
  console.error(e);
  process.exit(1);
});

import { createServer } from "node:http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { attachSocketHandlers, initializeSocket } from "./services/socket.js";
import { prisma } from "./lib/prisma.js";

const server = createServer(app);
initializeSocket(server);
attachSocketHandlers();

// Health check on startup
async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✓ Database connection verified");
    return true;
  } catch (error) {
    console.error("✗ Database connection failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

server.listen(env.PORT, async () => {
  console.log(`🚀 PlacementOS API starting on http://localhost:${env.PORT}`);
  console.log(`📌 Environment: ${env.NODE_ENV}`);
  console.log(`📦 Database: ${env.DATABASE_URL?.split('@')[1] || 'unknown'}`);
  
  await checkDatabaseConnection();
  console.log("✓ Server ready");
});


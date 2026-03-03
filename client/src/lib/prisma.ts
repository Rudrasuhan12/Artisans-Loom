import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pool: Pool;
};

const getPrisma = (): PrismaClient => {
  // Always check for DATABASE_URL first
  if (!process.env.DATABASE_URL) {
    return new PrismaClient();
  }

  // Server-side initialization with Postgres Adapter
  if (typeof window === "undefined") {
    // Reuse pool across requests in production (prevents connection exhaustion on Vercel)
    if (!globalForPrisma.pool) {
      globalForPrisma.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 5, // Limit connections for serverless
      });
    }
    const adapter = new PrismaPg(globalForPrisma.pool);
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma || getPrisma();

// Cache in all environments to prevent connection exhaustion
globalForPrisma.prisma = prisma;
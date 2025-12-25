import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Initialize Prisma client with proper configuration
let prismaClient: PrismaClient;

if (typeof window === 'undefined') { // server-side
  if (process.env.DATABASE_URL) {
    // Use adapter if DATABASE_URL is available
    try {
      const { PrismaPg } = require('@prisma/adapter-pg');
      const { Pool } = require('pg');
      
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      const adapter = new PrismaPg(pool);
      
      prismaClient = new PrismaClient({ adapter });
    } catch (error) {
      // If adapter setup fails, try to initialize with minimal configuration
      prismaClient = new PrismaClient();
    }
  } else {
    // No DATABASE_URL available, initialize without adapter
    // This should only happen during build time
    prismaClient = new PrismaClient();
  }
} else {
  // client-side
  prismaClient = new PrismaClient();
}

export const prisma = globalForPrisma.prisma || prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
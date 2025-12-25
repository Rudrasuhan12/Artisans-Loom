import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create a lazy initialization approach to avoid issues during build time
let prismaInstance: PrismaClient | null = null;

const getPrisma = (): PrismaClient => {
  if (!prismaInstance) {
    if (typeof window === 'undefined' && process.env.DATABASE_URL) { // server-side with DATABASE_URL
      try {
        // Dynamically import PrismaPg and Pool only when needed
        const { PrismaPg } = require('@prisma/adapter-pg');
        const { Pool } = require('pg');
        
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
        });
        const adapter = new PrismaPg(pool);
        
        prismaInstance = new PrismaClient({ adapter });
      } catch (error) {
        // If adapter setup fails, create client without adapter
        prismaInstance = new PrismaClient();
      }
    } else {
      // For client-side or when DATABASE_URL is not available
      prismaInstance = new PrismaClient();
    }
  }
  
  return prismaInstance;
};

// For Next.js global instance pattern
export const prisma = globalForPrisma.prisma || getPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
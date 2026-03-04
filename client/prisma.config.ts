// client/prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
    // Cast to 'any' to bypass the strict TypeScript check while 
    // still passing the value to the Prisma engine
    directUrl: process.env.DIRECT_URL,
  } as any,
});
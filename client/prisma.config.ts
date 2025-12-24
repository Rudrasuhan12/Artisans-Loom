// client/prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Using a placeholder URL during build since env vars may not be available
    // This is acceptable for client-side generation
    url: process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder", 
  },
});
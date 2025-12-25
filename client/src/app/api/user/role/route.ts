import { currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in Prisma database
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { role: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ role: user.role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    // Handle database connection errors gracefully
    if (error instanceof Error && error.message.includes('connection')) {
      return Response.json({ error: "Database connection error" }, { status: 503 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Secure endpoint to promote a user to ADMIN role.
 * Requires the ADMIN_SECRET env variable as authorization.
 * 
 * Usage:
 *   POST /api/admin/promote
 *   Headers: { "Authorization": "Bearer <ADMIN_SECRET>" }
 *   Body:    { "email": "admin@example.com" }
 * 
 * Set ADMIN_SECRET in your .env.local file.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.ADMIN_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: "ADMIN_SECRET not configured" },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. They must register first." },
        { status: 404 }
      );
    }

    if (user.role === "ADMIN") {
      return NextResponse.json(
        { message: "User is already an admin", user },
        { status: 200 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(
      { message: "User promoted to ADMIN successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin promotion error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

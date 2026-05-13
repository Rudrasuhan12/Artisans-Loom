import { auth } from "@/auth";
import { NextResponse } from "next/server";

async function triggerStoryGeneration() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (role !== "ADMIN") {
    return NextResponse.json(
      { error: "Only admins can craft new stories." },
      { status: 403 }
    );
  }

  const triggerSecret = process.env.STORY_TRIGGER_SECRET || process.env.ADMIN_SECRET;

  if (!triggerSecret) {
    return NextResponse.json(
      { error: "STORY_TRIGGER_SECRET is not configured." },
      { status: 500 }
    );
  }

  const backendUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://artisans-loom-backend.onrender.com";

  try {
    const response = await fetch(`${backendUrl}/api/stories/trigger`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${triggerSecret}`,
      },
      cache: "no-store",
    });

    const body = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: body || "Story generation failed." },
        { status: response.status }
      );
    }

    return new NextResponse(body, { status: 200 });
  } catch (error) {
    console.error("Story trigger proxy error:", error);
    return NextResponse.json(
      { error: "Could not reach the story generator." },
      { status: 502 }
    );
  }
}

export async function GET() {
  return triggerStoryGeneration();
}

export async function POST() {
  return triggerStoryGeneration();
}

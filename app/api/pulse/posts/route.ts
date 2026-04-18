import { NextRequest, NextResponse } from "next/server";
import { createPulsePost, listPulsePosts } from "@/lib/server/pulse-posts-store";
import { allowWriteByWindow } from "@/lib/server/rate-limit";

const MAX_POST_LENGTH = 280;
const CREATE_POST_LIMIT_PER_MINUTE = 5;

export const runtime = "nodejs";

function sanitizePostText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function GET() {
  try {
    const posts = await listPulsePosts();
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: "Failed to load posts." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { text?: unknown };
    if (typeof body.text !== "string") {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const text = sanitizePostText(body.text);
    if (!text || text.length > MAX_POST_LENGTH) {
      return NextResponse.json({ error: "Post text must be between 1 and 280 characters." }, { status: 400 });
    }

    const clientIp = getClientIp(request);
    const canCreate = allowWriteByWindow(`pulse-create:${clientIp}`, CREATE_POST_LIMIT_PER_MINUTE, 60_000);
    if (!canCreate) {
      return NextResponse.json(
        { error: "You're posting too quickly. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const post = await createPulsePost(text);
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/server/http";
import { getSessionUserFromCookie } from "@/lib/server/services/auth-service";
import { createPulsePost, listPulsePosts } from "@/lib/server/services/pulse-service";

export const runtime = "nodejs";

function parseLimit(raw: string | null): number {
  const n = Number(raw ?? 10);
  if (!Number.isFinite(n)) return 10;
  return Math.max(1, Math.min(30, Math.floor(n)));
}

export async function GET(req: NextRequest) {
  const user = await getSessionUserFromCookie();
  const url = new URL(req.url);
  const limit = parseLimit(url.searchParams.get("limit"));
  const cursor = url.searchParams.get("cursor") ?? undefined;

  const data = await listPulsePosts({ viewer: user, cursor, limit });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUserFromCookie();
  if (!user) {
    return jsonError("Authentication required.", 401);
  }

  const body = await req.json().catch(() => null);
  const text =
    body && typeof body === "object" && typeof (body as Record<string, unknown>).text === "string"
      ? (body as Record<string, string>).text.trim()
      : "";

  if (text.length < 1 || text.length > 280) {
    return jsonError("Post text must be between 1 and 280 characters.", 400);
  }

  await createPulsePost({ user, text });
  return NextResponse.json({ ok: true }, { status: 201 });
}

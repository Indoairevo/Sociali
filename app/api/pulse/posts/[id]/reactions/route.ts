import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/server/http";
import { getSessionUserFromCookie } from "@/lib/server/services/auth-service";
import { togglePulseReaction } from "@/lib/server/services/pulse-service";

export const runtime = "nodejs";

const validFields = new Set(["liked", "reposted", "bookmarked"]);

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUserFromCookie();
  if (!user) {
    return jsonError("Authentication required.", 401);
  }

  const body = await req.json().catch(() => null);
  const field =
    body && typeof body === "object" && typeof (body as Record<string, unknown>).field === "string"
      ? (body as Record<string, string>).field
      : "";

  if (!validFields.has(field)) {
    return jsonError("Invalid reaction field.", 400);
  }

  const { id } = await ctx.params;

  try {
    const post = await togglePulseReaction({
      user,
      postId: id,
      field: field as "liked" | "reposted" | "bookmarked",
    });
    return NextResponse.json({ post });
  } catch (error) {
    if (error instanceof Error && error.message === "POST_NOT_FOUND") {
      return jsonError("Post not found.", 404);
    }
    return jsonError("Failed to toggle reaction.", 500);
  }
}

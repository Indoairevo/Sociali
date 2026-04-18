import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { jsonError, toClientIp } from "@/lib/server/http";
import { loginUser, SESSION_COOKIE } from "@/lib/server/services/auth-service";

export const runtime = "nodejs";

function validate(body: unknown): { username: string; password: string } | null {
  if (!body || typeof body !== "object") return null;
  const payload = body as Record<string, unknown>;
  const username = typeof payload.username === "string" ? payload.username.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) return null;
  if (password.length < 8 || password.length > 128) return null;
  return { username, password };
}

export async function POST(req: NextRequest) {
  const ip = toClientIp(req.headers.get("x-forwarded-for"));
  const rate = checkRateLimit(`login:${ip}`, 20, 60_000);
  if (!rate.allowed) {
    return jsonError(`Too many requests. Retry in ${rate.retryAfterSeconds}s.`, 429);
  }

  const body = await req.json().catch(() => null);
  const valid = validate(body);
  if (!valid) {
    return jsonError("Invalid login payload.", 400);
  }

  try {
    const result = await loginUser({
      username: valid.username,
      password: valid.password,
      ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    const res = NextResponse.json({ user: result.user });
    res.cookies.set({
      name: SESSION_COOKIE,
      value: result.sessionId,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: result.maxAgeSeconds,
    });
    return res;
  } catch {
    return jsonError("Invalid username or password.", 401);
  }
}

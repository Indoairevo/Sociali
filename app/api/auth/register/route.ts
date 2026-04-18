import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { jsonError, toClientIp } from "@/lib/server/http";
import { loginUser, registerUser, SESSION_COOKIE } from "@/lib/server/services/auth-service";

export const runtime = "nodejs";

function validate(body: unknown): { username: string; displayName: string; password: string } | null {
  if (!body || typeof body !== "object") return null;
  const payload = body as Record<string, unknown>;
  const username = typeof payload.username === "string" ? payload.username.trim() : "";
  const displayName = typeof payload.displayName === "string" ? payload.displayName.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) return null;
  if (displayName.length < 2 || displayName.length > 64) return null;
  if (password.length < 8 || password.length > 128) return null;

  return { username, displayName, password };
}

export async function POST(req: NextRequest) {
  const ip = toClientIp(req.headers.get("x-forwarded-for"));
  const rate = checkRateLimit(`register:${ip}`, 10, 60_000);
  if (!rate.allowed) {
    return jsonError(`Too many requests. Retry in ${rate.retryAfterSeconds}s.`, 429);
  }

  const body = await req.json().catch(() => null);
  const valid = validate(body);
  if (!valid) {
    return jsonError("Invalid registration payload.", 400);
  }

  try {
    await registerUser(valid);
    const loggedIn = await loginUser({
      username: valid.username,
      password: valid.password,
      ip,
      userAgent: req.headers.get("user-agent") ?? undefined,
    });

    const res = NextResponse.json({ user: loggedIn.user }, { status: 201 });
    res.cookies.set({
      name: SESSION_COOKIE,
      value: loggedIn.sessionId,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: loggedIn.maxAgeSeconds,
    });
    return res;
  } catch (error) {
    if (error instanceof Error && error.message === "USERNAME_TAKEN") {
      return jsonError("Username already exists.", 409);
    }
    return jsonError("Failed to register user.", 500);
  }
}

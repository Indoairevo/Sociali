import { NextResponse } from "next/server";
import { revokeSessionFromCookie, SESSION_COOKIE } from "@/lib/server/services/auth-service";

export const runtime = "nodejs";

export async function POST() {
  await revokeSessionFromCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}

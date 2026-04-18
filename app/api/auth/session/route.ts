import { NextResponse } from "next/server";
import { getSessionUserFromCookie } from "@/lib/server/services/auth-service";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUserFromCookie();
  return NextResponse.json({ user });
}

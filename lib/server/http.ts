import { NextResponse } from "next/server";

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function toClientIp(forwardedFor: string | null): string {
  if (!forwardedFor) return "unknown";
  return forwardedFor.split(",")[0]?.trim() || "unknown";
}

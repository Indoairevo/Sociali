import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export function generateId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, expectedHash] = stored.split(":");
  if (!salt || !expectedHash) return false;
  const calculatedHash = scryptSync(password, salt, 64).toString("hex");
  const left = Buffer.from(expectedHash, "hex");
  const right = Buffer.from(calculatedHash, "hex");
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function sessionExpiryIso(now = Date.now()): string {
  return new Date(now + SESSION_TTL_MS).toISOString();
}

export function getSessionMaxAgeSeconds(): number {
  return Math.floor(SESSION_TTL_MS / 1000);
}

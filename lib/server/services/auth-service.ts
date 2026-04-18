import { cookies } from "next/headers";
import { getSessionMaxAgeSeconds, hashPassword, sessionExpiryIso, verifyPassword } from "@/lib/server/security";
import { readDb, updateDb } from "@/lib/server/store";
import type { SessionRecord, SessionUser, UserRecord } from "@/lib/server/types";

export const SESSION_COOKIE = "sociali_session";

function sanitizeUser(user: UserRecord): SessionUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
  };
}

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export async function registerUser(input: {
  username: string;
  displayName: string;
  password: string;
}): Promise<SessionUser> {
  const username = normalizeUsername(input.username);

  const db = await updateDb((draft) => {
    const alreadyExists = draft.users.some((u) => u.username === username);
    if (alreadyExists) {
      throw new Error("USERNAME_TAKEN");
    }
    draft.users.push({
      id: `user_${crypto.randomUUID()}`,
      username,
      displayName: input.displayName.trim(),
      passwordHash: hashPassword(input.password),
      createdAt: new Date().toISOString(),
    });
  });

  const created = db.users.find((u) => u.username === username);
  if (!created) {
    throw new Error("USER_CREATE_FAILED");
  }

  return sanitizeUser(created);
}

export async function loginUser(input: {
  username: string;
  password: string;
  ip?: string;
  userAgent?: string;
}): Promise<{ user: SessionUser; sessionId: string; maxAgeSeconds: number }> {
  const username = normalizeUsername(input.username);
  const db = await readDb();
  const user = db.users.find((u) => u.username === username);

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const session: SessionRecord = {
    id: `sess_${crypto.randomUUID()}`,
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt: sessionExpiryIso(),
    ip: input.ip,
    userAgent: input.userAgent,
  };

  await updateDb((draft) => {
    draft.sessions = draft.sessions.filter((s) => {
      const isExpiredSessionForUser =
        s.userId === user.id && new Date(s.expiresAt).getTime() <= Date.now();
      return !isExpiredSessionForUser;
    });
    draft.sessions.push(session);
  });

  return {
    user: sanitizeUser(user),
    sessionId: session.id,
    maxAgeSeconds: getSessionMaxAgeSeconds(),
  };
}

export async function getSessionUserFromCookie(): Promise<SessionUser | null> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const db = await readDb();
  const session = db.sessions.find((s) => s.id === sessionId);
  if (!session) return null;

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    await updateDb((draft) => {
      draft.sessions = draft.sessions.filter((s) => s.id !== session.id);
    });
    return null;
  }

  const user = db.users.find((u) => u.id === session.userId);
  return user ? sanitizeUser(user) : null;
}

export async function revokeSessionFromCookie(): Promise<void> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return;

  await updateDb((draft) => {
    draft.sessions = draft.sessions.filter((s) => s.id !== sessionId);
  });
}

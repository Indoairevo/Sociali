import fs from "fs/promises";
import path from "path";
import { hashPassword } from "@/lib/server/security";
import type { DatabaseShape } from "@/lib/server/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "sociali-db.json");

const DEFAULT_DB = (): DatabaseShape => {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: "user_default",
        username: "indoairevo",
        displayName: "Indra Evo",
        passwordHash: hashPassword("sociali-dev-password"),
        createdAt: now,
      },
    ],
    sessions: [],
    pulsePosts: [
      {
        id: "post_seed_1",
        userId: "user_default",
        text: "Welcome to Sociali's persistent Pulse feed. This post is served from the backend API.",
        createdAt: now,
        likes: [],
        reposts: [],
        bookmarks: [],
        replies: 0,
      },
    ],
  };
};

let queue: Promise<void> = Promise.resolve();

async function ensureDbFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB(), null, 2), "utf8");
  }
}

async function readDbUnsafe(): Promise<DatabaseShape> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf8");
  const parsed = JSON.parse(raw) as DatabaseShape;
  return {
    users: parsed.users ?? [],
    sessions: parsed.sessions ?? [],
    pulsePosts: parsed.pulsePosts ?? [],
  };
}

async function writeDbUnsafe(db: DatabaseShape): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export async function readDb(): Promise<DatabaseShape> {
  return readDbUnsafe();
}

// mutator can either mutate the provided draft in place (return void) or return a full replacement object.
export async function updateDb(mutator: (db: DatabaseShape) => void | DatabaseShape): Promise<DatabaseShape> {
  let nextDb: DatabaseShape | null = null;

  const run = async (): Promise<void> => {
    const db = await readDbUnsafe();
    const result = mutator(db);
    const next = (result ?? db) as DatabaseShape;
    await writeDbUnsafe(next);
    nextDb = next;
  };

  queue = queue.then(run, run);
  await queue;

  if (!nextDb) {
    throw new Error("DB_UPDATE_FAILED");
  }

  return nextDb;
}

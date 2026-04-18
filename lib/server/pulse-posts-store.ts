import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PulsePost } from "@/lib/pulse/types";

const dataDir = path.join(process.cwd(), "data");
const pulsePostsPath = path.join(dataDir, "pulse-posts.json");
const maxStoredPosts = 500;

const now = Date.now();
const INITIAL_POSTS: PulsePost[] = [
  {
    id: 1,
    user: "Indra Evo",
    handle: "@indoairevo",
    avatar: "IE",
    avatarGradient: "from-sky-400 to-indigo-600",
    text: "Building the all-in-one social app experience in one tab. Chat, reels, posts, videos & profiles — unified under one identity. This is Sociali. 🚀",
    createdAt: new Date(now - 2 * 60 * 1000).toISOString(),
    likes: 220,
    reposts: 74,
    replies: 18,
    liked: false,
    reposted: false,
    bookmarked: false,
  },
  {
    id: 2,
    user: "Alya Design",
    handle: "@alyadsgn",
    avatar: "A",
    avatarGradient: "from-rose-400 to-pink-600",
    text: "Glassmorphism + motion + dark mode = instant premium vibe. The new Sociali UI is chef's kiss 💅",
    createdAt: new Date(now - 9 * 60 * 1000).toISOString(),
    likes: 154,
    reposts: 45,
    replies: 12,
    liked: false,
    reposted: false,
    bookmarked: false,
  },
  {
    id: 3,
    user: "Rafi Dev",
    handle: "@rafidev",
    avatar: "R",
    avatarGradient: "from-violet-400 to-purple-600",
    text: "State-driven view switching feels insanely smooth now. Framer Motion AnimatePresence is doing the heavy lifting and it shows. ✨",
    createdAt: new Date(now - 23 * 60 * 1000).toISOString(),
    likes: 99,
    reposts: 27,
    replies: 8,
    liked: true,
    reposted: false,
    bookmarked: false,
  },
  {
    id: 4,
    user: "Nadia UX",
    handle: "@nadiaux",
    avatar: "N",
    avatarGradient: "from-amber-400 to-orange-600",
    text: "Hot take: accessibility should be the first thing you design for, not the last thing you audit. Thread 🧵",
    createdAt: new Date(now - 60 * 60 * 1000).toISOString(),
    likes: 311,
    reposts: 102,
    replies: 47,
    liked: false,
    reposted: false,
    bookmarked: true,
  },
  {
    id: 5,
    user: "Rio Systems",
    handle: "@riosys",
    avatar: "Rs",
    avatarGradient: "from-emerald-400 to-teal-600",
    text: "Real-time WebSocket infra is live on the Connect tab. Typing indicators, read receipts, presence — all working. No polling!",
    createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    likes: 188,
    reposts: 61,
    replies: 22,
    liked: false,
    reposted: true,
    bookmarked: false,
  },
];

let writeQueue: Promise<void> = Promise.resolve();

function normalizePosts(value: unknown): PulsePost[] {
  if (!Array.isArray(value)) return INITIAL_POSTS;

  return value
    .map((item): PulsePost | null => {
      if (!item || typeof item !== "object") return null;

      const candidate = item as Partial<PulsePost>;
      const text = typeof candidate.text === "string" ? candidate.text.trim() : "";
      if (!text) return null;

      const createdAt =
        typeof candidate.createdAt === "string" && !Number.isNaN(Date.parse(candidate.createdAt))
          ? candidate.createdAt
          : new Date().toISOString();

      return {
        id: typeof candidate.id === "number" ? candidate.id : Date.now(),
        user: typeof candidate.user === "string" ? candidate.user : "Indra Evo",
        handle: typeof candidate.handle === "string" ? candidate.handle : "@indoairevo",
        avatar: typeof candidate.avatar === "string" ? candidate.avatar : "IE",
        avatarGradient:
          typeof candidate.avatarGradient === "string"
            ? candidate.avatarGradient
            : "from-sky-400 to-indigo-600",
        text,
        createdAt,
        likes: typeof candidate.likes === "number" ? candidate.likes : 0,
        reposts: typeof candidate.reposts === "number" ? candidate.reposts : 0,
        replies: typeof candidate.replies === "number" ? candidate.replies : 0,
        liked: Boolean(candidate.liked),
        reposted: Boolean(candidate.reposted),
        bookmarked: Boolean(candidate.bookmarked),
      };
    })
    .filter((post): post is PulsePost => post !== null)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, maxStoredPosts);
}

async function ensureDataFile(): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  try {
    await access(pulsePostsPath);
  } catch {
    await writeFile(pulsePostsPath, JSON.stringify({ posts: INITIAL_POSTS }, null, 2), "utf8");
  }
}

async function readPostsFromFile(): Promise<PulsePost[]> {
  await ensureDataFile();
  const raw = await readFile(pulsePostsPath, "utf8");
  const parsed = JSON.parse(raw) as { posts?: unknown };
  return normalizePosts(parsed.posts);
}

async function writePostsToFile(posts: PulsePost[]): Promise<void> {
  await writeFile(pulsePostsPath, JSON.stringify({ posts }, null, 2), "utf8");
}

export async function listPulsePosts(): Promise<PulsePost[]> {
  return readPostsFromFile();
}

export async function createPulsePost(text: string): Promise<PulsePost> {
  const newPost: PulsePost = {
    id: Date.now(),
    user: "Indra Evo",
    handle: "@indoairevo",
    avatar: "IE",
    avatarGradient: "from-sky-400 to-indigo-600",
    text,
    createdAt: new Date().toISOString(),
    likes: 0,
    reposts: 0,
    replies: 0,
    liked: false,
    reposted: false,
    bookmarked: false,
  };

  writeQueue = writeQueue.then(async () => {
    const posts = await readPostsFromFile();
    const nextPosts = [newPost, ...posts].slice(0, maxStoredPosts);
    await writePostsToFile(nextPosts);
  });
  await writeQueue;

  return newPost;
}

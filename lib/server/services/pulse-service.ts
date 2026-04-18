import { readDb, updateDb } from "@/lib/server/store";
import type { PulsePostRecord, PulsePostView, SessionUser } from "@/lib/server/types";
import { initialsFromName } from "@/lib/shared/identity";

type ReactionField = "liked" | "reposted" | "bookmarked";

const gradients = [
  "from-sky-400 to-indigo-600",
  "from-rose-400 to-pink-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-600",
  "from-emerald-400 to-teal-600",
  "from-fuchsia-400 to-pink-600",
];

function relativeTime(iso: string): string {
  const deltaMs = Date.now() - new Date(iso).getTime();
  if (deltaMs < 60_000) return "just now";
  if (deltaMs < 3_600_000) return `${Math.floor(deltaMs / 60_000)}m`;
  if (deltaMs < 86_400_000) return `${Math.floor(deltaMs / 3_600_000)}h`;
  return `${Math.floor(deltaMs / 86_400_000)}d`;
}

function decorate(
  post: PulsePostRecord,
  lookup: Map<string, { displayName: string; username: string }>,
  viewerId?: string
): PulsePostView {
  const author = lookup.get(post.userId) ?? {
    displayName: "Unknown",
    username: "unknown",
  };

  let gradientHash = 0;
  for (const char of post.userId) {
    gradientHash += char.charCodeAt(0);
  }
  const gradientIndex = Math.abs(gradientHash) % gradients.length;

  return {
    id: post.id,
    user: author.displayName,
    handle: `@${author.username}`,
    avatar: initialsFromName(author.displayName),
    avatarGradient: gradients[gradientIndex],
    text: post.text,
    time: relativeTime(post.createdAt),
    likes: post.likes.length,
    reposts: post.reposts.length,
    replies: post.replies,
    liked: viewerId ? post.likes.includes(viewerId) : false,
    reposted: viewerId ? post.reposts.includes(viewerId) : false,
    bookmarked: viewerId ? post.bookmarks.includes(viewerId) : false,
  };
}

export async function listPulsePosts(input: {
  viewer?: SessionUser | null;
  cursor?: string;
  limit: number;
}): Promise<{ items: PulsePostView[]; nextCursor: string | null }> {
  const db = await readDb();

  const sorted = [...db.pulsePosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let startIndex = 0;
  if (input.cursor) {
    const cursorIndex = sorted.findIndex((p) => p.id === input.cursor);
    startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
  }

  const page = sorted.slice(startIndex, startIndex + input.limit);
  const next = sorted[startIndex + input.limit];
  const userLookup = new Map(db.users.map((u) => [u.id, { displayName: u.displayName, username: u.username }]));

  return {
    items: page.map((post) => decorate(post, userLookup, input.viewer?.id)),
    nextCursor: next?.id ?? null,
  };
}

export async function createPulsePost(input: {
  user: SessionUser;
  text: string;
}): Promise<void> {
  await updateDb((draft) => {
    draft.pulsePosts.push({
      id: `post_${crypto.randomUUID()}`,
      userId: input.user.id,
      text: input.text,
      createdAt: new Date().toISOString(),
      likes: [],
      reposts: [],
      bookmarks: [],
      replies: 0,
    });
  });
}

export async function togglePulseReaction(input: {
  user: SessionUser;
  postId: string;
  field: ReactionField;
}): Promise<PulsePostView> {
  const db = await updateDb((draft) => {
    const post = draft.pulsePosts.find((p) => p.id === input.postId);
    if (!post) {
      throw new Error("POST_NOT_FOUND");
    }

    const target =
      input.field === "liked"
        ? post.likes
        : input.field === "reposted"
          ? post.reposts
          : post.bookmarks;

    const idx = target.indexOf(input.user.id);
    if (idx >= 0) {
      target.splice(idx, 1);
    } else {
      target.push(input.user.id);
    }
  });

  const post = db.pulsePosts.find((p) => p.id === input.postId);
  if (!post) {
    throw new Error("POST_NOT_FOUND");
  }

  const userLookup = new Map(db.users.map((u) => [u.id, { displayName: u.displayName, username: u.username }]));
  return decorate(post, userLookup, input.user.id);
}

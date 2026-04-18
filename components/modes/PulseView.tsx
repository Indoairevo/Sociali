"use client";

import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2, Share2 } from "lucide-react";
import { useState } from "react";

interface Post {
  id: number;
  user: string;
  handle: string;
  avatar: string;
  avatarGradient: string;
  text: string;
  image?: string;
  time: string;
  likes: number;
  reposts: number;
  replies: number;
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
}

const SEED_POSTS: Post[] = [
  {
    id: 1,
    user: "Indra Evo", handle: "@indoairevo", avatar: "IE",
    avatarGradient: "from-sky-400 to-indigo-600",
    text: "Building the all-in-one social app experience in one tab. Chat, reels, posts, videos & profiles — unified under one identity. This is Sociali. 🚀",
    time: "2m",
    likes: 220, reposts: 74, replies: 18,
    liked: false, reposted: false, bookmarked: false,
  },
  {
    id: 2,
    user: "Alya Design", handle: "@alyadsgn", avatar: "A",
    avatarGradient: "from-rose-400 to-pink-600",
    text: "Glassmorphism + motion + dark mode = instant premium vibe. The new Sociali UI is chef's kiss 💅",
    time: "9m",
    likes: 154, reposts: 45, replies: 12,
    liked: false, reposted: false, bookmarked: false,
  },
  {
    id: 3,
    user: "Rafi Dev", handle: "@rafidev", avatar: "R",
    avatarGradient: "from-violet-400 to-purple-600",
    text: "State-driven view switching feels insanely smooth now. Framer Motion AnimatePresence is doing the heavy lifting and it shows. ✨",
    time: "23m",
    likes: 99, reposts: 27, replies: 8,
    liked: true, reposted: false, bookmarked: false,
  },
  {
    id: 4,
    user: "Nadia UX", handle: "@nadiaux", avatar: "N",
    avatarGradient: "from-amber-400 to-orange-600",
    text: "Hot take: accessibility should be the first thing you design for, not the last thing you audit. Thread 🧵",
    time: "1h",
    likes: 311, reposts: 102, replies: 47,
    liked: false, reposted: false, bookmarked: true,
  },
  {
    id: 5,
    user: "Rio Systems", handle: "@riosys", avatar: "Rs",
    avatarGradient: "from-emerald-400 to-teal-600",
    text: "Real-time WebSocket infra is live on the Connect tab. Typing indicators, read receipts, presence — all working. No polling!",
    time: "3h",
    likes: 188, reposts: 61, replies: 22,
    liked: false, reposted: true, bookmarked: false,
  },
];

const TRENDING = [
  { tag: "#SocialiApp",   count: "12.4K" },
  { tag: "#WebDev",       count: "8.1K"  },
  { tag: "#UIDesign",     count: "5.7K"  },
  { tag: "#ReactJS",      count: "4.2K"  },
  { tag: "#NextJS",       count: "3.8K"  },
];

function PostCard({ post, onToggle }: { post: Post; onToggle: (id: number, field: "liked" | "reposted" | "bookmarked") => void }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition hover:bg-zinc-900/80">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ${post.avatarGradient}`}>
          {post.avatar}
        </div>

        <div className="min-w-0 flex-1">
          {/* Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-white">{post.user}</span>
              <span className="text-xs text-zinc-500">{post.handle}</span>
              <span className="text-xs text-zinc-600">·</span>
              <span className="text-xs text-zinc-500">{post.time}</span>
            </div>
            <button className="rounded-lg p-1 text-zinc-600 transition hover:text-zinc-300">
              <MoreHorizontal size={14} />
            </button>
          </div>

          {/* Text */}
          <p className="mt-2 text-sm leading-relaxed text-zinc-200">{post.text}</p>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-5">
            <button
              onClick={() => onToggle(post.id, "liked")}
              className={`flex items-center gap-1.5 text-xs transition ${post.liked ? "text-rose-400" : "text-zinc-500 hover:text-rose-400"}`}
            >
              <Heart size={15} fill={post.liked ? "currentColor" : "none"} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={() => onToggle(post.id, "reposted")}
              className={`flex items-center gap-1.5 text-xs transition ${post.reposted ? "text-emerald-400" : "text-zinc-500 hover:text-emerald-400"}`}
            >
              <Repeat2 size={15} />
              <span>{post.reposts}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-zinc-500 transition hover:text-sky-400">
              <MessageCircle size={15} />
              <span>{post.replies}</span>
            </button>
            <button
              onClick={() => onToggle(post.id, "bookmarked")}
              className={`ml-auto flex items-center gap-1.5 text-xs transition ${post.bookmarked ? "text-amber-400" : "text-zinc-500 hover:text-amber-400"}`}
            >
              <Bookmark size={15} fill={post.bookmarked ? "currentColor" : "none"} />
            </button>
            <button className="flex items-center gap-1.5 text-xs text-zinc-500 transition hover:text-zinc-200">
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function PulseView({ searchQuery = "" }: { searchQuery?: string }) {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [draft, setDraft] = useState("");
  const normalizedQuery = searchQuery.trim().toLowerCase();

  function toggle(id: number, field: "liked" | "reposted" | "bookmarked") {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (field === "liked") {
          const liked = !p.liked;
          return { ...p, liked, likes: Math.max(0, p.likes + (liked ? 1 : -1)) };
        }
        if (field === "reposted") {
          const reposted = !p.reposted;
          return { ...p, reposted, reposts: Math.max(0, p.reposts + (reposted ? 1 : -1)) };
        }
        return { ...p, bookmarked: !p.bookmarked };
      })
    );
  }

  function submitPost() {
    const text = draft.trim();
    if (!text) return;
    const newPost: Post = {
      id: Date.now(),
      user: "Indra Evo", handle: "@indoairevo", avatar: "IE",
      avatarGradient: "from-sky-400 to-indigo-600",
      text,
      time: "just now",
      likes: 0, reposts: 0, replies: 0,
      liked: false, reposted: false, bookmarked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setDraft("");
  }

  const filteredPosts = normalizedQuery
    ? posts.filter((post) =>
        `${post.user} ${post.handle} ${post.text}`.toLowerCase().includes(normalizedQuery)
      )
    : posts;

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* ── Feed ── */}
      <section className="flex h-full flex-1 flex-col gap-3 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-xl">
        {/* Compose */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-xs font-semibold text-white">
              IE
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <textarea
                className="w-full resize-none bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                placeholder="What's on your mind?"
                rows={2}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className={`text-xs ${280 - draft.length < 20 ? "text-rose-400" : "text-zinc-500"}`}>
                  {280 - draft.length}
                </span>
                <button
                  onClick={submitPost}
                  disabled={!draft.trim() || draft.length > 280}
                  className="rounded-full bg-violet-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-400 disabled:opacity-40"
                >
                  Pulse
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} onToggle={toggle} />
        ))}
        {filteredPosts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-900/30 p-5 text-center text-sm text-zinc-400">
            No pulses found for “{searchQuery.trim()}”.
          </div>
        )}
      </section>

      {/* ── Trending sidebar ── */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="mb-3 text-sm font-semibold text-white">Trending</p>
          {TRENDING.map((t) => (
            <button
              key={t.tag}
              className="mb-1 w-full rounded-xl px-3 py-2 text-left transition hover:bg-white/8"
            >
              <p className="text-sm font-medium text-violet-300">{t.tag}</p>
              <p className="text-xs text-zinc-500">{t.count} pulses</p>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

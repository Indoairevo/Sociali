"use client";

import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { PulsePost } from "@/lib/pulse/types";

const TRENDING = [
  { tag: "#SocialiApp", count: "12.4K" },
  { tag: "#WebDev", count: "8.1K" },
  { tag: "#UIDesign", count: "5.7K" },
  { tag: "#ReactJS", count: "4.2K" },
  { tag: "#NextJS", count: "3.8K" },
];

function formatRelativeTime(dateIso: string): string {
  const timestamp = Date.parse(dateIso);
  if (Number.isNaN(timestamp)) return "now";

  const diffMs = Date.now() - timestamp;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h`;
  return `${Math.floor(diffMs / day)}d`;
}

function PostCard({
  post,
  onToggle,
}: {
  post: PulsePost;
  onToggle: (id: number, field: "liked" | "reposted" | "bookmarked") => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition hover:bg-zinc-900/80">
      <div className="flex gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ${post.avatarGradient}`}
        >
          {post.avatar}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold text-white">{post.user}</span>
              <span className="text-xs text-zinc-500">{post.handle}</span>
              <span className="text-xs text-zinc-600">·</span>
              <span className="text-xs text-zinc-500">{formatRelativeTime(post.createdAt)}</span>
            </div>
            <button className="rounded-lg p-1 text-zinc-600 transition hover:text-zinc-300">
              <MoreHorizontal size={14} />
            </button>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-zinc-200">{post.text}</p>

          <div className="mt-4 flex items-center gap-5">
            <button
              onClick={() => onToggle(post.id, "liked")}
              className={`flex items-center gap-1.5 text-xs transition ${post.liked ? "text-rose-400" : "text-zinc-500 hover:text-rose-400"}`}
            >
              <Heart size={15} fill={post.liked ? "currentColor" : "none"} />
              <span>{post.likes + (post.liked ? 1 : 0)}</span>
            </button>
            <button
              onClick={() => onToggle(post.id, "reposted")}
              className={`flex items-center gap-1.5 text-xs transition ${post.reposted ? "text-emerald-400" : "text-zinc-500 hover:text-emerald-400"}`}
            >
              <Repeat2 size={15} />
              <span>{post.reposts + (post.reposted ? 1 : 0)}</span>
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

export function PulseView() {
  const [posts, setPosts] = useState<PulsePost[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadPosts() {
    setFeedError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/pulse/posts", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch posts.");
      }

      const payload = (await response.json()) as { posts?: PulsePost[] };
      setPosts(Array.isArray(payload.posts) ? payload.posts : []);
    } catch {
      setFeedError("Could not load Pulse feed. Please retry.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  function toggle(id: number, field: "liked" | "reposted" | "bookmarked") {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p)));
  }

  async function submitPost() {
    const text = draft.trim();
    if (!text || text.length > 280 || isSubmitting) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/pulse/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const payload = (await response.json()) as { post?: PulsePost; error?: string };
      if (!response.ok || !payload.post) {
        setSubmitError(payload.error || "Could not publish your pulse.");
        return;
      }

      setPosts((prev) => [payload.post as PulsePost, ...prev]);
      setDraft("");
    } catch {
      setSubmitError("Could not publish your pulse.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      <section className="flex h-full flex-1 flex-col gap-3 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-xl">
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
                  disabled={!draft.trim() || draft.length > 280 || isSubmitting}
                  className="rounded-full bg-violet-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-400 disabled:opacity-40"
                >
                  {isSubmitting ? "Posting..." : "Pulse"}
                </button>
              </div>
              {submitError && <p className="text-xs text-rose-400">{submitError}</p>}
            </div>
          </div>
        </div>

        {feedError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            <div className="flex items-center justify-between gap-2">
              <span>{feedError}</span>
              <button onClick={loadPosts} className="rounded bg-rose-500/20 px-2 py-1 font-medium hover:bg-rose-500/30">
                Retry
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 text-sm text-zinc-400">
            Loading Pulse feed...
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} onToggle={toggle} />)
        )}
      </section>

      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="mb-3 text-sm font-semibold text-white">Trending</p>
          {TRENDING.map((t) => (
            <button key={t.tag} className="mb-1 w-full rounded-xl px-3 py-2 text-left transition hover:bg-white/8">
              <p className="text-sm font-medium text-violet-300">{t.tag}</p>
              <p className="text-xs text-zinc-500">{t.count} pulses</p>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

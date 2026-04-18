"use client";

import { Bookmark, Heart, Loader2, LogIn, MessageCircle, MoreHorizontal, Repeat2, Share2, UserPlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { initialsFromName } from "@/lib/shared/identity";

interface Post {
  id: string;
  user: string;
  handle: string;
  avatar: string;
  avatarGradient: string;
  text: string;
  time: string;
  likes: number;
  reposts: number;
  replies: number;
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
}

interface SessionUser {
  id: string;
  username: string;
  displayName: string;
}

const TRENDING = [
  { tag: "#SocialiApp", count: "live" },
  { tag: "#WebDev", count: "live" },
  { tag: "#UIDesign", count: "live" },
  { tag: "#ReactJS", count: "live" },
  { tag: "#NextJS", count: "live" },
];

function PostCard({ post, onToggle }: { post: Post; onToggle: (id: string, field: "liked" | "reposted" | "bookmarked") => void }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition hover:bg-zinc-900/80">
      <div className="flex gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white ${post.avatarGradient}`}>
          {post.avatar}
        </div>

        <div className="min-w-0 flex-1">
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

          <p className="mt-2 text-sm leading-relaxed text-zinc-200">{post.text}</p>

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

export function PulseView() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [user, setUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const remaining = 280 - draft.length;

  const loadSession = useCallback(async () => {
    const res = await fetch("/api/auth/session", { credentials: "include" });
    if (!res.ok) return;
    const data = (await res.json()) as { user: SessionUser | null };
    setUser(data.user ?? null);
  }, []);

  const loadPosts = useCallback(async (cursor?: string) => {
    const firstPage = !cursor;
    if (firstPage) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const query = new URLSearchParams({ limit: "10" });
      if (cursor) query.set("cursor", cursor);
      const res = await fetch(`/api/pulse/posts?${query.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch feed.");
      const data = (await res.json()) as { items: Post[]; nextCursor: string | null };
      setPosts((prev) => (firstPage ? data.items : [...prev, ...data.items]));
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Pulse feed.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void Promise.all([loadSession(), loadPosts()]);
  }, [loadPosts, loadSession]);

  const canSubmit = useMemo(
    () => !!user && !!draft.trim() && draft.length <= 280,
    [draft, user]
  );

  async function submitPost() {
    const text = draft.trim();
    if (!canSubmit || !text) return;

    setError(null);
    const res = await fetch("/api/pulse/posts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({ error: "Failed to post." }))) as { error?: string };
      setError(data.error ?? "Failed to post.");
      return;
    }

    setDraft("");
    await loadPosts();
  }

  async function toggle(id: string, field: "liked" | "reposted" | "bookmarked") {
    if (!user) {
      setError("Login required to react.");
      return;
    }

    const previous = posts;
    setPosts((current) =>
      current.map((p) => {
        if (p.id !== id) return p;
        if (field === "liked") {
          const nextLiked = !p.liked;
          return { ...p, liked: nextLiked, likes: p.likes + (nextLiked ? 1 : -1) };
        }
        if (field === "reposted") {
          const nextReposted = !p.reposted;
          return { ...p, reposted: nextReposted, reposts: p.reposts + (nextReposted ? 1 : -1) };
        }
        return { ...p, bookmarked: !p.bookmarked };
      })
    );

    const res = await fetch(`/api/pulse/posts/${id}/reactions`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field }),
    });

    if (!res.ok) {
      setPosts(previous);
      const data = (await res.json().catch(() => ({ error: "Failed to react." }))) as { error?: string };
      setError(data.error ?? "Failed to react.");
      return;
    }

    const data = (await res.json()) as { post: Post };
    setPosts((current) => current.map((p) => (p.id === id ? data.post : p)));
  }

  async function runAuth() {
    setAuthLoading(true);
    setError(null);

    const path = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      authMode === "login"
        ? { username, password }
        : { username, displayName, password };

    const res = await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({ error: "Auth failed." }))) as { error?: string };
      setError(data.error ?? "Auth failed.");
      setAuthLoading(false);
      return;
    }

    setPassword("");
    await loadSession();
    await loadPosts();
    setAuthLoading(false);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    await loadPosts();
  }

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      <section className="flex h-full flex-1 flex-col gap-3 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-xl">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-zinc-400">
              {user ? `Signed in as @${user.username}` : "Sign in to post and react"}
            </p>
            {user && (
              <button onClick={logout} className="text-xs text-zinc-400 hover:text-zinc-200">
                Logout
              </button>
            )}
          </div>

          {!user && (
            <div className="mb-3 rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="mb-2 flex gap-2">
                <button
                  onClick={() => setAuthMode("login")}
                  className={`rounded-lg px-2.5 py-1 text-xs ${authMode === "login" ? "bg-white text-black" : "bg-white/10 text-zinc-300"}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthMode("register")}
                  className={`rounded-lg px-2.5 py-1 text-xs ${authMode === "register" ? "bg-white text-black" : "bg-white/10 text-zinc-300"}`}
                >
                  Register
                </button>
              </div>

              <div className="grid gap-2">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="rounded-lg bg-white/10 px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                />
                {authMode === "register" && (
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display name"
                    className="rounded-lg bg-white/10 px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                  />
                )}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="rounded-lg bg-white/10 px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                />
                <button
                  onClick={runAuth}
                  disabled={authLoading}
                  className="mt-1 inline-flex items-center justify-center gap-1 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-400 disabled:opacity-60"
                >
                  {authLoading ? <Loader2 size={13} className="animate-spin" /> : authMode === "login" ? <LogIn size={13} /> : <UserPlus size={13} />}
                  {authMode === "login" ? "Login" : "Create account"}
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-xs font-semibold text-white">
              {user ? initialsFromName(user.displayName) : "IE"}
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <textarea
                className="w-full resize-none bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                placeholder={user ? "What's on your mind?" : "Login to post"}
                rows={2}
                value={draft}
                disabled={!user}
                onChange={(e) => setDraft(e.target.value)}
              />
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className={`text-xs ${remaining < 20 ? "text-rose-400" : "text-zinc-500"}`}>
                  {remaining}
                </span>
                <button
                  onClick={submitPost}
                  disabled={!canSubmit}
                  className="rounded-full bg-violet-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-400 disabled:opacity-40"
                >
                  Pulse
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-10 text-zinc-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 text-sm text-zinc-400">
            No posts yet.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} onToggle={toggle} />)
        )}

        {nextCursor && (
          <button
            onClick={() => void loadPosts(nextCursor)}
            disabled={loadingMore}
            className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
          >
            {loadingMore && <Loader2 size={12} className="animate-spin" />}
            Load more
          </button>
        )}
      </section>

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

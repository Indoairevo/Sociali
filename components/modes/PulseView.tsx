"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, ImagePlus, MessageCircle, Repeat2, X } from "lucide-react";
import { useState } from "react";
import { POSTS, type Post, USERS, getUser } from "@/lib/mock-data";

export function PulseView() {
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [draft, setDraft] = useState("");
  const [composing, setComposing] = useState(false);
  const me = USERS[0];

  function toggleLike(id: number) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  }

  function toggleRepost(id: number) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, reposted: !p.reposted, reposts: p.reposted ? p.reposts - 1 : p.reposts + 1 } : p
      )
    );
  }

  function submitPost() {
    const text = draft.trim();
    if (!text) return;
    const newPost: Post = {
      id: Date.now(),
      userId: me.id,
      text,
      likes: 0,
      reposts: 0,
      replies: 0,
      time: "now",
      liked: false,
      reposted: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setDraft("");
    setComposing(false);
  }

  function closeComposerOnBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) setComposing(false);
  }

  return (
    <section className="relative mx-auto flex h-full w-full max-w-2xl flex-col gap-3 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-xl">
      {/* Composer trigger */}
      <div
        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/70 p-3 transition hover:bg-zinc-900"
        onClick={() => setComposing(true)}
      >
        <div className={`h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${me.avatar}`} />
        <p className="flex-1 text-sm text-zinc-500">What&apos;s on your mind?</p>
        <ImagePlus size={16} className="text-zinc-500" />
      </div>

      {/* Compose modal */}
      <AnimatePresence>
        {composing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
            onClick={closeComposerOnBackdrop}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full max-w-lg rounded-3xl border border-white/10 bg-zinc-950 p-4 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">New Pulse</p>
                <button onClick={() => setComposing(false)} className="text-zinc-400 hover:text-white transition">
                  <X size={18} />
                </button>
              </div>
              <div className="flex gap-3">
                <div className={`h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${me.avatar}`} />
                <textarea
                  autoFocus
                  className="min-h-[100px] w-full resize-none bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                  placeholder="Share a thought with the world…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs ${draft.length > 270 ? "text-rose-400" : "text-zinc-500"}`}>
                  {draft.length}/280
                </span>
                <button
                  onClick={submitPost}
                  disabled={!draft.trim() || draft.length > 280}
                  className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-40"
                >
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed */}
      <AnimatePresence initial={false}>
        {posts.map((post) => {
          const author = getUser(post.userId);
          return (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4"
            >
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${author.avatar}`} />
                <div>
                  <p className="text-sm font-semibold text-white">{author.name}</p>
                  <p className="text-xs text-zinc-500">{author.handle} · {post.time}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-zinc-200 leading-relaxed">{post.text}</p>

              <div className="mt-4 flex items-center gap-6 text-zinc-400">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs transition ${post.liked ? "text-rose-400" : "hover:text-rose-300"}`}
                >
                  <Heart size={15} fill={post.liked ? "currentColor" : "none"} />
                  {post.likes}
                </button>
                <button
                  onClick={() => toggleRepost(post.id)}
                  className={`flex items-center gap-1.5 text-xs transition ${post.reposted ? "text-emerald-400" : "hover:text-emerald-300"}`}
                >
                  <Repeat2 size={15} />
                  {post.reposts}
                </button>
                <button className="flex items-center gap-1.5 text-xs hover:text-sky-300 transition">
                  <MessageCircle size={15} />
                  {post.replies}
                </button>
              </div>
            </motion.article>
          );
        })}
      </AnimatePresence>
    </section>
  );
}

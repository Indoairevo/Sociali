"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Play, ThumbsUp, X } from "lucide-react";
import { useState } from "react";
import { VIDEOS, type Video, getUser } from "@/lib/mock-data";

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

export function WatchView() {
  const [selected, setSelected] = useState<Video | null>(null);

  function closePlayerOnBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) setSelected(null);
  }

  return (
    <section className="relative h-full overflow-y-auto rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl">
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((video) => {
          const author = getUser(video.userId);
          return (
            <article
              key={video.id}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-zinc-900/70 p-2 transition hover:border-white/20 hover:bg-zinc-800/70"
              onClick={() => setSelected(video)}
            >
              {/* Thumbnail */}
              <div className={`relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br ${video.gradient}`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                    <Play size={20} className="ml-1 text-white" fill="white" />
                  </div>
                </div>
                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
                  {video.duration}
                </span>
              </div>

              {/* Meta */}
              <div className="mt-2 flex gap-2 p-1">
                <div className={`h-8 w-8 shrink-0 rounded-full bg-gradient-to-br ${author.avatar}`} />
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-medium text-zinc-100">{video.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {author.name} · {video.views} views · {video.age}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Video player modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={closePlayerOnBackdrop}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
            >
              {/* Player area */}
              <div className={`relative aspect-video w-full bg-gradient-to-br ${selected.gradient} flex items-center justify-center`}>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm ring-1 ring-white/20">
                  <Play size={28} className="ml-1 text-white" fill="white" />
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                >
                  <X size={16} />
                </button>
                <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                  {selected.duration}
                </span>
              </div>

              {/* Details */}
              <div className="p-4">
                <p className="text-base font-semibold text-white">{selected.title}</p>
                <p className="mt-0.5 text-xs text-zinc-400">{selected.views} views · {selected.age}</p>

                <div className="mt-3 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${getUser(selected.userId).avatar}`} />
                  <div>
                    <p className="text-sm font-semibold text-white">{getUser(selected.userId).name}</p>
                    <p className="text-xs text-zinc-400">{getUser(selected.userId).handle}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-zinc-300 leading-relaxed">{selected.description}</p>

                <div className="mt-4 flex items-center gap-4 border-t border-white/10 pt-3">
                  <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-blue-300 transition">
                    <ThumbsUp size={15} /> {fmt(selected.likes)}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-sky-300 transition">
                    <MessageCircle size={15} /> {fmt(selected.comments)}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-300 transition">
                    <Heart size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

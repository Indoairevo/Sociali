"use client";

import { Bookmark, Heart, MessageCircle, Music2, Send } from "lucide-react";
import { useState } from "react";
import { REELS, type Reel, getUser } from "@/lib/mock-data";

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

export function VibeView() {
  const [reels, setReels] = useState<Reel[]>(REELS);

  function toggleLike(id: number) {
    setReels((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r
      )
    );
  }

  return (
    <section className="h-full snap-y snap-mandatory overflow-y-auto rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl">
      {reels.map((reel) => {
        const author = getUser(reel.userId);
        return (
          <article
            key={reel.id}
            className={`relative h-[calc(100vh-180px)] min-h-[520px] snap-start overflow-hidden border-b border-white/10 bg-gradient-to-b ${reel.gradient}`}
          >
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.12),transparent_50%)]" />

            {/* Play button hint */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20">
                <div className="ml-1 h-0 w-0 border-b-[11px] border-l-[20px] border-t-[11px] border-b-transparent border-l-white border-t-transparent" />
              </div>
            </div>

            {/* Right action bar */}
            <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5">
              <button
                onClick={() => toggleLike(reel.id)}
                className="flex flex-col items-center gap-1"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition ${reel.liked ? "text-rose-400" : "text-white hover:text-rose-300"}`}>
                  <Heart size={20} fill={reel.liked ? "currentColor" : "none"} />
                </div>
                <span className="text-xs font-medium text-white drop-shadow">{fmt(reel.likes)}</span>
              </button>

              <button className="flex flex-col items-center gap-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:text-sky-300 transition">
                  <MessageCircle size={20} />
                </div>
                <span className="text-xs font-medium text-white drop-shadow">{fmt(reel.comments)}</span>
              </button>

              <button className="flex flex-col items-center gap-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:text-emerald-300 transition">
                  <Send size={20} />
                </div>
                <span className="text-xs font-medium text-white drop-shadow">{fmt(reel.shares)}</span>
              </button>

              <button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:text-amber-300 transition">
                  <Bookmark size={20} />
                </div>
              </button>

              {/* Author avatar */}
              <div className={`h-10 w-10 rounded-full bg-gradient-to-br ring-2 ring-white ${author.avatar}`} />
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-14 space-y-1.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 pb-6">
              <p className="text-sm font-semibold text-white">{author.handle}</p>
              <p className="text-sm text-zinc-100 leading-snug">{reel.caption}</p>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                <Music2 size={12} className="animate-spin" style={{ animationDuration: "3s" }} />
                {reel.music}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

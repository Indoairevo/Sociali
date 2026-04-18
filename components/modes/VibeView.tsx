"use client";

import { Bookmark, Heart, MessageCircle, Music2, Share2, UserPlus } from "lucide-react";
import { useState } from "react";

interface Reel {
  id: number;
  user: string;
  handle: string;
  caption: string;
  music: string;
  gradient: string;
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
  followed: boolean;
}

const SEED_REELS: Reel[] = [
  {
    id: 1,
    user: "Alya Design", handle: "@alyadsgn",
    caption: "Night city timelapse — Tokyo at 2 AM hits differently 🌆",
    music: "Neon Dreams · DJ Flux",
    gradient: "from-indigo-900 via-purple-900 to-zinc-950",
    likes: 4821, comments: 312,
    liked: false, saved: false, followed: false,
  },
  {
    id: 2,
    user: "Rafi Dev", handle: "@rafidev",
    caption: "UI micro-interactions that took my app from 3★ to 5★ 🤌",
    music: "Soft Pulse · Motion Lab",
    gradient: "from-sky-900 via-cyan-900 to-zinc-950",
    likes: 2934, comments: 187,
    liked: true, saved: true, followed: true,
  },
  {
    id: 3,
    user: "Nadia UX", handle: "@nadiaux",
    caption: "Coffee + coding + lo-fi = the perfect Sunday loop ☕",
    music: "Midnight Jazz · LoFi Set",
    gradient: "from-amber-900 via-orange-900 to-zinc-950",
    likes: 7102, comments: 441,
    liked: false, saved: false, followed: false,
  },
  {
    id: 4,
    user: "Rio Systems", handle: "@riosys",
    caption: "Deploy day 🚀 — nothing beats watching green check marks appear",
    music: "Launch Sequence · CodeBeats",
    gradient: "from-emerald-900 via-teal-900 to-zinc-950",
    likes: 3318, comments: 229,
    liked: false, saved: true, followed: false,
  },
];

function formatCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return (Number.isInteger(k) ? k.toString() : k.toFixed(1)) + "K";
  }
  return String(n);
}

export function VibeView() {
  const [reels, setReels] = useState<Reel[]>(SEED_REELS);

  function toggle(id: number, field: "liked" | "saved" | "followed") {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === "liked") {
          const nextLiked = !r.liked;
          return {
            ...r,
            liked: nextLiked,
            likes: nextLiked ? r.likes + 1 : Math.max(0, r.likes - 1),
          };
        }
        return { ...r, [field]: !r[field] };
      })
    );
  }

  return (
    <section className="snap-reel h-full overflow-y-auto rounded-3xl border border-white/10 shadow-xl">
      {reels.map((reel) => (
        <article
          key={reel.id}
          className={`snap-reel-item relative flex h-[calc(100vh-180px)] min-h-[500px] overflow-hidden bg-gradient-to-b ${reel.gradient}`}
          style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
        >
          {/* Background shimmer overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(255,255,255,0.12),transparent_55%)]" />

          {/* Play button overlay (center) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-white opacity-80">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
          </div>

          {/* Right action bar */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
            <button
              onClick={() => toggle(reel.id, "liked")}
              className="flex flex-col items-center gap-1"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm transition ${reel.liked ? "bg-rose-500/80" : "bg-black/40 hover:bg-black/60"}`}>
                <Heart size={20} fill={reel.liked ? "white" : "none"} className="text-white" />
              </div>
              <span className="text-[11px] font-medium text-white drop-shadow">
                {formatCount(reel.likes)}
              </span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition hover:bg-black/60">
                <MessageCircle size={20} className="text-white" />
              </div>
              <span className="text-[11px] font-medium text-white drop-shadow">
                {formatCount(reel.comments)}
              </span>
            </button>

            <button
              onClick={() => toggle(reel.id, "saved")}
              className="flex flex-col items-center gap-1"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm transition ${reel.saved ? "bg-amber-500/80" : "bg-black/40 hover:bg-black/60"}`}>
                <Bookmark size={20} fill={reel.saved ? "white" : "none"} className="text-white" />
              </div>
              <span className="text-[11px] font-medium text-white drop-shadow">Save</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition hover:bg-black/60">
                <Share2 size={20} className="text-white" />
              </div>
              <span className="text-[11px] font-medium text-white drop-shadow">Share</span>
            </button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-14 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-5 pt-16">
            {/* User row */}
            <div className="mb-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm ring-2 ring-white/30" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white drop-shadow">{reel.user}</p>
                <p className="text-xs text-zinc-300">{reel.handle}</p>
              </div>
              <button
                onClick={() => toggle(reel.id, "followed")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  reel.followed
                    ? "bg-white/20 text-white ring-1 ring-white/30"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {reel.followed ? "Following" : <><UserPlus size={12} /> Follow</>}
              </button>
            </div>

            {/* Caption */}
            <p className="mb-2 text-sm leading-snug text-white drop-shadow">{reel.caption}</p>

            {/* Music */}
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <Music2 size={10} className="text-white" />
              </div>
              <p className="text-xs text-zinc-300">♫ {reel.music}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

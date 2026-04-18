"use client";

import { Bell, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useState } from "react";

interface Video {
  id: number;
  title: string;
  channel: string;
  channelAbbr: string;
  channelGradient: string;
  views: string;
  age: string;
  duration: string;
  thumbnailGradient: string;
  likes: number;
  dislikes: number;
  subscribers: string;
  description: string;
}

const VIDEOS: Video[] = [
  {
    id: 1,
    title: "Designing a super app from scratch — full process",
    channel: "Indra Evo", channelAbbr: "IE",
    channelGradient: "from-sky-400 to-indigo-600",
    views: "21K", age: "2 days ago", duration: "18:42",
    thumbnailGradient: "from-indigo-700 via-purple-800 to-zinc-900",
    likes: 1840, dislikes: 42, subscribers: "18.5K",
    description: "In this video I walk through my entire design process for building Sociali — a super app that combines chat, reels, posts, video, and profiles in one tab.",
  },
  {
    id: 2,
    title: "Framer Motion transitions you'll use in every project",
    channel: "Rafi Dev", channelAbbr: "R",
    channelGradient: "from-violet-400 to-purple-600",
    views: "12K", age: "5 days ago", duration: "10:08",
    thumbnailGradient: "from-violet-700 via-fuchsia-800 to-zinc-900",
    likes: 978, dislikes: 18, subscribers: "9.2K",
    description: "AnimatePresence, layout animations, stagger, and spring physics — all the Framer Motion APIs I reach for every single project.",
  },
  {
    id: 3,
    title: "Next.js 15 App Router deep dive",
    channel: "Alya Design", channelAbbr: "A",
    channelGradient: "from-rose-400 to-pink-600",
    views: "35K", age: "1 week ago", duration: "24:55",
    thumbnailGradient: "from-rose-700 via-pink-800 to-zinc-900",
    likes: 3210, dislikes: 71, subscribers: "41.7K",
    description: "Everything you need to know about the App Router, server components, streaming, and partial rendering in Next.js 15.",
  },
  {
    id: 4,
    title: "Mobile-first dark UI — full Tailwind walkthrough",
    channel: "Nadia UX", channelAbbr: "N",
    channelGradient: "from-amber-400 to-orange-600",
    views: "9K", age: "3 days ago", duration: "14:30",
    thumbnailGradient: "from-amber-700 via-orange-800 to-zinc-900",
    likes: 812, dislikes: 9, subscribers: "7.4K",
    description: "Step-by-step Tailwind dark mode UI design with mobile-first responsive breakpoints, glassmorphism cards, and a custom color palette.",
  },
  {
    id: 5,
    title: "Glassmorphism done right — not just blur + white",
    channel: "Rafi Dev", channelAbbr: "R",
    channelGradient: "from-violet-400 to-purple-600",
    views: "7K", age: "6 days ago", duration: "9:17",
    thumbnailGradient: "from-teal-700 via-cyan-800 to-zinc-900",
    likes: 641, dislikes: 14, subscribers: "9.2K",
    description: "Most glassmorphism tutorials miss the depth cues. Learn how to use proper border gradients, shadow stacks, and noise overlays.",
  },
  {
    id: 6,
    title: "Build once, ship for all social platforms",
    channel: "Indra Evo", channelAbbr: "IE",
    channelGradient: "from-sky-400 to-indigo-600",
    views: "18K", age: "1 day ago", duration: "22:11",
    thumbnailGradient: "from-sky-700 via-blue-800 to-zinc-900",
    likes: 1554, dislikes: 28, subscribers: "18.5K",
    description: "One codebase, one identity, five social modes. Here's how I architect Sociali so each feature feels native but shares the same user context.",
  },
];

function ThumbnailCard({ video, onPlay }: { video: Video; onPlay: (v: Video) => void }) {
  return (
    <article
      className="cursor-pointer rounded-2xl border border-white/10 bg-zinc-900/60 p-2 transition hover:bg-zinc-900/90"
      onClick={() => onPlay(video)}
    >
      {/* Thumbnail */}
      <div className={`relative aspect-video rounded-xl bg-gradient-to-br ${video.thumbnailGradient} overflow-hidden`}>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
          <svg viewBox="0 0 24 24" className="ml-1 h-10 w-10 fill-white">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </div>
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {video.duration}
        </span>
      </div>

      {/* Info */}
      <div className="mt-2.5 flex gap-2.5 p-1">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ${video.channelGradient}`}>
          {video.channelAbbr}
        </div>
        <div>
          <p className="line-clamp-2 text-xs font-medium leading-snug text-zinc-100">{video.title}</p>
          <p className="mt-1 text-[10px] text-zinc-500">{video.channel}</p>
          <p className="text-[10px] text-zinc-500">{video.views} views · {video.age}</p>
        </div>
      </div>
    </article>
  );
}

function VideoPlayer({ video, onClose, onSelectRelated }: { video: Video; onClose: () => void; onSelectRelated: (video: Video) => void }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl lg:flex-row lg:overflow-hidden">
      {/* Player + meta */}
      <div className="flex flex-col lg:flex-1 lg:overflow-y-auto">
        {/* Video */}
        <div className={`relative aspect-video w-full bg-gradient-to-br ${video.thumbnailGradient}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-white opacity-80">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
          >
            <X size={16} />
          </button>
        </div>

        {/* Meta */}
        <div className="p-4">
          <h2 className="text-base font-semibold leading-snug text-white">{video.title}</h2>
          <p className="mt-1 text-xs text-zinc-500">{video.views} views · {video.age}</p>

          {/* Channel row */}
          <div className="mt-4 flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${video.channelGradient}`}>
              {video.channelAbbr}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{video.channel}</p>
              <p className="text-xs text-zinc-500">{video.subscribers} subscribers</p>
            </div>
            <button
              onClick={() => setSubscribed((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                subscribed ? "bg-zinc-700 text-white ring-1 ring-white/20" : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              {subscribed ? (
                <><Bell size={12} /> Subscribed</>
              ) : (
                "Subscribe"
              )}
            </button>
          </div>

          {/* Like / dislike */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => { setLiked((v) => !v); setDisliked(false); }}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                liked ? "border-sky-500 bg-sky-500/20 text-sky-400" : "border-white/15 text-zinc-300 hover:bg-white/10"
              }`}
            >
              <ThumbsUp size={13} fill={liked ? "currentColor" : "none"} />
              {video.likes + (liked ? 1 : 0)}
            </button>
            <button
              onClick={() => { setDisliked((v) => !v); setLiked(false); }}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                disliked ? "border-rose-500 bg-rose-500/20 text-rose-400" : "border-white/15 text-zinc-300 hover:bg-white/10"
              }`}
            >
              <ThumbsDown size={13} fill={disliked ? "currentColor" : "none"} />
              {video.dislikes + (disliked ? 1 : 0)}
            </button>
          </div>

          {/* Description */}
          <div className="mt-4 rounded-xl bg-white/5 p-3 text-xs leading-relaxed text-zinc-400">
            {video.description}
          </div>
        </div>
      </div>

      {/* Related videos */}
      <aside className="border-t border-white/10 p-3 lg:w-72 lg:overflow-y-auto lg:border-t-0 lg:border-l">
        <p className="mb-3 px-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Up next</p>
        <div className="flex flex-col gap-2">
          {VIDEOS.filter((v) => v.id !== video.id).map((v) => (
            <div
              key={v.id}
              className="flex cursor-pointer gap-2 rounded-xl p-1.5 transition hover:bg-white/8"
              onClick={() => onSelectRelated(v)}
            >
              <div className={`relative h-16 w-28 shrink-0 rounded-lg bg-gradient-to-br ${v.thumbnailGradient}`}>
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-medium text-white">
                  {v.duration}
                </span>
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-xs font-medium leading-snug text-zinc-200">{v.title}</p>
                <p className="mt-0.5 text-[10px] text-zinc-500">{v.channel}</p>
                <p className="text-[10px] text-zinc-500">{v.views} views</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

export function WatchView({ searchQuery = "" }: { searchQuery?: string }) {
  const [playing, setPlaying] = useState<Video | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleVideos = normalizedQuery
    ? VIDEOS.filter((video) =>
        `${video.title} ${video.channel} ${video.description}`.toLowerCase().includes(normalizedQuery)
      )
    : VIDEOS;

  if (playing) {
    return <VideoPlayer video={playing} onClose={() => setPlaying(null)} onSelectRelated={setPlaying} />;
  }

  return (
    <section className="grid h-full grid-cols-1 gap-4 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-3">
      {visibleVideos.map((video) => (
        <ThumbnailCard key={video.id} video={video} onPlay={setPlaying} />
      ))}
      {visibleVideos.length === 0 && (
        <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-white/15 bg-zinc-900/30 p-5 text-center text-sm text-zinc-400">
          No videos found for “{searchQuery.trim()}”.
        </div>
      )}
    </section>
  );
}

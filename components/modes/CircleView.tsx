"use client";

import { Camera, Check, Grid3X3, Heart, MessageCircle, MoreHorizontal, Pencil, UserPlus, Users } from "lucide-react";
import { useState } from "react";

/* ── Types ── */
interface Story {
  id: number;
  name: string;
  gradient: string;
  hasNew: boolean;
}

interface Friend {
  id: number;
  name: string;
  handle: string;
  gradient: string;
  mutualFriends: number;
  connected: boolean;
}

interface FeedPost {
  id: number;
  user: string;
  gradient: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
  liked: boolean;
}

/* ── Data ── */
const STORIES: Story[] = [
  { id: 1, name: "Your Story", gradient: "from-sky-400 to-indigo-600",   hasNew: false },
  { id: 2, name: "Alya",       gradient: "from-rose-400 to-pink-600",     hasNew: true  },
  { id: 3, name: "Rafi",       gradient: "from-violet-400 to-purple-600", hasNew: true  },
  { id: 4, name: "Nadia",      gradient: "from-amber-400 to-orange-600",  hasNew: true  },
  { id: 5, name: "Rio",        gradient: "from-emerald-400 to-teal-600",  hasNew: false },
  { id: 6, name: "Sinta",      gradient: "from-fuchsia-400 to-pink-600",  hasNew: true  },
];

const FRIENDS: Friend[] = [
  { id: 1, name: "Alya Design", handle: "@alyadsgn", gradient: "from-rose-400 to-pink-600",     mutualFriends: 12, connected: false },
  { id: 2, name: "Rafi Dev",    handle: "@rafidev",   gradient: "from-violet-400 to-purple-600", mutualFriends: 8,  connected: true  },
  { id: 3, name: "Nadia UX",   handle: "@nadiaux",   gradient: "from-amber-400 to-orange-600",  mutualFriends: 5,  connected: false },
  { id: 4, name: "Rio Systems", handle: "@riosys",   gradient: "from-emerald-400 to-teal-600",  mutualFriends: 3,  connected: false },
  { id: 5, name: "Sinta Pro",  handle: "@sintapro",  gradient: "from-fuchsia-400 to-pink-600",  mutualFriends: 7,  connected: true  },
  { id: 6, name: "Bima Code",  handle: "@bimacode",  gradient: "from-sky-400 to-cyan-600",      mutualFriends: 2,  connected: false },
];

const FEED_POSTS: FeedPost[] = [
  {
    id: 1,
    user: "Indra Evo", gradient: "from-sky-400 to-indigo-600",
    time: "2 hours ago",
    text: "Just shipped the Sociali super app! Chat, reels, posts, videos and profile — all in one beautiful tab. Building the future of social 🚀",
    likes: 48, comments: 12, liked: false,
  },
  {
    id: 2,
    user: "Indra Evo", gradient: "from-sky-400 to-indigo-600",
    time: "Yesterday",
    text: "Real-time typing indicators are LIVE in the Connect tab. The small details always make the biggest difference ⚡",
    likes: 134, comments: 27, liked: true,
  },
  {
    id: 3,
    user: "Indra Evo", gradient: "from-sky-400 to-indigo-600",
    time: "3 days ago",
    text: "Glassmorphism is still the most satisfying UI trend if you do it right — proper depth, subtle noise, real shadows, not just `backdrop-blur`.",
    likes: 211, comments: 44, liked: false,
  },
];

/* ── Sub-components ── */
function StoryRing({ story }: { story: Story }) {
  return (
    <button className="flex shrink-0 flex-col items-center gap-1.5">
      <div className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${story.gradient} ${story.hasNew ? "ring-2 ring-violet-400 ring-offset-2 ring-offset-zinc-950" : "ring-1 ring-white/20"}`}>
        {story.id === 1 && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 ring-2 ring-zinc-950">
            <Camera size={10} className="text-white" />
          </div>
        )}
      </div>
      <span className="max-w-[56px] truncate text-center text-[10px] text-zinc-400">{story.name}</span>
    </button>
  );
}

/* ── Main ── */
export function CircleView() {
  const [friends, setFriends] = useState<Friend[]>(FRIENDS);
  const [posts, setPosts] = useState<FeedPost[]>(FEED_POSTS);
  const [activeTab, setActiveTab] = useState<"posts" | "friends">("posts");

  function toggleConnect(id: number) {
    setFriends((prev) => prev.map((f) => f.id === id ? { ...f, connected: !f.connected } : f));
  }

  function toggleLike(id: number) {
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, liked: !p.liked } : p));
  }

  const connectedCount = friends.filter((f) => f.connected).length;

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl">
      {/* ── Cover photo ── */}
      <div className="relative h-28 shrink-0 overflow-hidden rounded-t-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-700 sm:h-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,rgba(255,255,255,0.15),transparent_60%)]" />
        <button className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition hover:bg-black/60">
          <Camera size={12} /> Edit cover
        </button>
      </div>

      {/* ── Avatar + name ── */}
      <div className="relative px-4 pb-4 pt-0">
        <div className="flex items-end justify-between">
          <div className="relative -mt-8 shrink-0">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 ring-4 ring-zinc-950 sm:h-24 sm:w-24" />
            <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 ring-2 ring-zinc-950 transition hover:bg-zinc-700">
              <Camera size={12} className="text-white" />
            </button>
          </div>
          <button className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/15">
            <Pencil size={12} /> Edit profile
          </button>
        </div>

        <div className="mt-3">
          <p className="text-lg font-bold text-white">Indra Evo</p>
          <p className="text-sm text-zinc-400">@indoairevo · Building Sociali 🚀</p>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Posts",    value: "184" },
            { label: "Friends",  value: `${2300 + connectedCount}` },
            { label: "Following", value: "980" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/6 py-2.5 transition hover:bg-white/10">
              <p className="text-base font-bold text-white">{s.value}</p>
              <p className="text-xs text-zinc-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stories ── */}
      <div className="border-t border-white/10 px-4 py-3">
        <p className="mb-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Stories</p>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {STORIES.map((s) => <StoryRing key={s.id} story={s} />)}
        </div>
      </div>

      {/* ── Tab switcher ── */}
      <div className="flex border-t border-white/10">
        {(["posts", "friends"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition ${
              activeTab === t
                ? "border-b-2 border-violet-400 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t === "posts" ? <Grid3X3 size={15} /> : <Users size={15} />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 p-4">
        {activeTab === "posts" && (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <article key={post.id} className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${post.gradient}`}>
                      IE
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{post.user}</p>
                      <p className="text-xs text-zinc-500">{post.time}</p>
                    </div>
                  </div>
                  <button className="rounded-lg p-1 text-zinc-600 transition hover:text-zinc-300">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-200">{post.text}</p>
                <div className="mt-4 flex items-center gap-5 border-t border-white/8 pt-3">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs transition ${post.liked ? "text-rose-400" : "text-zinc-500 hover:text-rose-400"}`}
                  >
                    <Heart size={14} fill={post.liked ? "currentColor" : "none"} />
                    {post.likes + (post.liked ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-zinc-500 transition hover:text-sky-400">
                    <MessageCircle size={14} />
                    {post.comments}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === "friends" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {friends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${friend.gradient}`}>
                  {friend.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{friend.name}</p>
                  <p className="text-xs text-zinc-500">{friend.mutualFriends} mutual friends</p>
                </div>
                <button
                  onClick={() => toggleConnect(friend.id)}
                  className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    friend.connected
                      ? "bg-white/10 text-zinc-300 hover:bg-white/15"
                      : "bg-violet-500/80 text-white hover:bg-violet-400"
                  }`}
                >
                  {friend.connected ? <><Check size={11} /> Friends</> : <><UserPlus size={11} /> Connect</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

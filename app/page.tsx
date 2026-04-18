"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Clapperboard,
  Heart,
  MessageCircleMore,
  PlaySquare,
  Search,
  UserPlus,
  UserRound,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CircleView } from "@/components/modes/CircleView";
import { ConnectView } from "@/components/modes/ConnectView";
import { PulseView } from "@/components/modes/PulseView";
import { VibeView } from "@/components/modes/VibeView";
import { WatchView } from "@/components/modes/WatchView";
import { NOTIFICATIONS, USERS, POSTS, VIDEOS, getUser } from "@/lib/mock-data";

type ModeKey = "connect" | "pulse" | "vibe" | "watch" | "circle";

const tabs: { key: ModeKey; label: string; icon: LucideIcon }[] = [
  { key: "connect", label: "Connect", icon: MessageCircleMore },
  { key: "pulse",   label: "Pulse",   icon: Waves },
  { key: "vibe",    label: "Vibe",    icon: PlaySquare },
  { key: "watch",   label: "Watch",   icon: Clapperboard },
  { key: "circle",  label: "Circle",  icon: UserRound },
];

const notifIcon: Record<string, LucideIcon> = {
  like:    Heart,
  follow:  UserPlus,
  comment: MessageCircleMore,
  repost:  Waves,
  message: MessageCircleMore,
};

export default function Home() {
  const [mode, setMode] = useState<ModeKey>("connect");
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const searchResults = useMemo(() => {
    if (!query.trim()) return { users: [], posts: [], videos: [] };
    const q = query.toLowerCase();
    return {
      users:  USERS.filter((u) => u.name.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q)),
      posts:  POSTS.filter((p) => p.text.toLowerCase().includes(q)),
      videos: VIDEOS.filter((v) => v.title.toLowerCase().includes(q)),
    };
  }, [query]);

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function closeNotifOnBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) setNotifOpen(false);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  const currentView = useMemo(() => {
    switch (mode) {
      case "connect": return <ConnectView />;
      case "pulse":   return <PulseView />;
      case "vibe":    return <VibeView />;
      case "watch":   return <WatchView />;
      case "circle":  return <CircleView />;
      default:        return null;
    }
  }, [mode]);

  return (
    <main className="mx-auto flex h-screen max-w-6xl flex-col px-3 pb-28 pt-4 sm:px-6">
      {/* Header */}
      <header className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
        <div>
          <p className="text-base font-semibold text-white">Sociali</p>
          <p className="text-xs text-zinc-400">All social. One tab.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <Search size={15} />
          </button>

          {/* Notifications button */}
          <button
            onClick={() => setNotifOpen(true)}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">{mode}</span>
        </div>
      </header>

      {/* Main view */}
      <section className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="h-full"
          >
            {currentView}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 border-t border-white/15 bg-zinc-950/70 px-2 py-2 backdrop-blur-md sm:px-4">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = mode === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs transition ${
                  active ? "bg-white/15 text-white" : "text-zinc-400 hover:bg-white/10 hover:text-zinc-100"
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Notifications panel */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
            onClick={closeNotifOnBackdrop}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                <p className="text-sm font-semibold text-white">Notifications</p>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-blue-400 hover:text-blue-300 transition">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="text-zinc-400 hover:text-white transition">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {notifs.map((n) => {
                  const Icon = notifIcon[n.type] ?? Bell;
                  const u = getUser(n.userId);
                  return (
                    <div
                      key={n.id}
                      className={`mb-2 flex items-start gap-3 rounded-2xl p-3 transition ${
                        n.read ? "bg-white/3" : "bg-white/8 ring-1 ring-white/10"
                      }`}
                    >
                      <div className="relative">
                        <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${u.avatar}`} />
                        <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900">
                          <Icon size={9} className="text-zinc-300" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-zinc-200">{n.text}</p>
                        <p className="text-xs text-zinc-500">{n.time} ago</p>
                      </div>
                      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                    </div>
                  );
                })}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-xl"
          >
            {/* Search bar */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <Search size={16} className="shrink-0 text-zinc-400" />
              <input
                autoFocus
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                placeholder="Search people, posts, videos…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={closeSearch} className="text-zinc-400 hover:text-white transition">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!query.trim() ? (
                <p className="text-center text-sm text-zinc-500 mt-12">Start typing to search…</p>
              ) : (
                <div className="space-y-6">
                  {/* Users */}
                  {searchResults.users.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">People</p>
                      {searchResults.users.map((u) => (
                        <div key={u.id} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-white/5">
                          <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${u.avatar}`} />
                          <div>
                            <p className="text-sm font-semibold text-white">{u.name}</p>
                            <p className="text-xs text-zinc-400">{u.handle}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Posts */}
                  {searchResults.posts.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Pulse</p>
                      {searchResults.posts.map((p) => {
                        const author = getUser(p.userId);
                        return (
                          <div key={p.id} className="rounded-2xl border border-white/8 bg-zinc-900/50 p-3 mb-2">
                            <p className="text-xs text-zinc-400">{author.handle}</p>
                            <p className="mt-1 text-sm text-zinc-200">{p.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Videos */}
                  {searchResults.videos.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Watch</p>
                      {searchResults.videos.map((v) => (
                        <div key={v.id} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-zinc-900/50 p-3 mb-2">
                          <div className={`h-12 w-20 shrink-0 rounded-lg bg-gradient-to-br ${v.gradient}`} />
                          <div>
                            <p className="text-sm font-medium text-zinc-100">{v.title}</p>
                            <p className="text-xs text-zinc-400">{v.views} views · {v.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No results */}
                  {searchResults.users.length === 0 && searchResults.posts.length === 0 && searchResults.videos.length === 0 && (
                    <p className="text-center text-sm text-zinc-500 mt-12">No results for &ldquo;{query}&rdquo;</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


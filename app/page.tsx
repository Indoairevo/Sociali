"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Clapperboard,
  MessageCircleMore,
  PlaySquare,
  Search,
  UserRound,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CircleView } from "@/components/modes/CircleView";
import { ConnectView } from "@/components/modes/ConnectView";
import { PulseView } from "@/components/modes/PulseView";
import { VibeView } from "@/components/modes/VibeView";
import { WatchView } from "@/components/modes/WatchView";

type ModeKey = "connect" | "pulse" | "vibe" | "watch" | "circle";

const tabs: { key: ModeKey; label: string; icon: LucideIcon; color: string }[] = [
  { key: "connect", label: "Connect", icon: MessageCircleMore, color: "text-sky-400" },
  { key: "pulse", label: "Pulse", icon: Waves, color: "text-violet-400" },
  { key: "vibe", label: "Vibe", icon: PlaySquare, color: "text-rose-400" },
  { key: "watch", label: "Watch", icon: Clapperboard, color: "text-amber-400" },
  { key: "circle", label: "Circle", icon: UserRound, color: "text-emerald-400" },
];

const modeColors: Record<ModeKey, string> = {
  connect: "from-sky-500/20 to-transparent",
  pulse: "from-violet-500/20 to-transparent",
  vibe: "from-rose-500/20 to-transparent",
  watch: "from-amber-500/20 to-transparent",
  circle: "from-emerald-500/20 to-transparent",
};

const modeBadgeColors: Record<ModeKey, string> = {
  connect: "border-sky-500/40 text-sky-300 bg-sky-500/10",
  pulse: "border-violet-500/40 text-violet-300 bg-violet-500/10",
  vibe: "border-rose-500/40 text-rose-300 bg-rose-500/10",
  watch: "border-amber-500/40 text-amber-300 bg-amber-500/10",
  circle: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
};

export default function Home() {
  const [mode, setMode] = useState<ModeKey>("connect");
  const [showSearch, setShowSearch] = useState(false);
  const [notifCount] = useState(3);

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

  const activeTab = tabs.find((t) => t.key === mode)!;

  return (
    <main className="mx-auto flex h-screen max-w-6xl flex-col px-3 pb-24 pt-3 sm:px-6">
      {/* ── Header ── */}
      <header className="mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
        {/* Brand */}
        <div className="flex-1">
          <p className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-base font-bold tracking-tight text-transparent">
            Sociali
          </p>
          <p className="text-[10px] text-zinc-500">Everything in one tab</p>
        </div>

        {/* Mode badge */}
        <span className={`hidden rounded-full border px-3 py-1 text-xs font-medium sm:inline-flex ${modeBadgeColors[mode]}`}>
          {activeTab.label}
        </span>

        {/* Search toggle */}
        <button
          onClick={() => setShowSearch((v) => !v)}
          className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {notifCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
              {notifCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 ring-2 ring-white/20" />
      </header>

      {/* ── Search bar ── */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-xl">
              <Search size={15} className="shrink-0 text-zinc-500" />
              <input
                autoFocus
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                placeholder={`Search in ${activeTab.label}…`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      <section className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="h-full"
          >
            {currentView}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Bottom nav ── */}
      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 border-t border-white/10 bg-zinc-950/80 px-2 py-2 backdrop-blur-md sm:px-4">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = mode === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className={`relative flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs transition-all duration-200 ${
                  active
                    ? `bg-gradient-to-b ${modeColors[tab.key]} border border-white/10 ${tab.color} font-medium`
                    : "text-zinc-500 hover:bg-white/8 hover:text-zinc-200"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

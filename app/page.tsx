"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Clapperboard,
  MessageCircleMore,
  PlaySquare,
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

const tabs: { key: ModeKey; label: string; icon: LucideIcon }[] = [
  { key: "connect", label: "Connect", icon: MessageCircleMore },
  { key: "pulse", label: "Pulse", icon: Waves },
  { key: "vibe", label: "Vibe", icon: PlaySquare },
  { key: "watch", label: "Watch", icon: Clapperboard },
  { key: "circle", label: "Circle", icon: UserRound },
];

export default function Home() {
  const [mode, setMode] = useState<ModeKey>("connect");

  const currentView = useMemo(() => {
    switch (mode) {
      case "connect":
        return <ConnectView />;
      case "pulse":
        return <PulseView />;
      case "vibe":
        return <VibeView />;
      case "watch":
        return <WatchView />;
      case "circle":
        return <CircleView />;
      default:
        return null;
    }
  }, [mode]);

  return (
    <main className="mx-auto flex h-screen max-w-6xl flex-col px-3 pb-28 pt-4 sm:px-6">
      <header className="mb-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
        <div>
          <p className="text-base font-semibold text-white">Sociali</p>
          <p className="text-xs text-zinc-400">Single-Tab Super App Prototype</p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">{mode}</span>
      </header>

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
    </main>
  );
}

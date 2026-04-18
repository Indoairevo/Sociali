"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Send, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CHATS, type Chat, type Message, getUser } from "@/lib/mock-data";

const statusColor: Record<string, string> = {
  online: "bg-emerald-400",
  away: "bg-amber-400",
  offline: "bg-zinc-500",
};

const statusLabel: Record<string, string> = {
  online: "online",
  away: "away",
  offline: "offline",
};

export function ConnectView() {
  const [chats, setChats] = useState<Chat[]>(CHATS);
  const [activeChatId, setActiveChatId] = useState<number>(CHATS[0].id);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId)!;
  const activeUser = getUser(activeChat.userId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, activeChat.messages.length]);

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== activeChatId) return c;
        const newMsg: Message = {
          id: c.messages.length + 1,
          mine: true,
          text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        return { ...c, lastMessage: text, time: "now", messages: [...c.messages, newMsg] };
      })
    );
    setDraft("");
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function selectChat(id: number) {
    setActiveChatId(id);
    // mark unread as read
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  }

  return (
    <section className="h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl md:grid md:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="hidden flex-col border-r border-white/10 md:flex">
        <p className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Messages</p>
        <div className="flex-1 overflow-y-auto p-2">
          {chats.map((chat) => {
            const u = getUser(chat.userId);
            const active = chat.id === activeChatId;
            return (
              <button
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={`mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                  active ? "bg-white/15 ring-1 ring-white/20" : "hover:bg-white/8"
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${u.avatar}`} />
                  <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-zinc-950 ${statusColor[u.status]}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-semibold text-white">{u.name}</p>
                    <span className="ml-1 shrink-0 text-xs text-zinc-500">{chat.time}</span>
                  </div>
                  <p className="truncate text-xs text-zinc-400">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="ml-1 shrink-0 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs font-bold text-white">
                    {chat.unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Chat pane */}
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <div className="relative">
            <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${activeUser.avatar}`} />
            <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-zinc-950 ${statusColor[activeUser.status]}`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{activeUser.name}</p>
            <p className="text-xs text-zinc-400">{statusLabel[activeUser.status]}</p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeChatId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-y-auto p-4"
          >
            <div className="space-y-3">
              {activeChat.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[80%]">
                    <p
                      className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                        msg.mine ? "bg-blue-500/80 text-white" : "bg-white/10 text-zinc-100"
                      }`}
                    >
                      {msg.text}
                    </p>
                    <p className={`mt-0.5 text-xs text-zinc-500 ${msg.mine ? "text-right" : "text-left"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </motion.div>
        </AnimatePresence>

        <footer className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
            <button className="text-zinc-400 hover:text-zinc-200 transition">
              <SmilePlus size={18} />
            </button>
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-zinc-400 focus:outline-none"
              placeholder="Type a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim()}
              className="rounded-xl bg-blue-500/80 p-2 text-white transition hover:bg-blue-500 disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}

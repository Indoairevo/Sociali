"use client";

import { Check, CheckCheck, Phone, Search, Send, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ── Types ── */
interface Chat {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  unread: number;
  lastMessage: string;
  time: string;
}

interface Message {
  id: number;
  mine: boolean;
  text: string;
  time: string;
  read: boolean;
}

/* ── Static seed data ── */
const CHATS: Chat[] = [
  { id: 1, name: "Alya",          avatar: "A",  status: "online",  unread: 2, lastMessage: "Let's sync before launch.",         time: "2m"  },
  { id: 2, name: "Rafi",          avatar: "R",  status: "online",  unread: 0, lastMessage: "Sending the mock now.",              time: "9m"  },
  { id: 3, name: "Nadia",         avatar: "N",  status: "away",    unread: 1, lastMessage: "Dinner later?",                      time: "23m" },
  { id: 4, name: "Team Sociali",  avatar: "TS", status: "online",  unread: 5, lastMessage: "Sprint review starts in 10.",        time: "1h"  },
  { id: 5, name: "Rio",           avatar: "Ri", status: "offline", unread: 0, lastMessage: "Great work on the animations 🔥",    time: "3h"  },
  { id: 6, name: "Sinta",         avatar: "S",  status: "away",    unread: 0, lastMessage: "Can you review my PR?",              time: "1d"  },
];

const SEED_MESSAGES: Record<number, Message[]> = {
  1: [
    { id: 1, mine: false, text: "Hey! Did you see the prototype update?",   time: "10:02", read: true  },
    { id: 2, mine: true,  text: "Yes, I love the glass look 🔥",            time: "10:03", read: true  },
    { id: 3, mine: false, text: "Can we add smoother transitions?",          time: "10:04", read: true  },
    { id: 4, mine: true,  text: "Already done with Framer Motion.",          time: "10:05", read: true  },
    { id: 5, mine: false, text: "Perfect, shipping this demo today.",        time: "10:06", read: false },
    { id: 6, mine: false, text: "Let's sync before launch.",                 time: "10:08", read: false },
  ],
  2: [
    { id: 1, mine: false, text: "Just pushed the design tokens.",            time: "09:30", read: true  },
    { id: 2, mine: true,  text: "Nice, I'll pull and review.",               time: "09:32", read: true  },
    { id: 3, mine: false, text: "Sending the mock now.",                     time: "09:51", read: true  },
  ],
  3: [
    { id: 1, mine: false, text: "Are you free this evening?",                time: "08:00", read: true  },
    { id: 2, mine: true,  text: "Maybe after 7 PM.",                         time: "08:05", read: true  },
    { id: 3, mine: false, text: "Dinner later?",                             time: "08:37", read: false },
  ],
  4: [
    { id: 1, mine: false, text: "Everyone check the Figma link.",            time: "11:00", read: true  },
    { id: 2, mine: false, text: "API contract is ready for review.",         time: "11:15", read: true  },
    { id: 3, mine: true,  text: "On it 👍",                                  time: "11:18", read: true  },
    { id: 4, mine: false, text: "Sprint review starts in 10.",               time: "11:50", read: false },
  ],
  5: [
    { id: 1, mine: true,  text: "Shipped the new vibe tab!",                 time: "Yesterday", read: true },
    { id: 2, mine: false, text: "Great work on the animations 🔥",           time: "Yesterday", read: true },
  ],
  6: [
    { id: 1, mine: false, text: "Hey, can you review my PR?",                time: "Monday",    read: true },
    { id: 2, mine: true,  text: "Sure, link it and I'll take a look.",       time: "Monday",    read: true },
    { id: 3, mine: false, text: "Can you review my PR?",                     time: "Monday",    read: true },
  ],
};

const avatarGradients: Record<number, string> = {
  1: "from-sky-400 to-blue-600",
  2: "from-violet-400 to-purple-600",
  3: "from-rose-400 to-pink-600",
  4: "from-amber-400 to-orange-600",
  5: "from-emerald-400 to-teal-600",
  6: "from-fuchsia-400 to-pink-600",
};

const statusColors: Record<Chat["status"], string> = {
  online:  "bg-emerald-400",
  away:    "bg-amber-400",
  offline: "bg-zinc-600",
};

function Avatar({ chat, size = "md" }: { chat: Chat; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-xs", lg: "h-12 w-12 text-sm" };
  const dotClasses  = { sm: "h-2 w-2 right-0 bottom-0", md: "h-2.5 w-2.5 right-0 bottom-0", lg: "h-3 w-3 right-0.5 bottom-0.5" };
  return (
    <div className="relative shrink-0">
      <div className={`flex items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white ${sizeClasses[size]} ${avatarGradients[chat.id] ?? "from-zinc-600 to-zinc-800"}`}>
        {chat.avatar.slice(0, 2)}
      </div>
      <span className={`absolute block rounded-full ring-2 ring-zinc-950 ${dotClasses[size]} ${statusColors[chat.status]}`} />
    </div>
  );
}

/* ── Main component ── */
export function ConnectView() {
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [messages, setMessages] = useState<Record<number, Message[]>>(SEED_MESSAGES);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [chats, setChats] = useState<Chat[]>(CHATS);
  const [searchQuery, setSearchQuery] = useState("");
  const msgEndRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId)!;
  const chatMessages = messages[activeChatId] ?? [];

  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* Scroll to bottom when messages change */
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  /* Mark messages as read when switching chat */
  useEffect(() => {
    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, unread: 0 } : c))
    );
  }, [activeChatId]);

  /* Simulate typing indicator from partner */
  function simulateTyping() {
    setTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setTyping(false);
      const replies = [
        "That sounds great! 🙌",
        "Got it, thanks!",
        "Will check that now.",
        "On it! 💪",
        "Makes sense, let's go!",
        "Awesome 🔥",
        "Noted 👍",
        "Love the idea!",
      ];
      const reply: Message = {
        id: Date.now(),
        mine: false,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        read: true,
      };
      setMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] ?? []), reply],
      }));
    }, 1800);
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    const msg: Message = {
      id: Date.now(),
      mine: true,
      text,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] ?? []), msg],
    }));
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId ? { ...c, lastMessage: text, time: "just now" } : c
      )
    );
    setDraft("");
    inputRef.current?.focus();
    setTimeout(simulateTyping, 600);
  }

  return (
    <section className="h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl md:grid md:grid-cols-[300px_1fr]">
      {/* ── Sidebar ── */}
      <aside className="hidden flex-col border-r border-white/10 md:flex">
        {/* Search */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center gap-2 rounded-xl bg-white/8 px-3 py-2">
            <Search size={14} className="shrink-0 text-zinc-500" />
            <input
              className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none"
              placeholder="Search conversations…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`mb-1 w-full rounded-2xl p-3 text-left transition-all duration-150 ${
                activeChatId === chat.id
                  ? "bg-white/12 ring-1 ring-white/15"
                  : "hover:bg-white/8"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar chat={chat} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-semibold text-white">{chat.name}</p>
                    <span className="ml-2 shrink-0 text-[10px] text-zinc-500">{chat.time}</span>
                  </div>
                  <p className="truncate text-xs text-zinc-400">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">
                    {chat.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Chat window ── */}
      <div className="flex h-full min-h-0 flex-col">
        {/* Chat header */}
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar chat={activeChat} size="sm" />
            <div>
              <p className="text-sm font-semibold text-white">{activeChat.name}</p>
              <p className={`text-xs ${activeChat.status === "online" ? "text-emerald-400" : "text-zinc-500"}`}>
                {typing ? "typing…" : activeChat.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white">
              <Phone size={16} />
            </button>
            <button className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white">
              <Video size={16} />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
              <div className="flex max-w-[78%] flex-col gap-1">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-snug ${
                    msg.mine
                      ? "rounded-br-md bg-sky-500/80 text-white"
                      : "rounded-bl-md bg-white/10 text-zinc-100"
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 text-[10px] text-zinc-600 ${msg.mine ? "justify-end" : "justify-start"}`}>
                  {msg.time}
                  {msg.mine && (
                    msg.read
                      ? <CheckCheck size={11} className="text-sky-400" />
                      : <Check size={11} />
                  )}
                </div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white/10 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={msgEndRef} />
        </div>

        {/* Input */}
        <footer className="border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 rounded-2xl bg-white/8 px-3 py-2">
            <input
              ref={inputRef}
              className="flex-1 bg-transparent px-1 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              placeholder="Type a message…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white transition hover:bg-sky-400 disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}

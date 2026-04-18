const chats = [
  { id: 1, name: "Alya", status: "online", lastMessage: "Let's sync before launch.", time: "2m" },
  { id: 2, name: "Rafi", status: "typing...", lastMessage: "Sending the mock now.", time: "9m" },
  { id: 3, name: "Nadia", status: "away", lastMessage: "Dinner later?", time: "23m" },
  { id: 4, name: "Team Sociali", status: "12 members", lastMessage: "Sprint review starts in 10.", time: "1h" },
];

const messages = [
  { id: 1, mine: false, text: "Hey! Did you see the prototype update?" },
  { id: 2, mine: true, text: "Yes, I love the glass look 🔥" },
  { id: 3, mine: false, text: "Can we add smoother transitions?" },
  { id: 4, mine: true, text: "Already done with Framer Motion." },
  { id: 5, mine: false, text: "Perfect, shipping this demo today." },
];

export function ConnectView() {
  return (
    <section className="h-full rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl md:grid md:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-white/10 p-3 md:block">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className="mb-2 w-full rounded-2xl border border-transparent bg-white/5 p-3 text-left transition hover:border-white/10 hover:bg-white/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{chat.name}</p>
              <span className="text-xs text-zinc-400">{chat.time}</span>
            </div>
            <p className="text-xs text-emerald-300">{chat.status}</p>
            <p className="truncate text-xs text-zinc-300">{chat.lastMessage}</p>
          </button>
        ))}
      </aside>

      <div className="flex h-full flex-col">
        <header className="border-b border-white/10 px-4 py-3">
          <p className="text-sm font-semibold text-white">Alya</p>
          <p className="text-xs text-emerald-300">online</p>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.mine ? "justify-end" : "justify-start"}`}>
              <p
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  message.mine ? "bg-blue-500/80 text-white" : "bg-white/10 text-zinc-100"
                }`}
              >
                {message.text}
              </p>
            </div>
          ))}
        </div>

        <footer className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2 rounded-2xl bg-white/10 p-2">
            <input
              className="w-full bg-transparent px-2 text-sm text-white placeholder:text-zinc-400 focus:outline-none"
              placeholder="Type a message..."
            />
            <button className="rounded-xl bg-blue-500/80 px-3 py-1 text-xs font-medium text-white">Send</button>
          </div>
        </footer>
      </div>
    </section>
  );
}

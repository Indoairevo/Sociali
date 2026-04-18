import { Heart, MessageCircle, Repeat2 } from "lucide-react";

const posts = [
  { id: 1, user: "@sociali", text: "Building the all-in-one social app experience in one tab.", likes: 220, reposts: 74, replies: 18 },
  { id: 2, user: "@alyadsgn", text: "Glassmorphism + motion + dark mode = instant premium vibe.", likes: 154, reposts: 45, replies: 12 },
  { id: 3, user: "@rafidev", text: "State-driven view switching feels insanely smooth now.", likes: 99, reposts: 27, replies: 8 },
];

export function PulseView() {
  return (
    <section className="mx-auto flex h-full w-full max-w-2xl flex-col gap-3 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-xl">
      {posts.map((post) => (
        <article key={post.id} className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
          <p className="text-sm font-semibold text-white">{post.user}</p>
          <p className="mt-2 text-sm text-zinc-200">{post.text}</p>

          <div className="mt-4 flex items-center gap-6 text-zinc-400">
            <button className="flex items-center gap-2 text-xs hover:text-rose-300">
              <Heart size={16} /> {post.likes}
            </button>
            <button className="flex items-center gap-2 text-xs hover:text-emerald-300">
              <Repeat2 size={16} /> {post.reposts}
            </button>
            <button className="flex items-center gap-2 text-xs hover:text-sky-300">
              <MessageCircle size={16} /> {post.replies}
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}

const videos = [
  { id: 1, title: "Designing a super app from scratch", views: "21K", age: "2 days ago" },
  { id: 2, title: "Framer Motion transitions in 10 minutes", views: "12K", age: "5 days ago" },
  { id: 3, title: "Next.js 14 app router deep dive", views: "35K", age: "1 week ago" },
  { id: 4, title: "Mobile-first dark UI walkthrough", views: "9K", age: "3 days ago" },
  { id: 5, title: "Glassmorphism done right", views: "7K", age: "6 days ago" },
  { id: 6, title: "Build once, multiple social modes", views: "18K", age: "1 day ago" },
];

export function WatchView() {
  return (
    <section className="grid h-full grid-cols-1 gap-4 overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <article key={video.id} className="rounded-2xl border border-white/10 bg-zinc-900/70 p-2">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-900" />
          <p className="mt-3 text-sm font-medium text-zinc-100">{video.title}</p>
          <p className="mt-1 text-xs text-zinc-400">
            {video.views} views · {video.age}
          </p>
        </article>
      ))}
    </section>
  );
}

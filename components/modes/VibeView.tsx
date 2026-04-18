const reels = [
  { id: 1, user: "@alya", caption: "Night city timelapse", music: "Neon Dreams · DJ Flux" },
  { id: 2, user: "@rafi", caption: "UI micro-interactions", music: "Soft Pulse · Motion Lab" },
  { id: 3, user: "@nadia", caption: "Coffee + coding loop", music: "Midnight Jazz · LoFi Set" },
];

export function VibeView() {
  return (
    <section className="h-full snap-y snap-mandatory overflow-y-auto rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl">
      {reels.map((reel) => (
        <article
          key={reel.id}
          className="relative h-[calc(100vh-180px)] min-h-[520px] snap-start overflow-hidden border-b border-white/10 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
          <div className="absolute bottom-0 left-0 right-0 space-y-2 bg-gradient-to-t from-black/90 to-transparent p-4">
            <p className="text-sm font-semibold text-white">{reel.user}</p>
            <p className="text-sm text-zinc-100">{reel.caption}</p>
            <p className="text-xs text-zinc-300">♫ {reel.music}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

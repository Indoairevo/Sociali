const friends = ["Alya", "Rafi", "Nadia", "Rio", "Sinta", "Bima"];

export function CircleView() {
  return (
    <section className="mx-auto h-full w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl">
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600" />
          <div>
            <p className="text-base font-semibold text-white">Indra Evo</p>
            <p className="text-xs text-zinc-400">@indoairevo · Building Sociali</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-zinc-300">
          <div className="rounded-xl bg-white/5 p-2">
            <p className="text-white">184</p>
            <p>Posts</p>
          </div>
          <div className="rounded-xl bg-white/5 p-2">
            <p className="text-white">2.3K</p>
            <p>Friends</p>
          </div>
          <div className="rounded-xl bg-white/5 p-2">
            <p className="text-white">980</p>
            <p>Following</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
        <p className="text-sm font-semibold text-white">Friends</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {friends.map((friend) => (
            <div key={friend} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-zinc-200">
              {friend}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

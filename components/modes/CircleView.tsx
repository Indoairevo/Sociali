"use client";

import { motion } from "framer-motion";
import { Check, UserPlus } from "lucide-react";
import { useState } from "react";
import { POSTS, SUGGESTED_FRIENDS, USERS, getUser } from "@/lib/mock-data";

const ME = USERS[0];
const FRIENDS_IDS = [2, 3, 4]; // already friends

export function CircleView() {
  const [friends, setFriends] = useState<number[]>(FRIENDS_IDS);
  const [suggested, setSuggested] = useState<number[]>(SUGGESTED_FRIENDS);

  function addFriend(id: number) {
    setFriends((prev) => [...prev, id]);
    setSuggested((prev) => prev.filter((i) => i !== id));
  }

  const myPosts = POSTS.filter((p) => p.userId === ME.id);

  return (
    <section className="mx-auto h-full w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl">
      {/* Profile card */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
        <div className="flex items-center gap-3">
          <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${ME.avatar}`} />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-white">{ME.name}</p>
            <p className="text-xs text-zinc-400">{ME.handle}</p>
            {ME.bio && <p className="mt-0.5 text-xs text-zinc-300">{ME.bio}</p>}
          </div>
          <button className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10">
            Edit profile
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-zinc-300">
          <div className="rounded-xl bg-white/5 p-2">
            <p className="text-sm font-semibold text-white">{ME.posts}</p>
            <p>Posts</p>
          </div>
          <div className="rounded-xl bg-white/5 p-2">
            <p className="text-sm font-semibold text-white">{(ME.friends / 1000).toFixed(1)}K</p>
            <p>Friends</p>
          </div>
          <div className="rounded-xl bg-white/5 p-2">
            <p className="text-sm font-semibold text-white">{ME.following}</p>
            <p>Following</p>
          </div>
        </div>
      </div>

      {/* Friend suggestions */}
      {suggested.length > 0 && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
          <p className="text-sm font-semibold text-white">People you may know</p>
          <div className="mt-3 space-y-2">
            {suggested.map((uid) => {
              const u = getUser(uid);
              return (
                <div key={uid} className="flex items-center gap-3 rounded-xl bg-white/5 p-2">
                  <div className={`h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${u.avatar}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{u.name}</p>
                    <p className="text-xs text-zinc-400">{u.handle}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => addFriend(uid)}
                    className="flex items-center gap-1 rounded-full bg-blue-500/80 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500"
                  >
                    <UserPlus size={12} /> Add
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Friends list */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
        <p className="text-sm font-semibold text-white">Friends · {friends.length}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {friends.map((uid) => {
            const u = getUser(uid);
            return (
              <div key={uid} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <div className={`h-7 w-7 shrink-0 rounded-full bg-gradient-to-br ${u.avatar}`} />
                <p className="truncate text-sm text-zinc-200">{u.name}</p>
                <Check size={12} className="ml-auto shrink-0 text-emerald-400" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      {myPosts.length > 0 && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
          <p className="text-sm font-semibold text-white">Recent Activity</p>
          <div className="mt-3 space-y-3">
            {myPosts.map((post) => (
              <div key={post.id} className="rounded-xl bg-white/5 p-3">
                <p className="text-sm text-zinc-200 leading-relaxed">{post.text}</p>
                <p className="mt-1.5 text-xs text-zinc-500">
                  {post.likes} likes · {post.reposts} reposts · {post.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

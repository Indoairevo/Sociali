// ────────────────────────────────────────────────────────────
// Sociali – Centralised mock data (Phase 1 prototype)
// ────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  handle: string;
  avatar: string; // gradient class pair e.g. "from-sky-400 to-indigo-600"
  status: "online" | "away" | "offline";
  bio?: string;
  posts: number;
  friends: number;
  following: number;
}

export interface Message {
  id: number;
  mine: boolean;
  text: string;
  time: string;
}

export interface Chat {
  id: number;
  userId: number;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

export interface Post {
  id: number;
  userId: number;
  text: string;
  image?: string;
  likes: number;
  reposts: number;
  replies: number;
  time: string;
  liked: boolean;
  reposted: boolean;
}

export interface Reel {
  id: number;
  userId: number;
  caption: string;
  music: string;
  likes: number;
  comments: number;
  shares: number;
  gradient: string;
  liked: boolean;
}

export interface Video {
  id: number;
  userId: number;
  title: string;
  description: string;
  views: string;
  duration: string;
  age: string;
  gradient: string;
  likes: number;
  comments: number;
}

export interface Notification {
  id: number;
  type: "like" | "comment" | "follow" | "repost" | "message";
  userId: number;
  text: string;
  time: string;
  read: boolean;
}

// ── Users ──────────────────────────────────────────────────
export const USERS: User[] = [
  { id: 1, name: "Indra Evo", handle: "@indoairevo", avatar: "from-sky-400 to-indigo-600", status: "online", bio: "Building Sociali · Next.js enthusiast", posts: 184, friends: 2300, following: 980 },
  { id: 2, name: "Alya", handle: "@alyadsgn", avatar: "from-rose-400 to-pink-600", status: "online", bio: "UI/UX Designer · Glassmorphism addict", posts: 97, friends: 1400, following: 540 },
  { id: 3, name: "Rafi", handle: "@rafidev", avatar: "from-emerald-400 to-teal-600", status: "away", bio: "Frontend dev · Framer Motion wizard", posts: 132, friends: 870, following: 310 },
  { id: 4, name: "Nadia", handle: "@nadialens", avatar: "from-amber-400 to-orange-500", status: "offline", bio: "Photographer · Lover of city lights", posts: 256, friends: 3100, following: 1200 },
  { id: 5, name: "Rio", handle: "@riobeats", avatar: "from-violet-400 to-purple-600", status: "online", bio: "Music producer · Beat maker", posts: 61, friends: 520, following: 200 },
  { id: 6, name: "Sinta", handle: "@sintacodes", avatar: "from-cyan-400 to-blue-500", status: "offline", bio: "Full-stack · Coffee-powered coder", posts: 88, friends: 640, following: 290 },
  { id: 7, name: "Bima", handle: "@bimashots", avatar: "from-lime-400 to-green-600", status: "away", bio: "Videographer · Travel addict", posts: 314, friends: 4200, following: 1800 },
];

// ── Chats ──────────────────────────────────────────────────
export const CHATS: Chat[] = [
  {
    id: 1, userId: 2, lastMessage: "Let's sync before launch.", time: "2m", unread: 2,
    messages: [
      { id: 1, mine: false, text: "Hey! Did you see the prototype update?", time: "10:12" },
      { id: 2, mine: true,  text: "Yes, I love the glass look 🔥", time: "10:13" },
      { id: 3, mine: false, text: "Can we add smoother transitions?", time: "10:14" },
      { id: 4, mine: true,  text: "Already done with Framer Motion.", time: "10:15" },
      { id: 5, mine: false, text: "Let's sync before launch.", time: "10:16" },
    ],
  },
  {
    id: 2, userId: 3, lastMessage: "Sending the mock now.", time: "9m", unread: 1,
    messages: [
      { id: 1, mine: true,  text: "Did you push the new hooks?", time: "9:50" },
      { id: 2, mine: false, text: "Almost — one more test to fix.", time: "9:51" },
      { id: 3, mine: false, text: "Sending the mock now.", time: "9:52" },
    ],
  },
  {
    id: 3, userId: 4, lastMessage: "Dinner later?", time: "23m", unread: 0,
    messages: [
      { id: 1, mine: false, text: "Just posted new night shots 🌙", time: "9:30" },
      { id: 2, mine: true,  text: "Stunning as always!", time: "9:31" },
      { id: 3, mine: false, text: "Dinner later?", time: "9:35" },
    ],
  },
  {
    id: 4, userId: 5, lastMessage: "Sprint review starts in 10.", time: "1h", unread: 5,
    messages: [
      { id: 1, mine: false, text: "Team, ship the demo branch.", time: "8:00" },
      { id: 2, mine: true,  text: "On it 🚀", time: "8:01" },
      { id: 3, mine: false, text: "Sprint review starts in 10.", time: "8:50" },
    ],
  },
];

// ── Posts ──────────────────────────────────────────────────
export const POSTS: Post[] = [
  { id: 1, userId: 1, text: "Building the all-in-one social app experience in one tab. Sociali is live 🚀", likes: 220, reposts: 74, replies: 18, time: "3m", liked: false, reposted: false },
  { id: 2, userId: 2, text: "Glassmorphism + motion + dark mode = instant premium vibe. Your next app should try this combo.", likes: 154, reposts: 45, replies: 12, time: "18m", liked: false, reposted: false },
  { id: 3, userId: 3, text: "State-driven view switching feels insanely smooth now. Framer AnimatePresence is 🤌", likes: 99, reposts: 27, replies: 8, time: "32m", liked: false, reposted: false },
  { id: 4, userId: 4, text: "Golden hour, city skyline, and a fresh cup of coffee. Life is good ☕🌆", likes: 387, reposts: 92, replies: 33, time: "1h", liked: false, reposted: false },
  { id: 5, userId: 5, text: "New beat dropping midnight. Who's staying up? 🎶🌙 #lofi #beats", likes: 211, reposts: 56, replies: 19, time: "2h", liked: false, reposted: false },
];

// ── Reels ──────────────────────────────────────────────────
export const REELS: Reel[] = [
  { id: 1, userId: 2, caption: "Night city timelapse — magic hour vibes ✨", music: "Neon Dreams · DJ Flux", likes: 4200, comments: 187, shares: 93, gradient: "from-indigo-900 via-purple-900 to-black", liked: false },
  { id: 2, userId: 3, caption: "UI micro-interactions that *chef's kiss* 💫", music: "Soft Pulse · Motion Lab", likes: 3150, comments: 204, shares: 117, gradient: "from-teal-900 via-emerald-900 to-black", liked: false },
  { id: 3, userId: 4, caption: "Coffee + coding loop — the ultimate afternoon ☕", music: "Midnight Jazz · LoFi Set", likes: 5800, comments: 341, shares: 210, gradient: "from-amber-900 via-orange-900 to-black", liked: false },
  { id: 4, userId: 7, caption: "Mountain drone shot — altitude 3,200m 🏔️", music: "Horizon · Bima Beats", likes: 9100, comments: 520, shares: 388, gradient: "from-blue-900 via-sky-900 to-black", liked: false },
];

// ── Videos ─────────────────────────────────────────────────
export const VIDEOS: Video[] = [
  { id: 1, userId: 1, title: "Designing a super app from scratch", description: "Full walkthrough of building a social super-app UI in Next.js with Tailwind and Framer Motion.", views: "21K", duration: "18:42", age: "2 days ago", gradient: "from-sky-700 to-indigo-900", likes: 1200, comments: 84 },
  { id: 2, userId: 3, title: "Framer Motion transitions in 10 minutes", description: "Quick-fire tutorial covering AnimatePresence, layout animations, and spring configs.", views: "12K", duration: "10:05", age: "5 days ago", gradient: "from-emerald-700 to-teal-900", likes: 870, comments: 61 },
  { id: 3, userId: 3, title: "Next.js 14 app router deep dive", description: "Everything you need to know about React Server Components and the new app directory.", views: "35K", duration: "34:17", age: "1 week ago", gradient: "from-violet-700 to-purple-900", likes: 2800, comments: 213 },
  { id: 4, userId: 2, title: "Mobile-first dark UI walkthrough", description: "Step-by-step dark mode, glassmorphism, and responsive layouts.", views: "9K", duration: "14:28", age: "3 days ago", gradient: "from-rose-700 to-pink-900", likes: 540, comments: 38 },
  { id: 5, userId: 2, title: "Glassmorphism done right", description: "The dos and don'ts of backdrop-blur and layered transparency.", views: "7K", duration: "8:53", age: "6 days ago", gradient: "from-amber-700 to-orange-900", likes: 430, comments: 29 },
  { id: 6, userId: 1, title: "Build once, multiple social modes", description: "Architecture breakdown of Sociali's single-tab multi-mode pattern.", views: "18K", duration: "22:10", age: "1 day ago", gradient: "from-cyan-700 to-blue-900", likes: 1650, comments: 97 },
];

// ── Notifications ───────────────────────────────────────────
export const NOTIFICATIONS: Notification[] = [
  { id: 1, type: "like",    userId: 2, text: "Alya liked your post", time: "2m", read: false },
  { id: 2, type: "follow",  userId: 3, text: "Rafi started following you", time: "8m", read: false },
  { id: 3, type: "comment", userId: 4, text: "Nadia commented: \"Love this vibe!\"", time: "15m", read: false },
  { id: 4, type: "repost",  userId: 5, text: "Rio reposted your thought", time: "1h", read: true },
  { id: 5, type: "message", userId: 7, text: "Bima sent you a message", time: "2h", read: true },
];

// ── Suggested friends ───────────────────────────────────────
export const SUGGESTED_FRIENDS: number[] = [5, 6, 7]; // user IDs not yet friended

// ── Helper ─────────────────────────────────────────────────
export function getUser(id: number): User {
  return USERS.find((u) => u.id === id) ?? USERS[0];
}

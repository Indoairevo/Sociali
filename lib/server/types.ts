export interface UserRecord {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  ip?: string;
  userAgent?: string;
}

export interface PulsePostRecord {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  likes: string[];
  reposts: string[];
  bookmarks: string[];
  replies: number;
}

export interface DatabaseShape {
  users: UserRecord[];
  sessions: SessionRecord[];
  pulsePosts: PulsePostRecord[];
}

export interface SessionUser {
  id: string;
  username: string;
  displayName: string;
}

export interface PulsePostView {
  id: string;
  user: string;
  handle: string;
  avatar: string;
  avatarGradient: string;
  text: string;
  time: string;
  likes: number;
  reposts: number;
  replies: number;
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
}

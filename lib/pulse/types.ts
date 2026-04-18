export interface PulsePost {
  id: number;
  user: string;
  handle: string;
  avatar: string;
  avatarGradient: string;
  text: string;
  createdAt: string;
  likes: number;
  reposts: number;
  replies: number;
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
}

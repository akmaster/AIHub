export type AspectRatioType = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface PersonaProfile {
  id: string;
  name: string;
  handle: string;
  niche: string;
  tagline: string;
  bio: string;
  age: string;
  location: string;
  avatarSeed: string;
  avatarUrl?: string;
  visualLock: string; // The physical consistency prompt lock
  voiceTone: string;
  targetAudience: string;
  signatureStyle: string;
  stats: {
    followers: string;
    followersCount: number;
    engagementRate: string;
    postsCount: number;
    monthlyEarnings: string;
  };
  highlights: { title: string; icon: string }[];
}

export interface GeneratedPhoto {
  id: string;
  personaId: string;
  title: string;
  url: string;
  aspectRatio: AspectRatioType;
  prompt: string;
  environment: string;
  outfit: string;
  cameraPreset: string;
  lighting: string;
  createdAt: string;
  likes: number;
  commentsCount: number;
  isFavorite?: boolean;
  caption?: string;
  hashtags?: string[];
  scheduledDate?: string;
  brandTag?: string;
  angleType?: 'wide' | 'medium' | 'closeup' | 'standard';
  angleLabel?: string;
  seriesId?: string;
}

export interface BrandDeal {
  id: string;
  brandName: string;
  category: 'Fashion' | 'Tech' | 'Beauty' | 'Automotive' | 'Lifestyle';
  logoText: string;
  deliverables: string;
  budget: string;
  rawBudget: number;
  deadline: string;
  status: 'Teklif' | 'Hazırlanıyor' | 'Onayda' | 'Yayınlandı';
  brief: string;
}

export interface FanComment {
  id: string;
  username: string;
  userAvatarSeed: string;
  text: string;
  timeAgo: string;
  reply?: string;
}

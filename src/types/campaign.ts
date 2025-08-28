// Campaign Management Types
export interface Campaign {
  id: string;
  name: string;
  description: string;
  objective: CampaignObjective;
  type: CampaignType;
  status: CampaignStatus;
  targetAudience: TargetAudience;
  budget: CampaignBudget;
  schedule: CampaignSchedule;
  platforms: string[];
  creatives: CampaignCreative[];
  metrics: CampaignMetrics;
  settings: CampaignSettings;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TargetAudience {
  demographics: {
    ageRange: { min: number; max: number };
    gender: string[];
    locations: string[];
    interests: string[];
  };
  behavioral: {
    customerSegments: string[];
    transactionHistory: any;
    engagementLevel: string[];
  };
  customAudiences: string[];
}

export interface CampaignBudget {
  total: number;
  daily?: number;
  currency: string;
  bidStrategy: BidStrategy;
  spent: number;
}

export interface CampaignSchedule {
  startDate: string;
  endDate?: string;
  timezone: string;
  dayParting?: DayParting[];
}

export interface DayParting {
  day: string;
  startTime: string;
  endTime: string;
}

export interface CampaignCreative {
  id: string;
  type: CreativeType;
  name: string;
  content: any; // JSON content based on type
  status: CreativeStatus;
  platforms: string[];
  createdAt: string;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  reach: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  conversionRate: number;
  engagementRate: number;
}

export interface CampaignSettings {
  autoOptimization: boolean;
  frequencyCap?: number;
  deviceTargeting: string[];
  languageTargeting: string[];
  excludedPlacements?: string[];
}

export interface SocialMediaPost {
  id: string;
  campaignId?: string;
  platform: SocialPlatform;
  content: PostContent;
  scheduledFor?: string;
  publishedAt?: string;
  status: PostStatus;
  metrics: PostMetrics;
  createdBy: string;
  createdAt: string;
}

export interface PostContent {
  text: string;
  images?: string[];
  videos?: string[];
  links?: string[];
  hashtags: string[];
  mentions: string[];
}

export interface PostMetrics {
  likes: number;
  shares: number;
  comments: number;
  views: number;
  engagement: number;
  reach: number;
}

// Enums
export enum CampaignObjective {
  BRAND_AWARENESS = 'BRAND_AWARENESS',
  LEAD_GENERATION = 'LEAD_GENERATION',
  CONVERSIONS = 'CONVERSIONS',
  TRAFFIC = 'TRAFFIC',
  ENGAGEMENT = 'ENGAGEMENT',
  APP_INSTALLS = 'APP_INSTALLS',
  VIDEO_VIEWS = 'VIDEO_VIEWS'
}

export enum CampaignType {
  SEARCH = 'SEARCH',
  DISPLAY = 'DISPLAY',
  VIDEO = 'VIDEO',
  SOCIAL = 'SOCIAL',
  EMAIL = 'EMAIL',
  INFLUENCER = 'INFLUENCER'
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum BidStrategy {
  MANUAL_CPC = 'MANUAL_CPC',
  ENHANCED_CPC = 'ENHANCED_CPC',
  TARGET_CPA = 'TARGET_CPA',
  TARGET_ROAS = 'TARGET_ROAS',
  MAXIMIZE_CLICKS = 'MAXIMIZE_CLICKS',
  MAXIMIZE_CONVERSIONS = 'MAXIMIZE_CONVERSIONS'
}

export enum CreativeType {
  TEXT_AD = 'TEXT_AD',
  IMAGE_AD = 'IMAGE_AD',
  VIDEO_AD = 'VIDEO_AD',
  CAROUSEL_AD = 'CAROUSEL_AD',
  STORY_AD = 'STORY_AD'
}

export enum CreativeStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED'
}

export enum SocialPlatform {
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  TIKTOK = 'TIKTOK',
  YOUTUBE = 'YOUTUBE'
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED'
}
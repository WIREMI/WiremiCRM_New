// Loyalty Program Types
export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  type: LoyaltyProgramType;
  status: LoyaltyProgramStatus;
  rules: LoyaltyRule[];
  conversionRate: number; // points to currency
  startDate: string;
  endDate?: string;
  participants: number;
  totalRewards: number;
  conversionRatePercent: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyRule {
  id: string;
  event: LoyaltyEventType;
  condition: any; // JSON condition
  reward: LoyaltyReward;
  isActive: boolean;
}

export interface LoyaltyReward {
  type: 'POINTS' | 'CASHBACK' | 'DISCOUNT';
  value: number;
  maxValue?: number;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  category: string;
  pointsCost?: number;
  cashValue?: number;
  availability: number;
  claimed: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerLoyalty {
  id: string;
  customerId: string;
  programId: string;
  currentPoints: number;
  currentTier?: string;
  enrollmentDate: string;
  status: LoyaltyMemberStatus;
  totalEarned: number;
  totalRedeemed: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyTransaction {
  id: string;
  customerLoyaltyId: string;
  type: LoyaltyTransactionType;
  pointsAmount: number;
  rewardItemId?: string;
  source: string;
  sourceId?: string;
  description: string;
  createdAt: string;
}

// Enums
export enum LoyaltyProgramType {
  POINTS = 'POINTS',
  CASHBACK = 'CASHBACK',
  TIER = 'TIER',
  REFERRAL = 'REFERRAL'
}

export enum LoyaltyProgramStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT'
}

export enum LoyaltyEventType {
  TRANSACTION = 'TRANSACTION',
  REFERRAL = 'REFERRAL',
  SIGNUP = 'SIGNUP',
  KYC_COMPLETION = 'KYC_COMPLETION',
  FIRST_DEPOSIT = 'FIRST_DEPOSIT'
}

export enum LoyaltyMemberStatus {
  ENROLLED = 'ENROLLED',
  SUSPENDED = 'SUSPENDED',
  UNENROLLED = 'UNENROLLED'
}

export enum LoyaltyTransactionType {
  ACCRUAL = 'ACCRUAL',
  REDEMPTION = 'REDEMPTION',
  ADJUSTMENT = 'ADJUSTMENT'
}
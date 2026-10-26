export type UserRole = "subscriber" | "admin";
export type SubscriptionTier = "monthly" | "yearly" | "none";
export type SubscriptionStatus = "active" | "inactive" | "lapsed" | "cancelled";
export type DrawStatus = "draft" | "simulated" | "published";
export type DrawLogicType = "random" | "algorithmic";
export type VerificationStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "pending" | "paid";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  handicap?: number;
  home_club?: string;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  subscription_renews_at?: string;
  charity_id: string;
  charity_percentage: number; // minimum 10%, voluntarily increased
  created_at: string;
  updated_at?: string;
}

export interface GolfScore {
  id: string;
  user_id: string;
  score: number; // 1-45 Stableford format
  played_date: string; // YYYY-MM-DD - Unique per user per date
  course_name: string;
  holes_played: 9 | 18;
  created_at: string;
}

export interface CharityEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  registration_link?: string;
}

export interface CharityImpactMetric {
  label: string;
  value: string;
}

export interface Charity {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: "Youth & Access" | "Health & Medical" | "Veterans & Rehabilitation" | "Environmental & Links Care";
  hero_image_url: string;
  logo_url?: string;
  featured: boolean;
  total_raised: number;
  impact_metrics: CharityImpactMetric[];
  upcoming_events: CharityEvent[];
  website_url: string;
}

export interface Draw {
  id: string;
  title: string;
  draw_date: string;
  status: DrawStatus;
  draw_logic: DrawLogicType;
  winning_numbers: number[]; // 5 numbers between 1 and 45
  total_subscribers: number;
  active_jackpot: number;
  subscription_fee_per_user: number;
  rollover_jackpot_in: number;
  total_prize_pool: number;
  // 40 / 35 / 25 split
  tier1_pool_share: number; // 40% + rollover_jackpot_in
  tier2_pool_share: number; // 35%
  tier3_pool_share: number; // 25%
  tier1_winners_count: number; // 5-number matches
  tier2_winners_count: number; // 4-number matches
  tier3_winners_count: number; // 3-number matches
  tier1_payout_per_winner: number;
  tier2_payout_per_winner: number;
  tier3_payout_per_winner: number;
  rollover_jackpot_out: number; // Carries forward if tier1_winners_count === 0
  published_at?: string;
  created_at: string;
}

export interface DrawEntry {
  id: string;
  draw_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  submitted_scores: number[]; // 5 latest Stableford scores
  matches_count: number; // 0 to 5
  matching_numbers: number[];
  tier: 1 | 2 | 3 | null;
  prize_amount: number;
  created_at: string;
}

export interface WinnerVerification {
  id: string;
  draw_entry_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  draw_id: string;
  draw_title: string;
  prize_amount: number;
  tier: 1 | 2 | 3;
  matches_count: number;
  matching_numbers: number[];
  golf_platform_name: "HowDidiDo" | "GHIN" | "Golf Ireland" | "England Golf" | "Other Club App";
  proof_image_url: string;
  status: VerificationStatus;
  admin_notes?: string;
  payment_status: PaymentStatus;
  payout_reference?: string;
  submitted_at: string;
  reviewed_at?: string;
  paid_at?: string;
}

export interface Donation {
  id: string;
  user_id?: string;
  charity_id: string;
  charity_name: string;
  amount: number;
  donation_type: "subscription_contribution" | "independent_gift";
  donor_name: string;
  donor_email: string;
  message?: string;
  created_at: string;
}

export interface PlatformStats {
  total_raised_charity: number;
  total_prize_pool_distributed: number;
  active_subscribers: number;
  draws_completed: number;
  current_jackpot: number;
}

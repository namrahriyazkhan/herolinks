-- ==============================================================================
-- DIGITAL HEROES POSTGRESQL SCHEMA (SUPABASE)
-- Conforming to Digital Heroes PRD (Level 1) 2026 Edition
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
  handicap NUMERIC(4, 1) DEFAULT NULL,
  home_club TEXT DEFAULT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'monthly' CHECK (subscription_tier IN ('monthly', 'yearly', 'none')),
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'lapsed', 'cancelled')),
  subscription_renews_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  charity_id TEXT DEFAULT 'charity-youth-on-course',
  charity_percentage INTEGER NOT NULL DEFAULT 10 CHECK (charity_percentage >= 10 AND charity_percentage <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CHARITIES DIRECTORY
CREATE TABLE IF NOT EXISTS public.charities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Youth & Access', 'Health & Medical', 'Veterans & Rehabilitation', 'Environmental & Links Care')),
  hero_image_url TEXT NOT NULL,
  logo_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  total_raised NUMERIC(12, 2) DEFAULT 0.00,
  impact_metrics JSONB DEFAULT '[]'::jsonb,
  upcoming_events JSONB DEFAULT '[]'::jsonb,
  website_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GOLF SCORES (STABLEFORD 1-45, ROLLING 5 LOGIC, UNIQUE DATE PER USER)
CREATE TABLE IF NOT EXISTS public.golf_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  played_date DATE NOT NULL,
  course_name TEXT NOT NULL,
  holes_played INTEGER NOT NULL DEFAULT 18 CHECK (holes_played IN (9, 18)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_played_date UNIQUE (user_id, played_date)
);

-- Index for rolling score queries (most recent first)
CREATE INDEX IF NOT EXISTS idx_golf_scores_user_date ON public.golf_scores(user_id, played_date DESC);

-- Trigger Function: Enforce Rolling 5 Scores Retention
-- Section § 05: "Only the latest 5 scores are retained at any time. A new score replaces the oldest stored score automatically."
CREATE OR REPLACE FUNCTION public.enforce_rolling_five_scores()
RETURNS TRIGGER AS $$
DECLARE
  v_score_count INTEGER;
  v_oldest_id UUID;
BEGIN
  -- Count total scores for this user
  SELECT COUNT(*) INTO v_score_count FROM public.golf_scores WHERE user_id = NEW.user_id;
  
  -- If more than 5, remove the oldest score based on played_date
  IF v_score_count > 5 THEN
    SELECT id INTO v_oldest_id 
    FROM public.golf_scores 
    WHERE user_id = NEW.user_id 
    ORDER BY played_date ASC, created_at ASC 
    LIMIT 1;

    DELETE FROM public.golf_scores WHERE id = v_oldest_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_rolling_five_scores ON public.golf_scores;
CREATE TRIGGER trg_rolling_five_scores
AFTER INSERT ON public.golf_scores
FOR EACH ROW
EXECUTE FUNCTION public.enforce_rolling_five_scores();

-- 4. DRAWS & REWARDS
CREATE TABLE IF NOT EXISTS public.draws (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  draw_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'simulated', 'published')),
  draw_logic TEXT NOT NULL DEFAULT 'random' CHECK (draw_logic IN ('random', 'algorithmic')),
  winning_numbers INTEGER[] NOT NULL DEFAULT '{}',
  total_subscribers INTEGER NOT NULL DEFAULT 0,
  active_jackpot NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  subscription_fee_per_user NUMERIC(10, 2) NOT NULL DEFAULT 15.00,
  rollover_jackpot_in NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_prize_pool NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tier1_pool_share NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 40% + rollover
  tier2_pool_share NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 35%
  tier3_pool_share NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 25%
  tier1_winners_count INTEGER NOT NULL DEFAULT 0,
  tier2_winners_count INTEGER NOT NULL DEFAULT 0,
  tier3_winners_count INTEGER NOT NULL DEFAULT 0,
  tier1_payout_per_winner NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tier2_payout_per_winner NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tier3_payout_per_winner NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  rollover_jackpot_out NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- carries forward if 0 tier 1 winners
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DRAW ENTRIES
CREATE TABLE IF NOT EXISTS public.draw_entries (
  id TEXT PRIMARY KEY,
  draw_id TEXT NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  submitted_scores INTEGER[] NOT NULL,
  matches_count INTEGER NOT NULL DEFAULT 0 CHECK (matches_count BETWEEN 0 AND 5),
  matching_numbers INTEGER[] NOT NULL DEFAULT '{}',
  tier INTEGER CHECK (tier IN (1, 2, 3) OR tier IS NULL),
  prize_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. WINNER VERIFICATIONS
-- Section § 09: Proof upload (screenshot from golf platform), Admin Review (approve/reject), Payment states (Pending -> Paid)
CREATE TABLE IF NOT EXISTS public.winner_verifications (
  id TEXT PRIMARY KEY,
  draw_entry_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  draw_id TEXT NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  draw_title TEXT NOT NULL,
  prize_amount NUMERIC(12, 2) NOT NULL,
  tier INTEGER NOT NULL CHECK (tier IN (1, 2, 3)),
  matches_count INTEGER NOT NULL,
  matching_numbers INTEGER[] NOT NULL,
  golf_platform_name TEXT NOT NULL CHECK (golf_platform_name IN ('HowDidiDo', 'GHIN', 'Golf Ireland', 'England Golf', 'Other Club App')),
  proof_image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  payout_reference TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- 7. DIRECT CHARITY DONATIONS
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  charity_id TEXT NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  charity_name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  donation_type TEXT NOT NULL CHECK (donation_type IN ('subscription_contribution', 'independent_gift')),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.golf_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winner_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Charities: Everyone can read, only admin can insert/update/delete
DROP POLICY IF EXISTS "Public charities are viewable by everyone" ON public.charities;
CREATE POLICY "Public charities are viewable by everyone" ON public.charities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can modify charities" ON public.charities;
CREATE POLICY "Admin can modify charities" ON public.charities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Profiles: Users can view & update own, admin can view all
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Scores: Users can manage own scores, admin can view & edit all
DROP POLICY IF EXISTS "Users can view own scores" ON public.golf_scores;
CREATE POLICY "Users can view own scores" ON public.golf_scores FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Users can insert own scores" ON public.golf_scores;
CREATE POLICY "Users can insert own scores" ON public.golf_scores FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own scores" ON public.golf_scores;
CREATE POLICY "Users can update own scores" ON public.golf_scores FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own scores" ON public.golf_scores;
CREATE POLICY "Users can delete own scores" ON public.golf_scores FOR DELETE USING (auth.uid() = user_id);

-- Draws: Published draws viewable by all, all draws viewable and manageable by admin
DROP POLICY IF EXISTS "Published draws viewable by everyone" ON public.draws;
CREATE POLICY "Published draws viewable by everyone" ON public.draws FOR SELECT USING (status = 'published' OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Admin can manage draws" ON public.draws;
CREATE POLICY "Admin can manage draws" ON public.draws FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Winner verifications: User can view own, admin can view and update all
DROP POLICY IF EXISTS "Users can view own winner verifications" ON public.winner_verifications;
CREATE POLICY "Users can view own winner verifications" ON public.winner_verifications FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Users can submit own winner verification" ON public.winner_verifications;
CREATE POLICY "Users can submit own winner verification" ON public.winner_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can verify winners and payouts" ON public.winner_verifications;
CREATE POLICY "Admin can verify winners and payouts" ON public.winner_verifications FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

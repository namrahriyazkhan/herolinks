-- DIGITAL HEROES SEED DATA
-- Insert Charities
INSERT INTO public.charities (id, name, slug, tagline, description, category, hero_image_url, featured, total_raised, website_url, impact_metrics, upcoming_events)
VALUES 
(
  'charity-youth-on-course',
  'Youth on Course Initiative',
  'youth-on-course',
  'Subsidizing golf rounds for underrepresented youth from disadvantaged communities.',
  'Youth on Course provides young people with access to life-changing opportunities on and off the golf course. By subsidizing rounds to just £5, youth develop resilience, discipline, and community connections that carry forward for life.',
  'Youth & Access',
  'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=1200&q=80',
  TRUE,
  48920.00,
  'https://youthoncourse.org',
  '[{"label": "Youth Rounds Subsidized", "value": "3,840"}, {"label": "STEM Scholarships", "value": "28"}]'::jsonb,
  '[{"id": "evt-1", "title": "2026 Junior Open & Charity Scramble", "date": "2026-04-18", "location": "The Berkshire Golf Club, Ascot", "description": "18-hole handicap team scramble uniting junior prodigies with tour professionals."}]'::jsonb
),
(
  'charity-fairway-health',
  'Fairway to Health UK',
  'fairway-to-health',
  'Prescription golf therapies and active rehabilitation for neurological conditions.',
  'Partnering with NHS trusts and neuroscientists to provide structured outdoor golf therapy for stroke recovery, Parkinson''s management, and mental health wellness.',
  'Health & Medical',
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1200&q=80',
  TRUE,
  37400.00,
  'https://fairwayhealth.org.uk',
  '[{"label": "Rehab Patients Supported", "value": "1,220"}, {"label": "Clinical Sessions", "value": "540"}]'::jsonb,
  '[{"id": "evt-3", "title": "Mind & Momentum Charity Pro-Am", "date": "2026-05-22", "location": "Sunningdale Golf Club", "description": "An inspiring day celebrating cognitive recovery through the beauty of the walk."}]'::jsonb
),
(
  'charity-veterans-links',
  'Veterans Links Alliance',
  'veterans-links-alliance',
  'Combat trauma healing and camaraderie on the fairways for military veterans.',
  'Through adaptive equipment, peer caddie mentorship, and therapeutic rounds, Veterans Links Alliance helps wounded veterans reintegrate into civilian life with dignity and purpose.',
  'Veterans & Rehabilitation',
  'https://images.unsplash.com/photo-1593111774642-a14644a4fa85?auto=format&fit=crop&w=1200&q=80',
  TRUE,
  31250.00,
  'https://veteranslinks.org',
  '[{"label": "Veterans Reintegrated", "value": "860"}, {"label": "Adaptive SoloRiders", "value": "19"}]'::jsonb,
  '[]'::jsonb
),
(
  'charity-green-earth',
  'Green Links Conservation Trust',
  'green-links-conservation',
  'Restoring natural coastal sand dunes, wetlands, and native bird sanctuaries on links courses.',
  'Working with golf course architects and conservation biologists to transition coastal golf land into vibrant biodiversity corridors and protected wetlands.',
  'Environmental & Links Care',
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1200&q=80',
  FALSE,
  25280.00,
  'https://greenlinksconservation.org',
  '[{"label": "Acres Restored", "value": "480"}, {"label": "Bird Nesting Sites", "value": "310"}]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Insert Initial Published Draw
INSERT INTO public.draws (
  id, title, draw_date, status, draw_logic, winning_numbers, total_subscribers, active_jackpot, 
  subscription_fee_per_user, rollover_jackpot_in, total_prize_pool, tier1_pool_share, 
  tier2_pool_share, tier3_pool_share, tier1_winners_count, tier2_winners_count, tier3_winners_count, 
  tier1_payout_per_winner, tier2_payout_per_winner, tier3_payout_per_winner, rollover_jackpot_out, published_at
) VALUES (
  'draw-mar-2026',
  'March 2026 Spring Equinox Major Draw',
  '2026-03-31 20:00:00+00',
  'published',
  'algorithmic',
  ARRAY[29, 34, 36, 38, 41],
  1420,
  14370.00,
  15.00,
  3720.00,
  14370.00,
  7980.00,
  3727.50,
  2662.50,
  1,
  2,
  2,
  7980.00,
  1863.75,
  1331.25,
  0.00,
  NOW()
) ON CONFLICT (id) DO NOTHING;

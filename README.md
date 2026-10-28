# Digital Heroes

A golf performance tracking and monthly charity draw platform built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

Golfers log their Stableford rounds (scores 1–45), and their latest 5 scores automatically become their tickets for monthly draws. A portion of every subscription (minimum 10%, up to 50%) is directed to certified charities, with 50% guaranteed towards the monthly prize pool.

---

## 🔗 Live Links

- **Live Site:** [https://herolinks.vercel.app](https://herolinks.vercel.app)
- **GitHub Repository:** [https://github.com/namrahriyazkhan/herolinks](https://github.com/namrahriyazkhan/herolinks)

---

## 🔑 Quick Review & Test Accounts

A floating **Evaluator Bar** is pinned at the bottom of the screen to switch between test personas in one click without re-typing credentials:

| Role | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **Public Visitor** | *(Unauthenticated)* | — | Landing page, draw results, charity directory, and sign-up flow. |
| **Golfer** | `golfer@digitalheroes.co.in` | *(any password)* | Marcus Vance: 5 rolling scores, draw matching tickets, proof upload, and charity pledge. |
| **Admin** | `admin@digitalheroes.co.in` | *(any password)* | Eleanor Rostova: draw tumbler simulation, user management, and scorecard audit approvals. |

---

## ⛳ Features Implemented

### 1. Score Entry & Rolling 5 Queue (§ 05)
- Accepts valid Stableford scores between **1 and 45**.
- **Duplicate Date Prevention:** Rejects multiple rounds submitted on the same day.
- **Rolling Queue:** Golfers keep their 5 most recent rounds. Adding a 6th round automatically drops the oldest one.

### 2. Monthly Draw Engine & Rollover Jackpot (§ 06 & § 07)
- Draws 5 numbers between 1 and 45 (supports both Random and Algorithmic frequency-weighted modes).
- **Prize Allocation (40 / 35 / 25 Split):**
  - **Tier 1 (5 matches):** 40% of the prize pool + any carryover rollover jackpot. If unclaimed, it rolls over to next month's jackpot.
  - **Tier 2 (4 matches):** 35% of the prize pool (split equally among winners).
  - **Tier 3 (3 matches):** 25% of the prize pool (split equally among winners).

### 3. Charity Ecosystem & Direct Gifts (§ 08)
- Every subscription requires a minimum **10% pledge** to a chosen cause, adjustable up to **50%**.
- Includes a charity directory with categorized causes, impact metrics, and upcoming golf days.
- Supports independent direct donations not tied to gameplay.

### 4. Winner Verification Audit (§ 09)
- Winners upload scorecard screenshots from official handicap providers (HowDidiDo, GHIN, England Golf, Golf Ireland).
- Verification transitions through `Pending` → `Approved` / `Rejected` → `Paid`.

### 5. Admin Console (§ 11)
- User Management: inspect and adjust subscriptions and handicaps.
- Draw Simulation: run test draws and calculate tier payouts before publishing.
- Audit Queue: review submitted proof screenshots and mark payouts as completed.
- Charity Directory Management: add and update vetted causes.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Frontend:** React 19, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Language:** TypeScript 5 (Strict Mode)
- **Database:** Supabase / PostgreSQL (RLS policies, triggers for rolling score constraints)
- **Testing:** Node.js native test runner & `tsx`

---

## 🚀 Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/namrahriyazkhan/herolinks.git
cd herolinks
npm install
```

### 2. Run Automated Unit Tests
To run the 11 unit tests covering scoring constraints, rolling 5 queue, duplicate dates, 40/35/25 prize pool splits, and rollover logic:
```bash
npm test
```

### 3. Start Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase)

The database schema and seed data are located in `supabase/`:
- `supabase/migrations/20260301000000_digital_heroes_schema.sql` (Tables, idempotent RLS policies, trigger for rolling 5 scores)
- `supabase/seed.sql` (Initial demo users, vetted charities, and sample rounds)

To connect your own Supabase project, set these variables in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
*(If Supabase environment variables are omitted, the app smoothly falls back to an in-memory / local storage demo state so the interviewer can evaluate everything without setup friction).*

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store/app-context";
import { SubscriptionTier, UserRole } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Shield,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function SignupPage() {
  const router = useRouter();
  const { charities, signupUser } = useApp();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [homeClub, setHomeClub] = useState("");
  const [handicap, setHandicap] = useState("12.4");
  const [subscriptionTier, setSubscriptionTier] =
    useState<SubscriptionTier>("monthly");
  const [charityId, setCharityId] = useState(
    charities[0]?.id || "charity-youth-on-course"
  );
  const [charityPercentage, setCharityPercentage] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCharity =
    charities.find((c) => c.id === charityId) || charities[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setIsSubmitting(true);

    const newUser = signupUser({
      fullName,
      email,
      role: "subscriber",
      subscriptionTier,
      charityId,
      charityPercentage,
      homeClub: homeClub || "Independent Links Club",
      handicap: parseFloat(handicap) || 12.0,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#C88D34", "#072847", "#FFF2BA"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  const monthlyFee = subscriptionTier === "yearly" ? 12.5 : 15.0;
  const charityCut = (monthlyFee * (charityPercentage / 100)).toFixed(2);
  const prizeCut = (monthlyFee * 0.5).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EB] text-[#072847]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-[#C88D34] uppercase tracking-widest font-semibold">
              § 04 & § 08.1 · MEMBERSHIP ONBOARDING
            </span>
            <h1 className="font-serif italic text-4xl sm:text-5xl font-normal text-[#072847]">
              Join Digital Heroes
            </h1>
            <p className="text-xs sm:text-sm text-[#3E5A74] max-w-md mx-auto">
              Create your account, nominate your certified partner charity, and enter your 5 Stableford scores into the monthly draw.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#EFE4C4] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8"
          >
            {/* Step 1: Personal Credentials */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#EFE4C4]">
                <div className="w-6 h-6 rounded-full bg-[#072847] text-[#FFF2BA] flex items-center justify-center font-mono text-xs font-bold">
                  1
                </div>
                <h3 className="font-serif italic text-xl font-bold text-[#072847]">
                  Golfer Profile & Credentials
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D3B66] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colin Montgomerie"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4C4] bg-[#FFFDF7] text-sm text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#072847]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D3B66] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="colin@golf.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4C4] bg-[#FFFDF7] text-sm text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#072847]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D3B66] mb-1.5">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4C4] bg-[#FFFDF7] text-sm text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#072847]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D3B66] mb-1.5">
                    Home Golf Club
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Portrush Golf Club"
                    value={homeClub}
                    onChange={(e) => setHomeClub(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4C4] bg-[#FFFDF7] text-sm text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#072847]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D3B66] mb-1.5">
                    Official WHS Handicap Index (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="12.4"
                    value={handicap}
                    onChange={(e) => setHandicap(e.target.value)}
                    className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-[#EFE4C4] bg-[#FFFDF7] text-sm text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#072847]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Subscription Plan (§ 04) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#EFE4C4]">
                <div className="w-6 h-6 rounded-full bg-[#072847] text-[#FFF2BA] flex items-center justify-center font-mono text-xs font-bold">
                  2
                </div>
                <h3 className="font-serif italic text-xl font-bold text-[#072847]">
                  Select Subscription Plan (§ 04)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSubscriptionTier("monthly")}
                  className={`p-4 text-left rounded-2xl border transition-all ${
                    subscriptionTier === "monthly"
                      ? "bg-[#072847] text-white border-[#041220] shadow-md"
                      : "bg-[#FFFDF7] text-[#072847] border-[#EFE4C4] hover:border-[#072847]"
                  }`}
                >
                  <div className="font-serif italic font-bold text-lg">Monthly Membership</div>
                  <div className="text-sm mt-0.5 opacity-90">£15.00 / month</div>
                  <div className="text-xs text-[#FFF2BA] mt-2 font-mono">
                    Cancel anytime • 12 draws/year
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSubscriptionTier("yearly")}
                  className={`p-4 text-left rounded-2xl border transition-all ${
                    subscriptionTier === "yearly"
                      ? "bg-[#072847] text-white border-[#041220] shadow-md"
                      : "bg-[#FFFDF7] text-[#072847] border-[#EFE4C4] hover:border-[#072847]"
                  }`}
                >
                  <div className="flex items-center justify-between font-serif italic font-bold text-lg">
                    Annual Membership
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFF2BA] text-[#072847] font-black">
                      Save 17%
                    </span>
                  </div>
                  <div className="text-sm mt-0.5 opacity-90">£150.00 / year</div>
                  <div className="text-xs text-[#FFF2BA] mt-2 font-mono">
                    2 months free • Full major draw access
                  </div>
                </button>
              </div>
            </div>

            {/* Step 3: Charity Nomination (§ 08.1) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#EFE4C4]">
                <div className="w-6 h-6 rounded-full bg-[#072847] text-[#FFF2BA] flex items-center justify-center font-mono text-xs font-bold">
                  3
                </div>
                <h3 className="font-serif italic text-xl font-bold text-[#072847]">
                  Nominate Cause & Set Contribution (§ 08.1)
                </h3>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D3B66] mb-1.5">
                  Designate Your Charity
                </label>
                <select
                  value={charityId}
                  onChange={(e) => setCharityId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EFE4C4] bg-[#FFFDF7] text-sm text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#072847]"
                >
                  {charities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[#3E5A74] mt-1.5 leading-relaxed">
                  {selectedCharity?.description}
                </p>
              </div>

              {/* Contribution Percentage Slider */}
              <div className="bg-[#FAF0CA]/40 border border-[#EFE4C4] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#072847] flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-[#C88D34]" />
                    Voluntary Charity Allocation:
                  </span>
                  <span className="font-serif text-xl font-bold text-[#072847]">
                    {charityPercentage}% of fee
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={charityPercentage}
                  onChange={(e) => setCharityPercentage(Number(e.target.value))}
                  className="w-full accent-[#072847]"
                />
                <div className="flex justify-between text-[10px] text-[#3E5A74] font-mono">
                  <span>10% (PRD Minimum)</span>
                  <span>25%</span>
                  <span>50% (Hero Giving)</span>
                </div>
              </div>

              {/* Real-Time Mathematical Split Preview (§ 07 & § 08) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#041220] via-[#072847] to-[#0D3B66] border border-[#0D3B66] text-white text-xs space-y-2 shadow-sm">
                <div className="text-[10px] font-mono uppercase text-[#FFF2BA] tracking-wider">
                  Transparent Monthly Split:
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Direct to {selectedCharity?.name.split(" ")[0]}:</span>
                  <strong className="text-white font-mono">£{charityCut} / month</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Direct to Monthly Draw Prize Pool (50%):</span>
                  <strong className="text-[#FFF2BA] font-mono">£{prizeCut} / month</strong>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#072847] hover:bg-[#0D3B66] text-white font-semibold rounded-2xl text-base transition-all shadow-lg shadow-[#072847]/20 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <span>Creating Your Account...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FFF2BA]" />
                  <span>Activate Membership & Enter Draw</span>
                </>
              )}
            </button>

            <div className="text-center text-xs text-[#3E5A74]">
              Already registered?{" "}
              <Link href="/login" className="font-bold text-[#0D3B66] hover:text-[#072847] hover:underline">
                Sign in to your account
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

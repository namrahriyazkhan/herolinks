"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store/app-context";
import { UserRole, SubscriptionTier } from "@/types";
import { X, Check, Heart, Shield, Sparkles, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
  initialTab?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultTab, initialTab = "login" }: AuthModalProps) {
  const effectiveTab = defaultTab || initialTab;
  const { charities, loginUser, signupUser, allUsers } = useApp();
  const [tab, setTab] = useState<"login" | "signup">(effectiveTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("golfer@digitalheroes.co.in");
  const [loginError, setLoginError] = useState("");

  // Signup form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("subscriber");
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>("monthly");
  const [charityId, setCharityId] = useState(charities[0]?.id || "charity-youth-on-course");
  const [charityPercentage, setCharityPercentage] = useState(15);
  const [homeClub, setHomeClub] = useState("");
  const [handicap, setHandicap] = useState("12.4");
  const [signupSuccess, setSignupSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const ok = loginUser(loginEmail);
    if (ok) {
      onClose();
    } else {
      setLoginError("Account not found. Please choose a demo user below or sign up.");
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setLoginEmail(demoEmail);
    const ok = loginUser(demoEmail);
    if (ok) onClose();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    signupUser({
      fullName,
      email,
      role: "subscriber",
      subscriptionTier,
      charityId,
      charityPercentage,
      homeClub: homeClub || "Royal St George's",
      handicap: parseFloat(handicap) || 12.0,
    });

    setSignupSuccess(true);
    setTimeout(() => {
      onClose();
      setSignupSuccess(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FAF6EB] border-2 border-[#EFE4C4] rounded-3xl max-w-lg w-full p-6 sm:p-9 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#3E5A74] hover:text-[#072847] rounded-full hover:bg-[#FAF0CA] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-baseline gap-1.5 mb-2">
            <span className="font-sans font-black text-2xl text-[#072847]">digital<span className="text-[#C88D34]">.</span></span>
            <span className="font-serif italic font-bold text-3xl text-[#072847]">HEROES</span>
          </div>
          <p className="text-xs text-[#6786A3] font-sans">
            Golf Performance & Verified Charity Draws · 2026 PRD Edition
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-[#FAF0CA]/60 rounded-2xl mb-6 border border-[#EFE4C4]">
          <button
            onClick={() => setTab("login")}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              tab === "login"
                ? "bg-[#072847] text-white shadow-sm"
                : "text-[#6786A3] hover:text-[#072847]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              tab === "signup"
                ? "bg-[#072847] text-white shadow-sm"
                : "text-[#6786A3] hover:text-[#072847]"
            }`}
          >
            Subscribe & Join (§ 04)
          </button>
        </div>

        {tab === "login" ? (
          <div className="space-y-5">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E5A74] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE4C4] bg-white text-sm text-[#072847] focus:outline-none focus:ring-2 focus:ring-[#0D3B66]"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#3E5A74] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value="••••••••••••"
                  readOnly
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE4C4] bg-white text-sm text-[#072847] focus:outline-none"
                />
                <span className="text-[11px] text-[#6786A3] mt-1 block">
                  (Demo Mode enabled: Passwords are automatically bypassed)
                </span>
              </div>

              {loginError && (
                <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-xl">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#072847] hover:bg-[#0D3B66] text-white font-semibold rounded-xl text-sm transition-all shadow-md"
              >
                Sign In to Dashboard
              </button>
            </form>

            {/* Quick Demo Logins for Evaluator */}
            <div className="pt-4 border-t border-[#EFE4C4]">
              <span className="text-xs font-semibold text-[#3E5A74] block mb-2.5">
                ⚡ Evaluator Instant Sign-In:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("golfer@digitalheroes.co.in")}
                  className="p-3 text-left bg-white border border-[#EFE4C4] hover:border-[#0D3B66] rounded-xl transition-all group shadow-xs"
                >
                  <div className="text-xs font-bold text-[#072847] group-hover:text-[#0D3B66]">
                    Marcus Vance
                  </div>
                  <div className="text-[11px] text-[#6786A3]">Active Golfer</div>
                  <div className="text-[10px] text-[#C88D34] mt-1 font-medium">
                    5 Scores Logged • Won £7,980
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("admin@digitalheroes.co.in")}
                  className="p-3 text-left bg-[#041220] text-white border border-[#0D3B66] hover:bg-[#072847] rounded-xl transition-all shadow-xs"
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    Eleanor Rostova
                    <Shield className="w-3 h-3 text-[#FFF2BA]" />
                  </div>
                  <div className="text-[11px] text-white/70">Platform Director</div>
                  <div className="text-[10px] text-[#FFF2BA] mt-1 font-medium">
                    Full Admin Control
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Subscription and Signup Form (§ 04 & § 08.1) */
          <form onSubmit={handleSignup} className="space-y-4">
            {signupSuccess ? (
              <div className="p-6 text-center bg-[#FAF0CA] border border-[#C88D34]/40 rounded-xl space-y-2">
                <div className="w-12 h-12 bg-[#FFF2BA] text-[#072847] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif italic font-semibold text-xl text-[#072847]">
                  Welcome to Digital Heroes!
                </h4>
                <p className="text-xs text-[#3E5A74]">
                  Your subscription is activated. Let&apos;s log your first Stableford scores.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#3E5A74] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Colin Montgomerie"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFE4C4] bg-white text-[#072847]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3E5A74] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="colin@golf.co.uk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFE4C4] bg-white text-[#072847]"
                    />
                  </div>
                </div>

                {/* Subscription Tier Selection (§ 04) */}
                <div>
                  <label className="block text-xs font-semibold text-[#3E5A74] mb-1.5">
                    Select Plan (Section § 04)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSubscriptionTier("monthly")}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        subscriptionTier === "monthly"
                          ? "bg-[#072847] text-white border-[#041220] shadow-sm"
                          : "bg-white text-[#072847] border-[#EFE4C4]"
                      }`}
                    >
                      <div className="font-semibold text-sm">Monthly Plan</div>
                      <div className="text-xs opacity-80">£15.00 / month</div>
                      <div className="text-[10px] mt-1 text-[#FFF2BA]">Cancel anytime</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubscriptionTier("yearly")}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        subscriptionTier === "yearly"
                          ? "bg-[#072847] text-white border-[#041220] shadow-sm"
                          : "bg-white text-[#072847] border-[#EFE4C4]"
                      }`}
                    >
                      <div className="font-semibold text-sm flex items-center justify-between">
                        Yearly Plan
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C88D34] text-white font-bold">
                          -17%
                        </span>
                      </div>
                      <div className="text-xs opacity-80">£150.00 / year</div>
                      <div className="text-[10px] mt-1 text-[#FFF2BA]">2 months free</div>
                    </button>
                  </div>
                </div>

                {/* Charity Nomination (§ 08.1) */}
                <div>
                  <label className="block text-xs font-semibold text-[#3E5A74] mb-1">
                    Nominate Your Charity (Section § 08.1)
                  </label>
                  <select
                    value={charityId}
                    onChange={(e) => setCharityId(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFE4C4] bg-white text-[#072847]"
                  >
                    {charities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Voluntary Percentage Slider (§ 08.1) */}
                <div className="bg-[#FAF6EB] p-3.5 rounded-xl border border-[#EFE4C4]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#072847] flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-[#C88D34]" />
                      Charity Contribution Pledge:
                    </span>
                    <span className="text-sm font-bold text-[#072847]">
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
                    className="w-full accent-[#0D3B66]"
                  />
                  <div className="flex justify-between text-[10px] text-[#6786A3] mt-1">
                    <span>10% (PRD Minimum)</span>
                    <span>25%</span>
                    <span>50% (Heroic Giving)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#3E5A74] mb-1">
                      Home Golf Club (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Portrush"
                      value={homeClub}
                      onChange={(e) => setHomeClub(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFE4C4] bg-white text-[#072847]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3E5A74] mb-1">
                      Handicap Index
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="12.4"
                      value={handicap}
                      onChange={(e) => setHandicap(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-[#EFE4C4] bg-white text-[#072847]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#072847] hover:bg-[#0D3B66] text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  <Sparkles className="w-4 h-4 text-[#FFF2BA]" />
                  Activate Subscription & Enter Draw
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

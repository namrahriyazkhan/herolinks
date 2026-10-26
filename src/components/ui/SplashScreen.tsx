"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function SplashScreen({ onComplete, forceShow = false }: SplashScreenProps) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Check if already viewed in this browser session
    const hasViewed = sessionStorage.getItem("dh_splash_viewed");
    if (!hasViewed || forceShow) {
      setVisible(true);

      // Phase 1 -> 2
      const t1 = setTimeout(() => setPhase(2), 1000);
      // Phase 2 -> 3
      const t2 = setTimeout(() => setPhase(3), 2200);
      // Phase 3 -> 4
      const t3 = setTimeout(() => setPhase(4), 3600);

      // Animate charity counter from 0 to 142850
      let start = 0;
      const target = 142850;
      const step = 40;
      const timer = setInterval(() => {
        start += Math.ceil((target - start) / 10);
        if (start >= target) {
          setCounter(target);
          clearInterval(timer);
        } else {
          setCounter(start);
        }
      }, step);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearInterval(timer);
      };
    }
  }, [forceShow]);

  const handleDismiss = () => {
    sessionStorage.setItem("dh_splash_viewed", "true");
    setVisible(false);
    if (onComplete) onComplete();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#071712] text-[#FAF7F2] flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none transition-opacity duration-700 animate-in fade-in">
      {/* Background ambient editorial grid & glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#C88D34_1px,transparent_1px)] [background-size:32px_32px]"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C88D34]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#143A2F]/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Masthead */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#E8C28A] tracking-widest uppercase">
            § 00 · PRODUCT REQUIREMENTS · 2026 EDITION
          </span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline font-mono text-xs text-white/60">
            DIGITALHEROES.CO.IN
          </span>
        </div>

        <button
          onClick={handleDismiss}
          className="text-xs font-mono text-[#FAF7F2]/60 hover:text-white border border-white/20 hover:border-white/50 px-3 py-1 rounded-full transition-all"
        >
          Skip Intro [Esc] ✕
        </button>
      </div>

      {/* Center Cinematic Stage */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto py-10 space-y-8 text-center sm:text-left">
        {/* Phase Indicator */}
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span
            className={`h-1 rounded-full transition-all duration-500 ${
              phase >= 1 ? "w-8 bg-[#C88D34]" : "w-2 bg-white/20"
            }`}
          ></span>
          <span
            className={`h-1 rounded-full transition-all duration-500 ${
              phase >= 2 ? "w-8 bg-[#C88D34]" : "w-2 bg-white/20"
            }`}
          ></span>
          <span
            className={`h-1 rounded-full transition-all duration-500 ${
              phase >= 3 ? "w-8 bg-[#C88D34]" : "w-2 bg-white/20"
            }`}
          ></span>
          <span
            className={`h-1 rounded-full transition-all duration-500 ${
              phase >= 4 ? "w-8 bg-[#C88D34]" : "w-2 bg-white/20"
            }`}
          ></span>
        </div>

        {/* Brand & Mascot Lockup */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* SVG Line-art Superhero Mascot (homage to PRD Page 1 astronaut with cape) */}
          <div className="w-24 h-24 rounded-2xl bg-[#143A2F]/80 border border-[#C88D34]/40 p-4 shrink-0 flex items-center justify-center shadow-2xl relative group">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-[#E8C28A] stroke-current fill-none stroke-[2.5] stroke-linecap-round stroke-linejoin-round"
            >
              {/* Helmet circle */}
              <circle cx="50" cy="30" r="16" />
              {/* Visor inner */}
              <path d="M42 28 C45 24 55 24 58 28 C58 33 42 33 42 28 Z" fill="#E8C28A" opacity="0.3" />
              {/* Antenna */}
              <line x1="50" y1="14" x2="50" y2="8" />
              <circle cx="50" cy="7" r="2" fill="#C88D34" />
              {/* Torso / Space suit */}
              <path d="M38 46 L62 46 L60 72 L40 72 Z" />
              {/* Cape billowing */}
              <path d="M38 48 C28 50 20 62 16 78 C24 74 34 68 38 62" />
              {/* Hero hands on hips */}
              <path d="M38 52 L30 58 L38 64" />
              <path d="M62 52 L70 58 L62 64" />
              {/* Legs */}
              <line x1="44" y1="72" x2="44" y2="90" />
              <line x1="56" y1="72" x2="56" y2="90" />
              <path d="M40 90 L48 90" />
              <path d="M52 90 L60 90" />
            </svg>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#C88D34]"></div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-baseline gap-2">
              <span className="font-sans font-black text-3xl sm:text-5xl tracking-tight text-white">
                digital<span className="text-[#C88D34]">.</span>
              </span>
              <span className="font-serif italic font-normal text-4xl sm:text-6xl text-[#E8C28A]">
                HEROES
              </span>
            </div>
            <p className="font-mono text-xs sm:text-sm text-[#BDE3D5]/80 uppercase tracking-widest">
              Six core objectives · One owned platform · Level 1
            </p>
          </div>
        </div>

        {/* Narrative Revelations based on Phase */}
        <div className="min-h-[140px] flex flex-col justify-center space-y-3">
          {phase === 1 && (
            <h2 className="font-serif italic text-3xl sm:text-5xl text-[#FAF7F2] font-light leading-tight animate-in fade-in slide-in-from-bottom-2 duration-500">
              “Feel, not fairway.”
            </h2>
          )}

          {phase === 2 && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <span className="font-mono text-xs text-[#E8C28A] uppercase tracking-wider">
                Platform Philosophy
              </span>
              <h2 className="font-serif italic text-2xl sm:text-4xl text-[#FAF7F2] font-light leading-tight">
                Where every Stableford point logged carries weight beyond the scorecard.
              </h2>
            </div>
          )}

          {phase >= 3 && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <span className="font-mono text-xs text-[#E8C28A] uppercase tracking-wider">
                Audited Social Impact Live Counter
              </span>
              <div className="font-serif italic text-5xl sm:text-7xl font-bold text-white tracking-tight">
                £{counter.toLocaleString("en-GB")}
              </div>
              <p className="text-xs sm:text-sm text-[#BDE3D5]/80 max-w-lg font-light">
                Directly disbursed to vetted youth access, medical neurology rehabilitation,
                and coastal dunes conservation initiatives.
              </p>
            </div>
          )}
        </div>

        {/* Enter CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto px-8 py-4 bg-[#C88D34] hover:bg-[#E09F45] text-[#071712] font-serif italic text-lg font-bold rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]"
          >
            <span>Enter Digital Heroes Experience</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <span className="font-mono text-xs text-white/50">
            Press anywhere or click to enter
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white/40 border-t border-white/10 pt-4 gap-2">
        <div>March 2026 Candidate Showcase · Full-Stack Evaluation</div>
        <div className="flex items-center gap-3">
          <span>St Andrews / Sunningdale / Carnoustie Links</span>
          <span>•</span>
          <span className="text-[#E8C28A]">40 / 35 / 25 Enforced</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { Heart, Trophy, ShieldCheck, ExternalLink, HelpCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#072847] text-[#FAF6EB] border-t border-[#0D3B66] mt-auto">
      {/* Editorial banner */}
      <div className="border-b border-[#0D3B66]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FFF2BA]">
              § 12 · Editorial Manifesto
            </span>
            <h2 className="font-serif italic text-3xl sm:text-4xl text-[#FFFDF7] font-normal leading-tight">
              “Feel, not fairway. Lead with human impact, not sport.”
            </h2>
            <p className="text-sm text-[#C1DBE8] max-w-2xl leading-relaxed">
              Digital Heroes reframes golf from self-indulgence to purposeful community giving.
              Every Stableford point logged participates in a verified draw, channeling minimum 10%
              pledges to audited charities while rewarding golfer performance transparently.
            </p>
          </div>

          <div className="md:col-span-4 bg-[#0D3B66]/60 border border-[#FFF2BA]/20 rounded-xl p-6 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FFF2BA]">
              <ShieldCheck className="w-4 h-4 text-[#C88D34]" />
              Evaluation Credentials
            </div>
            <div className="text-xs space-y-1.5 text-white/90 font-mono">
              <div>
                <span className="text-[#C1DBE8]">Golfer:</span> golfer@digitalheroes.co.in
              </div>
              <div>
                <span className="text-[#C1DBE8]">Admin:</span> admin@digitalheroes.co.in
              </div>
              <div>
                <span className="text-[#C1DBE8]">Architecture:</span> Next.js 16 • Tailwind • Supabase
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="space-y-4">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-black text-lg text-white">digital.</span>
            <span className="font-serif italic text-xl text-[#FFF2BA]">HEROES</span>
          </div>
          <p className="text-xs text-[#C1DBE8] leading-relaxed">
            A golf performance and charity draw platform brief for full-stack trainees. Edition 2026.
          </p>
          <div className="text-xs text-[#C1DBE8]/70">
            digitalheroes.co.in · Version 1.0
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FAF0CA]">The Platform</h4>
          <ul className="space-y-2 text-xs text-[#C1DBE8]">
            <li>
              <Link href="/#how-it-works" className="hover:text-white transition-colors">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/draw" className="hover:text-white transition-colors font-semibold text-[#FFF2BA]">
                The Monthly Major Draw (§ 06)
              </Link>
            </li>
            <li>
              <Link href="/draw#draw-mechanics" className="hover:text-white transition-colors">
                Prize Pool Distribution (40/35/25)
              </Link>
            </li>
            <li>
              <Link href="/#score-rules" className="hover:text-white transition-colors">
                Rolling 5 Score Logic
              </Link>
            </li>
            <li>
              <Link href="/charities" className="hover:text-white transition-colors">
                Vetted Charity Directory
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FAF0CA]">Roles & Portals</h4>
          <ul className="space-y-2 text-xs text-[#C1DBE8]">
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Golfer Dashboard (§ 10)
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white transition-colors">
                Admin Management Center (§ 11)
              </Link>
            </li>
            <li>
              <Link href="/dashboard#proof" className="hover:text-white transition-colors">
                Winner Verification (§ 09)
              </Link>
            </li>
            <li>
              <Link href="/admin#simulations" className="hover:text-white transition-colors">
                Draw Simulation Engine
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FAF0CA]">Integrations & Ethics</h4>
          <ul className="space-y-2 text-xs text-[#C1DBE8]">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>100% Charity Pass-Through</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Rollover Jackpot Vault</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>WHS / HowDidiDo Proof Verification</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Supabase RLS Protected</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#0D3B66] py-6 text-center text-xs text-[#C1DBE8]/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © 2026 Digital Heroes (Level 1 PRD Submission). Built with Next.js, TypeScript, Tailwind & Supabase.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#FFF2BA]">48-Hour Full-Stack Candidate Showcase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

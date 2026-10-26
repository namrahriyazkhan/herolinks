"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AuthModal } from "@/components/modals/AuthModal";
import { DirectDonationModal } from "@/components/modals/DirectDonationModal";

export default function AdminPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDonate={() => setDonateModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <AdminDashboard />
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <DirectDonationModal
        isOpen={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
      />
    </div>
  );
}

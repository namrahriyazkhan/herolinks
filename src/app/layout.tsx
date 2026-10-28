import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { AppProvider } from "@/lib/store/app-context";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital Heroes | Golf Performance & Monthly Charity Draws",
  description:
    "An editorial golf performance platform uniting golfers through monthly charity prize draws. Log your Stableford scores, win transparent prize pools, and empower vetted charities.",
  keywords: ["golf charity", "stableford scores", "charity draw", "digital heroes", "golf impact platform"],
};

import { EvaluatorBar } from "@/components/layout/EvaluatorBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#FAF6EB] text-[#072847] font-sans selection:bg-[#072847] selection:text-[#FFF2BA]"
        suppressHydrationWarning
      >
        <AppProvider>
          {children}
          <EvaluatorBar />
        </AppProvider>
      </body>
    </html>
  );
}

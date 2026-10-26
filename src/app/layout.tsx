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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#13201B] font-sans selection:bg-[#163E32] selection:text-[#FAF7F2]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

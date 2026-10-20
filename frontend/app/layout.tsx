import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import IconSprite from "@/components/IconSprite";
import RevealBoot from "@/components/RevealBoot";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cogit: encrypted team context on Arkiv",
  description:
    "Cogit commits short, encrypted, wallet-signed context entries to Arkiv. Teammates and their agents pull them verified; stale notes expire on their own.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <IconSprite />
        <div className="ambient" aria-hidden="true">
          <div className="ambient-grid" />
          <div className="ambient-glow a" />
          <div className="ambient-glow b" />
        </div>
        <div className="grain" aria-hidden="true" />
        {children}
        <RevealBoot />
      </body>
    </html>
  );
}

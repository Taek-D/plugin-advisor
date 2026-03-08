import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Syne } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: "800",
});

export const metadata: Metadata = {
  title: "Plugin Advisor — Claude Code",
  description:
    "PRD / README / GitHub URL을 입력하면 최적의 Claude Code 플러그인 조합을 추천해드려요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`${jetbrains.variable} ${syne.variable} font-mono bg-main text-text-main antialiased`}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}

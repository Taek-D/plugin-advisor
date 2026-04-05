import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import Nav from "@/components/Nav";
import UmamiScript from "@/components/UmamiScript";
import FeedbackWidget from "@/components/FeedbackWidget";
import {
  organizationSchema,
  webSiteSchema,
  softwareApplicationSchema,
  wrapGraph,
} from "@/lib/schema";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pluginadvisor.cc"),
  title: "Plugin Advisor — Claude Code Plugin Recommendation Tool",
  description:
    "Plugin Advisor는 51개 검증된 플러그인 DB 기반으로 Claude Code 플러그인 조합을 추천하고 점수화하는 무료 웹 도구입니다. 충돌 감지, 커버리지 분석, 원클릭 설치 스크립트를 제공합니다.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://pluginadvisor.cc",
    siteName: "Plugin Advisor",
    title: "Plugin Advisor — Claude Code Plugin Recommendation Tool",
    description:
      "Plugin Advisor analyzes your project and recommends verified Claude Code plugin combinations from a database of 51 plugins. Includes conflict detection, 100-point scoring, and one-click install scripts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plugin Advisor — Claude Code Plugin Recommendation Tool",
    description:
      "Plugin Advisor analyzes your project and recommends verified Claude Code plugin combinations from a database of 51 plugins. Includes conflict detection, 100-point scoring, and one-click install scripts.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning style={{ colorScheme: "dark" }}>
      <head>
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <style>{`@font-face { font-family: 'Pretendard Variable'; font-display: swap; }`}</style>
        <meta name="theme-color" content="hsl(222.2, 47.4%, 11.2%)" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: wrapGraph([
              organizationSchema(),
              webSiteSchema(),
              softwareApplicationSchema(),
            ]),
          }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased`}
      >
        <I18nProvider>
          <Nav />
          <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
          <footer className="border-t border-border px-4 py-6 text-xs text-muted-foreground">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
              <span>Plugin Advisor — Claude Code starter setup guide</span>
              <a
                href="/admin/login"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                관리자
              </a>
            </div>
          </footer>
          <FeedbackWidget />
        </I18nProvider>
        <UmamiScript />
      </body>
    </html>
  );
}

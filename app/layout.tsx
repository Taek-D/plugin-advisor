import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import Link from "next/link";
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
          <footer className="border-t border-border px-4 py-10 text-sm text-muted-foreground">
            <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="mb-3 font-heading text-xs font-bold tracking-widest text-foreground">
                  PLUGIN ADVISOR
                </div>
                <p className="text-xs leading-relaxed">
                  Claude Code 플러그인 추천 + 조합 분석 도구.
                  51개 검증 DB 기반, 충돌 감지, 설치 스크립트 제공.
                </p>
              </div>
              <div>
                <div className="mb-3 text-xs font-semibold text-foreground">
                  Product
                </div>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/advisor" className="transition-colors hover:text-foreground">Plugin Advisor</Link></li>
                  <li><Link href="/optimizer" className="transition-colors hover:text-foreground">Plugin Optimizer</Link></li>
                  <li><Link href="/plugins" className="transition-colors hover:text-foreground">Plugin Catalog</Link></li>
                  <li><Link href="/compare" className="transition-colors hover:text-foreground">Compare Approaches</Link></li>
                </ul>
              </div>
              <div>
                <div className="mb-3 text-xs font-semibold text-foreground">
                  Resources
                </div>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/guides" className="transition-colors hover:text-foreground">Starter Guides</Link></li>
                  <li><Link href="/guides/claude-code-first-setup-checklist" className="transition-colors hover:text-foreground">First Setup Checklist</Link></li>
                  <li><Link href="/plugins/category/orchestration" className="transition-colors hover:text-foreground">Orchestration Plugins</Link></li>
                  <li><Link href="/plugins/category/data" className="transition-colors hover:text-foreground">Data Plugins</Link></li>
                </ul>
              </div>
              <div>
                <div className="mb-3 text-xs font-semibold text-foreground">
                  Support
                </div>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/services" className="transition-colors hover:text-foreground">Setup Review</Link></li>
                  <li><Link href="/admin/login" className="transition-colors hover:text-foreground">Admin</Link></li>
                </ul>
              </div>
            </div>
            <div className="mx-auto mt-8 flex max-w-6xl items-center justify-between border-t border-border pt-6 text-xs">
              <span>Plugin Advisor — setup success over plugin count</span>
              <span>pluginadvisor.cc</span>
            </div>
          </footer>
          <FeedbackWidget />
        </I18nProvider>
        <UmamiScript />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import Nav from "@/components/Nav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
  title: "Plugin Advisor — Claude Code",
  description:
    "Claude Code 첫 세팅을 덜 헤매게 도와주는 검증된 스타터 스택 설치 어드바이저.",
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
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased`}
      >
        <I18nProvider>
          <Nav />
          <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
          <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
            <a
              href="/admin/login"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              관리자
            </a>
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}

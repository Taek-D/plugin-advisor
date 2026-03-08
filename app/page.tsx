"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-20 animate-fade-in">
      {/* Hero Section */}
      <div className="mb-16 max-w-3xl text-center animate-float-up">
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Claude Code
          </span>
        </div>
        <h1 className="mb-6 font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
          {t.landing.heroTitle}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {t.landing.heroSubtitle}
        </p>
        <Link href="/advisor">
          <Button size="lg" className="group h-12 rounded-full px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
            {t.landing.startBtn}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-5xl">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold text-foreground">
          {t.landing.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-border bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Code2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">
              {t.landing.feature1Title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t.landing.feature1Desc}
            </p>
          </Card>
          <Card className="border-border bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-[#7C3AED]/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#7C3AED]/10">
              <Sparkles className="h-6 w-6 text-[#A78BFA]" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">
              {t.landing.feature2Title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t.landing.feature2Desc}
            </p>
          </Card>
          <Card className="border-border bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-warning/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <Zap className="h-6 w-6 text-warning" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">
              {t.landing.feature3Title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t.landing.feature3Desc}
            </p>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-border pb-8 pt-6 text-center text-sm text-muted-foreground">
        <p>Plugin Advisor — Claude Code</p>
      </footer>
    </main>
  );
}

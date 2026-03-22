"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Wrench,
  MessageSquareMore,
  CheckCircle2,
  Compass,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

export default function Home() {
  const { locale } = useI18n();

  useEffect(() => {
    trackEvent("landing_view");
  }, []);

  const featureCopy = [
    {
      icon: ShieldCheck,
      title:
        locale === "en" ? "Verified first" : "검증된 세팅 우선",
      desc:
        locale === "en"
          ? "Unsafe copy commands, placeholders, and high-risk plugins stay out of the starter flow."
          : "예시 경로, placeholder, 설치 검증이 약한 플러그인은 기본 흐름에서 보수적으로 제외합니다.",
    },
    {
      icon: Wrench,
      title:
        locale === "en" ? "Success over plugin count" : "플러그인 수보다 설치 성공",
      desc:
        locale === "en"
          ? "We prefer a short, practical setup path instead of a flashy stack that breaks on day one."
          : "많은 조합보다, 첫날 바로 써볼 수 있는 짧고 안전한 세팅 경로를 우선합니다.",
    },
    {
      icon: MessageSquareMore,
      title:
        locale === "en" ? "Escalate to real help" : "필요하면 실제 점검으로 연결",
      desc:
        locale === "en"
          ? "If you get blocked, you can turn the recommendation into a setup review request."
          : "막히는 지점이 생기면 추천 결과를 바탕으로 실제 세팅 점검 요청까지 이어갈 수 있습니다.",
    },
  ];

  const quickSignals = [
    locale === "en" ? "4 starter packs" : "4개 스타터 팩",
    locale === "en" ? "2-3 plugin focus" : "2~3개 핵심 추천",
    locale === "en" ? "Checklist before copy" : "복사 전 체크리스트",
  ];

  const quickSteps = [
    {
      icon: Compass,
      title: locale === "en" ? "Choose your path" : "시작 경로 선택",
      desc:
        locale === "en"
          ? "Pick a starter pack when you want speed, or describe your project for a custom diagnosis."
          : "빨리 시작하고 싶으면 프리셋 팩을, 더 맞춤형으로 보려면 직접 진단을 선택합니다.",
    },
    {
      icon: CheckCircle2,
      title: locale === "en" ? "Review setup blockers" : "막히는 지점 먼저 확인",
      desc:
        locale === "en"
          ? "See prerequisites, account setup needs, and the plugins we intentionally hold back."
          : "사전 준비물, 계정 연결 필요 여부, 이번에는 제외한 플러그인까지 먼저 확인합니다.",
    },
    {
      icon: Clock3,
      title: locale === "en" ? "Ship your first flow" : "첫 실행 흐름까지 연결",
      desc:
        locale === "en"
          ? "Copy only verified commands, then use the starter prompt to get a quick win."
          : "검증된 명령만 복사하고, 바로 써볼 첫 프롬프트까지 이어서 빠른 성공 경험을 만듭니다.",
    },
  ];

  return (
    <main className="px-4 py-16 animate-fade-in sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="surface-panel relative animate-float-up overflow-hidden rounded-[28px] p-8 sm:p-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_60%)]" />
            <div className="relative">
              <div className="mb-6 flex">
                <span className="section-kicker">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {locale === "en"
                  ? "Starter setup guide"
                  : "Claude Code 스타터 세팅 가이드"}
                </span>
              </div>
              <h1 className="mb-6 max-w-3xl font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground text-pretty sm:text-6xl">
              {locale === "en"
                ? "Set up Claude Code without tripping over the first week."
                : "Claude Code 첫 세팅, 덜 헤매고 시작하게 도와주는 가이드"}
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {locale === "en"
                ? "Pick a starter pack or run a quick diagnosis. We focus on verified plugins, preflight checks, and practical install steps."
                : "프리셋 팩을 고르거나 간단 진단을 돌리면, 검증된 플러그인과 설치 전 체크리스트를 기준으로 첫 세팅 실패 확률을 줄여드려요."}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {quickSignals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-overlay-border bg-overlay-subtle px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {signal}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/advisor" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="group h-12 w-full rounded-full bg-primary px-8 text-base font-bold text-primary-foreground hover:bg-primary/90 sm:w-auto"
                  >
                    {locale === "en" ? "Start setup diagnosis" : "세팅 진단 시작하기"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/guides" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="h-12 w-full rounded-full border-overlay-border bg-overlay-subtle px-8 text-base font-bold sm:w-auto">
                    {locale === "en" ? "Open starter guides" : "스타터 가이드 보기"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="surface-panel-soft rounded-[24px] p-6">
              <div className="mb-4 text-sm font-semibold text-primary">
                {locale === "en"
                  ? "What this product optimizes for"
                  : "이 제품이 우선하는 것"}
              </div>
              <div className="space-y-4">
                {featureCopy.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">{item.title}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="surface-panel-soft rounded-[24px] p-6">
              <div className="mb-4 text-sm font-semibold text-foreground">
                {locale === "en" ? "What you can do in 5 minutes" : "5분 안에 할 수 있는 흐름"}
              </div>
              <div className="space-y-4">
                {quickSteps.map((step) => (
                  <div key={step.title} className="flex gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-overlay-border bg-overlay-subtle">
                      <step.icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{step.title}</div>
                      <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card className="surface-panel-soft rounded-[24px] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">
              {locale === "en" ? "1. Pick a safe starting point" : "1. 안전한 시작점 고르기"}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {locale === "en"
                ? "Start from a preset pack or a quick diagnosis instead of browsing dozens of tools."
                : "수많은 플러그인을 뒤지는 대신, 프리셋 팩이나 간단 진단으로 시작점을 먼저 정합니다."}
            </p>
          </Card>
          <Card className="surface-panel-soft rounded-[24px] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">
              {locale === "en"
                ? "2. Review checks before copying"
                : "2. 복사 전에 체크리스트 확인"}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {locale === "en"
                ? "See prerequisites, account setup needs, and plugins we intentionally hold back for now."
                : "사전 준비물, 계정 연결 필요 여부, 이번에는 보수적으로 제외한 플러그인까지 함께 보여줍니다."}
            </p>
          </Card>
          <Card className="surface-panel-soft rounded-[24px] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <MessageSquareMore className="h-6 w-6 text-warning" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">
              {locale === "en"
                ? "3. Turn it into a real setup plan"
                : "3. 필요하면 실제 세팅 계획으로 연결"}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {locale === "en"
                ? "If the setup is important, send your blocker and turn the recommendation into a tailored plan."
                : "세팅이 중요한 프로젝트라면, 막히는 지점을 남겨서 맞춤형 세팅 계획으로 이어갈 수 있습니다."}
            </p>
          </Card>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>
            {locale === "en"
              ? "Plugin Advisor — built for setup success, not plugin hoarding."
              : "Plugin Advisor — 플러그인 수보다 세팅 성공을 우선합니다."}
          </p>
          <div className="flex gap-4">
            <Link href="/guides" className="hover:text-foreground">
              {locale === "en" ? "Starter guides" : "스타터 가이드"}
            </Link>
            <Link href="/services" className="hover:text-foreground">
              {locale === "en" ? "Setup help" : "세팅 점검"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

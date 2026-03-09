"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { STARTER_GUIDES } from "@/lib/guides";

export default function GuidesPage() {
  const { locale } = useI18n();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <Badge variant="outline" className="mb-3 text-primary">
          {locale === "en" ? "Starter guides" : "스타터 가이드"}
        </Badge>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          {locale === "en"
            ? "Guides for reducing early setup failure"
            : "초기 세팅 실패를 줄이기 위한 가이드"}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {locale === "en"
            ? "These pages focus on setup decisions, not plugin collection. Start with the guide closest to your current blocker."
            : "이 페이지들은 플러그인을 많이 모으는 법보다, 세팅 실패를 줄이는 의사결정에 초점을 둡니다. 지금 막히는 상황과 가장 가까운 가이드부터 보세요."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {STARTER_GUIDES.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="block">
            <Card className="h-full p-5 transition-colors hover:border-primary/40">
              <Badge variant="outline" className="mb-3">
                {locale === "en" ? guide.categoryEn : guide.category}
              </Badge>
              <h2 className="font-heading text-lg font-bold text-foreground">
                {locale === "en" ? guide.titleEn : guide.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {locale === "en" ? guide.summaryEn : guide.summary}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}

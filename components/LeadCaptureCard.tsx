"use client";

import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  compact?: boolean;
};

export default function LeadCaptureCard({ compact = false }: Props) {
  const { locale } = useI18n();

  const copy = {
    title:
      locale === "en"
        ? "Setup support is in preparation"
        : "세팅 지원 서비스는 준비 중입니다",
    subtitle:
      locale === "en"
        ? "We are keeping this area in a coming-soon state until the support flow is operational. For now, the product focuses on starter recommendations and setup guides."
        : "실제 세팅 지원 흐름이 열릴 때까지는 준비중 상태로 두고 있습니다. 지금은 스타터 추천과 설치 가이드에 집중하고 있어요.",
    points:
      locale === "en"
        ? [
            "No live consultation intake yet",
            "Starter recommendations remain free",
            "Guides and setup flow are the current priority",
          ]
        : [
            "아직 실시간 상담 신청은 열어두지 않았어요",
            "스타터 추천과 기본 가이드는 계속 무료예요",
            "지금은 설치 성공률과 가이드 완성도를 먼저 다듬고 있어요",
          ],
    primaryAction: locale === "en" ? "View setup guides" : "세팅 가이드 보기",
    secondaryAction: locale === "en" ? "Back to advisor" : "어드바이저로 돌아가기",
  };

  return (
    <Card className={`surface-panel-soft rounded-[24px] ${compact ? "p-4" : "p-5 sm:p-6"}`}>
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Clock3 className="h-4 w-4" />
        </span>
        <div>
          <div className="mb-1 inline-flex rounded-full border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-semibold text-primary">
            {locale === "en" ? "Coming soon" : "서비스 준비중"}
          </div>
          <h3 className="font-heading text-base font-bold text-foreground">
            {copy.title}
          </h3>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{copy.subtitle}</p>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        {copy.points.map((point) => (
          <div key={point} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
            <span>{point}</span>
          </div>
        ))}
      </div>

      <div className={`mt-5 flex ${compact ? "flex-col" : "flex-col sm:flex-row"} gap-2`}>
        <Button
          asChild
          className={compact ? "h-11 w-full rounded-full" : "rounded-full"}
          onClick={() =>
            trackEvent("service_cta_click", {
              target: "guides",
              source: compact ? "result" : "services",
            })
          }
        >
          <Link href="/guides">
            <span className="flex items-center gap-2">
              {copy.primaryAction}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className={
            compact
              ? "h-11 w-full rounded-full border-overlay-border bg-overlay-subtle"
              : "rounded-full border-overlay-border bg-overlay-subtle"
          }
          onClick={() =>
            trackEvent("service_cta_click", {
              target: "advisor",
              source: compact ? "result" : "services",
            })
          }
        >
          <Link href="/advisor">{copy.secondaryAction}</Link>
        </Button>
      </div>
    </Card>
  );
}

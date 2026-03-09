"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import LeadCaptureCard from "@/components/LeadCaptureCard";
import { useI18n } from "@/lib/i18n";

const SERVICE_PACKAGES = [
  {
    id: "personal-setup",
    title: "1:1 세팅 점검",
    titleEn: "1:1 setup review",
    desc: "지금 막히는 설치 흐름을 같이 정리하고, 무엇부터 빼고 무엇만 먼저 깔지 실전 기준으로 정리해드려요.",
    descEn:
      "We review your current setup blocker and narrow the stack down to the practical essentials.",
    outcomes: [
      "추천 조합 정리",
      "설치 순서 정리",
      "막히는 포인트 점검",
    ],
    outcomesEn: [
      "Recommended starter stack",
      "Install order",
      "Blocker review",
    ],
  },
  {
    id: "project-package",
    title: "프로젝트 맞춤 추천/설치 문서",
    titleEn: "Project-specific setup package",
    desc: "프로젝트 상황에 맞는 플러그인 세트, 설치 문서, 첫 프롬프트까지 한 번에 정리해드려요.",
    descEn:
      "We turn your project context into a tailored plugin stack, install checklist, and first-prompt guide.",
    outcomes: [
      "프로젝트용 스타터 세트",
      "설치 체크리스트",
      "첫 프롬프트 문서",
    ],
    outcomesEn: [
      "Project starter stack",
      "Install checklist",
      "First-prompt guide",
    ],
  },
  {
    id: "team-package",
    title: "팀 승인 스택/온보딩 문서",
    titleEn: "Team-approved stack package",
    desc: "팀이 공통으로 써야 하는 플러그인 세트와 AGENTS.md, 온보딩 문서, 주의사항을 정리합니다.",
    descEn:
      "We document a team-approved plugin stack, AGENTS.md baseline, and onboarding guidance.",
    outcomes: [
      "승인 플러그인 세트",
      "AGENTS.md 초안",
      "온보딩 체크리스트",
    ],
    outcomesEn: [
      "Approved plugin stack",
      "AGENTS.md starter draft",
      "Onboarding checklist",
    ],
  },
] as const;

export default function ServicesPage() {
  const { locale } = useI18n();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 max-w-3xl">
        <Badge variant="outline" className="mb-3 text-primary">
          {locale === "en" ? "Setup support" : "세팅 지원"}
        </Badge>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          {locale === "en"
            ? "Setup support is coming soon"
            : "세팅 지원 서비스는 준비 중입니다"}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {locale === "en"
            ? "We are not opening a live support intake yet. For now, this page stays in a coming-soon state while we focus on recommendation quality and setup success."
            : "아직 상담/의뢰를 바로 받지는 않습니다. 지금은 추천 품질과 설치 성공률을 먼저 다듬기 위해 이 페이지를 준비중 상태로 유지하고 있어요."}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {SERVICE_PACKAGES.map((service) => (
          <Card key={service.id} className="p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-foreground">
                {locale === "en" ? service.titleEn : service.title}
              </div>
              <Badge variant="outline" className="text-[11px] text-muted-foreground">
                {locale === "en" ? "Planned" : "준비 중"}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {locale === "en" ? service.descEn : service.desc}
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {(locale === "en" ? service.outcomesEn : service.outcomes).map((item) => (
                <div key={item}>• {item}</div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <LeadCaptureCard />
      </div>
    </main>
  );
}

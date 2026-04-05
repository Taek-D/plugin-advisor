"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X, Minus } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Feature = {
  label: string;
  labelEn: string;
  pluginAdvisor: "yes" | "no" | "partial";
  officialSetup: "yes" | "no" | "partial";
  awesomeList: "yes" | "no" | "partial";
  manual: "yes" | "no" | "partial";
};

const FEATURES: Feature[] = [
  {
    label: "프로젝트 맞춤 추천",
    labelEn: "Project-based recommendation",
    pluginAdvisor: "yes",
    officialSetup: "yes",
    awesomeList: "no",
    manual: "no",
  },
  {
    label: "조합 점수화 (0-100)",
    labelEn: "Combination scoring (0-100)",
    pluginAdvisor: "yes",
    officialSetup: "no",
    awesomeList: "no",
    manual: "no",
  },
  {
    label: "충돌 감지",
    labelEn: "Conflict detection",
    pluginAdvisor: "yes",
    officialSetup: "no",
    awesomeList: "no",
    manual: "no",
  },
  {
    label: "설치 스크립트 생성",
    labelEn: "Install script generation",
    pluginAdvisor: "yes",
    officialSetup: "no",
    awesomeList: "no",
    manual: "no",
  },
  {
    label: "프리셋 스타터 팩",
    labelEn: "Preset starter packs",
    pluginAdvisor: "yes",
    officialSetup: "no",
    awesomeList: "no",
    manual: "no",
  },
  {
    label: "커버리지 갭 분석",
    labelEn: "Coverage gap analysis",
    pluginAdvisor: "yes",
    officialSetup: "no",
    awesomeList: "no",
    manual: "no",
  },
  {
    label: "보완/대체 추천",
    labelEn: "Complementary/replacement suggestions",
    pluginAdvisor: "yes",
    officialSetup: "no",
    awesomeList: "no",
    manual: "no",
  },
  {
    label: "코드베이스 자동 분석",
    labelEn: "Codebase auto-analysis",
    pluginAdvisor: "no",
    officialSetup: "yes",
    awesomeList: "no",
    manual: "no",
  },
  {
    label: "검증 상태 표시",
    labelEn: "Verification status",
    pluginAdvisor: "yes",
    officialSetup: "no",
    awesomeList: "partial",
    manual: "no",
  },
  {
    label: "한/영 다국어",
    labelEn: "Korean/English i18n",
    pluginAdvisor: "yes",
    officialSetup: "no",
    awesomeList: "no",
    manual: "no",
  },
];

function StatusIcon({ status }: { status: "yes" | "no" | "partial" }) {
  if (status === "yes")
    return <Check className="h-4 w-4 text-green-400" />;
  if (status === "partial")
    return <Minus className="h-4 w-4 text-yellow-400" />;
  return <X className="h-4 w-4 text-muted-foreground/40" />;
}

type Approach = {
  name: string;
  type: string;
  bestFor: string;
  bestForEn: string;
  desc: string;
  descEn: string;
  pros: string[];
  prosEn: string[];
  cons: string[];
  consEn: string[];
};

const APPROACHES: Approach[] = [
  {
    name: "Plugin Advisor",
    type: "Web Tool",
    bestFor: "첫 세팅부터 조합 최적화까지 데이터 기반으로 접근하고 싶은 개발자",
    bestForEn:
      "Developers who want a data-driven approach from first setup to combination optimization",
    desc: "51개 검증 DB에서 프로젝트 맞춤 추천, 조합 점수화, 충돌 감지, 설치 스크립트까지 제공하는 웹 도구.",
    descEn:
      "Web tool with 51 verified plugins, project-based recommendations, combination scoring, conflict detection, and install scripts.",
    pros: [
      "조합 점수 + 충돌 경고로 세팅 실패 방지",
      "설치 명령어 원클릭 복사",
      "프리셋 팩으로 5분 내 시작",
    ],
    prosEn: [
      "Prevents setup failures with scoring + conflict warnings",
      "One-click install command copy",
      "Start in 5 minutes with preset packs",
    ],
    cons: [
      "코드베이스 직접 분석 미지원 (텍스트 입력 기반)",
      "오프라인 사용 불가",
    ],
    consEn: [
      "No direct codebase analysis (text input based)",
      "Requires internet access",
    ],
  },
  {
    name: "Claude Code Setup (Official)",
    type: "CLI Plugin",
    bestFor: "코드베이스를 자동 분석해서 추천받고 싶은 개발자",
    bestForEn:
      "Developers who want automatic codebase analysis for recommendations",
    desc: "Anthropic 공식 CLI 플러그인. 코드베이스를 읽고 적합한 플러그인을 제안하지만, 읽기 전용이며 설치는 수동.",
    descEn:
      "Official Anthropic CLI plugin. Reads your codebase and suggests plugins, but read-only — manual installation required.",
    pros: [
      "코드베이스 자동 분석",
      "Claude Code 내에서 바로 실행",
      "공식 지원",
    ],
    prosEn: [
      "Automatic codebase analysis",
      "Runs inside Claude Code directly",
      "Official support",
    ],
    cons: [
      "충돌 감지 없음",
      "조합 점수화 없음",
      "설치 스크립트 미생성",
    ],
    consEn: [
      "No conflict detection",
      "No combination scoring",
      "No install script generation",
    ],
  },
  {
    name: "awesome-claude-code",
    type: "GitHub Repo",
    bestFor: "전체 생태계를 한눈에 보고 직접 고르고 싶은 개발자",
    bestForEn:
      "Developers who want to browse the full ecosystem and pick manually",
    desc: "커뮤니티가 관리하는 Claude Code 플러그인/도구 목록. 카테고리별 정리되어 있지만 추천이나 분석은 없음.",
    descEn:
      "Community-curated list of Claude Code plugins/tools. Categorized but no recommendations or analysis.",
    pros: [
      "가장 넓은 범위의 도구 목록",
      "커뮤니티 기여로 빠른 업데이트",
      "무료, 오픈소스",
    ],
    prosEn: [
      "Broadest range of tools listed",
      "Fast updates via community contributions",
      "Free and open source",
    ],
    cons: [
      "추천/분석 없음 — 직접 판단 필요",
      "충돌/중복 정보 없음",
      "설치 가이드 최소한",
    ],
    consEn: [
      "No recommendations/analysis — self-judgment required",
      "No conflict/redundancy information",
      "Minimal install guidance",
    ],
  },
  {
    name: "Manual Setup",
    type: "DIY",
    bestFor: "이미 생태계를 잘 아는 시니어 개발자",
    bestForEn: "Senior developers who already know the ecosystem well",
    desc: "블로그, 커뮤니티 추천, 시행착오로 직접 플러그인을 조합. 자유도가 높지만 시간이 많이 걸림.",
    descEn:
      "Build your plugin stack from blogs, community recommendations, and trial-and-error. Maximum flexibility but time-intensive.",
    pros: [
      "완전한 자유도",
      "깊은 이해도 축적",
      "외부 의존성 없음",
    ],
    prosEn: [
      "Complete freedom",
      "Builds deep understanding",
      "No external dependencies",
    ],
    cons: [
      "반나절~하루 이상 소요",
      "충돌 발견이 늦어질 수 있음",
      "최신 정보 수집 어려움",
    ],
    consEn: [
      "Takes half a day or more",
      "Conflicts may be discovered late",
      "Hard to gather up-to-date info",
    ],
  },
];

export default function CompareContent() {
  const { locale } = useI18n();
  const isEn = locale === "en";

  return (
    <>
      <div className="mb-10">
        <Badge variant="outline" className="mb-3 text-primary">
          {isEn ? "Comparison" : "비교"}
        </Badge>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {isEn
            ? "4 Ways to Set Up Claude Code Plugins"
            : "Claude Code 플러그인 세팅 방법 4가지 비교"}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          {isEn
            ? "Each approach has trade-offs. Plugin Advisor focuses on verified setups and combination scoring. The official Setup CLI analyzes your codebase directly. awesome-claude-code gives you the full list. Manual setup gives maximum control. Here's how they compare."
            : "각 방법마다 장단점이 있습니다. Plugin Advisor는 검증된 세팅과 조합 점수에 집중하고, 공식 Setup CLI는 코드베이스를 직접 분석하며, awesome-claude-code는 전체 목록을 보여주고, 수동 세팅은 최대 자유도를 줍니다."}
        </p>
      </div>

      {/* Feature comparison table */}
      <section className="mb-12">
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
          {isEn ? "Feature Comparison" : "기능 비교"}
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  {isEn ? "Feature" : "기능"}
                </th>
                <th className="px-3 py-3 text-center font-semibold text-primary">
                  Plugin Advisor
                </th>
                <th className="px-3 py-3 text-center font-semibold text-foreground">
                  Official Setup
                </th>
                <th className="px-3 py-3 text-center font-semibold text-foreground">
                  awesome-cc
                </th>
                <th className="px-3 py-3 text-center font-semibold text-foreground">
                  {isEn ? "Manual" : "수동"}
                </th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.labelEn} className="border-b border-border/50">
                  <td className="px-4 py-2.5 text-foreground">
                    {isEn ? f.labelEn : f.label}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="inline-flex justify-center">
                      <StatusIcon status={f.pluginAdvisor} />
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="inline-flex justify-center">
                      <StatusIcon status={f.officialSetup} />
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="inline-flex justify-center">
                      <StatusIcon status={f.awesomeList} />
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="inline-flex justify-center">
                      <StatusIcon status={f.manual} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed cards */}
      <section className="mb-12">
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
          {isEn ? "Detailed Breakdown" : "상세 비교"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {APPROACHES.map((a) => (
            <Card key={a.name} className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {a.name}
                </h3>
                <Badge variant="secondary" className="text-[10px] uppercase">
                  {a.type}
                </Badge>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                {isEn ? a.descEn : a.desc}
              </p>

              <div className="mb-2 text-xs font-semibold text-green-400">
                {isEn ? "Strengths" : "장점"}
              </div>
              <ul className="mb-3 space-y-1">
                {(isEn ? a.prosEn : a.pros).map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mb-2 text-xs font-semibold text-yellow-400">
                {isEn ? "Limitations" : "한계"}
              </div>
              <ul className="mb-3 space-y-1">
                {(isEn ? a.consEn : a.cons).map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-400" />
                    {c}
                  </li>
                ))}
              </ul>

              <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {isEn ? "Best for: " : "적합한 사용자: "}
                </span>
                {isEn ? a.bestForEn : a.bestFor}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recommendation */}
      <section className="mb-12 rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="mb-3 font-heading text-xl font-bold text-foreground">
          {isEn ? "Our Recommendation" : "추천 조합"}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {isEn
            ? "For most developers, we recommend starting with Plugin Advisor for initial setup and scoring, then using the official Setup CLI for codebase-specific fine-tuning. The two tools complement each other — Plugin Advisor handles combination health, while Setup CLI handles project-specific relevance."
            : "대부분의 개발자에게는 Plugin Advisor로 초기 세팅과 조합 점수를 확인한 뒤, 공식 Setup CLI로 코드베이스 맞춤 미세 조정을 하는 것을 추천합니다. 두 도구는 상호 보완적입니다 — Plugin Advisor는 조합 건강도를, Setup CLI는 프로젝트별 적합성을 담당합니다."}
        </p>
        <Link href="/advisor">
          <Button className="group rounded-full">
            {isEn ? "Try Plugin Advisor" : "Plugin Advisor 시작하기"}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </section>

      {/* Other links */}
      <div className="flex flex-wrap gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
        <Link href="/plugins" className="hover:text-foreground">
          {isEn ? "Browse all 51 plugins" : "51개 플러그인 둘러보기"}
        </Link>
        <span>·</span>
        <Link href="/optimizer" className="hover:text-foreground">
          {isEn ? "Score your current setup" : "현재 조합 점수 확인"}
        </Link>
        <span>·</span>
        <Link href="/guides" className="hover:text-foreground">
          {isEn ? "Starter guides" : "스타터 가이드"}
        </Link>
      </div>
    </>
  );
}

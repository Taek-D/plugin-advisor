import type { Metadata } from "next";
import { breadcrumbSchema, wrapSingle } from "@/lib/schema";
import CompareContent from "./CompareContent";

export const metadata: Metadata = {
  title:
    "Claude Code Plugin Setup: 4 Approaches Compared | Plugin Advisor",
  description:
    "Claude Code 플러그인 세팅 방법 4가지를 비교합니다. Plugin Advisor, 공식 Claude Code Setup, awesome-claude-code 리포, 수동 세팅의 장단점과 적합한 상황을 분석합니다.",
  openGraph: {
    title:
      "Claude Code Plugin Setup: 4 Approaches Compared | Plugin Advisor",
    description:
      "Compare 4 ways to set up Claude Code plugins: Plugin Advisor (web tool with 51-plugin DB and scoring), official Claude Code Setup CLI, awesome-claude-code repo, and manual trial-and-error.",
  },
};

export default function ComparePage() {
  const jsonLd = wrapSingle(
    breadcrumbSchema([
      { name: "Home", url: "https://pluginadvisor.cc" },
      { name: "Compare", url: "https://pluginadvisor.cc/compare" },
    ])
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <CompareContent />
    </div>
  );
}

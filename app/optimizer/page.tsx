import type { Metadata } from "next";
import OptimizerApp from "@/components/OptimizerApp";

export const metadata: Metadata = {
  title: "Plugin Optimizer — Analyze Your Claude Code Setup | Plugin Advisor",
  description:
    "현재 Claude Code 플러그인 조합을 100점 감점 모델로 점수화합니다. 충돌 경고, 커버리지 갭 분석, 보완/대체 플러그인 추천을 제공하는 무료 진단 도구입니다.",
  openGraph: {
    title: "Plugin Optimizer — Analyze Your Claude Code Setup | Plugin Advisor",
    description:
      "Score your current Claude Code plugin setup on a 100-point deduction model. Get conflict warnings, coverage gap analysis, and complementary plugin recommendations.",
  },
};

export default function OptimizerPage() {
  return (
    <main className="min-h-screen">
      <OptimizerApp />
    </main>
  );
}

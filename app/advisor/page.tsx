import type { Metadata } from "next";
import PluginAdvisorApp from "@/components/PluginAdvisorApp";

export const metadata: Metadata = {
  title: "Project Analysis — Claude Code Plugin Advisor",
  description:
    "프로젝트 설명, 파일, GitHub URL을 입력하면 51개 검증 DB에서 맞춤 Claude Code 플러그인을 추천합니다. 키워드 매칭과 AI 분석으로 충돌 없는 최적 조합을 제안합니다.",
  openGraph: {
    title: "Project Analysis — Claude Code Plugin Advisor",
    description:
      "Input your project description, file, or GitHub URL to get personalized Claude Code plugin recommendations from 51 verified plugins. Keyword matching and AI analysis for conflict-free setup.",
  },
};

export default function Advisor() {
    return (
        <main className="min-h-screen">
            <PluginAdvisorApp />
        </main>
    );
}

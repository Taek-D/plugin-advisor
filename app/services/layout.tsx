import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup Review & Consulting — Claude Code | Plugin Advisor",
  description:
    "Claude Code 세팅 점검, 프로젝트 맞춤 플러그인 추천, 팀 온보딩 문서 작성까지 1:1로 도와드립니다. 세팅 실패 없이 첫날부터 생산적으로 시작하세요.",
  openGraph: {
    title: "Setup Review & Consulting — Claude Code | Plugin Advisor",
    description:
      "1:1 Claude Code setup review, project-specific plugin recommendations, and team onboarding documentation. Start productive from day one.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

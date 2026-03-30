import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup Services | Plugin Advisor",
  description:
    "Claude Code 세팅 점검, 프로젝트 맞춤 추천, 팀 온보딩까지. 직접 도와드립니다.",
  openGraph: {
    title: "Setup Services | Plugin Advisor",
    description:
      "Claude Code 세팅 점검, 프로젝트 맞춤 추천, 팀 온보딩까지.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

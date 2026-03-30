import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Starter Guides | Plugin Advisor",
  description:
    "Claude Code 초기 세팅 실패를 줄이기 위한 실전 가이드 모음. 첫 세팅 체크리스트부터 보안 실수까지.",
  openGraph: {
    title: "Starter Guides | Plugin Advisor",
    description:
      "Claude Code 초기 세팅 실패를 줄이기 위한 실전 가이드 모음.",
  },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

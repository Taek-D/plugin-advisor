import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Starter Guides — Claude Code Setup Guides | Plugin Advisor",
  description:
    "Claude Code 초기 세팅 실패를 줄이기 위한 6개 실전 가이드. 첫 세팅 체크리스트, MCP 서버 연결 문제 해결, 플러그인 충돌 대응, 팀 표준화까지 다룹니다.",
  openGraph: {
    title: "Starter Guides — Claude Code Setup Guides | Plugin Advisor",
    description:
      "6 practical guides to reduce Claude Code setup failures. Covers first setup checklist, MCP server troubleshooting, plugin conflict resolution, and team standardization.",
  },
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

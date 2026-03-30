import type { Metadata } from "next";
import PluginAdvisorApp from "@/components/PluginAdvisorApp";

export const metadata: Metadata = {
  title: "Plugin Advisor | Plugin Advisor",
  description:
    "프로젝트 설명을 입력하면 Claude Code에 맞는 플러그인 조합을 추천받을 수 있습니다.",
  openGraph: {
    title: "Plugin Advisor | Plugin Advisor",
    description:
      "프로젝트 설명을 입력하면 Claude Code에 맞는 플러그인 조합을 추천받을 수 있습니다.",
  },
};

export default function Advisor() {
    return (
        <main className="min-h-screen">
            <PluginAdvisorApp />
        </main>
    );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import PluginGrid from "@/components/PluginGrid";
import PluginSuggestionCallout from "@/components/PluginSuggestionCallout";

export const metadata: Metadata = {
  title: "All Plugins | Plugin Advisor",
  description: "Claude Code에서 활용할 수 있는 플러그인 카탈로그를 둘러보세요.",
};

export default function PluginsPage() {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6">
      <h1 className="mb-1.5 font-heading text-[18px] font-extrabold sm:text-[22px]">
        플러그인 둘러보기
      </h1>
      <p className="mb-6 text-[11px] text-muted-foreground">
        MCP 서버와 Plugin을 탭으로 나누어 탐색하거나, 카테고리별로 필터링할 수 있어요.
      </p>

      <PluginSuggestionCallout sourcePage="/plugins" variant="banner" />
      <Suspense fallback={null}>
        <PluginGrid />
      </Suspense>
    </div>
  );
}

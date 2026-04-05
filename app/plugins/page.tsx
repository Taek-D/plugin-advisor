import { Suspense } from "react";
import type { Metadata } from "next";
import { PLUGINS } from "@/lib/plugins";
import { itemListSchema, wrapSingle } from "@/lib/schema";
import PluginGrid from "@/components/PluginGrid";
import PluginSuggestionCallout from "@/components/PluginSuggestionCallout";

export const metadata: Metadata = {
  title: "Plugin Catalog — 51 Verified Claude Code Plugins | Plugin Advisor",
  description:
    "39개 MCP 서버와 12개 플러그인을 포함한 51개 검증된 Claude Code 플러그인 카탈로그. 카테고리별 필터링, 설치 명령어, 사전 체크리스트를 제공합니다.",
};

export default function PluginsPage() {
  const pluginItems = Object.entries(PLUGINS).map(([id, p]) => ({
    name: p.name,
    url: `https://pluginadvisor.cc/plugins/${id}`,
  }));
  const jsonLd = wrapSingle(itemListSchema(pluginItems));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      {/* Title rendered inside PluginGrid (client) for i18n */}

      <PluginSuggestionCallout sourcePage="/plugins" variant="banner" />
      <Suspense fallback={null}>
        <PluginGrid />
      </Suspense>
    </div>
  );
}

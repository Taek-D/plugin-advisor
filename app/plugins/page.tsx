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
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Title rendered inside PluginGrid (client) for i18n */}

      <PluginSuggestionCallout sourcePage="/plugins" variant="banner" />
      <Suspense fallback={null}>
        <PluginGrid />
      </Suspense>
    </div>
  );
}

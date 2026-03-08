import type { Metadata } from "next";
import PluginGrid from "@/components/PluginGrid";

export const metadata: Metadata = {
  title: "All Plugins — Plugin Advisor",
  description: "Claude Code에서 사용할 수 있는 모든 플러그인을 둘러보세요.",
};

export default function PluginsPage() {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6">
      <h1 className="mb-1.5 font-heading text-[18px] font-extrabold sm:text-[22px]">
        플러그인 둘러보기
      </h1>
      <p className="mb-6 text-[11px] text-[#484860]">
        Claude Code 생태계의 플러그인을 카테고리별로 탐색하세요.
      </p>
      <PluginGrid />
    </div>
  );
}

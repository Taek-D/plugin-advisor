"use client";

import { useState, useEffect } from "react";
import type { PluginCategory } from "@/lib/types";

const CATEGORIES: { key: PluginCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "orchestration", label: "오케스트레이션" },
  { key: "workflow", label: "워크플로" },
  { key: "code-quality", label: "코드 품질" },
  { key: "testing", label: "테스팅" },
  { key: "documentation", label: "문서화" },
  { key: "data", label: "데이터" },
  { key: "security", label: "보안" },
  { key: "integration", label: "통합" },
  { key: "ui-ux", label: "UI/UX" },
  { key: "devops", label: "DevOps" },
];

type Props = {
  onSearch: (query: string) => void;
  onCategory: (category: PluginCategory | "all") => void;
  activeCategory: PluginCategory | "all";
};

export default function PluginSearch({
  onSearch,
  onCategory,
  activeCategory,
}: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="플러그인 이름, 설명, 키워드로 검색..."
        className="mb-4 w-full rounded-md border border-border-main bg-card px-3 py-3 font-mono text-xs text-[#CCC] outline-none transition-colors placeholder:text-[#252540] focus:border-accent"
      />
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onCategory(cat.key)}
            className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-wide transition-all ${
              activeCategory === cat.key
                ? "border-accent bg-accent/10 text-accent"
                : "border-border-main text-text-sub hover:border-[#30306A] hover:text-[#CCC]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

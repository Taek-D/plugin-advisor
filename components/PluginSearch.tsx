"use client";

import { useState, useEffect } from "react";
import type { PluginCategory } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type Props = {
  onSearch: (query: string) => void;
  onCategory: (category: PluginCategory | "all") => void;
  activeCategory: PluginCategory | "all";
};

const CATEGORY_KEYS: (PluginCategory | "all")[] = [
  "all",
  "orchestration",
  "workflow",
  "code-quality",
  "testing",
  "documentation",
  "data",
  "security",
  "integration",
  "ui-ux",
  "devops",
];

export default function PluginSearch({
  onSearch,
  onCategory,
  activeCategory,
}: Props) {
  const { t } = useI18n();
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
        placeholder={t.pluginsPage.searchPlaceholder}
        className="mb-4 w-full rounded-md border border-border-main bg-card px-3 py-3 font-mono text-xs text-[#CCC] outline-none transition-colors placeholder:text-[#252540] focus:border-accent"
      />
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-2">
        {CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => onCategory(key)}
            className={`shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-wide transition-all ${
              activeCategory === key
                ? "border-accent bg-accent/10 text-accent"
                : "border-border-main text-text-sub hover:border-[#30306A] hover:text-[#CCC]"
            }`}
          >
            {key === "all" ? t.pluginsPage.allCategories : (t.categories[key] || key)}
          </button>
        ))}
      </div>
    </div>
  );
}

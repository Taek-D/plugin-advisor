"use client";

import { useState, useEffect } from "react";
import type { PluginCategory } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.pluginsPage.searchPlaceholder}
        className="mb-4 h-auto px-3 py-3 font-mono text-xs"
      />
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-2">
        {CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => onCategory(key)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              activeCategory === key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
            )}
          >
            {key === "all" ? t.pluginsPage.allCategories : (t.categories[key] || key)}
          </button>
        ))}
      </div>
    </div>
  );
}

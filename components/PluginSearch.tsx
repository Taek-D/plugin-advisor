"use client";

import { useState, useEffect } from "react";
import type { PluginCategory, ItemType } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type ActiveType = ItemType | "all";

type Props = {
  onSearch: (query: string) => void;
  onCategory: (category: PluginCategory | "all") => void;
  activeCategory: PluginCategory | "all";
  activeType: ActiveType;
  onTypeChange: (type: ActiveType) => void;
  typeCounts: { total: number; mcp: number; plugin: number };
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
  activeType,
  onTypeChange,
  typeCounts,
}: Props) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div>
      <label htmlFor="plugin-search-input" className="sr-only">
        {t.pluginsPage.searchPlaceholder}
      </label>
      <Input
        id="plugin-search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.pluginsPage.searchPlaceholder}
        className="mb-4 h-auto px-3 py-3 font-mono text-xs"
      />
      <TabsList className="mb-5">
        <TabsTrigger
          active={activeType === "all"}
          onClick={() => onTypeChange("all")}
        >
          {t.pluginsPage.allTabLabel} ({typeCounts.total})
        </TabsTrigger>
        <TabsTrigger
          active={activeType === "mcp"}
          onClick={() => onTypeChange("mcp")}
        >
          MCP ({typeCounts.mcp})
        </TabsTrigger>
        <TabsTrigger
          active={activeType === "plugin"}
          onClick={() => onTypeChange("plugin")}
        >
          Plugin ({typeCounts.plugin})
        </TabsTrigger>
      </TabsList>
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
        {CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => onCategory(key)}
            aria-pressed={activeCategory === key}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-2 font-mono text-xs tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
    </div>
  );
}

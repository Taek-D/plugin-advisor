"use client";

import { useState, useCallback } from "react";
import { PLUGINS } from "@/lib/plugins";
import type { PluginCategory } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import PluginSearch from "./PluginSearch";
import PluginGridCard from "./PluginGridCard";

export default function PluginGrid() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PluginCategory | "all">("all");

  const handleSearch = useCallback((q: string) => setSearch(q), []);
  const handleCategory = useCallback(
    (c: PluginCategory | "all") => setCategory(c),
    []
  );

  const allPlugins = Object.values(PLUGINS);
  const filtered = allPlugins.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <PluginSearch
        onSearch={handleSearch}
        onCategory={handleCategory}
        activeCategory={category}
      />
      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-2 text-[11px] text-muted-foreground">
            {t.pluginsPage.noResults}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PluginGridCard key={p.id} plugin={p} />
          ))}
        </div>
      )}
    </div>
  );
}

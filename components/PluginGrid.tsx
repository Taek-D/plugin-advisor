"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { PLUGINS } from "@/lib/plugins";
import type { PluginCategory, ItemType } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import PluginSearch from "./PluginSearch";
import PluginGridCard from "./PluginGridCard";

type ActiveType = ItemType | "all";

export default function PluginGrid() {
  const { locale, t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawType = searchParams.get("type");
  const initialType: ActiveType =
    rawType === "mcp" || rawType === "plugin" ? rawType : "all";

  const [activeType, setActiveType] = useState<ActiveType>(initialType);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PluginCategory | "all">("all");

  useEffect(() => {
    const raw = searchParams.get("type");
    const fromUrl: ActiveType =
      raw === "mcp" || raw === "plugin" ? raw : "all";
    setActiveType(fromUrl);
  }, [searchParams]);

  const handleSearch = useCallback((q: string) => setSearch(q), []);
  const handleCategory = useCallback(
    (c: PluginCategory | "all") => setCategory(c),
    []
  );
  const handleTypeChange = useCallback(
    (type: ActiveType) => {
      setActiveType(type);
      const params = new URLSearchParams(searchParams.toString());
      if (type === "all") {
        params.delete("type");
      } else {
        params.set("type", type);
      }
      const qs = params.toString();
      router.push(`/plugins${qs ? `?${qs}` : ""}`);
    },
    [searchParams, router]
  );

  const allPlugins = Object.values(PLUGINS);

  const totalCount = allPlugins.length;
  const mcpCount = allPlugins.filter((p) => p.type === "mcp").length;
  const pluginCount = allPlugins.filter((p) => p.type === "plugin").length;

  const filtered = allPlugins.filter((p) => {
    if (activeType !== "all" && p.type !== activeType) return false;
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
        activeType={activeType}
        onTypeChange={handleTypeChange}
        typeCounts={{ total: totalCount, mcp: mcpCount, plugin: pluginCount }}
      />
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-border">
            <SearchX className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mb-1 text-sm font-medium text-muted-foreground">
            {t.pluginsPage.noResults}
          </div>
          <div className="text-xs text-muted-foreground">
            {locale === "en"
              ? "Try a different keyword or category"
              : "다른 키워드나 카테고리를 시도해 보세요"}
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

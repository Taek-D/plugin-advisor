"use client";

import { useState, useEffect } from "react";
import { getFavorites, deleteFavorite } from "@/lib/favorites";
import { PLUGINS } from "@/lib/plugins";
import { useI18n } from "@/lib/i18n";
import type { Favorite } from "@/lib/types";

export default function FavoritesPanel() {
  const { locale, t } = useI18n();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  const handleDelete = async (id: string) => {
    await deleteFavorite(id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const handleCopy = (pluginIds: string[]) => {
    const script = [
      t.installScript.scriptComment1,
      "",
      ...pluginIds.flatMap((id) => {
        const p = PLUGINS[id];
        return p ? [`# ── ${p.name}`, ...p.install, ""] : [];
      }),
    ].join("\n");
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!favorites.length) {
    return (
      <div className="rounded-[9px] border border-border-main bg-card px-4 py-8 text-center">
        <div className="mb-2 text-[9px] tracking-[2px] text-[#383850]">
          FAVORITES
        </div>
        <div className="text-[11px] text-text-sub">{t.favorites.empty}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 text-[9px] tracking-[2px] text-[#383850]">
        FAVORITES ({favorites.length})
      </div>
      <div className="flex flex-col gap-2">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className="group rounded-[7px] border border-border-main bg-card p-3 transition-colors hover:border-[#28285A]"
          >
            <div
              className="cursor-pointer"
              onClick={() =>
                setExpanded(expanded === fav.id ? null : fav.id)
              }
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#CCC]">
                  {fav.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-[#303048]">
                    {new Date(fav.createdAt).toLocaleDateString(
                      locale === "en" ? "en-US" : "ko-KR"
                    )}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(fav.id);
                    }}
                    className="hidden text-[11px] text-text-sub hover:text-error group-hover:inline"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {fav.pluginIds.map((id) => {
                  const p = PLUGINS[id];
                  if (!p) return null;
                  return (
                    <span
                      key={id}
                      className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-bold"
                      style={{
                        color: p.color,
                        background: p.color + "14",
                        border: `1px solid ${p.color}28`,
                      }}
                    >
                      {p.tag}
                    </span>
                  );
                })}
              </div>
            </div>

            {expanded === fav.id && (
              <div className="mt-3 border-t border-border-main pt-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] tracking-[2px] text-[#383850]">
                    {t.installScript.title}
                  </span>
                  <button
                    onClick={() => handleCopy(fav.pluginIds)}
                    className="rounded-[5px] bg-gradient-to-br from-success to-accent px-3 py-1.5 font-mono text-[9px] font-bold text-white hover:opacity-85"
                  >
                    {copied ? t.installScript.copyDone : t.installScript.copy}
                  </button>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-[10px] leading-[1.8] text-[#555]">
                  {fav.pluginIds
                    .map((id) => {
                      const p = PLUGINS[id];
                      return p
                        ? `# ── ${p.name}\n${p.install.join("\n")}`
                        : null;
                    })
                    .filter(Boolean)
                    .join("\n\n")}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

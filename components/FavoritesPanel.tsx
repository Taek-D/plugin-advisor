"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { getFavorites, deleteFavorite } from "@/lib/favorites";
import { PLUGINS } from "@/lib/plugins";
import { useI18n } from "@/lib/i18n";
import type { Favorite } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FavoritesPanel() {
  const { locale, t } = useI18n();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleDelete = (id: string) => {
    deleteFavorite(id);
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
      <Card className="px-4 py-8 text-center">
        <div className="mb-2 text-xs tracking-[2px] text-text-dim">
          FAVORITES
        </div>
        <div className="py-10 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-dim">
            <Bookmark className="h-5 w-5" />
          </div>
          <div className="text-sm text-muted-foreground">{t.favorites.empty}</div>
          <div className="mt-1 text-xs text-muted-foreground">{t.favorites.emptyHint}</div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-3 text-xs tracking-[2px] text-text-dim">
        FAVORITES ({favorites.length})
      </div>
      <div className="flex flex-col gap-2">
        {favorites.map((fav) => (
          <Card
            key={fav.id}
            className="group p-3 transition-colors hover:border-muted-foreground"
          >
            <div
              className="cursor-pointer"
              onClick={() =>
                setExpanded(expanded === fav.id ? null : fav.id)
              }
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">
                  {fav.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-dim">
                    {new Date(fav.createdAt).toLocaleDateString(
                      locale === "en" ? "en-US" : "ko-KR"
                    )}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(fav.id);
                    }}
                    className="hidden text-xs text-muted-foreground transition-colors hover:text-destructive group-hover:inline"
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
                      className="rounded-sm px-1.5 py-0.5 text-xs font-bold"
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
              <div className="mt-3 border-t border-border pt-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs tracking-[2px] text-text-dim">
                    {t.installScript.title}
                  </span>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleCopy(fav.pluginIds)}
                  >
                    {copied ? t.installScript.copyDone : t.installScript.copy}
                  </Button>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-[1.8] text-text-dim">
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
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { ArrowRight, Rocket, Globe, Search, Server, Zap, Layers } from "lucide-react";
import type { PresetPack } from "@/lib/presets";
import { PRESET_PACKS } from "@/lib/presets";
import { PLUGINS } from "@/lib/plugins";
import { useI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Globe,
  Search,
  Server,
  Zap,
  Layers,
};

type Props = {
  onSelect: (pack: PresetPack) => void;
};

export default function PresetPacks({ onSelect }: Props) {
  const { locale, t } = useI18n();

  const difficultyVariant = {
    beginner: "border-primary/30 bg-primary/10 text-primary",
    intermediate: "border-warning/30 bg-warning/10 text-warning",
    advanced: "border-primary/30 bg-primary/10 text-primary",
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-heading text-lg font-bold text-foreground">{t.presets.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.presets.subtitle}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {PRESET_PACKS.map((pack) => {
          const Icon = ICONS[pack.icon];
          const name = locale === "en" ? pack.nameEn : pack.name;
          const desc = locale === "en" ? pack.descriptionEn : pack.description;
          const plugins = pack.pluginIds.map((id) => PLUGINS[id]).filter(Boolean);

          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => onSelect(pack)}
              className="surface-panel-soft group flex h-full cursor-pointer flex-col rounded-[24px] border bg-card p-5 text-left transition-[transform,border-color] hover:-translate-y-0.5 hover:border-primary/30 active:translate-y-0"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                {Icon && (
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                )}
                  <div className="flex-1">
                  <div className="flex items-center gap-2">
                      <span className="font-heading text-sm font-semibold text-foreground">{name}</span>
                    <Badge
                        className={`rounded-full border ${difficultyVariant[pack.difficulty]}`}
                    >
                      {t.presets.difficulty[pack.difficulty]}
                    </Badge>
                  </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {plugins.length} {locale === "en" ? "core plugins" : "개 핵심 플러그인"}
                    </div>
                  </div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-overlay-border bg-overlay-subtle text-muted-foreground transition-colors group-hover:text-foreground">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              <div className="mt-auto flex flex-wrap gap-1.5">
                {plugins.map((p) => (
                  <span
                    key={p.id}
                    className="rounded-full border px-2 py-1 text-xs font-semibold"
                    style={{
                      color: p.color,
                      background: p.color + "18",
                      borderColor: p.color + "22",
                    }}
                  >
                    {p.tag}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

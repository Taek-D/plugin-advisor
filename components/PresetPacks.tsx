"use client";

import { Rocket, Globe, Search, Server, Zap, Layers } from "lucide-react";
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
        <h2 className="font-heading text-base font-bold">{t.presets.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.presets.subtitle}</p>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {PRESET_PACKS.map((pack) => {
          const Icon = ICONS[pack.icon];
          const name = locale === "en" ? pack.nameEn : pack.name;
          const desc = locale === "en" ? pack.descriptionEn : pack.description;
          const plugins = pack.pluginIds.map((id) => PLUGINS[id]).filter(Boolean);

          return (
            <Card
              key={pack.id}
              onClick={() => onSelect(pack)}
              className="group cursor-pointer p-4 transition-colors hover:border-muted-foreground"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(pack); } }}
            >
              <div className="mb-2.5 flex items-center gap-2.5">
                {Icon && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-4 w-4" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-sm font-semibold">{name}</span>
                    <Badge
                      className={`rounded-full border ${difficultyVariant[pack.difficulty]}`}
                    >
                      {t.presets.difficulty[pack.difficulty]}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground sm:text-xs">{desc}</p>
              <div className="flex flex-wrap gap-1">
                {plugins.map((p) => (
                  <span
                    key={p.id}
                    className="rounded-sm px-1.5 py-0.5 text-xs font-bold"
                    style={{
                      color: p.color,
                      background: p.color + "18",
                    }}
                  >
                    {p.tag}
                  </span>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

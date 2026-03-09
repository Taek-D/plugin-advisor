"use client";

import { CircleOff } from "lucide-react";
import { PLUGINS } from "@/lib/plugins";
import { useI18n } from "@/lib/i18n";
import type { NotRecommendedPlugin } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  items?: NotRecommendedPlugin[];
};

export default function NotRecommendedPanel({ items = [] }: Props) {
  const { locale } = useI18n();

  if (items.length === 0) return null;

  return (
    <Card className="surface-panel-soft rounded-[24px] p-5">
      <div className="mb-3 flex items-center gap-2">
        <CircleOff className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm font-semibold text-foreground">
          {locale === "en"
            ? "Held back for now"
            : "이번 추천에서 보수적으로 제외한 플러그인"}
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const plugin = PLUGINS[item.pluginId];
          if (!plugin) return null;
          return (
            <div
              key={item.pluginId}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {plugin.name}
                </span>
                <Badge
                  className="border-transparent"
                  style={{
                    color: plugin.color,
                    background: plugin.color + "18",
                  }}
                >
                  {plugin.tag}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {locale === "en" ? item.reasonEn : item.reason}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

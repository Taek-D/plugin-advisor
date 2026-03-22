"use client";

import Link from "next/link";
import { PLUGINS } from "@/lib/plugins";
import { useI18n } from "@/lib/i18n";
import { pluginDescEn } from "@/lib/i18n/plugins-en";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  currentId: string;
  category: string;
};

export default function RelatedPlugins({ currentId, category }: Props) {
  const { locale, t } = useI18n();
  const related = Object.values(PLUGINS)
    .filter((p) => p.id !== currentId && p.category === category)
    .slice(0, 4);

  if (!related.length) return null;

  return (
    <div>
      <div className="mb-3 text-[9px] tracking-[2px] text-text-dim">
        {t.detail.relatedPlugins}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {related.map((p) => {
          const desc = locale === "en" ? (pluginDescEn[p.id]?.desc || p.desc) : p.desc;
          return (
            <Link
              key={p.id}
              href={`/plugins/${p.id}`}
              className="block"
            >
              <Card className="p-3 transition-colors hover:border-muted-foreground">
                <div className="mb-1 flex items-center gap-2">
                  <Badge
                    className="border-transparent"
                    style={{
                      color: p.color,
                      background: p.color + "18",
                    }}
                  >
                    {p.tag}
                  </Badge>
                  <span className="text-xs font-bold text-foreground">
                    {p.name}
                  </span>
                </div>
                <div className="text-[0.625rem] text-muted-foreground">{desc}</div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

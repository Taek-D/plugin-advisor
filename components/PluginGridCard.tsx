"use client";

import Link from "next/link";
import type { Plugin } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { pluginDescEn } from "@/lib/i18n/plugins-en";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  plugin: Plugin;
};

export default function PluginGridCard({ plugin }: Props) {
  const { locale, t } = useI18n();
  const desc = locale === "en" ? (pluginDescEn[plugin.id]?.desc || plugin.desc) : plugin.desc;

  return (
    <Link
      href={`/plugins/${plugin.id}`}
      className="block"
    >
      <Card className="group cursor-pointer p-4 transition-colors hover:border-muted-foreground">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge
            className="border-transparent"
            style={{
              color: plugin.color,
              background: plugin.color + "18",
            }}
          >
            {plugin.tag}
          </Badge>
          <Badge variant="outline">
            {t.categories[plugin.category] ?? plugin.category}
          </Badge>
          <Badge variant="outline" className="text-primary">
            {plugin.installMode === "safe-copy"
              ? locale === "en"
                ? "copy-safe"
                : "검증된 설치"
              : locale === "en"
                ? "manual setup"
                : "수동 설정"}
          </Badge>
        </div>
        <h3 className="mb-1 font-heading text-sm font-semibold text-muted-foreground group-hover:text-foreground">
          {plugin.name}
        </h3>
        <p className="mb-2.5 text-xs leading-[1.7] text-muted-foreground">
          {desc}
        </p>
        <div className="flex flex-wrap gap-1">
          {plugin.features.slice(0, 3).map((f, i) => (
            <span
              key={i}
              className="rounded-sm px-1.5 py-0.5 text-xs text-muted-foreground"
              style={{ background: plugin.color + "0A" }}
            >
              {f}
            </span>
          ))}
        </div>
      </Card>
    </Link>
  );
}

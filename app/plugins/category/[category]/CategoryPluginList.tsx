"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import type { PluginCategory, ItemType } from "@/lib/types";

type CategoryMeta = {
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
};

type PluginItem = {
  id: string;
  name: string;
  desc: string;
  type: ItemType;
};

export default function CategoryPluginList({
  meta,
  plugins,
  category,
}: {
  meta: CategoryMeta;
  plugins: PluginItem[];
  category: PluginCategory;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";

  return (
    <>
      <div className="mb-8">
        <Badge variant="outline" className="mb-3 text-primary">
          {isEn ? meta.labelEn : meta.label}
        </Badge>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          {isEn
            ? `${meta.labelEn} Plugins for Claude Code`
            : `Claude Code ${meta.label} 플러그인`}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {isEn ? meta.descriptionEn : meta.description}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {isEn
            ? `${plugins.length} plugins in this category`
            : `이 카테고리에 ${plugins.length}개의 플러그인이 있습니다`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {plugins.map((p) => (
          <Link key={p.id} href={`/plugins/${p.id}`} className="block">
            <Card className="h-full p-5 transition-colors hover:border-primary/40">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  {p.name}
                </h2>
                <Badge
                  variant="secondary"
                  className="text-[10px] uppercase tracking-wide"
                >
                  {p.type}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {plugins.length === 0 && (
        <p className="text-center text-muted-foreground">
          {isEn
            ? `No plugins found in the ${meta.labelEn} category yet.`
            : `${meta.label} 카테고리에 아직 플러그인이 없습니다.`}
        </p>
      )}
    </>
  );
}

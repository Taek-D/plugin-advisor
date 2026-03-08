"use client";

import Link from "next/link";
import type { Plugin } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { pluginDescEn } from "@/lib/i18n/plugins-en";

type Props = {
  plugin: Plugin;
};

export default function PluginGridCard({ plugin }: Props) {
  const { locale, t } = useI18n();
  const desc = locale === "en" ? (pluginDescEn[plugin.id]?.desc || plugin.desc) : plugin.desc;

  return (
    <Link
      href={`/plugins/${plugin.id}`}
      className="group rounded-[9px] border border-border-main bg-card p-4 transition-all hover:border-[#28285A] hover:-translate-y-0.5"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-bold tracking-wide"
          style={{
            color: plugin.color,
            background: plugin.color + "18",
          }}
        >
          {plugin.tag}
        </span>
        <span className="rounded-[3px] border border-border-main px-1.5 py-0.5 text-[8px] text-text-sub">
          {t.categories[plugin.category] ?? plugin.category}
        </span>
      </div>
      <h3 className="mb-1 font-heading text-xs font-extrabold text-[#CCC] group-hover:text-white">
        {plugin.name}
      </h3>
      <p className="mb-2.5 text-[11px] leading-[1.7] text-[#666]">
        {desc}
      </p>
      <div className="flex flex-wrap gap-1">
        {plugin.features.slice(0, 3).map((f, i) => (
          <span
            key={i}
            className="rounded px-1.5 py-0.5 text-[9px] text-[#555]"
            style={{ background: plugin.color + "0A" }}
          >
            {f}
          </span>
        ))}
      </div>
    </Link>
  );
}

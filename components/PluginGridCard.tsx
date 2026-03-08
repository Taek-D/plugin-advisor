import Link from "next/link";
import type { Plugin } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  orchestration: "오케스트레이션",
  workflow: "워크플로",
  "code-quality": "코드 품질",
  testing: "테스팅",
  documentation: "문서화",
  data: "데이터",
  security: "보안",
  integration: "통합",
  "ui-ux": "UI/UX",
  devops: "DevOps",
};

type Props = {
  plugin: Plugin;
};

export default function PluginGridCard({ plugin }: Props) {
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
          {CATEGORY_LABELS[plugin.category] ?? plugin.category}
        </span>
      </div>
      <h3 className="mb-1 font-heading text-xs font-extrabold text-[#CCC] group-hover:text-white">
        {plugin.name}
      </h3>
      <p className="mb-2.5 text-[11px] leading-[1.7] text-[#666]">
        {plugin.desc}
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

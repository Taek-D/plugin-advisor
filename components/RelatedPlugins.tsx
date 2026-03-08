import Link from "next/link";
import { PLUGINS } from "@/lib/plugins";

type Props = {
  currentId: string;
  category: string;
};

export default function RelatedPlugins({ currentId, category }: Props) {
  const related = Object.values(PLUGINS)
    .filter((p) => p.id !== currentId && p.category === category)
    .slice(0, 4);

  if (!related.length) return null;

  return (
    <div>
      <div className="mb-3 text-[9px] tracking-[2px] text-[#383850]">
        같은 카테고리
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {related.map((p) => (
          <Link
            key={p.id}
            href={`/plugins/${p.id}`}
            className="rounded-[7px] border border-border-main bg-card p-3 transition-colors hover:border-[#28285A]"
          >
            <div className="mb-1 flex items-center gap-2">
              <span
                className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-bold"
                style={{
                  color: p.color,
                  background: p.color + "18",
                }}
              >
                {p.tag}
              </span>
              <span className="text-[11px] font-bold text-[#CCC]">
                {p.name}
              </span>
            </div>
            <div className="text-[10px] text-[#555]">{p.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

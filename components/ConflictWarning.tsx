import type { ConflictWarning as ConflictType } from "@/lib/types";
import { PLUGINS } from "@/lib/plugins";

type Props = {
  conflicts: ConflictType[];
};

export default function ConflictWarning({ conflicts }: Props) {
  if (!conflicts.length) return null;

  return (
    <div className="mb-3.5 space-y-1.5">
      {conflicts.map((c, i) => (
        <div
          key={i}
          className="flex items-start gap-2 rounded-md border border-[#3A1010] bg-[#130808] px-3 py-2.5 text-[11px] text-error"
        >
          <span>⚡</span>
          <div>
            <strong className="text-[#FF8080]">
              {c.ids.map((id) => PLUGINS[id]?.name).join(" + ")} 충돌 경고
            </strong>
            <div className="mt-0.5 text-[#CC5050]">{c.msg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

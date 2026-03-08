import type { ConflictWarning as ConflictType } from "@/lib/types";
import { PLUGINS } from "@/lib/plugins";
import { Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  conflicts: ConflictType[];
};

export default function ConflictWarning({ conflicts }: Props) {
  if (!conflicts.length) return null;

  return (
    <div className="mb-3.5 space-y-1.5">
      {conflicts.map((c, i) => (
        <Card
          key={i}
          className="flex items-start gap-2 border-destructive/30 bg-bg-error-subtle px-3 py-2.5 text-sm text-destructive"
        >
          <Zap className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          <div>
            <strong className="font-semibold text-destructive">
              {c.ids.map((id) => PLUGINS[id]?.name).join(" + ")} 충돌 경고
            </strong>
            <div className="mt-0.5 text-destructive/80">{c.msg}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

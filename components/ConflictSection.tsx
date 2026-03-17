"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import type { ConflictWarning } from "@/lib/types";
import type { RedundancyGroup } from "@/lib/conflicts";

type ConflictSectionProps = {
  conflicts: ConflictWarning[];
  redundancies: RedundancyGroup[];
};

export default function ConflictSection({
  conflicts,
  redundancies,
}: ConflictSectionProps) {
  const { t, locale } = useI18n();
  const hasConflicts = conflicts.length > 0;
  const hasRedundancies = redundancies.length > 0;

  return (
    <Card className="surface-panel rounded-[28px] p-5">
      {!hasConflicts && !hasRedundancies ? (
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="text-sm font-semibold">{t.optimizer.noConflict}</span>
        </div>
      ) : (
        <div className="space-y-4">
          {hasConflicts && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t.optimizer.conflictsTitle}
              </p>
              <ul className="space-y-2">
                {conflicts.map((conflict, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <div>
                      <p className="text-sm text-foreground">{conflict.msg}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {conflict.ids.join(", ")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasRedundancies && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {t.optimizer.redundancyTitle}
              </p>
              <ul className="space-y-2">
                {redundancies.map((group, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                    <p className="text-sm text-foreground">
                      {locale === "ko" ? group.msg : group.msgEn}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import ReplacementCard from "./ReplacementCard";
import type { ReplacementSuggestion } from "@/lib/scoring";

type ReplacementSectionProps = {
  replacements: ReplacementSuggestion[];
};

export default function ReplacementSection({
  replacements,
}: ReplacementSectionProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  if (replacements.length === 0) return null;

  return (
    <Card className="surface-panel rounded-[28px] p-5">
      {/* Header button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t.optimizer.replacementTitle}
          </span>
          <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-semibold text-orange-400">
            {replacements.length}
          </span>
        </div>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Collapsible body */}
      <div
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
        style={{ maxHeight: open ? "9999px" : "0px" }}
      >
        <div className="mt-3 space-y-2">
          {replacements.map((r) => (
            <ReplacementCard
              key={r.original}
              original={r.original}
              reason={r.reason}
              replacement={r.replacement}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

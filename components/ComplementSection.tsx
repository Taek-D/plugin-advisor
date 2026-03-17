"use client";

import { ChevronDown, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import RecommendPluginCard from "./RecommendPluginCard";
import type { ComplementSuggestion } from "@/lib/scoring";

type ComplementSectionProps = {
  complements: ComplementSuggestion[];
  open: boolean;
  onToggle: () => void;
};

export default function ComplementSection({
  complements,
  open,
  onToggle,
}: ComplementSectionProps) {
  const { t } = useI18n();

  return (
    <Card className="surface-panel rounded-[28px] p-5">
      {/* Header button */}
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t.optimizer.complementTitle}
          </span>
          {complements.length > 0 && (
            <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-400">
              {complements.length}
            </span>
          )}
        </div>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Collapsible body */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? "9999px" : "0px" }}
      >
        <div className="mt-3 space-y-2">
          {complements.length === 0 ? (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="text-sm font-semibold">
                {t.optimizer.noConflict}
              </span>
            </div>
          ) : (
            complements.map((c) => (
              <RecommendPluginCard
                key={c.pluginId}
                pluginId={c.pluginId}
                reason={t.categories[c.forCategory] ?? c.forCategory}
              />
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

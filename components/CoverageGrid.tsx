"use client";

import { useI18n } from "@/lib/i18n";
import { getCategoryIcon } from "@/lib/optimizer-utils";
import { Card } from "@/components/ui/card";
import type { CoverageResult } from "@/lib/scoring";
import type { PluginCategory } from "@/lib/types";

const ALL_CATEGORIES: PluginCategory[] = [
  "orchestration",
  "workflow",
  "code-quality",
  "testing",
  "documentation",
  "data",
  "security",
  "integration",
  "ui-ux",
  "devops",
];

type CoverageGridProps = {
  coverage: CoverageResult;
  complementsRef: React.RefObject<HTMLDivElement | null>;
  onOpenComplements: () => void;
};

export default function CoverageGrid({
  coverage,
  complementsRef,
  onOpenComplements,
}: CoverageGridProps) {
  const { t } = useI18n();
  const coveredSet = new Set(coverage.covered);
  const coveredCount = coverage.covered.length;
  const total = ALL_CATEGORIES.length;
  const coverageRatio = coveredCount / total;

  const progressColor =
    coverageRatio >= 0.8
      ? "#22c55e"
      : coverageRatio >= 0.5
      ? "#3b82f6"
      : "#eab308";

  const summaryText = t.optimizer.coverageSummary
    .replace("{covered}", String(coveredCount))
    .replace("{total}", String(total));

  function handleUncoveredClick() {
    onOpenComplements();
    complementsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <Card className="surface-panel rounded-[28px] p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {t.optimizer.coverageTitle}
      </p>

      {/* Coverage summary */}
      <div className="mb-4">
        <p className="mb-1.5 text-sm text-foreground">{summaryText}</p>
        <div className="h-2 w-full rounded-full bg-white/10">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${coverageRatio * 100}%`,
              backgroundColor: progressColor,
            }}
          />
        </div>
      </div>

      {/* 5x2 category grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {ALL_CATEGORIES.map((category) => {
          const isCovered = coveredSet.has(category);
          const Icon = getCategoryIcon(category);
          return (
            <div
              key={category}
              onClick={!isCovered ? handleUncoveredClick : undefined}
              className={[
                "flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-opacity",
                isCovered
                  ? "opacity-100"
                  : "cursor-pointer opacity-30 hover:opacity-60",
              ].join(" ")}
              title={!isCovered ? t.categories[category] : undefined}
            >
              <Icon className="h-5 w-5 text-foreground" />
              <span className="text-[10px] leading-tight text-muted-foreground">
                {t.categories[category]}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

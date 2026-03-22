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
  onOpenComplements: (category?: PluginCategory) => void;
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
      ? "hsl(var(--primary))"
      : coverageRatio >= 0.5
      ? "hsl(217 91% 60%)"
      : "hsl(var(--warning))";

  const summaryText = t.optimizer.coverageSummary
    .replace("{covered}", String(coveredCount))
    .replace("{total}", String(total));

  function handleUncoveredClick(category: PluginCategory) {
    onOpenComplements(category);
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
        <div className="h-2 w-full rounded-full bg-overlay-border">
          <div
            className="h-2 rounded-full transition-[width] duration-500"
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
              role={!isCovered ? "button" : undefined}
              tabIndex={!isCovered ? 0 : undefined}
              aria-label={!isCovered ? `${t.categories[category]} — 보완 플러그인 보기` : undefined}
              onClick={!isCovered ? () => handleUncoveredClick(category) : undefined}
              onKeyDown={!isCovered ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleUncoveredClick(category); } } : undefined}
              className={[
                "flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-opacity",
                isCovered
                  ? "opacity-100"
                  : "cursor-pointer opacity-50 hover:opacity-80",
              ].join(" ")}
              title={!isCovered ? t.categories[category] : undefined}
            >
              <Icon className="h-5 w-5 text-foreground" />
              <span className="text-[0.625rem] leading-tight text-muted-foreground">
                {t.categories[category]}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

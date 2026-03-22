"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { getGrade, GRADE_COLORS } from "@/lib/optimizer-utils";
import { Card } from "@/components/ui/card";
import type { ConflictWarning } from "@/lib/types";
import type { RedundancyGroup } from "@/lib/conflicts";

type ScoreGaugeProps = {
  score: number;
  conflicts: ConflictWarning[];
  redundancies: RedundancyGroup[];
  uncoveredCount: number;
};

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreGauge({
  score,
  conflicts,
  redundancies,
  uncoveredCount,
}: ScoreGaugeProps) {
  const { t } = useI18n();
  const grade = getGrade(score);
  const color = GRADE_COLORS[grade];
  const targetOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
  const [offset, setOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOffset(targetOffset));
    return () => cancelAnimationFrame(frame);
  }, [targetOffset]);

  const conflictPenalty = conflicts.length * 20;
  const redundancyPenalty = redundancies.length * 7;
  const uncoveredPenalty = uncoveredCount * 7;

  const gradeLabel =
    grade === "Excellent"
      ? t.optimizer.gradeExcellent
      : grade === "Good"
      ? t.optimizer.gradeGood
      : grade === "Fair"
      ? t.optimizer.gradeFair
      : t.optimizer.gradePoor;

  return (
    <Card className="surface-panel rounded-[28px] p-5">
      <div className="flex flex-col items-center gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {t.optimizer.resultScore}
        </p>

        {/* Circular gauge */}
        <div className="relative flex items-center justify-center">
          <svg
            width={136}
            height={136}
            viewBox="0 0 136 136"
            className="-rotate-90"
          >
            {/* Track circle */}
            <circle
              cx={68}
              cy={68}
              r={RADIUS}
              fill="none"
              stroke="hsl(var(--overlay-border))"
              strokeWidth={10}
            />
            {/* Filled arc */}
            <circle
              cx={68}
              cy={68}
              r={RADIUS}
              fill="none"
              stroke={color}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-[600ms] ease-out motion-reduce:transition-none"
            />
          </svg>
          {/* Score overlay */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold leading-none text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
              {score}
            </span>
            <span
              className="mt-1 text-xs font-semibold"
              style={{ color }}
            >
              {gradeLabel}
            </span>
          </div>
        </div>

        {/* Perfect combo message */}
        {score === 100 && (
          <p className="text-sm font-semibold text-primary">
            {t.optimizer.perfectCombo}
          </p>
        )}

        {/* Deduction badges */}
        {(conflictPenalty > 0 || redundancyPenalty > 0 || uncoveredPenalty > 0) && (
          <div className="flex flex-wrap justify-center gap-2">
            {conflictPenalty > 0 && (
              <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                {t.optimizer.deductionConflict} -{conflictPenalty}
              </span>
            )}
            {redundancyPenalty > 0 && (
              <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                {t.optimizer.deductionRedundancy} -{redundancyPenalty}
              </span>
            )}
            {uncoveredPenalty > 0 && (
              <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                {t.optimizer.deductionUncovered} -{uncoveredPenalty}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

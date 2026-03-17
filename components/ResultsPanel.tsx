"use client";

import { useI18n } from "@/lib/i18n";
import ScoreGauge from "./ScoreGauge";
import ConflictSection from "./ConflictSection";
import type { ScoringResult } from "@/lib/scoring";

type ResultsPanelProps = {
  result: ScoringResult;
};

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const { t } = useI18n();

  if (result.empty) {
    return (
      <div className="mt-6 flex items-center justify-center rounded-[24px] border border-dashed border-white/10 px-6 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          {t.optimizer.emptyInputHint}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mt-6 space-y-4">
      <ScoreGauge
        score={result.score!}
        conflicts={result.conflicts}
        redundancies={result.redundancies}
        uncoveredCount={result.coverage.uncovered.length}
      />
      <ConflictSection
        conflicts={result.conflicts}
        redundancies={result.redundancies}
      />
      {/* CoverageGrid — Plan 02 */}
      {/* ComplementSection — Plan 02 */}
      {/* ReplacementSection — Plan 02 */}
    </div>
  );
}

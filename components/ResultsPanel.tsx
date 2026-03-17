"use client";

import { useState, useRef, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import ScoreGauge from "./ScoreGauge";
import ConflictSection from "./ConflictSection";
import CoverageGrid from "./CoverageGrid";
import ComplementSection from "./ComplementSection";
import ReplacementSection from "./ReplacementSection";
import type { ScoringResult } from "@/lib/scoring";
import type { PluginCategory } from "@/lib/types";

type ResultsPanelProps = {
  result: ScoringResult;
};

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const { t } = useI18n();
  const [complementsOpen, setComplementsOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<PluginCategory | null>(null);
  const complementsRef = useRef<HTMLDivElement>(null);

  const handleOpenComplements = useCallback((category?: PluginCategory) => {
    setComplementsOpen(true);
    setFilterCategory(category ?? null);
  }, []);

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
      <CoverageGrid
        coverage={result.coverage}
        complementsRef={complementsRef}
        onOpenComplements={handleOpenComplements}
      />
      <div ref={complementsRef}>
        <ComplementSection
          complements={result.complements}
          open={complementsOpen}
          filterCategory={filterCategory}
          onToggle={() => {
            setComplementsOpen((v) => !v);
            if (complementsOpen) setFilterCategory(null);
          }}
          onClearFilter={() => setFilterCategory(null)}
        />
      </div>
      {result.replacements.length > 0 && (
        <ReplacementSection replacements={result.replacements} />
      )}
    </div>
  );
}

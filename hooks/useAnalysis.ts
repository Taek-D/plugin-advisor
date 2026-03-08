"use client";

import { useState, useCallback } from "react";
import { recommend } from "@/lib/recommend";
import { saveHistory } from "@/lib/history";
import type { AnalysisResult, HistoryEntry, Plugin } from "@/lib/types";

type Step = "input" | "analyzing" | "result";
type InputMode = "text" | "file" | "github";

export function useAnalysis() {
  const [step, setStep] = useState<Step>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [detailPlugin, setDetailPlugin] = useState<Plugin | null>(null);

  const handleAnalyze = useCallback(
    async (content: string, mode: InputMode = "text") => {
      setStep("analyzing");
      await new Promise((r) => setTimeout(r, 700));
      const res = recommend(content);
      setResult(res);
      const s: Record<string, boolean> = {};
      res.recommendations.forEach((r) => {
        s[r.pluginId] = true;
      });
      setSel(s);
      setStep("result");

      await saveHistory({
        inputText: content,
        inputMode: mode,
        recommendations: res.recommendations,
        selectedIds: res.recommendations.map((r) => r.pluginId),
      });

      return res;
    },
    []
  );

  const restoreFromHistory = useCallback((entry: HistoryEntry) => {
    const res = recommend(entry.inputText);
    setResult(res);
    const s: Record<string, boolean> = {};
    entry.selectedIds.forEach((id) => {
      s[id] = true;
    });
    setSel(s);
    setStep("result");
  }, []);

  const reset = useCallback(() => {
    setStep("input");
    setResult(null);
    setSel({});
    setDetailPlugin(null);
  }, []);

  const togglePlugin = useCallback((id: string) => {
    setSel((s) => ({ ...s, [id]: !s[id] }));
  }, []);

  const selectedIds = Object.keys(sel).filter((k) => sel[k]);

  return {
    step,
    result,
    sel,
    selectedIds,
    detailPlugin,
    setDetailPlugin,
    handleAnalyze,
    restoreFromHistory,
    reset,
    togglePlugin,
  };
}

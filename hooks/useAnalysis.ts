"use client";

import { useState, useCallback, useEffect } from "react";
import { recommend } from "@/lib/recommend";
import { saveHistory } from "@/lib/history";
import { trackEvent } from "@/lib/analytics";
import type { AnalysisResult, AnalysisMode, HistoryEntry, Plugin } from "@/lib/types";

type Step = "input" | "analyzing" | "result";
type InputMode = "text" | "file" | "github";

export function useAnalysis() {
  const [step, setStep] = useState<Step>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [detailPlugin, setDetailPlugin] = useState<Plugin | null>(null);
  const [aiAvailable] = useState(false); // AI 분석은 준비 중
  const [currentMode, setCurrentMode] = useState<AnalysisMode>("keyword");

  const handleAnalyze = useCallback(
    async (content: string, mode: InputMode = "text", analysisMode: AnalysisMode = "keyword") => {
      setStep("analyzing");
      trackEvent("analysis_start", { mode: analysisMode, inputMode: mode });

      await new Promise((r) => setTimeout(r, 500));

      let res = recommend(content);
      let effectiveMode: AnalysisMode = "keyword";

      if (analysisMode === "ai") {
        try {
          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: content,
              candidatePluginIds: res.recommendations.map((item) => item.pluginId),
            }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);

          type AiRecommendation = {
            pluginId: string;
            reason: string;
            matchedKeywords?: string[];
          };

          const reasonById = new Map<string, AiRecommendation>(
            (data.recommendations ?? []).map(
              (item: AiRecommendation) => [
                item.pluginId,
                item,
              ]
            )
          );

          res = {
            ...res,
            summary: data.summary || res.summary,
            warning: data.warning ?? res.warning,
            recommendations: res.recommendations.map((item) => ({
              ...item,
              reason: reasonById.get(item.pluginId)?.reason || item.reason,
              matchedKeywords:
                reasonById.get(item.pluginId)?.matchedKeywords || item.matchedKeywords,
            })),
          };
          effectiveMode = "ai";
        } catch {
          effectiveMode = "keyword";
        }
      }

      setCurrentMode(effectiveMode);
      setResult(res);
      const s: Record<string, boolean> = {};
      res.recommendations.forEach((r) => {
        s[r.pluginId] = true;
      });
      setSel(s);
      setStep("result");
      trackEvent("analysis_complete", {
        mode: effectiveMode,
        pluginCount: res.recommendations.length,
      });

      saveHistory({
        inputText: content,
        inputMode: mode,
        analysisMode: effectiveMode,
        summary: res.summary,
        warning: res.warning,
        recommendations: res.recommendations,
        selectedIds: res.recommendations.map((r) => r.pluginId),
        recommendedPackId: res.recommendedPackId,
        confidenceLevel: res.confidenceLevel,
        preflightChecks: res.preflightChecks,
        setupWarnings: res.setupWarnings,
        notRecommended: res.notRecommended,
      });

      return res;
    },
    []
  );

  const restoreFromHistory = useCallback((entry: HistoryEntry) => {
    const res =
      entry.summary !== undefined || entry.warning !== undefined
        ? {
            summary: entry.summary ?? "",
            recommendations: entry.recommendations,
            warning: entry.warning ?? null,
            inputText: entry.inputText,
            recommendedPackId: entry.recommendedPackId,
            confidenceLevel: entry.confidenceLevel,
            preflightChecks: entry.preflightChecks,
            setupWarnings: entry.setupWarnings,
            notRecommended: entry.notRecommended,
          }
        : recommend(entry.inputText);

    setResult(res);
    setCurrentMode(entry.analysisMode ?? "keyword");
    const s: Record<string, boolean> = {};
    entry.selectedIds.forEach((id) => {
      s[id] = true;
    });
    setSel(s);
    setDetailPlugin(null);
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
    aiAvailable,
    currentMode,
  };
}

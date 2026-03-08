"use client";

import { useState, useCallback, useEffect } from "react";
import { recommend } from "@/lib/recommend";
import { saveHistory } from "@/lib/history";
import type { AnalysisResult, AnalysisMode, HistoryEntry, Plugin } from "@/lib/types";

type Step = "input" | "analyzing" | "result";
type InputMode = "text" | "file" | "github";

export function useAnalysis() {
  const [step, setStep] = useState<Step>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [detailPlugin, setDetailPlugin] = useState<Plugin | null>(null);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [currentMode, setCurrentMode] = useState<AnalysisMode>("keyword");

  // Check if AI analysis is available
  useEffect(() => {
    fetch("/api/analyze", { method: "POST", body: JSON.stringify({ text: "" }) })
      .then((r) => {
        // 503 = no API key, 400 = valid endpoint (key exists)
        setAiAvailable(r.status !== 503);
      })
      .catch(() => setAiAvailable(false));
  }, []);

  const handleAnalyze = useCallback(
    async (content: string, mode: InputMode = "text", analysisMode: AnalysisMode = "keyword") => {
      setStep("analyzing");

      let res: AnalysisResult;
      let effectiveMode: AnalysisMode = analysisMode;

      if (analysisMode === "ai") {
        try {
          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: content }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);
          res = data;
        } catch {
          // Fallback to keyword analysis
          effectiveMode = "keyword";
          res = recommend(content);
        }
      } else {
        await new Promise((r) => setTimeout(r, 700));
        res = recommend(content);
      }

      setCurrentMode(effectiveMode);
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
        analysisMode: effectiveMode,
        summary: res.summary,
        warning: res.warning,
        recommendations: res.recommendations,
        selectedIds: res.recommendations.map((r) => r.pluginId),
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

"use client";

import { useState, useCallback } from "react";
import { PLUGINS } from "@/lib/plugins";
import { recommend } from "@/lib/recommend";
import { getConflicts } from "@/lib/conflicts";
import type { AnalysisResult, Plugin } from "@/lib/types";
import InputPanel from "./InputPanel";
import PluginCard from "./PluginCard";
import PluginModal from "./PluginModal";
import ConflictWarning from "./ConflictWarning";
import InstallScript from "./InstallScript";

type Step = "input" | "analyzing" | "result";

export default function PluginAdvisorApp() {
  const [step, setStep] = useState<Step>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [detailPlugin, setDetailPlugin] = useState<Plugin | null>(null);

  const handleAnalyze = useCallback(async (content: string) => {
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
  }, []);

  const reset = () => {
    setStep("input");
    setResult(null);
    setSel({});
    setDetailPlugin(null);
  };

  const selectedIds = Object.keys(sel).filter((k) => sel[k]);
  const conflicts = getConflicts(selectedIds);

  return (
    <>
      <PluginModal plugin={detailPlugin} onClose={() => setDetailPlugin(null)} />

      {/* Header */}
      <div className="flex flex-col items-start justify-between border-b border-[#121224] px-4 py-4 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent shadow-[0_0_8px_#3030FF]" />
          <span className="font-heading text-[11px] font-extrabold tracking-[1.5px] sm:text-[13px] sm:tracking-[2.5px]">
            PLUGIN ADVISOR
          </span>
          <span className="hidden rounded-[3px] border border-[#181848] bg-[#080820] px-1.5 py-0.5 text-[9px] text-accent sm:inline">
            Claude Code · {Object.keys(PLUGINS).length} plugins
          </span>
        </div>
        {step === "result" && (
          <button
            onClick={reset}
            className="mt-2 rounded border border-border-main px-3 py-1.5 font-mono text-[10px] text-text-sub hover:border-[#30306A] hover:text-[#CCC] sm:mt-0"
          >
            ← 다시
          </button>
        )}
      </div>

      <div className="mx-auto max-w-[660px] px-4 py-8 sm:px-5">
        {/* INPUT */}
        {step === "input" && (
          <div className="animate-fade-in">
            <h1 className="mb-1.5 font-heading text-[18px] font-extrabold sm:text-[22px]">
              어떤 걸 만들고 있나요?
            </h1>
            <p className="mb-5 text-[11px] leading-[1.8] text-[#484860] sm:mb-6">
              PRD, README, 프로젝트 설명을 넣으면 최적의 플러그인 조합을
              찾아드려요.{" "}
              <span className="text-accent">API 호출 없이 즉시</span> 분석해요.
            </p>
            <InputPanel onAnalyze={handleAnalyze} disabled={false} />
            <div className="mt-4 flex flex-wrap gap-[5px]">
              {Object.values(PLUGINS).map((p) => (
                <span
                  key={p.id}
                  onClick={() => setDetailPlugin(p)}
                  className="cursor-pointer rounded-[3px] px-1.5 py-0.5 text-[9px] font-bold tracking-wide"
                  style={{
                    color: p.color,
                    background: p.color + "14",
                    border: `1px solid ${p.color}28`,
                  }}
                >
                  {p.tag}
                </span>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-[#303048]">
              ↑ 태그 클릭하면 플러그인 상세 볼 수 있어요
            </div>
          </div>
        )}

        {/* ANALYZING */}
        {step === "analyzing" && (
          <div className="py-[70px] text-center">
            <div className="text-accent">
              <span className="mx-[3px] inline-block animate-blink text-[22px]">●</span>
              <span className="mx-[3px] inline-block animate-blink text-[22px] [animation-delay:0.2s]">●</span>
              <span className="mx-[3px] inline-block animate-blink text-[22px] [animation-delay:0.4s]">●</span>
            </div>
            <div className="mt-4 font-heading text-[15px] font-extrabold">
              분석 중...
            </div>
            <div className="text-[11px] text-[#383850]">
              키워드 매칭 & 플러그인 조합 계산 중
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && result && (
          <div className="animate-fade-in">
            {/* Summary */}
            <div className="mb-4 rounded-[9px] border border-border-main bg-card px-4 py-3.5">
              <div className="mb-1.5 text-[9px] tracking-[2px] text-accent">
                PROJECT SUMMARY
              </div>
              <div className="text-[13px] leading-[1.7]">{result.summary}</div>
            </div>

            {/* Conflicts */}
            <ConflictWarning conflicts={conflicts} />

            {/* General warning */}
            {result.warning && !conflicts.length && (
              <div className="mb-3.5 rounded-[5px] border border-[#281C00] bg-[#100D00] px-3 py-2 text-[11px] text-warning">
                ⚠ {result.warning}
              </div>
            )}

            <div className="mb-2 text-[9px] tracking-[2px] text-[#383850]">
              추천 조합 — 원하는 것만 선택
            </div>

            {/* Plugin cards */}
            <div className="mb-5 flex flex-col gap-[7px]">
              {result.recommendations.map((rec) => {
                const p = PLUGINS[rec.pluginId];
                if (!p) return null;
                return (
                  <PluginCard
                    key={p.id}
                    plugin={p}
                    recommendation={rec}
                    selected={!!sel[rec.pluginId]}
                    inConflict={conflicts.some(
                      (c) =>
                        c.ids.includes(p.id) && selectedIds.includes(p.id)
                    )}
                    onToggle={() =>
                      setSel((s) => ({ ...s, [p.id]: !s[p.id] }))
                    }
                    onDetail={() => setDetailPlugin(p)}
                  />
                );
              })}
            </div>

            {/* Install script */}
            <InstallScript selectedIds={selectedIds} />
          </div>
        )}
      </div>
    </>
  );
}

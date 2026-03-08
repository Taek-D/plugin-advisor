"use client";

import { useState, useEffect } from "react";
import { PLUGINS } from "@/lib/plugins";
import { getConflicts } from "@/lib/conflicts";
import { useAnalysis } from "@/hooks/useAnalysis";
import { fetchVersions } from "@/lib/versions";
import type { VersionInfo } from "@/lib/types";
import InputPanel from "./InputPanel";
import PluginCard from "./PluginCard";
import PluginModal from "./PluginModal";
import ConflictWarning from "./ConflictWarning";
import InstallScript from "./InstallScript";
import HistoryPanel from "./HistoryPanel";
import FavoritesPanel from "./FavoritesPanel";

type Panel = "input" | "history" | "favorites";

export default function PluginAdvisorApp() {
  const {
    step,
    result,
    selectedIds,
    detailPlugin,
    setDetailPlugin,
    handleAnalyze,
    restoreFromHistory,
    reset,
    togglePlugin,
    sel,
  } = useAnalysis();

  const [panel, setPanel] = useState<Panel>("input");
  const [versions, setVersions] = useState<Record<string, VersionInfo>>({});
  const conflicts = getConflicts(selectedIds);

  useEffect(() => {
    if (step === "result" && result) {
      const ids = result.recommendations.map((r) => r.pluginId);
      fetchVersions(ids).then(setVersions);
    }
  }, [step, result]);

  return (
    <>
      <PluginModal
        plugin={detailPlugin}
        onClose={() => setDetailPlugin(null)}
        version={detailPlugin ? versions[detailPlugin.id] : undefined}
      />

      {step === "result" && (
        <div className="px-4 pt-2 sm:px-6">
          <button
            onClick={reset}
            className="rounded border border-border-main px-3 py-1.5 font-mono text-[10px] text-text-sub hover:border-[#30306A] hover:text-[#CCC]"
          >
            ← 다시 분석
          </button>
        </div>
      )}

      <div className="mx-auto max-w-[660px] px-4 py-8 sm:px-5">
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

            <div className="mb-4 flex gap-1.5">
              {([
                { key: "input" as const, label: "분석" },
                { key: "history" as const, label: "기록" },
                { key: "favorites" as const, label: "즐겨찾기" },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPanel(tab.key)}
                  className={`rounded-[5px] border px-3 py-[7px] font-mono text-[11px] tracking-wide transition-all ${
                    panel === tab.key
                      ? "border-[#30306A] bg-[#101028] text-[#CCC]"
                      : "border-border-main bg-transparent text-text-sub hover:border-[#30306A] hover:text-[#CCC]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {panel === "input" && (
              <>
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
              </>
            )}

            {panel === "history" && (
              <HistoryPanel onRestore={restoreFromHistory} />
            )}

            {panel === "favorites" && <FavoritesPanel />}
          </div>
        )}

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

        {step === "result" && result && (
          <div className="animate-fade-in">
            <div className="mb-4 rounded-[9px] border border-border-main bg-card px-4 py-3.5">
              <div className="mb-1.5 text-[9px] tracking-[2px] text-accent">
                PROJECT SUMMARY
              </div>
              <div className="text-[13px] leading-[1.7]">{result.summary}</div>
            </div>

            <ConflictWarning conflicts={conflicts} />

            {result.warning && !conflicts.length && (
              <div className="mb-3.5 rounded-[5px] border border-[#281C00] bg-[#100D00] px-3 py-2 text-[11px] text-warning">
                ⚠ {result.warning}
              </div>
            )}

            <div className="mb-2 text-[9px] tracking-[2px] text-[#383850]">
              추천 조합 — 원하는 것만 선택
            </div>

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
                    onToggle={() => togglePlugin(p.id)}
                    onDetail={() => setDetailPlugin(p)}
                    version={versions[p.id]}
                  />
                );
              })}
            </div>

            <InstallScript selectedIds={selectedIds} />
          </div>
        )}
      </div>
    </>
  );
}

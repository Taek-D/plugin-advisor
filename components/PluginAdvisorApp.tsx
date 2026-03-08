"use client";

import { useState, useEffect } from "react";
import { Sparkles, AlertTriangle, Info, Plus, Hand } from "lucide-react";
import { PLUGINS } from "@/lib/plugins";
import { getConflicts } from "@/lib/conflicts";
import { useAnalysis } from "@/hooks/useAnalysis";
import { fetchVersions } from "@/lib/versions";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { VersionInfo, Plugin } from "@/lib/types";
import type { PresetPack } from "@/lib/presets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import InputPanel from "./InputPanel";
import PluginCard from "./PluginCard";
import PluginModal from "./PluginModal";
import ConflictWarning from "./ConflictWarning";
import InstallScript from "./InstallScript";
import HistoryPanel from "./HistoryPanel";
import FavoritesPanel from "./FavoritesPanel";
import PresetPacks from "./PresetPacks";
import OnboardingFlow from "./OnboardingFlow";

type Panel = "input" | "history" | "favorites";

export default function PluginAdvisorApp() {
  const { t } = useI18n();
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
    aiAvailable,
    currentMode,
  } = useAnalysis();

  const [panel, setPanel] = useState<Panel>("input");
  const [versions, setVersions] = useState<Record<string, VersionInfo>>({});
  const [selectedPack, setSelectedPack] = useState<PresetPack | null>(null);

  const handleDetailPlugin = (p: Plugin | null) => {
    setDetailPlugin(p);
    if (p) trackEvent("plugin_detail_view", { pluginId: p.id });
  };

  const handlePresetSelect = (pack: PresetPack) => {
    setSelectedPack(pack);
    trackEvent("preset_select", { packId: pack.id });
  };
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
          <Button
            variant="outline"
            size="xs"
            onClick={reset}
          >
            {t.analysis.backToAnalysis}
          </Button>
        </div>
      )}

      <div className="mx-auto max-w-[660px] px-4 py-8 sm:px-5">
        {step === "input" && (
          <div className="animate-fade-in">
            <h1 className="mb-2 font-heading text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
              {t.main.title}
            </h1>
            <p className="mb-6 text-base leading-relaxed text-text-dim sm:mb-8 sm:text-sm">
              {t.main.subtitle}{" "}
              <span className="font-medium text-primary">{t.main.instantBadge}</span>
              {aiAvailable && (
                <span className="ml-1 font-medium text-[#A78BFA]">
                  · <Sparkles className="ml-0.5 inline h-3.5 w-3.5" /> AI
                </span>
              )}
            </p>

            <TabsList className="mb-4">
              {([
                { key: "input" as const, label: t.main.tabAnalysis },
                { key: "history" as const, label: t.main.tabHistory },
                { key: "favorites" as const, label: t.main.tabFavorites },
              ]).map((tab) => (
                <TabsTrigger
                  key={tab.key}
                  active={panel === tab.key}
                  onClick={() => setPanel(tab.key)}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {panel === "input" && (
              selectedPack ? (
                <OnboardingFlow
                  pack={selectedPack}
                  onBack={() => setSelectedPack(null)}
                />
              ) : (
                <>
                  {/* Beginner banner */}
                  <button
                    onClick={() => {
                      const el = document.getElementById("preset-packs");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mb-5 flex w-full cursor-pointer items-center gap-3.5 rounded-md border border-primary/30 bg-primary/5 p-3 text-left transition-colors hover:border-primary/50 hover:bg-primary/10"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                      <Hand className="h-5 w-5 text-primary" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-primary">{t.onboarding.beginnerBanner}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{t.onboarding.beginnerBannerDesc}</div>
                    </div>
                  </button>

                  <InputPanel
                    onAnalyze={handleAnalyze}
                    disabled={false}
                    aiAvailable={aiAvailable}
                  />
                  <div className="mt-5 flex flex-wrap gap-2">
                    {Object.values(PLUGINS).map((p) => (
                      <span
                        key={p.id}
                        onClick={() => handleDetailPlugin(p)}
                        className="cursor-pointer rounded-sm px-2.5 py-2 text-xs font-bold tracking-wide transition-opacity hover:opacity-80 sm:px-2 sm:py-1"
                        style={{
                          color: p.color,
                          background: p.color + "20",
                          border: `1px solid ${p.color}40`,
                        }}
                      >
                        {p.tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2.5 text-sm font-medium text-muted-foreground sm:text-xs">
                    {t.main.tagHint}
                  </div>

                  {/* Preset Packs */}
                  <div id="preset-packs" className="mt-8 border-t border-border pt-6">
                    <PresetPacks onSelect={handlePresetSelect} />
                  </div>
                </>
              )
            )}

            {panel === "history" && (
              <HistoryPanel onRestore={restoreFromHistory} />
            )}

            {panel === "favorites" && <FavoritesPanel />}
          </div>
        )}

        {step === "analyzing" && (
          <div className="animate-fade-in">
            <div className="mb-4 text-center">
              <div className="text-primary">
                <span className="mx-[3px] inline-block animate-blink text-[22px]">●</span>
                <span className="mx-[3px] inline-block animate-blink text-[22px] [animation-delay:0.2s]">●</span>
                <span className="mx-[3px] inline-block animate-blink text-[22px] [animation-delay:0.4s]">●</span>
              </div>
              <div className="mt-3 font-heading text-base font-bold text-foreground">
                {t.analysis.analyzing}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {currentMode === "ai" ? t.analysis.analyzingAiDesc : t.analysis.analyzingDesc}
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <Card className="p-4">
                <div className="mb-2 h-3 w-24 animate-pulse rounded-sm bg-primary/20" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full animate-pulse rounded-sm bg-border" />
                  <div className="h-3 w-3/4 animate-pulse rounded-sm bg-border" />
                </div>
              </Card>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex gap-3">
                    <div className="h-5 w-5 animate-pulse rounded-sm bg-border" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-28 animate-pulse rounded-sm bg-border" />
                        <div className="h-4 w-14 animate-pulse rounded-sm bg-border" />
                      </div>
                      <div className="h-3 w-full animate-pulse rounded-sm bg-border" />
                      <div className="h-3 w-2/3 animate-pulse rounded-sm bg-border" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === "result" && result && (
          <div className="animate-fade-in">
            <Card className="mb-5 px-5 py-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-medium tracking-wide text-text-dim">
                  {t.analysis.projectSummary}
                </span>
                {currentMode === "ai" && (
                  <Badge
                    className="border-transparent bg-[#7C3AED]/10 text-[#A78BFA]"
                  >
                    AI
                  </Badge>
                )}
              </div>
              <div className="text-sm leading-relaxed text-foreground">{result.summary}</div>
            </Card>

            <ConflictWarning conflicts={conflicts} />

            {result.warning && !conflicts.length && (
              <div className="mb-4 rounded-md border border-border-warning-subtle bg-bg-warning-subtle px-4 py-3 text-sm text-warning">
                <span className="inline-flex items-center gap-2">
                  <AlertTriangle className="inline h-4 w-4 flex-shrink-0" />
                  {result.warning}
                </span>
              </div>
            )}

            <div className="mb-3 text-xs font-medium tracking-wide text-text-dim">
              {t.analysis.recommendLabel}
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
                    onDetail={() => handleDetailPlugin(p)}
                    version={versions[p.id]}
                  />
                );
              })}
            </div>

            {/* Section divider */}
            {((result.redundancies && result.redundancies.length > 0) ||
              (result.complements && result.complements.length > 0)) && (
              <div className="my-1 border-t border-border" />
            )}

            {/* Redundancy hints */}
            {result.redundancies && result.redundancies.length > 0 && (
              <div className="mb-4 space-y-2.5">
                {result.redundancies.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Info className="inline h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="font-bold text-primary">{t.analysis.redundancyHint}</span>
                      {r.msg}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Complement suggestions */}
            {result.complements && result.complements.length > 0 && (
              <Card className="mb-6 mt-2 p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-wide text-text-dim">
                  <Plus className="h-4 w-4" />
                  {t.analysis.alsoConsider}
                </div>
                <div className="space-y-2.5">
                  {result.complements.map((comp) => {
                    const cp = PLUGINS[comp.pluginId];
                    if (!cp) return null;
                    return (
                      <button
                        key={cp.id}
                        onClick={() => handleDetailPlugin(cp)}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-3 rounded-md border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
                        )}
                      >
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-xs font-bold text-white"
                          style={{ backgroundColor: cp.color }}
                        >
                          +
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground">{cp.name}</span>
                            <Badge
                              className="border-transparent"
                              style={{ color: cp.color, background: cp.color + "18" }}
                            >
                              {cp.tag}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{comp.reason}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}

            <InstallScript selectedIds={selectedIds} />
          </div>
        )}
      </div>
    </>
  );
}

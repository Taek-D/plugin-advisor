"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Sparkles,
  Hand,
  Compass,
  BookOpen,
  LayoutGrid,
  ShieldCheck,
} from "lucide-react";
import { PLUGINS } from "@/lib/plugins";
import { getConflicts } from "@/lib/conflicts";
import { useAnalysis } from "@/hooks/useAnalysis";
import { fetchVersions } from "@/lib/versions";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import type { VersionInfo, Plugin } from "@/lib/types";
import { PRESET_PACKS } from "@/lib/presets";
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
import SetupReadiness from "./SetupReadiness";
import NotRecommendedPanel from "./NotRecommendedPanel";
import LeadCaptureCard from "./LeadCaptureCard";
import ShareResultButton from "./ShareResultButton";

type Panel = "input" | "history" | "favorites";

export default function PluginAdvisorApp() {
  const { locale, t } = useI18n();
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
  const [readyForCopy, setReadyForCopy] = useState(false);

  const conflicts = getConflicts(selectedIds);

  const handleDetailPlugin = (plugin: Plugin | null) => {
    setDetailPlugin(plugin);
    if (plugin) trackEvent("plugin_detail_view", { pluginId: plugin.id });
  };

  const handlePresetSelect = (pack: PresetPack) => {
    setSelectedPack(pack);
    trackEvent("preset_select", { packId: pack.id });
  };

  useEffect(() => {
    if (step === "result" && result) {
      const ids = result.recommendations.map((recommendation) => recommendation.pluginId);
      fetchVersions(ids).then(setVersions);
      setReadyForCopy(false);
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
          <Button variant="outline" size="xs" onClick={reset}>
            {t.analysis.backToAnalysis}
          </Button>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-8">
        {step === "input" && (
          <div className="animate-fade-in">
            <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_20rem]">
              <Card className="surface-panel relative overflow-hidden rounded-[28px] p-6 sm:p-7">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_60%)]" />
                <div className="relative">
                  <div className="mb-3 section-kicker">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {locale === "en" ? "Setup-first workflow" : "세팅 성공 우선 흐름"}
                  </div>

                  <h1 className="mb-2 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {t.main.title}
                  </h1>

                  <p className="text-sm leading-relaxed text-text-dim sm:text-base">
                    {t.main.subtitle}{" "}
                    <span className="font-medium text-primary">
                      {locale === "en"
                        ? "Built to reduce setup failure"
                        : "첫 세팅 실패를 줄이는 데 집중했습니다"}
                    </span>
                    {aiAvailable && (
                      <span className="ml-1 inline-flex items-center gap-1 font-medium text-ai-accent">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI
                      </span>
                    )}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {locale === "en" ? "4 starter packs" : "4개 스타터 팩"}
                    </span>
                    <span className="rounded-full border border-overlay-border bg-overlay-subtle px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {locale === "en" ? "2-3 core recommendations" : "2~3개 핵심 추천"}
                    </span>
                    <span className="rounded-full border border-overlay-border bg-overlay-subtle px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {locale === "en" ? "Checklist before copy" : "복사 전 체크리스트"}
                    </span>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <Card className="surface-panel-soft rounded-[24px] p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <LayoutGrid className="h-4 w-4 text-primary" />
                    {locale === "en" ? "Choose your start" : "시작 경로 고르기"}
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <div>
                      <div className="font-medium text-foreground">
                        {locale === "en" ? "Preset packs" : "프리셋 팩"}
                      </div>
                      <div>
                        {locale === "en"
                          ? "Best when you want the safest quick path."
                          : "가장 안전한 빠른 시작이 필요할 때 적합합니다."}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {locale === "en" ? "Manual diagnosis" : "직접 세팅 진단"}
                      </div>
                      <div>
                        {locale === "en"
                          ? "Best when your project context is already clear."
                          : "프로젝트 맥락이 이미 분명할 때 적합합니다."}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="surface-panel-soft rounded-[24px] p-5">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {locale === "en" ? "Need more context?" : "가이드부터 보고 싶다면"}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === "en"
                      ? "Open the starter guides or check the setup support status before choosing a stack."
                      : "스택을 고르기 전에 스타터 가이드를 먼저 보거나 세팅 지원 상태를 확인할 수 있어요."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/guides"
                      className="rounded-full border border-overlay-border bg-overlay-subtle px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/30"
                    >
                      {locale === "en" ? "Starter guides" : "스타터 가이드"}
                    </Link>
                    <Link
                      href="/services"
                      className="rounded-full border border-overlay-border bg-overlay-subtle px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/30"
                    >
                      {locale === "en" ? "Setup support" : "세팅 지원"}
                    </Link>
                  </div>
                </Card>
              </div>
            </div>

            <div className="no-scrollbar -mx-1 mb-5 overflow-x-auto px-1">
              <TabsList className="w-max min-w-full rounded-full border border-overlay-border bg-card/60 p-1 sm:min-w-0">
                {([
                  { key: "input" as const, label: t.main.tabAnalysis },
                  { key: "history" as const, label: t.main.tabHistory },
                  { key: "favorites" as const, label: t.main.tabFavorites },
                ]).map((tab) => (
                  <TabsTrigger
                    key={tab.key}
                    active={panel === tab.key}
                    className="whitespace-nowrap rounded-full border-transparent px-4 py-2"
                    onClick={() => setPanel(tab.key)}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {panel === "input" &&
              (selectedPack ? (
                <OnboardingFlow pack={selectedPack} onBack={() => setSelectedPack(null)} />
              ) : (
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                  <div className="space-y-6">
                    <button
                      onClick={() => {
                        const element = document.getElementById("preset-packs");
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="flex w-full cursor-pointer items-center gap-3.5 rounded-[24px] border border-primary/25 bg-primary/[0.08] p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/10"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                        <Hand className="h-5 w-5 text-primary" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-primary">
                          {t.onboarding.beginnerBanner}
                        </div>
                        <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {t.onboarding.beginnerBannerDesc}
                        </div>
                      </div>
                    </button>

                    <div id="preset-packs" className="surface-panel-soft rounded-[28px] p-5">
                      <PresetPacks onSelect={handlePresetSelect} />
                    </div>

                    <Card className="surface-panel-soft rounded-[28px] p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <Compass className="h-4 w-4 text-primary" />
                        <div className="text-base font-semibold text-foreground">
                          {locale === "en" ? "Manual setup diagnosis" : "직접 세팅 진단하기"}
                        </div>
                      </div>
                      <InputPanel
                        onAnalyze={handleAnalyze}
                        disabled={false}
                        aiAvailable={aiAvailable}
                      />
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <Card className="surface-panel-soft rounded-[24px] p-5">
                      <div className="mb-2 text-sm font-semibold text-foreground">
                        {locale === "en" ? "Before you choose" : "고르기 전에 기억할 것"}
                      </div>
                      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                        <div>
                          {locale === "en"
                            ? "Start with the shortest stack that solves your immediate task."
                            : "지금 당장 필요한 문제를 푸는 가장 짧은 스택부터 시작하세요."}
                        </div>
                        <div>
                          {locale === "en"
                            ? "Treat account-linked and manual-setup plugins as second-step tools."
                            : "계정 연결이나 수동 설정이 필요한 플러그인은 두 번째 단계 도구로 보는 편이 안전합니다."}
                        </div>
                        <div>
                          {locale === "en"
                            ? "If you are unsure, the beginner pack is usually the safest default."
                            : "헷갈린다면 입문자 기본 팩이 가장 안전한 기본값입니다."}
                        </div>
                      </div>
                    </Card>

                    <Card className="surface-panel-soft rounded-[24px] p-5">
                      <div className="mb-3 text-sm font-semibold text-foreground">
                        {locale === "en" ? "Catalog preview" : "카탈로그 미리보기"}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(PLUGINS).map((plugin) => (
                          <button
                            type="button"
                            key={plugin.id}
                            onClick={() => handleDetailPlugin(plugin)}
                            aria-label={`${plugin.name} 상세 보기`}
                            className="cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold tracking-wide transition-opacity hover:opacity-80"
                            style={{
                              color: plugin.color,
                              background: `${plugin.color}20`,
                              border: `1px solid ${plugin.color}40`,
                            }}
                          >
                            {plugin.tag}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
                        {locale === "en"
                          ? "Use the full catalog only when you need deeper exploration after the first recommendation."
                          : "전체 플러그인 탐색은 첫 추천을 받은 뒤 더 깊게 조정할 때만 보는 편이 좋습니다."}
                      </div>
                    </Card>
                  </div>
                </div>
              ))}

            {panel === "history" && <div className="animate-fade-in"><HistoryPanel onRestore={restoreFromHistory} /></div>}
            {panel === "favorites" && <div className="animate-fade-in"><FavoritesPanel /></div>}
          </div>
        )}

        {step === "analyzing" && (
          <div className="animate-fade-in">
            <div className="mb-4 text-center" role="status" aria-live="polite" aria-label={t.analysis.analyzing}>
              <div className="text-primary">
                <span className="mx-[3px] inline-block animate-blink text-xl">•</span>
                <span className="mx-[3px] inline-block animate-blink text-xl [animation-delay:0.2s]">•</span>
                <span className="mx-[3px] inline-block animate-blink text-xl [animation-delay:0.4s]">•</span>
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
              {[1, 2, 3].map((item) => (
                <Card key={item} className="p-4">
                  <div className="flex gap-4">
                    <div className="mt-0.5 h-6 w-6 flex-shrink-0 animate-pulse rounded-md bg-border" />
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-4 w-28 animate-pulse rounded-sm bg-border" />
                        <div className="h-5 w-14 animate-pulse rounded-full bg-primary/20" />
                      </div>
                      <div className="rounded-2xl border border-overlay-border bg-background/45 p-3">
                        <div className="h-3 w-full animate-pulse rounded-sm bg-border" />
                        <div className="mt-1.5 h-3 w-3/4 animate-pulse rounded-sm bg-border" />
                      </div>
                      <div className="flex gap-1">
                        <div className="h-5 w-12 animate-pulse rounded-full bg-border" />
                        <div className="h-5 w-16 animate-pulse rounded-full bg-border" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === "result" && result && (
          <div className="animate-fade-in">
            <div className="mb-4 flex justify-end">
              <ShareResultButton />
            </div>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
              <div>
                <Card className="surface-panel mb-5 rounded-[28px] px-5 py-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium tracking-wide text-text-dim">
                      {t.analysis.projectSummary}
                    </span>
                    {result.recommendedPackId && (
                      <Badge variant="outline">
                        {(() => {
                          const pack = PRESET_PACKS.find(
                            (candidate) => candidate.id === result.recommendedPackId
                          );
                          if (!pack) return result.recommendedPackId;
                          return locale === "en" ? pack.nameEn : pack.name;
                        })()}
                      </Badge>
                    )}
                    {currentMode === "ai" && (
                      <Badge className="border-transparent bg-ai-accent-strong/10 text-ai-accent">
                        AI
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm leading-relaxed text-foreground">{result.summary}</div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {result.recommendations.length}{" "}
                      {locale === "en" ? "recommendations" : "개 추천"}
                    </span>
                    <span className="rounded-full border border-overlay-border bg-overlay-subtle px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {selectedIds.length}{" "}
                      {locale === "en" ? "selected for setup" : "개 선택됨"}
                    </span>
                    {result.setupWarnings && result.setupWarnings.length > 0 && (
                      <span className="rounded-full border border-warning/20 bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                        {result.setupWarnings.length}{" "}
                        {locale === "en" ? "warnings" : "개 주의사항"}
                      </span>
                    )}
                  </div>
                </Card>

                <ConflictWarning conflicts={conflicts} />

                {result.warning && !conflicts.length && (
                  <div className="mb-4 rounded-[24px] border border-border-warning-subtle bg-bg-warning-subtle px-4 py-3 text-sm text-warning">
                    {result.warning}
                  </div>
                )}

                <div className="mb-3 text-xs font-medium tracking-wide text-text-dim">
                  {t.analysis.recommendLabel}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {locale === "en"
                    ? "Keep the starter stack short. Toggle only the plugins you actually want to install right now."
                    : "처음에는 짧은 스택으로 시작하는 편이 좋습니다. 지금 바로 설치할 항목만 골라서 진행해 보세요."}
                </p>

                <div className="flex flex-col gap-3">
                  {result.recommendations.map((recommendation) => {
                    const plugin = PLUGINS[recommendation.pluginId];
                    if (!plugin) return null;

                    return (
                      <PluginCard
                        key={plugin.id}
                        plugin={plugin}
                        recommendation={recommendation}
                        selected={!!sel[recommendation.pluginId]}
                        inConflict={conflicts.some(
                          (conflict) =>
                            conflict.ids.includes(plugin.id) && selectedIds.includes(plugin.id)
                        )}
                        onToggle={() => togglePlugin(plugin.id)}
                        onDetail={() => handleDetailPlugin(plugin)}
                        version={versions[plugin.id]}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-5 xl:sticky xl:top-24 xl:self-start">
                <div className="order-1">
                  <SetupReadiness
                    confidenceLevel={result.confidenceLevel}
                    checks={result.preflightChecks}
                    warnings={result.setupWarnings}
                    onReadyChange={setReadyForCopy}
                  />
                </div>
                <div className="order-2">
                  <InstallScript selectedIds={selectedIds} readyToCopy={readyForCopy} />
                </div>
                <div className="order-3">
                  <NotRecommendedPanel items={result.notRecommended} />
                </div>
                <div className="order-4">
                  <LeadCaptureCard compact />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

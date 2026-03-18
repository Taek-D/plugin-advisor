"use client";

import { useState, useCallback } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { PLUGINS } from "@/lib/plugins";
import { scorePlugins } from "@/lib/scoring";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Plugin, ItemType } from "@/lib/types";
import type { ScoringResult } from "@/lib/scoring";
import type { ParseResult } from "@/lib/parse-mcp-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import McpPasteInput from "./McpPasteInput";
import PluginTypeInput from "./PluginTypeInput";
import SelectedPluginChips from "./SelectedPluginChips";
import ResultsPanel from "./ResultsPanel";

type InputTab = "paste" | "type";
type AnalysisState = "idle" | "analyzing" | "done";

export default function OptimizerApp() {
  const { t } = useI18n();
  const [selectedPlugins, setSelectedPlugins] = useState<Plugin[]>([]);
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<InputTab>("paste");
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [result, setResult] = useState<ScoringResult | null>(null);

  const handlePasteResult = useCallback((parsed: ParseResult) => {
    const newPlugins: Plugin[] = [];
    for (const id of parsed.matched) {
      const plugin = PLUGINS[id];
      if (plugin) newPlugins.push(plugin);
    }
    setSelectedPlugins((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const additions = newPlugins.filter((p) => !existingIds.has(p.id));
      return [...prev, ...additions];
    });
    setUnmatched(parsed.unmatched);
  }, []);

  const handleAddPlugin = useCallback((pluginId: string) => {
    setSelectedPlugins((prev) => {
      if (prev.some((p) => p.id === pluginId)) return prev;
      const plugin = PLUGINS[pluginId];
      if (!plugin) return prev;
      return [...prev, plugin];
    });
  }, []);

  const handleRemovePlugin = useCallback((pluginId: string) => {
    setSelectedPlugins((prev) => prev.filter((p) => p.id !== pluginId));
  }, []);

  const handleSampleData = useCallback(() => {
    const sampleResult: ParseResult = {
      matched: ["context7", "playwright", "github", "superpowers", "omc"],
      unmatched: [],
    };
    handlePasteResult(sampleResult);
  }, [handlePasteResult]);

  const handleAnalyze = useCallback(() => {
    if (!hasPlugins) return;
    setAnalysisState("analyzing");
    setTimeout(() => {
      const ids = selectedPlugins.map((p) => p.id);
      const types = new Set(selectedPlugins.map((p) => p.type));
      const typeScope: ItemType | "both" =
        types.size === 1
          ? (types.values().next().value as ItemType)
          : "both";
      const scored = scorePlugins(ids, typeScope);
      setResult(scored);
      setAnalysisState("done");
    }, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlugins]);

  const selectedIds = selectedPlugins.map((p) => p.id);
  const hasPlugins = selectedPlugins.length > 0;
  const hasUnmatched = unmatched.length > 0;
  const isEmpty = !hasPlugins && !hasUnmatched;
  const isAnalyzing = analysisState === "analyzing";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-8">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="mb-2 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {t.optimizer.pageTitle}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.optimizer.pageSubtitle}
            </p>
          </div>
          <Button
            variant="outline"
            disabled
            aria-disabled="true"
            title={t.optimizer.aiComingSoon}
            className="shrink-0 cursor-not-allowed opacity-60 border-white/10"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {t.optimizer.aiComingSoon}
          </Button>
        </div>

        {/* Input section */}
        <Card className="surface-panel mb-6 rounded-[28px] p-5 sm:p-6">
          <div className="mb-5">
            <TabsList className="w-max rounded-full border border-white/10 bg-card/60 p-1">
              <TabsTrigger
                active={activeTab === "paste"}
                className="whitespace-nowrap rounded-full border-transparent px-4 py-2"
                onClick={() => setActiveTab("paste")}
              >
                {t.optimizer.tabPaste}
              </TabsTrigger>
              <TabsTrigger
                active={activeTab === "type"}
                className="whitespace-nowrap rounded-full border-transparent px-4 py-2"
                onClick={() => setActiveTab("type")}
              >
                {t.optimizer.tabType}
              </TabsTrigger>
            </TabsList>
          </div>
          {activeTab === "paste" && (
            <McpPasteInput onParsed={handlePasteResult} />
          )}
          {activeTab === "type" && (
            <PluginTypeInput onSelect={handleAddPlugin} selectedIds={selectedIds} />
          )}
        </Card>

        {/* Selected plugins */}
        {hasPlugins && (
          <div className="mb-6">
            <SelectedPluginChips plugins={selectedPlugins} onRemove={handleRemovePlugin} />
          </div>
        )}

        {/* Unmatched tokens */}
        {hasUnmatched && (
          <div className="mb-6">
            <div className="mb-2 text-xs font-medium tracking-wide text-muted-foreground">
              {t.optimizer.unrecognizedPlugins}
            </div>
            <div className="flex flex-wrap gap-2">
              {unmatched.map((token) => (
                <Badge key={token} variant="outline" className="border-white/10 text-muted-foreground">
                  {token}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="mb-6 flex flex-col items-center gap-3 rounded-[24px] border border-dashed border-white/10 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">{t.optimizer.emptyState}</p>
            <Button variant="outline" size="sm" onClick={handleSampleData} className="border-white/10">
              {t.optimizer.sampleBtn}
            </Button>
          </div>
        )}

        {/* Analyze button */}
        <div className="flex justify-end">
          <Button
            disabled={!hasPlugins || isAnalyzing}
            onClick={handleAnalyze}
            className={cn("px-6", (!hasPlugins || isAnalyzing) && "cursor-not-allowed opacity-60")}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.optimizer.analyzing}
              </>
            ) : hasPlugins ? (
              t.optimizer.analyzeBtn
            ) : (
              t.optimizer.analyzeBtnDisabled
            )}
          </Button>
        </div>

        {/* Results */}
        {analysisState === "done" && result && (
          <ResultsPanel result={result} />
        )}
      </div>
    </div>
  );
}

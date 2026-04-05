"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Terminal,
  Lightbulb,
  HelpCircle,
  Square,
  CheckSquare,
} from "lucide-react";
import type { PresetPack } from "@/lib/presets";
import { PLUGINS } from "@/lib/plugins";
import { useI18n } from "@/lib/i18n";
import { pluginDescEn } from "@/lib/i18n/plugins-en";
import { PACK_FIRST_RUN } from "@/lib/first-run-tips";
import { getManualSetupPlugins, getSafeCopyPlugins } from "@/lib/setup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  pack: PresetPack;
  onBack: () => void;
};

export default function OnboardingFlow({ pack, onBack }: Props) {
  const { locale, t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [checkedCmds, setCheckedCmds] = useState<Set<number>>(new Set());
  const [troubleshootOpen, setTroubleshootOpen] = useState(false);
  const [openTroubleshootIdx, setOpenTroubleshootIdx] = useState<number | null>(null);

  const plugins = pack.pluginIds.map((id) => PLUGINS[id]).filter(Boolean);
  const packName = locale === "en" ? pack.nameEn : pack.name;

  const safePlugins = getSafeCopyPlugins(pack.pluginIds);
  const manualPlugins = getManualSetupPlugins(pack.pluginIds);
  const allCommands = safePlugins.flatMap((p) => p.install);
  const totalCmds = allCommands.length;
  const doneCmds = checkedCmds.size;

  const packTips = PACK_FIRST_RUN[pack.id];
  const tryPrompt = locale === "en" ? packTips?.tryPromptEn : packTips?.tryPrompt;
  const tips = packTips?.tips ?? [];

  const copyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(allCommands.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copyPromptText = () => {
    if (!tryPrompt) return;
    const raw = tryPrompt.replace(/^[""]|[""]$/g, "");
    navigator.clipboard.writeText(raw);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const toggleChecked = (idx: number) => {
    setCheckedCmds((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const toggleTroubleshootItem = (idx: number) => {
    setOpenTroubleshootIdx((prev) => (prev === idx ? null : idx));
  };

  const steps = [
    { label: packName, num: 1 },
    { label: t.onboarding.stepInstall, num: 2 },
    { label: t.onboarding.stepDone, num: 3 },
  ];

  const troubleshootItems = [
    {
      q: t.onboarding.troubleshootItems.cmdNotWork,
      a: t.onboarding.troubleshootItems.cmdNotWorkAnswer,
    },
    {
      q: t.onboarding.troubleshootItems.pluginNotVisible,
      a: t.onboarding.troubleshootItems.pluginNotVisibleAnswer,
    },
    {
      q: t.onboarding.troubleshootItems.permissionError,
      a: t.onboarding.troubleshootItems.permissionErrorAnswer,
    },
  ];

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="mb-4 flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        {t.onboarding.backToPresets}
      </button>

      {/* Step indicator */}
      <nav aria-label="온보딩 단계" className="mb-6">
        <ol className="flex items-center gap-2">
          {steps.map((step, i) => (
            <li key={i} className="flex items-center gap-2" aria-current={i === currentStep ? "step" : undefined}>
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground"
                )}
                aria-hidden="true"
              >
                {i < currentStep ? <Check className="h-3 w-3" /> : step.num}
              </div>
              <span
                className={cn(
                  "text-xs",
                  i === currentStep ? "font-bold text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
              {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-text-faint" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </nav>

      {/* Step 0: Overview */}
      {currentStep === 0 && (
        <div className="animate-fade-in">
          <div className="mb-4 space-y-2.5">
            {plugins.map((plugin, i) => {
              const desc =
                locale === "en"
                  ? pluginDescEn[plugin.id]?.desc || plugin.desc
                  : plugin.desc;
              return (
                <Card
                  key={plugin.id}
                  className="p-3"
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-sm text-xs font-bold text-primary-foreground"
                      style={{ backgroundColor: plugin.color }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-heading text-sm font-semibold">{plugin.name}</span>
                    <Badge
                      className="border-transparent"
                      style={{ color: plugin.color, background: plugin.color + "18" }}
                    >
                      {plugin.tag}
                    </Badge>
                  </div>
                  <p className="ml-7 text-xs leading-[1.7] text-muted-foreground sm:text-sm">{desc}</p>
                </Card>
              );
            })}
          </div>
          <Button
            onClick={() => setCurrentStep(1)}
            className="w-full py-3"
          >
            {t.onboarding.stepInstall} <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 1: Install guide */}
      {currentStep === 1 && (
        <div className="animate-fade-in">
          {/* Guide box */}
          <div className="mb-4 rounded-md border border-primary/20 bg-primary/5 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary">
              <Terminal className="h-3.5 w-3.5" />
              {t.onboarding.installGuideTitle}
            </div>
            <ol className="space-y-1 text-xs leading-[1.8] text-muted-foreground">
              <li>1. {t.onboarding.installGuideStep1}</li>
              <li>2. {t.onboarding.installGuideStep2}</li>
              <li>3. {t.onboarding.installGuideStep3}</li>
              <li>4. {t.onboarding.installGuideStep4}</li>
            </ol>
          </div>

          {/* Progress indicator */}
          {totalCmds > 0 && (
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {doneCmds}/{totalCmds} {t.onboarding.installProgress}
              </span>
              <div className="flex gap-0.5">
                {allCommands.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 w-4 rounded-full transition-colors",
                      checkedCmds.has(i) ? "bg-primary" : "bg-border"
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Commands per plugin */}
          <div className="mb-4 space-y-2.5">
            {safePlugins.map((plugin) => (
              <div
                key={plugin.id}
                className="rounded-md border border-border bg-background p-3"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Badge
                    className="border-transparent"
                    style={{ color: plugin.color, background: plugin.color + "18" }}
                  >
                    {plugin.tag}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{plugin.name}</span>
                </div>
                <div className="space-y-1.5">
                  {plugin.install.map((cmd, i) => {
                    const globalIdx = allCommands.indexOf(cmd);
                    const isDone = checkedCmds.has(globalIdx);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <button
                          onClick={() => toggleChecked(globalIdx)}
                          className="shrink-0 cursor-pointer text-text-faint transition-colors hover:text-primary"
                          aria-label={isDone ? "Mark as not done" : "Mark as done"}
                        >
                          {isDone ? (
                            <CheckSquare className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <Square className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <code
                          className={cn(
                            "flex-1 overflow-x-auto text-xs transition-colors",
                            isDone ? "text-text-faint line-through" : "text-muted-foreground"
                          )}
                        >
                          {cmd}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={() => copyCommand(cmd, globalIdx)}
                        >
                          {copiedIdx === globalIdx ? (
                            <Check className="h-3 w-3 text-primary" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {manualPlugins.length > 0 && (
            <Card className="mb-4 p-3">
              <div className="mb-2 text-xs font-semibold text-foreground">
                {locale === "en"
                  ? "Manual or account setup required"
                  : "수동 확인 또는 계정 연결이 필요한 플러그인"}
              </div>
              <div className="space-y-3">
                {manualPlugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Badge
                        className="border-transparent"
                        style={{ color: plugin.color, background: plugin.color + "18" }}
                      >
                        {plugin.tag}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{plugin.name}</span>
                    </div>
                    <div className="space-y-1.5">
                      {plugin.install.map((cmd, i) => (
                        <div key={i} className="rounded-md border border-border px-2.5 py-2">
                          <code className="block overflow-x-auto text-xs text-muted-foreground">{cmd}</code>
                        </div>
                      ))}
                    </div>
                    {(plugin.prerequisites.length > 0 || plugin.requiredSecrets.length > 0) && (
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {plugin.prerequisites.map((item) => (
                          <div key={`${plugin.id}-${item}`}>• {item}</div>
                        ))}
                        {plugin.requiredSecrets.map((item) => (
                          <div key={`${plugin.id}-${item}`}>• {item}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Troubleshooting section */}
          <Card className="mb-4">
            <button
              onClick={() => setTroubleshootOpen((v) => !v)}
              className="flex w-full cursor-pointer items-center justify-between px-3.5 py-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="h-3.5 w-3.5" />
                {t.onboarding.troubleshooting}
              </span>
              {troubleshootOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
            {troubleshootOpen && (
              <div className="animate-fade-in border-t border-border px-3.5 pb-3 pt-2">
                <p className="mb-2.5 text-xs text-text-faint">
                  {t.onboarding.troubleshootingHint}
                </p>
                <div className="space-y-1.5">
                  {troubleshootItems.map((item, idx) => (
                    <div key={idx} className="rounded-md border border-border bg-background">
                      <button
                        onClick={() => toggleTroubleshootItem(idx)}
                        className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span>{item.q}</span>
                        {openTroubleshootIdx === idx ? (
                          <ChevronUp className="h-3 w-3 shrink-0" />
                        ) : (
                          <ChevronDown className="h-3 w-3 shrink-0" />
                        )}
                      </button>
                      {openTroubleshootIdx === idx && (
                        <p className="animate-fade-in px-3 pb-2.5 text-xs leading-[1.7] text-muted-foreground">
                          {item.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Copy all + Next */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 py-3"
              onClick={copyAll}
            >
              {copiedAll ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-primary" />
                  {t.installScript.copyDone}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <Copy className="h-3.5 w-3.5" />
                  {t.installScript.copy}
                </span>
              )}
            </Button>
            <Button
              onClick={() => setCurrentStep(2)}
              className="flex-1 py-3"
            >
              {t.onboarding.stepDone} <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Done + What's Next */}
      {currentStep === 2 && (
        <div className="animate-fade-in">
          {/* Success header */}
          <div className="mb-6 py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-2 font-heading text-base font-bold">{t.onboarding.stepDone}</h3>
            <p className="text-sm text-muted-foreground">{t.onboarding.stepDoneDesc}</p>
          </div>

          {/* What's Next section */}
          {packTips && (
            <div className="mb-4">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-primary" />
                <span className="font-heading text-xs font-semibold text-foreground">
                  {t.onboarding.whatsNext}
                </span>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">{t.onboarding.whatsNextDesc}</p>

              {/* Try this prompt */}
              <div className="mb-4 rounded-md border border-primary/20 bg-primary/5 p-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-dim">
                  {t.onboarding.tryThisPrompt}
                </p>
                <p className="mb-3 font-mono text-sm text-foreground">{tryPrompt}</p>
                <button
                  onClick={copyPromptText}
                  className="flex cursor-pointer items-center gap-1.5 text-xs text-primary transition-colors hover:underline"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="h-3 w-3" />
                      {t.installScript.copyDone}
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      {t.onboarding.copyPrompt}
                    </>
                  )}
                </button>
              </div>

              {/* Tips list */}
              <div className="space-y-2">
                {tips.map((tip, i) => {
                  const title = locale === "en" ? tip.titleEn : tip.title;
                  const desc = locale === "en" ? tip.descEn : tip.desc;
                  return (
                    <Card
                      key={i}
                      className="p-3"
                    >
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold text-foreground">{title}</span>
                        {tip.command && (
                          <code className="shrink-0 rounded-sm bg-background px-2 py-0.5 text-xs font-mono text-text-faint">
                            {tip.command}
                          </code>
                        )}
                      </div>
                      <p className="text-xs leading-[1.7] text-muted-foreground">{desc}</p>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back button */}
          <Button
            variant="outline"
            className="w-full py-2.5"
            onClick={onBack}
          >
            {t.onboarding.backToPresets}
          </Button>
        </div>
      )}
    </div>
  );
}

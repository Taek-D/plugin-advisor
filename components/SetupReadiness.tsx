"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, AlertTriangle, CheckSquare, Square } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";
import type { PreflightCheck, SetupWarning } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  confidenceLevel?: "high" | "medium" | "low";
  checks?: PreflightCheck[];
  warnings?: SetupWarning[];
  onReadyChange?: (ready: boolean) => void;
};

export default function SetupReadiness({
  confidenceLevel = "medium",
  checks = [],
  warnings = [],
  onReadyChange,
}: Props) {
  const { locale } = useI18n();
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  useEffect(() => {
    setCheckedIds([]);
  }, [checks]);

  const requiredIds = useMemo(
    () => checks.filter((check) => check.required).map((check) => check.id),
    [checks]
  );

  const isReady =
    requiredIds.length === 0 ||
    requiredIds.every((checkId) => checkedIds.includes(checkId));

  const requiredCheckedCount = requiredIds.filter((checkId) =>
    checkedIds.includes(checkId)
  ).length;

  useEffect(() => {
    onReadyChange?.(isReady);
    if (isReady && requiredIds.length > 0) {
      trackEvent("preflight_checked", { requiredChecks: requiredIds.length });
    }
  }, [isReady, onReadyChange, requiredIds.length]);

  const confidenceCopy = {
    high: locale === "en" ? "High confidence" : "추천 신뢰도 높음",
    medium: locale === "en" ? "Medium confidence" : "추천 신뢰도 보통",
    low: locale === "en" ? "Low confidence" : "추천 신뢰도 낮음",
  };

  return (
    <Card className="surface-panel-soft rounded-[24px] p-5">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          {locale === "en" ? "Before you install" : "설치 전 체크리스트"}
        </div>
        <Badge variant="outline" className="text-primary">
          {confidenceCopy[confidenceLevel]}
        </Badge>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {locale === "en"
          ? "Check the blockers that apply before copying any verified commands."
          : "검증된 명령을 복사하기 전에, 실제로 막힐 수 있는 조건부터 먼저 확인해 주세요."}
      </p>

      {checks.length === 0 ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-3 py-3 text-sm leading-relaxed text-muted-foreground">
          {locale === "en"
            ? "No required blockers were detected for this starter stack. You can move on to the verified install commands."
            : "이 스타터 스택에서는 필수로 막히는 조건이 감지되지 않았습니다. 바로 검증된 설치 명령으로 넘어가도 됩니다."}
        </div>
      ) : (
        <div className="space-y-2">
          {checks.map((check) => {
            const checked = checkedIds.includes(check.id);

            return (
              <button
                key={check.id}
                type="button"
                onClick={() =>
                  setCheckedIds((current) =>
                    current.includes(check.id)
                      ? current.filter((id) => id !== check.id)
                      : [...current, check.id]
                  )
                }
                className={`flex w-full items-start gap-2 rounded-2xl border px-3 py-3 text-left transition-colors hover:border-primary/40 ${
                  checked
                    ? "border-primary/20 bg-primary/7"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {checked ? (
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Square className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}

                <span className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {locale === "en" ? check.labelEn : check.label}
                </span>

                <span className="rounded-full border border-white/10 bg-background/60 px-2 py-1 text-[10px] font-semibold text-text-dim">
                  {check.required
                    ? locale === "en"
                      ? "Required"
                      : "필수"
                    : locale === "en"
                      ? "Optional"
                      : "선택"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-background/40 px-3 py-3 text-xs text-muted-foreground">
        <span>
          {requiredIds.length > 0
            ? locale === "en"
              ? `${requiredCheckedCount}/${requiredIds.length} required checks confirmed`
              : `필수 체크 ${requiredCheckedCount}/${requiredIds.length}개 확인됨`
            : locale === "en"
              ? "No required checks in this flow"
              : "이 흐름에는 필수 체크가 없습니다"}
        </span>

        <span className={isReady ? "font-semibold text-primary" : "font-semibold text-warning"}>
          {isReady
            ? locale === "en"
              ? "Ready for verified copy"
              : "검증된 복사 준비 완료"
            : locale === "en"
              ? "Finish the required checks first"
              : "필수 체크를 먼저 완료해 주세요"}
        </span>
      </div>

      {warnings.length > 0 && (
        <div className="mt-4 space-y-2">
          {warnings.map((warning) => (
            <div
              key={warning.id}
              className="rounded-2xl border border-warning/20 bg-warning/5 px-3 py-3 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                {locale === "en" ? warning.messageEn : warning.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

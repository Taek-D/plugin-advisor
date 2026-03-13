"use client";

import { useState, useRef, useCallback, DragEvent } from "react";
import { useI18n } from "@/lib/i18n";
import type { AnalysisMode } from "@/lib/types";
import { FileText, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type InputMode = "text" | "file" | "github";

type Props = {
  onAnalyze: (text: string, mode: InputMode, analysisMode: AnalysisMode) => void;
  disabled: boolean;
  aiAvailable: boolean;
};

export default function InputPanel({ onAnalyze, disabled, aiAvailable }: Props) {
  const { locale, t } = useI18n();
  const [mode, setMode] = useState<InputMode>("text");
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("keyword");
  const [text, setText] = useState("");
  const [ghUrl, setGhUrl] = useState("");
  const [fname, setFname] = useState("");
  const [fcontent, setFcontent] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const dragCounter = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback((file: File) => {
    setFname(file.name);
    const reader = new FileReader();
    reader.onload = (event) => setFcontent((event.target?.result as string) ?? "");
    reader.readAsText(file);
  }, []);

  const handleFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      readFile(file);
    },
    [readFile]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragCounter.current = 0;
      setDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (!file) return;
      setMode("file");
      readFile(file);
    },
    [readFile]
  );

  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current += 1;
    setDragging(true);
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setDragging(false);
  }, []);

  const canGo =
    (mode === "text" && text.trim()) ||
    (mode === "file" && fcontent) ||
    (mode === "github" && ghUrl.trim());

  const modeHint =
    mode === "text"
      ? locale === "en"
        ? "Paste a README, issue, PRD, or a short project note."
        : "README, 이슈, PRD, 짧은 프로젝트 설명을 그대로 붙여 넣어도 됩니다."
      : mode === "file"
        ? locale === "en"
          ? "Markdown and plain text work best for a first pass."
          : "첫 진단은 Markdown이나 txt 파일이 가장 안정적으로 동작합니다."
        : locale === "en"
          ? "Use a public GitHub repository URL. If fetch fails, paste the README text instead."
          : "공개 GitHub 저장소 URL을 넣어주세요. 가져오기에 실패하면 README 텍스트를 직접 붙여 넣는 편이 더 빠릅니다.";

  const handleAnalyze = async () => {
    setErr(null);
    setLoading(true);

    try {
      let content = "";

      if (mode === "text") {
        content = text;
      } else if (mode === "file") {
        content = fcontent;
      } else {
        const response = await fetch("/api/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: ghUrl }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        content = data.content;
      }

      if (!content.trim()) throw new Error(t.input.noContent);
      onAnalyze(content, mode, analysisMode);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "text" as const, label: t.input.tabText },
    { key: "file" as const, label: t.input.tabFile },
    { key: "github" as const, label: t.input.tabGithub },
  ];

  return (
    <div
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn("relative transition-opacity", loading && "pointer-events-none opacity-60")}
    >
      {dragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-card/90">
          <div className="text-center">
            <FileText className="mx-auto mb-1 h-6 w-6 text-primary" />
            <div className="text-xs font-bold text-primary">{t.input.fileDrop}</div>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
          <TabsList className="w-max min-w-full rounded-full border border-white/10 bg-white/5 p-1 sm:min-w-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.key}
                active={mode === tab.key}
                className="whitespace-nowrap rounded-full border-transparent px-4 py-2"
                onClick={() => setMode(tab.key)}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {aiAvailable && (
          <TabsTrigger
            active={analysisMode === "ai"}
            onClick={() => setAnalysisMode(analysisMode === "keyword" ? "ai" : "keyword")}
            className={cn(
              "w-full justify-center rounded-full border-white/10 bg-white/5 px-4 py-2 lg:w-auto",
              analysisMode === "ai" &&
                "border-[#7C3AED]/50 bg-[#7C3AED]/10 text-[#A78BFA] hover:border-[#7C3AED]/50 hover:text-[#A78BFA]"
            )}
          >
            {analysisMode === "ai" ? (
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                {locale === "en" ? "AI explanation boost" : "AI 설명 보강"}
              </span>
            ) : locale === "en" ? (
              "Add AI explanation"
            ) : (
              "AI 설명 보강 추가"
            )}
          </TabsTrigger>
        )}
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        {locale === "en"
          ? "Use this when you want a quick manual diagnosis instead of starting from a preset pack."
          : "프리셋 대신 프로젝트 설명을 직접 넣고 빠르게 진단받고 싶을 때 사용하세요."}
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span>{modeHint}</span>
      </div>

      {mode === "text" && (
        <>
          <label htmlFor="advisor-text-input" className="sr-only">
            {t.input.placeholder}
          </label>
          <Textarea
            id="advisor-text-input"
            rows={8}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={t.input.placeholder}
            className="min-h-[220px] rounded-2xl border-white/10 bg-background/55 leading-relaxed placeholder:text-text-faint focus-visible:ring-primary"
            style={{ resize: "vertical" }}
          />
        </>
      )}

      {mode === "file" && (
        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-white/10 bg-background/55 p-8 text-center transition-colors hover:border-primary"
        >
          {fname ? (
            <>
              <span className="text-sm font-bold text-primary">{fname}</span>
              <br />
              <div className="mt-1.5 text-xs text-text-dim">{t.input.fileChange}</div>
            </>
          ) : (
            <>
              <FileText className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
              <div className="mb-1 text-sm font-bold text-foreground">{t.input.fileUploadTitle}</div>
              <div className="text-xs text-text-dim">{t.input.fileUploadDesc}</div>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".md,.txt"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      )}

      {mode === "github" && (
        <>
          <label htmlFor="advisor-github-input" className="sr-only">
            {t.input.ghPlaceholder}
          </label>
          <Input
            id="advisor-github-input"
            type="text"
            value={ghUrl}
            onChange={(event) => setGhUrl(event.target.value)}
            placeholder={t.input.ghPlaceholder}
            className="h-auto rounded-2xl border-white/10 bg-background/55 px-4 py-3 text-sm placeholder:text-text-faint focus-visible:ring-primary"
          />
        </>
      )}

      {err && (
        <div className="mt-4 rounded-2xl border border-border-error-subtle bg-bg-error-subtle px-3 py-2.5 text-sm text-destructive">
          <span className="inline-flex items-center gap-2">
            <AlertTriangle className="inline h-4 w-4 flex-shrink-0" />
            {err}
          </span>
        </div>
      )}

      <Button
        onClick={handleAnalyze}
        disabled={!canGo || disabled || loading}
        aria-busy={loading}
        className={cn(
          "mt-5 h-12 w-full rounded-full text-sm font-semibold",
          analysisMode === "ai" && "bg-[#7C3AED] hover:bg-[#7C3AED]/90"
        )}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.input.analyzing || "분석 중..."}
          </span>
        ) : analysisMode === "ai" ? (
          <span className="flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            {locale === "en" ? "DIAGNOSE + AI EXPLAIN" : "진단 + AI 설명 보강"}
          </span>
        ) : locale === "en" ? (
          "START SETUP DIAGNOSIS"
        ) : (
          "세팅 진단 시작"
        )}
      </Button>

      {mode === "github" && (
        <p className="mt-3 text-xs leading-relaxed text-text-dim">
          {locale === "en"
            ? "Tip: when the repository is private or the README is thin, text input usually gives a better first recommendation."
            : "팁: 비공개 저장소이거나 README가 짧으면, 텍스트 입력으로 직접 설명하는 편이 첫 추천 품질이 더 좋습니다."}
        </p>
      )}
    </div>
  );
}

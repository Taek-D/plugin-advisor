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
  const { t } = useI18n();
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

  const readFile = useCallback((f: File) => {
    setFname(f.name);
    const reader = new FileReader();
    reader.onload = (ev) => setFcontent(ev.target?.result as string);
    reader.readAsText(f);
  }, []);

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      readFile(f);
    },
    [readFile],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      dragCounter.current = 0;
      setDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (!f) return;
      setMode("file");
      readFile(f);
    },
    [readFile],
  );

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current++;
    setDragging(true);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  }, []);

  const canGo =
    (mode === "text" && text.trim()) ||
    (mode === "file" && fcontent) ||
    (mode === "github" && ghUrl.trim());

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
        const res = await fetch("/api/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: ghUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        content = data.content;
      }
      if (!content.trim()) throw new Error(t.input.noContent);
      onAnalyze(content, mode, analysisMode);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setErr(msg);
      setMode("text");
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
      className="relative"
    >
      {dragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md border-2 border-dashed border-primary bg-card/90">
          <div className="text-center">
            <FileText className="mx-auto mb-1 h-6 w-6 text-primary" />
            <div className="text-xs font-bold text-primary">{t.input.fileDrop}</div>
          </div>
        </div>
      )}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              active={mode === tab.key}
              onClick={() => setMode(tab.key)}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {aiAvailable && (
          <TabsTrigger
            active={analysisMode === "ai"}
            onClick={() => setAnalysisMode(analysisMode === "keyword" ? "ai" : "keyword")}
            className={cn(
              analysisMode === "ai" &&
                "border-[#7C3AED]/50 bg-[#7C3AED]/10 text-[#A78BFA] hover:border-[#7C3AED]/50 hover:text-[#A78BFA]"
            )}
          >
            {analysisMode === "ai" ? <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" />{t.input.aiMode}</span> : t.input.keywordMode}
          </TabsTrigger>
        )}
      </div>

      {mode === "text" && (
        <Textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.input.placeholder}
          className="leading-relaxed placeholder:text-text-faint focus-visible:ring-primary"
          style={{ resize: "vertical" }}
        />
      )}

      {mode === "file" && (
        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer rounded-md border-2 border-dashed border-border bg-card p-8 text-center transition-colors hover:border-primary"
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
        <Input
          type="text"
          value={ghUrl}
          onChange={(e) => setGhUrl(e.target.value)}
          placeholder={t.input.ghPlaceholder}
          className="h-auto px-4 py-3 text-sm placeholder:text-text-faint focus-visible:ring-primary"
        />
      )}

      {err && (
        <div className="mt-4 rounded-md border border-border-error-subtle bg-bg-error-subtle px-3 py-2.5 text-sm text-destructive">
          <span className="inline-flex items-center gap-2"><AlertTriangle className="inline h-4 w-4 flex-shrink-0" />{err}</span>
        </div>
      )}

      <Button
        onClick={handleAnalyze}
        disabled={!canGo || disabled || loading}
        aria-busy={loading}
        className={cn(
          "mt-4 w-full py-3 text-sm font-semibold",
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
            AI ANALYZE → RECOMMEND
          </span>
        ) : (
          t.input.analyzeBtn
        )}
      </Button>
    </div>
  );
}

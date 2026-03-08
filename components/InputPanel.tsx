"use client";

import { useState, useRef, useCallback, DragEvent } from "react";
import { useI18n } from "@/lib/i18n";
import type { AnalysisMode } from "@/lib/types";

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
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-accent bg-[#080810]/90">
          <div className="text-center">
            <div className="mb-1 text-2xl">📄</div>
            <div className="text-xs font-bold text-accent">{t.input.fileDrop}</div>
          </div>
        </div>
      )}
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMode(tab.key)}
              className={`rounded-[5px] border px-3.5 py-[7px] font-mono text-[11px] tracking-wide transition-all ${
                mode === tab.key
                  ? "border-[#30306A] bg-[#101028] text-[#CCC]"
                  : "border-border-main bg-transparent text-text-sub hover:border-[#30306A] hover:text-[#CCC]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {aiAvailable && (
          <button
            onClick={() => setAnalysisMode(analysisMode === "keyword" ? "ai" : "keyword")}
            className={`rounded-[5px] border px-3 py-[7px] font-mono text-[10px] tracking-wide transition-all ${
              analysisMode === "ai"
                ? "border-[#7C3AED] bg-[#7C3AED]/10 text-[#A78BFA]"
                : "border-border-main text-text-sub hover:border-[#30306A] hover:text-[#CCC]"
            }`}
          >
            {analysisMode === "ai" ? `✦ ${t.input.aiMode}` : t.input.keywordMode}
          </button>
        )}
      </div>

      {mode === "text" && (
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.input.placeholder}
          className="w-full rounded-md border border-border-main bg-card px-3 py-3 font-mono text-xs leading-[1.7] text-[#CCC] outline-none transition-colors placeholder:text-[#252540] focus:border-accent"
          style={{ resize: "vertical" }}
        />
      )}

      {mode === "file" && (
        <div
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer rounded-[7px] border-2 border-dashed border-border-main p-7 text-center transition-all hover:border-accent hover:bg-card"
        >
          {fname ? (
            <>
              <span className="text-xs text-success">{fname}</span>
              <br />
              <span className="text-[10px] text-[#333]">{t.input.fileChange}</span>
            </>
          ) : (
            <>
              <div className="mb-1.5 text-lg">📄</div>
              <div className="mb-1 text-xs">{t.input.fileUploadTitle}</div>
              <div className="text-[10px] text-[#333]">{t.input.fileUploadDesc}</div>
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
        <input
          type="text"
          value={ghUrl}
          onChange={(e) => setGhUrl(e.target.value)}
          placeholder={t.input.ghPlaceholder}
          className="w-full rounded-md border border-border-main bg-card px-3 py-3 font-mono text-xs text-[#CCC] outline-none transition-colors placeholder:text-[#252540] focus:border-accent"
        />
      )}

      {err && (
        <div className="mt-2.5 rounded-[5px] border border-[#301010] bg-[#120808] px-3 py-2 text-[11px] text-[#FF6060]">
          ⚠ {err}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!canGo || disabled}
        className={`mt-3 w-full rounded-[7px] px-3 py-3.5 font-mono text-xs font-bold tracking-[1.5px] text-white transition-all hover:opacity-85 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-30 ${
          analysisMode === "ai"
            ? "bg-gradient-to-br from-[#7C3AED] to-[#EC4899]"
            : "bg-gradient-to-br from-accent to-[#7C3AED]"
        }`}
      >
        {analysisMode === "ai" ? "✦ AI ANALYZE → RECOMMEND" : t.input.analyzeBtn}
      </button>
    </div>
  );
}

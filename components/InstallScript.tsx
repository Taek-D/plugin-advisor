"use client";

import { useState } from "react";
import { PLUGINS } from "@/lib/plugins";

type Props = {
  selectedIds: string[];
};

export default function InstallScript({ selectedIds }: Props) {
  const [copied, setCopied] = useState(false);

  if (!selectedIds.length) return null;

  const script = [
    "# Claude Code 플러그인 설치 스크립트",
    "# Claude Code 터미널에서 순서대로 실행하세요",
    "",
    ...selectedIds.flatMap((id) => {
      const p = PLUGINS[id];
      return p ? [`# ── ${p.name}`, ...p.install, ""] : [];
    }),
  ].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[9px] border border-[#121224] bg-[#040408] p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="text-[9px] tracking-[2px] text-[#383850]">
          INSTALL SCRIPT
        </div>
        <button
          onClick={handleCopy}
          className="min-h-[44px] rounded-[5px] bg-gradient-to-br from-success to-accent px-5 py-2 font-mono text-[11px] font-bold tracking-wide text-white hover:opacity-85 sm:min-h-0"
        >
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap text-[11px] leading-[1.9] text-[#666]">
        {script}
      </pre>
      <div className="mt-2.5 rounded-[5px] bg-[#07070E] px-3 py-2 text-[10px] leading-relaxed text-[#383850]">
        💡 Claude Code 터미널에서 위 명령어를 순서대로 실행하세요. 설치 후{" "}
        <code className="text-accent">claude</code> 재시작이 필요할 수 있어요.
      </div>
    </div>
  );
}

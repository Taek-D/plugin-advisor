"use client";

import { useState, useEffect } from "react";
import { getHistory, deleteHistory, clearHistory } from "@/lib/history";
import type { HistoryEntry } from "@/lib/types";

type Props = {
  onRestore: (entry: HistoryEntry) => void;
};

export default function HistoryPanel({ onRestore }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    getHistory().then(setEntries);
  }, []);

  const handleDelete = async (id: string) => {
    await deleteHistory(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClear = async () => {
    await clearHistory();
    setEntries([]);
  };

  if (!entries.length) {
    return (
      <div className="rounded-[9px] border border-border-main bg-card px-4 py-8 text-center">
        <div className="mb-2 text-[9px] tracking-[2px] text-[#383850]">
          HISTORY
        </div>
        <div className="text-[11px] text-text-sub">분석 기록이 없어요</div>
        <div className="mt-1 text-[10px] text-[#303048]">
          분석을 실행하면 자동으로 저장돼요
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[9px] tracking-[2px] text-[#383850]">
          HISTORY ({entries.length})
        </div>
        <button
          onClick={handleClear}
          className="rounded border border-border-main px-2 py-1 font-mono text-[9px] text-text-sub hover:border-error hover:text-error"
        >
          전체 삭제
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="group cursor-pointer rounded-[7px] border border-border-main bg-card p-3 transition-colors hover:border-[#28285A]"
            onClick={() => onRestore(entry)}
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="rounded bg-[#101028] px-1.5 py-0.5 text-[9px] text-accent">
                {entry.inputMode.toUpperCase()}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-[#303048]">
                  {new Date(entry.date).toLocaleDateString("ko-KR")}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                  className="hidden text-[11px] text-text-sub hover:text-error group-hover:inline"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="mb-1 truncate text-[11px] text-[#888]">
              {entry.inputText.slice(0, 200)}
            </div>
            <div className="text-[10px] text-[#404050]">
              {entry.recommendations.length}개 추천 · {entry.selectedIds.length}
              개 선택
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { getHistory, deleteHistory, clearHistory } from "@/lib/history";
import { useI18n } from "@/lib/i18n";
import type { HistoryEntry } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  onRestore: (entry: HistoryEntry) => void;
};

export default function HistoryPanel({ onRestore }: Props) {
  const { locale, t } = useI18n();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteHistory(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClear = () => {
    clearHistory();
    setEntries([]);
  };

  if (!entries.length) {
    return (
      <Card className="px-4 py-8 text-center">
        <div className="mb-2 text-xs tracking-[2px] text-text-dim">
          HISTORY
        </div>
        <div className="py-10 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-dim">
            <Clock className="h-5 w-5" />
          </div>
          <div className="text-sm text-muted-foreground">{t.history.empty}</div>
          <div className="mt-1 text-xs text-muted-foreground">{t.history.emptyHint}</div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs tracking-[2px] text-text-dim">
          HISTORY ({entries.length})
        </div>
        <Button
          variant="outline"
          size="xs"
          onClick={handleClear}
          className="hover:border-destructive hover:text-destructive"
        >
          {t.history.delete}
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {entries.map((entry) => (
          <Card
            key={entry.id}
            className="group cursor-pointer p-3 transition-colors hover:border-muted-foreground"
            onClick={() => onRestore(entry)}
          >
            <div className="mb-1 flex items-center justify-between">
              <Badge>
                {entry.inputMode.toUpperCase()}
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-dim">
                  {new Date(entry.date).toLocaleDateString(
                    locale === "en" ? "en-US" : "ko-KR"
                  )}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                  className="hidden text-xs text-muted-foreground transition-colors hover:text-destructive group-hover:inline"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="mb-1 truncate text-xs text-muted-foreground">
              {entry.inputText.slice(0, 200)}
            </div>
            <div className="text-xs text-text-dim">
              {entry.recommendations.length} {locale === "en" ? "recommended" : "개 추천"} · {entry.selectedIds.length}{" "}
              {locale === "en" ? "selected" : "개 선택"}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

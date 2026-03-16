"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PLUGINS } from "@/lib/plugins";
import { parseMcpList } from "@/lib/parse-mcp-list";
import { useI18n } from "@/lib/i18n";
import type { ParseResult } from "@/lib/parse-mcp-list";

type McpPasteInputProps = {
  onParsed: (result: ParseResult) => void;
};

export default function McpPasteInput({ onParsed }: McpPasteInputProps) {
  const { t } = useI18n();
  const [text, setText] = useState("");

  function handleParse() {
    if (!text.trim()) return;
    const result = parseMcpList(text, Object.keys(PLUGINS));
    onParsed(result);
    setText("");
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        {t.optimizer.pasteLabel}
      </label>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.optimizer.pastePlaceholder}
        rows={6}
        className="resize-none border-white/10 bg-white/5 font-mono text-sm"
      />
      <Button
        onClick={handleParse}
        disabled={!text.trim()}
        variant="outline"
        className="border-white/10"
      >
        {t.optimizer.parseBtn}
      </Button>
    </div>
  );
}

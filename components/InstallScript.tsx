"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { PLUGINS } from "@/lib/plugins";
import { saveFavorite } from "@/lib/favorites";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  selectedIds: string[];
};

export default function InstallScript({ selectedIds }: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [favName, setFavName] = useState("");
  const [saved, setSaved] = useState(false);

  if (!selectedIds.length) return null;

  const script = [
    t.installScript.scriptComment1,
    t.installScript.scriptComment2,
    "",
    ...selectedIds.flatMap((id) => {
      const p = PLUGINS[id];
      return p ? [`# ── ${p.name}`, ...p.install, ""] : [];
    }),
  ].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    trackEvent("script_copy", { pluginCount: selectedIds.length });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveFavorite = () => {
    if (!favName.trim()) return;
    saveFavorite(favName.trim(), selectedIds);
    trackEvent("favorite_save", { pluginCount: selectedIds.length });
    setSaved(true);
    setSaving(false);
    setFavName("");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="p-4">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-medium tracking-wide text-text-dim">
          {t.installScript.title}
        </div>
        <div className="flex items-center gap-2">
          {saving ? (
            <div className="flex items-center gap-1.5">
              <Input
                type="text"
                value={favName}
                onChange={(e) => setFavName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveFavorite()}
                placeholder={t.installScript.comboName}
                className="h-8 w-[120px] text-xs"
                autoFocus
              />
              <Button
                variant="outline"
                size="xs"
                onClick={handleSaveFavorite}
                disabled={!favName.trim()}
                className="font-bold"
              >
                {t.installScript.save}
              </Button>
              <button
                onClick={() => setSaving(false)}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                ×
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="xs"
              onClick={() => (saved ? undefined : setSaving(true))}
            >
              {saved ? t.installScript.saved : t.installScript.saveFavorite}
            </Button>
          )}
          <Button
            onClick={handleCopy}
            size="sm"
            className="min-h-[44px] sm:min-h-0"
          >
            <span className="flex items-center gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t.installScript.copyDone : t.installScript.copy}
            </span>
          </Button>
        </div>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap text-[13px] leading-[1.9] sm:text-xs">
        {script.split("\n").map((line, i) => (
          <span key={i} className={line.startsWith("#") ? "text-text-faint" : "text-muted-foreground"}>
            {line}
            {"\n"}
          </span>
        ))}
      </pre>
      <div className="mt-2.5 flex items-start gap-2.5 rounded-md border border-primary/20 bg-primary/5 px-3 py-3">
        <Terminal className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span className="text-xs leading-relaxed text-muted-foreground">
          {t.installScript.guide}
        </span>
      </div>
    </Card>
  );
}

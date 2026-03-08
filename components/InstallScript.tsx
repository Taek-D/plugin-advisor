"use client";

import { useState } from "react";
import { PLUGINS } from "@/lib/plugins";
import { saveFavorite } from "@/lib/favorites";
import { useI18n } from "@/lib/i18n";

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
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveFavorite = async () => {
    if (!favName.trim()) return;
    await saveFavorite(favName.trim(), selectedIds);
    setSaved(true);
    setSaving(false);
    setFavName("");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="rounded-[9px] border border-[#121224] bg-[#040408] p-4">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[9px] tracking-[2px] text-[#383850]">
          {t.installScript.title}
        </div>
        <div className="flex items-center gap-2">
          {saving ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={favName}
                onChange={(e) => setFavName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveFavorite()}
                placeholder={t.installScript.comboName}
                className="w-[120px] rounded border border-border-main bg-card px-2 py-1.5 font-mono text-[10px] text-[#CCC] outline-none focus:border-accent"
                autoFocus
              />
              <button
                onClick={handleSaveFavorite}
                disabled={!favName.trim()}
                className="rounded-[5px] bg-accent/20 px-3 py-1.5 font-mono text-[9px] font-bold text-accent hover:bg-accent/30 disabled:opacity-30"
              >
                {t.installScript.save}
              </button>
              <button
                onClick={() => setSaving(false)}
                className="text-[11px] text-text-sub hover:text-[#CCC]"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              onClick={() => (saved ? undefined : setSaving(true))}
              className="rounded-[5px] border border-border-main px-3 py-1.5 font-mono text-[9px] text-text-sub hover:border-accent hover:text-accent sm:py-2"
            >
              {saved ? t.installScript.saved : t.installScript.saveFavorite}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="min-h-[44px] rounded-[5px] bg-gradient-to-br from-success to-accent px-5 py-2 font-mono text-[11px] font-bold tracking-wide text-white hover:opacity-85 sm:min-h-0"
          >
            {copied ? t.installScript.copyDone : t.installScript.copy}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap text-[11px] leading-[1.9] text-[#666]">
        {script}
      </pre>
      <div className="mt-2.5 rounded-[5px] bg-[#07070E] px-3 py-2 text-[10px] leading-relaxed text-[#383850]">
        {t.installScript.guide}
      </div>
    </div>
  );
}

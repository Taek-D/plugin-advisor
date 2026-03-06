"use client";

import { useEffect } from "react";
import type { Plugin } from "@/lib/types";
import { PLUGINS } from "@/lib/plugins";

type Props = {
  plugin: Plugin | null;
  onClose: () => void;
};

export default function PluginModal({ plugin, onClose }: Props) {
  useEffect(() => {
    if (!plugin) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [plugin, onClose]);

  if (!plugin) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5"
      onClick={onClose}
    >
      <div
        className="animate-fade-in fixed inset-0 flex flex-col overflow-y-auto rounded-none border border-[#252545] bg-[#0D0D1E] p-6 md:static md:max-h-[80vh] md:max-w-[500px] md:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-base font-extrabold">
              {plugin.name}
            </span>
            <span
              className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-bold tracking-wide"
              style={{
                color: plugin.color,
                background: plugin.color + "20",
              }}
            >
              {plugin.tag}
            </span>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] bg-transparent text-lg text-text-sub"
          >
            ×
          </button>
        </div>

        <p className="mb-4 text-xs leading-[1.8] text-[#888]">
          {plugin.longDesc}
        </p>

        <div className="mb-3.5">
          <div className="mb-2 text-[9px] tracking-[2px] text-[#444]">
            주요 기능
          </div>
          <div className="flex flex-wrap gap-1.5">
            {plugin.features.map((f, i) => (
              <span
                key={i}
                className="rounded px-2 py-[3px] text-[10px]"
                style={{
                  color: plugin.color,
                  background: plugin.color + "15",
                  border: `1px solid ${plugin.color}30`,
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {plugin.conflicts.length > 0 && (
          <div className="mb-3.5 rounded-md border border-[#301010] bg-[#120808] px-3 py-2.5 text-[11px] text-[#FF6060]">
            ⚠{" "}
            <strong>
              {plugin.conflicts.map((c) => PLUGINS[c]?.name).join(", ")}
            </strong>
            와 함께 사용 시 충돌 가능성이 있어요.
          </div>
        )}

        <a
          href={plugin.url}
          target="_blank"
          rel="noreferrer"
          className="mt-auto block rounded-md p-2.5 text-center text-[11px] tracking-wide no-underline"
          style={{
            color: plugin.color,
            background: plugin.color + "20",
            border: `1px solid ${plugin.color}40`,
          }}
        >
          GitHub / 공식 페이지 →
        </a>
      </div>
    </div>
  );
}

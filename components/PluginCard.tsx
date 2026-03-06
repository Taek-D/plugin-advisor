"use client";

import type { Plugin, Recommendation } from "@/lib/types";
import HighlightedText from "./HighlightedText";

type Props = {
  plugin: Plugin;
  recommendation: Recommendation;
  selected: boolean;
  inConflict: boolean;
  onToggle: () => void;
  onDetail: () => void;
};

export default function PluginCard({
  plugin,
  recommendation,
  selected,
  inConflict,
  onToggle,
  onDetail,
}: Props) {
  return (
    <div
      className={`rounded-[9px] border bg-card p-4 transition-colors ${
        inConflict
          ? "border-error bg-[#120808]"
          : selected
            ? "border-current"
            : "border-border-main hover:border-[#28285A]"
      }`}
      style={{ color: selected ? plugin.color : undefined }}
    >
      <div className="flex gap-3">
        <div
          onClick={onToggle}
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-[3px] border-2 transition-all sm:h-[15px] sm:w-[15px] ${
            selected ? "border-current bg-current" : "border-[#252545]"
          }`}
          style={
            selected
              ? { borderColor: plugin.color, backgroundColor: plugin.color }
              : undefined
          }
        >
          {selected && (
            <span className="text-[9px] font-bold text-white">✓</span>
          )}
        </div>

        <div className="flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-[7px]">
            <span
              onClick={onDetail}
              className="cursor-pointer font-heading text-xs font-extrabold"
            >
              {plugin.name}
            </span>
            <span
              className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-bold tracking-wide"
              style={{
                color: plugin.color,
                background: plugin.color + "18",
              }}
            >
              {plugin.tag}
            </span>
            {recommendation.priority === 1 && (
              <span className="rounded-[3px] bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-accent">
                CORE
              </span>
            )}
            {inConflict && (
              <span className="rounded-[3px] bg-error/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-error">
                ⚡ 충돌
              </span>
            )}
            <button
              onClick={onDetail}
              className="rounded border border-[#202038] px-2 py-1 font-mono text-[9px] tracking-wide text-[#444] transition-all hover:border-current hover:text-current"
              style={
                { "--tw-text-opacity": 1, color: undefined } as React.CSSProperties
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = plugin.color)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#202038")
              }
            >
              상세 보기
            </button>
          </div>

          <div className="mb-1.5 text-[11px] leading-[1.7] text-[#777]">
            <HighlightedText
              text={recommendation.reason}
              keywords={recommendation.matchedKeywords}
              color={plugin.color}
            />
          </div>

          {recommendation.matchedKeywords.length > 0 && (
            <div className="mb-1">
              {recommendation.matchedKeywords.slice(0, 5).map((kw, i) => (
                <span
                  key={i}
                  className="mr-0.5 mb-0.5 inline-block rounded-[3px] border border-accent/20 bg-accent/10 px-[7px] py-0.5 text-[10px] text-[#7070FF]"
                >
                  {kw}
                </span>
              ))}
              {recommendation.matchedKeywords.length > 5 && (
                <span className="mr-0.5 mb-0.5 inline-block rounded-[3px] border border-accent/20 bg-accent/10 px-[7px] py-0.5 text-[10px] text-[#7070FF]">
                  +{recommendation.matchedKeywords.length - 5}
                </span>
              )}
            </div>
          )}

          <div className="text-[10px] text-[#404050]">{plugin.desc}</div>
        </div>
      </div>
    </div>
  );
}

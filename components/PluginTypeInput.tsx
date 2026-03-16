"use client";

import { useState, useRef, useCallback } from "react";
import { PLUGINS } from "@/lib/plugins";
import { filterPlugins } from "@/lib/parse-mcp-list";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { Plugin } from "@/lib/types";

type PluginTypeInputProps = {
  onSelect: (pluginId: string) => void;
  selectedIds: string[];
};

export default function PluginTypeInput({
  onSelect,
  selectedIds,
}: PluginTypeInputProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const allPlugins = Object.values(PLUGINS);
  const suggestions = filterPlugins(query, allPlugins).filter(
    (p) => !selectedIds.includes(p.id)
  );

  const selectPlugin = useCallback(
    (plugin: Plugin) => {
      onSelect(plugin.id);
      setQuery("");
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onSelect]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "ArrowDown" && suggestions.length > 0) {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev >= suggestions.length - 1 ? 0 : prev + 1
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev <= 0 ? suggestions.length - 1 : prev - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          selectPlugin(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    setHighlightedIndex(-1);
  }

  function handleBlur() {
    blurTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }, 200);
  }

  function handleFocus() {
    if (query.length > 0) setIsOpen(true);
  }

  function handleSuggestionMouseDown(plugin: Plugin) {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    selectPlugin(plugin);
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {t.optimizer.typeLabel}
      </label>
      <div className="relative">
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={t.optimizer.typePlaceholder}
          className="border-white/10 bg-white/5"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0
              ? `plugin-option-${highlightedIndex}`
              : undefined
          }
        />

        {isOpen && suggestions.length > 0 && (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-card shadow-lg"
          >
            {suggestions.map((plugin, index) => (
              <div
                key={plugin.id}
                id={`plugin-option-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseDown={() => handleSuggestionMouseDown(plugin)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                  index === highlightedIndex
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: plugin.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {plugin.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {plugin.category}
                    </span>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {plugin.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

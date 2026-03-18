---
phase: 11-catalog-tab-ui
plan: "01"
subsystem: catalog-ui
tags: [ui, filtering, url-sync, i18n, tabs]
dependency_graph:
  requires: []
  provides: [type-tab-filtering, url-state-persistence]
  affects: [components/PluginSearch.tsx, components/PluginGrid.tsx, app/plugins/page.tsx, lib/i18n]
tech_stack:
  added: []
  patterns: [useSearchParams + router.push for URL state, Suspense boundary for client useSearchParams, AND-composed filters]
key_files:
  created: []
  modified:
    - lib/i18n/types.ts
    - lib/i18n/ko.ts
    - lib/i18n/en.ts
    - components/PluginSearch.tsx
    - components/PluginGrid.tsx
    - app/plugins/page.tsx
decisions:
  - Tab labels MCP/Plugin are proper nouns used as-is; only "All" goes through i18n (allTabLabel)
  - Category is NOT reset when switching type tabs (AND composition, locked decision from planning)
  - Suspense boundary required in page.tsx because PluginGrid uses useSearchParams (Next.js constraint)
  - useEffect syncs activeType from searchParams on back/forward navigation (useState initializer only runs once)
  - Type filter applied as first condition in filter chain before category and search
metrics:
  duration_seconds: 207
  completed_date: "2026-03-18"
  tasks_completed: 2
  files_modified: 6
---

# Phase 11 Plan 01: Catalog Type-Tab UI Summary

**One-liner:** All/MCP/Plugin tab row on /plugins with URL ?type= sync and browser back/forward preservation via useSearchParams + router.push.

## What Was Built

Added a type-tab row to the `/plugins` catalog page allowing users to filter the plugin grid by item type (All, MCP, Plugin). The tab selection is persisted in the URL as `?type=mcp` or `?type=plugin`, enabling direct URL access and browser back/forward navigation that restores the correct tab.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | i18n key + PluginSearch tabs rendering | 1354aa1 | lib/i18n/types.ts, ko.ts, en.ts, components/PluginSearch.tsx |
| 2 | PluginGrid state + URL sync + Suspense boundary | 1354aa1 | components/PluginGrid.tsx, app/plugins/page.tsx |

Note: Both tasks committed together as a single atomic unit — Task 1's typecheck verification required Task 2 to pass (PluginGrid needed new props).

## Implementation Details

### i18n Extension
- Added `allTabLabel: string` to `pluginsPage` block in `lib/i18n/types.ts`
- Korean: `"전체"`, English: `"All"`
- MCP and Plugin tab labels are proper nouns, not i18n-translated

### PluginSearch Component
- New props: `activeType: ActiveType`, `onTypeChange: (type: ActiveType) => void`, `typeCounts: { total, mcp, plugin }`
- `TabsList` + three `TabsTrigger` elements inserted between the `Input` and category pills `div`
- `TabsTrigger` uses default `rounded-md` style (rectangular), visually distinct from `rounded-full` category pills

### PluginGrid Component
- Imports `useSearchParams`, `useRouter` from `next/navigation`
- Reads `?type` URL param on init: `initialType = rawType === "mcp" || rawType === "plugin" ? rawType : "all"`
- `useState<ActiveType>(initialType)` for activeType
- `useEffect([searchParams])` syncs activeType when URL changes (handles browser back/forward)
- `handleTypeChange` calls `router.push` to create browser history entries
- Static counts computed once: `totalCount`, `mcpCount`, `pluginCount` from `Object.values(PLUGINS)`
- Type filter is first condition in `filtered` chain, AND-composed with category and search
- Category state is never reset on tab switch

### page.tsx Changes
- `import { Suspense } from "react"` added
- `<PluginGrid />` wrapped in `<Suspense fallback={null}>` (required for `useSearchParams` in Next.js App Router)
- Subtitle updated: "MCP 서버와 Plugin을 탭으로 나누어 탐색하거나, 카테고리별로 필터링할 수 있어요."

## Verification

- `pnpm typecheck`: PASSED (no type errors)
- `pnpm build`: PASSED (clean production build, /plugins renders as Dynamic)
- `pnpm test`: PASSED (125/125 tests, no regressions)

## Deviations from Plan

None — plan executed exactly as written. Tasks 1 and 2 were committed as a single atomic unit because the typecheck verification for Task 1 required Task 2's PluginGrid update to pass (new props had to be supplied).

## Self-Check: PASSED

- [x] `lib/i18n/types.ts` — `allTabLabel` present in `pluginsPage`
- [x] `lib/i18n/ko.ts` — `allTabLabel: "전체"`
- [x] `lib/i18n/en.ts` — `allTabLabel: "All"`
- [x] `components/PluginSearch.tsx` — `TabsTrigger` present, new props accepted
- [x] `components/PluginGrid.tsx` — `activeType` state, `useSearchParams`, `useEffect` sync
- [x] `app/plugins/page.tsx` — `Suspense` boundary wraps `PluginGrid`
- [x] Commit `1354aa1` exists in git log

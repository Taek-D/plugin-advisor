# Phase 11: Catalog Tab UI - Research

**Researched:** 2026-03-18
**Domain:** Next.js App Router URL state + React client component filtering
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### 탭 배치 & 레이아웃
- 검색창 아래, 카테고리 pill 버튼 위에 타입 탭 배치
- 탭과 카테고리 사이 간격: mb-5 (시각적 계층 분리)
- 상위→하위 필터링 계층: 검색 → 타입 탭 → 카테고리 pill → 그리드

#### 탭 스타일
- 기존 TabsTrigger 컴포넌트 재사용 (OptimizerApp과 동일한 사각형 border + bg 스타일)
- 카테고리 pill(rounded-full)과 시각적으로 구분되어 계층이 명확

#### 탭 라벨 & 카운트
- 탭 텍스트는 영문 그대로: All / MCP / Plugin (MCP, Plugin은 고유명사)
- All만 i18n 처리 (한국어: 전체)
- 각 탭에 전체 카운트 배지 표시: All (55) / MCP (42) / Plugin (13)
- 카운트는 카테고리/검색 필터와 무관하게 항상 전체 수 (안정적, 예측 가능)

#### 탭↔카테고리 상호작용
- 탭 전환 시 카테고리 필터 유지 (리셋하지 않음)
- AND 조건: 타입 + 카테고리 조합으로 0건이면 기존 empty state(SearchX 아이콘 + 결과 없음) 재사용
- 카테고리 리셋 버튼 등 추가 UI 불필요

#### URL 상태 관리
- URL query param에 type만 저장: ?type=plugin, ?type=mcp (all이면 param 생략)
- 카테고리는 세션 상태로만 유지 (URL에 포함하지 않음)
- /plugins/[id]에서 뒤로가기 시 탭 상태 보존

#### 페이지 헤더
- 제목 '플러그인 둘러보기' 고정 (탭 전환 시 변경 없음)
- 서브타이틀만 업데이트하여 MCP + Plugin 탭 존재를 반영

### Claude's Discretion
- 서브타이틀 구체적 문구
- empty state 하위 텍스트 (카테고리 리셋 안내 등)
- 검색어와 타입 필터 조합의 세부 UX

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UI-01 | /plugins 페이지에서 MCP \| Plugin 탭으로 분리되어 표시된다 | TabsList + TabsTrigger already exist in components/ui/tabs.tsx; activeType state added to PluginGrid filters Object.values(PLUGINS) by p.type |
| UI-02 | 탭 선택 상태가 URL query param으로 유지되어 뒤로가기 시 보존된다 | useSearchParams + useRouter.push from next/navigation inside PluginGrid ('use client') — server page.tsx passes no props, client component owns URL sync |
</phase_requirements>

---

## Summary

Phase 11 adds an All / MCP / Plugin type-tab row to the `/plugins` catalog page. The implementation is a pure client-side concern: `PluginGrid.tsx` already owns category and search state, so adding `activeType` state there follows the established pattern. URL persistence (`?type=mcp`, `?type=plugin`) uses Next.js `useSearchParams` + `router.push` inside the same client component — there is no server-side `searchParams` prop needed because `app/plugins/page.tsx` is a Server Component that renders `<PluginGrid />` with no props.

The project already ships `components/ui/tabs.tsx` with `TabsList` and `TabsTrigger`, styled exactly as required (rectangular border, `active` prop). `OptimizerApp.tsx` demonstrates the usage pattern verbatim. `ItemType = 'mcp' | 'plugin'` is already defined in `lib/types.ts`. The 13 Plugin-type entries are confirmed by the Phase 9 test in `lib/__tests__/plugins.test.ts`.

i18n impact is minimal: only `pluginsPage.allTabLabel` (한국어: "전체") needs adding because "MCP" and "Plugin" are used as-is. The `Translations` type in `lib/i18n/types.ts` must be extended with that single key; both `ko.ts` and `en.ts` must supply it.

**Primary recommendation:** Add `activeType` state + `useSearchParams`/`router.push` URL sync to `PluginGrid.tsx`; insert `TabsList`/`TabsTrigger` block between the search `<Input>` and the category pills inside `PluginSearch.tsx` (or inline in `PluginGrid.tsx` above `<PluginSearch>`); extend i18n with one key.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next/navigation | Next.js 14 | `useSearchParams`, `useRouter`, `usePathname` | App Router URL state APIs |
| components/ui/tabs.tsx | project | `TabsList`, `TabsTrigger` | Already exists, matches required style |
| lib/types.ts `ItemType` | project | `'mcp' \| 'plugin'` union | Already defined in Phase 8 |
| react useState/useCallback | 18 | local filter state | Matches existing PluginGrid pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lib/i18n (ko.ts / en.ts / types.ts) | project | Tab label i18n | "전체" for the All tab label |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| useSearchParams in PluginGrid | Server Component searchParams prop | Would require converting page.tsx to use `searchParams`, more complexity with no benefit here |
| router.push | router.replace | push preserves back-button history — correct for tab navigation that must survive back from `/plugins/[id]` |

**Installation:** No new packages required.

---

## Architecture Patterns

### File Change Map
```
components/
├── PluginGrid.tsx       # ADD activeType state + URL sync (useSearchParams/router.push)
│                        # ADD filtering: p.type === activeType || activeType === 'all'
│                        # ADD TabsList/TabsTrigger block (above PluginSearch)
└── PluginSearch.tsx     # No structural change needed — tabs live in PluginGrid

lib/i18n/
├── types.ts             # EXTEND pluginsPage with allTabLabel: string
├── ko.ts                # ADD allTabLabel: "전체"
└── en.ts                # ADD allTabLabel: "All"
```

### Pattern 1: URL Sync in Client Component (Next.js App Router)

**What:** `useSearchParams()` reads the current URL params; `router.push()` writes back. Because `PluginGrid` is already `'use client'`, no server boundary crossing is needed.

**When to use:** When a client component needs to reflect its state in the URL for shareability or back-button support, without turning the parent Server Component into a client component.

**Example:**
```typescript
// Inside PluginGrid.tsx ('use client')
import { useSearchParams, useRouter } from "next/navigation";
import type { ItemType } from "@/lib/types";

type ActiveType = ItemType | "all";

export default function PluginGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial type from URL, default to "all"
  const rawType = searchParams.get("type");
  const initialType: ActiveType =
    rawType === "mcp" || rawType === "plugin" ? rawType : "all";

  const [activeType, setActiveType] = useState<ActiveType>(initialType);

  const handleTypeChange = useCallback(
    (type: ActiveType) => {
      setActiveType(type);
      const params = new URLSearchParams(searchParams.toString());
      if (type === "all") {
        params.delete("type");
      } else {
        params.set("type", type);
      }
      router.push(`/plugins?${params.toString()}`);
    },
    [searchParams, router]
  );
  // ...
}
```

### Pattern 2: Static Total Counts (pre-computed, not reactive to filters)

**What:** Count all MCP and Plugin entries once from `Object.values(PLUGINS)` at render time, outside any filter logic. These counts never change per filter.

**Example:**
```typescript
const allPlugins = Object.values(PLUGINS);
const mcpCount = allPlugins.filter((p) => p.type === "mcp").length;   // ~42
const pluginCount = allPlugins.filter((p) => p.type === "plugin").length; // 13
const totalCount = allPlugins.length; // ~55

// Tab label usage:
// `All (${totalCount})` / `MCP (${mcpCount})` / `Plugin (${pluginCount})`
```

### Pattern 3: TabsList + TabsTrigger (OptimizerApp reference)

**What:** The existing `components/ui/tabs.tsx` uses `active` prop on `TabsTrigger`. The catalog tabs use default (rectangular) style — do NOT add `rounded-full` override that OptimizerApp uses.

**Example:**
```typescript
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

<TabsList className="mb-5">
  <TabsTrigger
    active={activeType === "all"}
    onClick={() => handleTypeChange("all")}
  >
    {t.pluginsPage.allTabLabel} ({totalCount})
  </TabsTrigger>
  <TabsTrigger
    active={activeType === "mcp"}
    onClick={() => handleTypeChange("mcp")}
  >
    MCP ({mcpCount})
  </TabsTrigger>
  <TabsTrigger
    active={activeType === "plugin"}
    onClick={() => handleTypeChange("plugin")}
  >
    Plugin ({pluginCount})
  </TabsTrigger>
</TabsList>
```

### Pattern 4: AND Filter Logic

**What:** Type filter and category filter compose with AND. The existing `filtered` derivation in `PluginGrid` adds one more condition.

**Example:**
```typescript
const filtered = allPlugins.filter((p) => {
  if (activeType !== "all" && p.type !== activeType) return false;  // NEW
  if (category !== "all" && p.category !== category) return false;
  if (!search.trim()) return true;
  const q = search.toLowerCase();
  return (
    p.name.toLowerCase().includes(q) ||
    p.desc.toLowerCase().includes(q) ||
    p.keywords.some((kw) => kw.toLowerCase().includes(q))
  );
});
```

### Anti-Patterns to Avoid

- **Resetting category on tab switch:** Locked decision says keep category state. Never call `setCategory("all")` inside `handleTypeChange`.
- **Using server searchParams prop:** Do not add `searchParams` prop to `PluginsPage()`. Keep URL handling in `PluginGrid` (client component).
- **Deriving initial activeType from useState initializer only:** The initializer only runs once (on mount). Since `useSearchParams()` is reactive, read from it directly at render time and pass as initial value — or use a derived state pattern.
- **Adding rounded-full to tabs:** OptimizerApp overrides to rounded-full for its pill tabs. The catalog tabs MUST use default `rounded-md` (rectangular) to visually distinguish from category pills.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL query param management | Custom history.pushState | `useRouter().push()` from next/navigation | Integrates with Next.js router; handles shallow routing correctly |
| Tab active styling | Custom CSS active class toggling | `TabsTrigger active={...}` | Already encapsulates the border/bg/color logic |
| Type narrowing from URL string | Manual string comparison everywhere | Single guard at read time: `rawType === 'mcp' \|\| rawType === 'plugin' ? rawType : 'all'` | Centralizes validation, prevents invalid state |

---

## Common Pitfalls

### Pitfall 1: useSearchParams Requires Suspense Boundary

**What goes wrong:** Next.js 14 App Router requires `useSearchParams()` to be wrapped in a `<Suspense>` boundary when used in a Server Component tree, or the build/runtime will warn/error.

**Why it happens:** `useSearchParams` is a dynamic API that opts the route into dynamic rendering.

**How to avoid:** Wrap `<PluginGrid />` in `<Suspense fallback={null}>` inside `app/plugins/page.tsx`, OR confirm that `PluginGrid` being a Client Component is sufficient. In Next.js 14 with App Router, a `'use client'` component using `useSearchParams` still needs a Suspense boundary in the parent Server Component.

**Correct pattern in page.tsx:**
```typescript
import { Suspense } from "react";
import PluginGrid from "@/components/PluginGrid";

export default function PluginsPage() {
  return (
    <div className="mx-auto max-w-[960px] px-4 py-8 sm:px-6">
      {/* ... heading ... */}
      <Suspense fallback={null}>
        <PluginGrid />
      </Suspense>
    </div>
  );
}
```

**Warning signs:** Build warning "useSearchParams() should be wrapped in a suspense boundary". Missing Suspense will not break the page but will trigger a Next.js warning and may affect streaming.

### Pitfall 2: router.push vs router.replace for Tab Navigation

**What goes wrong:** Using `router.replace` means tab switches don't create history entries, so the back button skips past them correctly — but then returning from `/plugins/[id]` might not restore the tab.

**Why it happens:** `replace` rewrites the current history entry; `push` creates a new one.

**How to avoid:** Use `router.push` for tab changes. When navigating to `/plugins/[id]`, the browser's back button returns to the last pushed `/plugins?type=...` URL, restoring the tab state from the URL param. This satisfies UI-02.

### Pitfall 3: Static Counts Reflecting Wrong Numbers

**What goes wrong:** Hardcoding counts like `All (55)` will be wrong if the plugin DB changes.

**How to avoid:** Always derive counts from `Object.values(PLUGINS)` at render time. The counts are computed once per render (not per filter), so there is no performance concern.

### Pitfall 4: i18n Type Error

**What goes wrong:** Adding `allTabLabel` to `ko.ts`/`en.ts` without updating `lib/i18n/types.ts` causes TypeScript error because `Translations` type does not include the new key.

**How to avoid:** Update `types.ts` first, then both locale files. Type-check with `pnpm typecheck` before committing.

---

## Code Examples

### Complete PluginGrid.tsx Changes (annotated)

```typescript
"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";  // NEW
import { SearchX } from "lucide-react";
import { PLUGINS } from "@/lib/plugins";
import type { PluginCategory, ItemType } from "@/lib/types";   // ADD ItemType
import { useI18n } from "@/lib/i18n";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";  // NEW
import PluginSearch from "./PluginSearch";
import PluginGridCard from "./PluginGridCard";

type ActiveType = ItemType | "all";

export default function PluginGrid() {
  const { locale, t } = useI18n();
  const searchParams = useSearchParams();                        // NEW
  const router = useRouter();                                    // NEW

  const rawType = searchParams.get("type");
  const initialType: ActiveType =
    rawType === "mcp" || rawType === "plugin" ? rawType : "all";

  const [activeType, setActiveType] = useState<ActiveType>(initialType);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PluginCategory | "all">("all");

  const allPlugins = Object.values(PLUGINS);
  const totalCount = allPlugins.length;
  const mcpCount = allPlugins.filter((p) => p.type === "mcp").length;
  const pluginCount = allPlugins.filter((p) => p.type === "plugin").length;

  const handleTypeChange = useCallback(
    (type: ActiveType) => {
      setActiveType(type);
      const params = new URLSearchParams(searchParams.toString());
      if (type === "all") {
        params.delete("type");
      } else {
        params.set("type", type);
      }
      router.push(`/plugins${params.toString() ? `?${params.toString()}` : ""}`);
    },
    [searchParams, router]
  );

  const handleSearch = useCallback((q: string) => setSearch(q), []);
  const handleCategory = useCallback(
    (c: PluginCategory | "all") => setCategory(c),
    []
  );

  const filtered = allPlugins.filter((p) => {
    if (activeType !== "all" && p.type !== activeType) return false;  // NEW
    if (category !== "all" && p.category !== category) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Type tabs — above search (or between search and category pills) */}
      {/* LOCKED DECISION: search → tabs → category pills */}
      <PluginSearch
        onSearch={handleSearch}
        onCategory={handleCategory}
        activeCategory={category}
        // Tabs are rendered inside PluginGrid, above PluginSearch,
        // or PluginSearch is restructured to accept tabs slot.
        // Simplest: render TabsList here, pass nothing to PluginSearch.
      />
      {/* ... grid or empty state ... */}
    </div>
  );
}
```

**Note on tab placement:** The locked decision places tabs "검색창 아래, 카테고리 pill 위". Since `PluginSearch` renders both the Input and the category pills together, the planner must decide whether to:
- (A) Render `TabsList` in `PluginGrid` between the `<PluginSearch>` internal Input and pills — which requires restructuring `PluginSearch` to accept a render slot, OR
- (B) Render `TabsList` in `PluginGrid` between a split `PluginSearchInput` and `PluginSearchCategories`, OR
- (C) Pass an `activeType`/`onTypeChange` prop to `PluginSearch` and render the tabs inside it.

Option (C) is the lowest-friction change — keeps `PluginSearch` as the single UI control block, adds tab rendering internally, matches the "검색창 아래" placement naturally.

### i18n Extension

```typescript
// lib/i18n/types.ts — extend pluginsPage
pluginsPage: {
  title: string;
  searchPlaceholder: string;
  allCategories: string;
  allTabLabel: string;  // NEW: "전체" / "All"
  noResults: string;
};

// ko.ts
pluginsPage: {
  // ... existing ...
  allTabLabel: "전체",
},

// en.ts
pluginsPage: {
  // ... existing ...
  allTabLabel: "All",
},
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| No type distinction in plugins | `type: 'mcp' \| 'plugin'` field on all Plugin entries | Phase 8 | Enables type filtering |
| No Plugin-type entries | 13 Plugin entries with `type: 'plugin'` via PLUGIN_FIELD_OVERRIDES | Phase 9 | Provides data for Plugin tab |
| Category-only filtering in PluginGrid | Category + type AND filtering | Phase 11 (this phase) | Full compound filter |

**Current data state (confirmed by plugins.test.ts):**
- Total PLUGINS entries: ≥42 + 13 = 55
- MCP entries: 42
- Plugin entries: 13 (omc, superpowers, agency-agents, bkit-starter, bkit, ralph, fireauto, repomix, context7, security, sentry, figma, playwright)

---

## Open Questions

1. **Tab placement implementation approach**
   - What we know: tabs go between search input and category pills; `PluginSearch` currently renders both in one component
   - What's unclear: whether to add tabs inside `PluginSearch` (option C) or split the component
   - Recommendation: Option C (add `activeType`/`onTypeChange` props to `PluginSearch`, render `TabsList` inside between Input and category pills) — single file change, matches existing callback prop pattern

2. **Suspense boundary requirement**
   - What we know: Next.js 14 recommends Suspense wrapping for `useSearchParams` in client components rendered from Server Components
   - What's unclear: whether the current project already has a root Suspense or if it produces a warning without one
   - Recommendation: Add `<Suspense fallback={null}>` around `<PluginGrid />` in `page.tsx` as a safe default; verify with `pnpm build` output

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (vitest.config.ts, environment: node) |
| Config file | vitest.config.ts |
| Quick run command | `pnpm test --run lib/__tests__/plugins.test.ts` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UI-01 | /plugins renders All/MCP/Plugin tabs and filters by type | unit (filter logic) | `pnpm test --run lib/__tests__/catalog-tab.test.ts` | ❌ Wave 0 |
| UI-02 | URL param ?type=plugin initializes Plugin tab; router.push on tab change | manual smoke / unit | manual: open /plugins?type=plugin, verify tab active | N/A |

**Note:** UI-02 is browser-dependent (useSearchParams, router). Automated testing for URL sync requires a browser environment (Playwright or similar), which is out of scope. Verify manually during implementation. UI-01 filter logic (AND condition) can be unit-tested against the filtering function if extracted.

### Sampling Rate
- **Per task commit:** `pnpm typecheck && pnpm lint`
- **Per wave merge:** `pnpm test`
- **Phase gate:** `pnpm build` green + manual browser verify of tab navigation before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `lib/__tests__/catalog-tab.test.ts` — unit test for type-filter AND logic (covers UI-01 filter behavior)
- [ ] No framework install needed — Vitest already configured

---

## Sources

### Primary (HIGH confidence)
- Direct code inspection: `components/ui/tabs.tsx` — TabsList/TabsTrigger API confirmed
- Direct code inspection: `components/PluginGrid.tsx` — existing state/filter pattern confirmed
- Direct code inspection: `components/OptimizerApp.tsx` — TabsList usage pattern confirmed
- Direct code inspection: `lib/types.ts` — ItemType union confirmed
- Direct code inspection: `lib/i18n/types.ts` — Translations shape confirmed
- Direct code inspection: `lib/__tests__/plugins.test.ts` — 13 Plugin-type IDs confirmed
- Direct code inspection: `lib/plugins.ts` (PLUGIN_FIELD_OVERRIDES) — type: 'plugin' assignments confirmed

### Secondary (MEDIUM confidence)
- Next.js 14 App Router docs: `useSearchParams` requires Suspense boundary when used in client components rendered from Server Component pages

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries/components verified by direct code inspection
- Architecture: HIGH — filter pattern is a direct extension of existing PluginGrid logic
- Pitfalls: HIGH (Suspense) / MEDIUM (router.push vs replace) — both are documented Next.js behaviors

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable domain, no fast-moving dependencies)

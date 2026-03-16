# Phase 5: Input & Page Scaffold - Research

**Researched:** 2026-03-16
**Domain:** Next.js 14 App Router page creation, text parsing, autocomplete UI, i18n extension
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- 탭 2개로 분리: "붙여넣기" / "직접 입력" — 기존 advisor의 text/file/github 탭 패턴과 일관
- "분석하기" 버튼은 플러그인 1개 이상 선택 시 활성화
- AI 분석 버튼은 Coming Soon 레이블로 비활성 표시
- 자동완성: 드롭다운 목록 방식 — 타이핑하면 필터링된 플러그인 목록 표시, 클릭으로 선택
- 42개 DB 기반 — Fuse.js 불필요, substring 매칭으로 충분 (Claude 판단)
- 선택된 플러그인: 배지/칩 형태로 가로 나열, X 버튼으로 삭제
- 각 칩에 표시: 플러그인 이름 + 카테고리 아이콘 + 1줄 desc
- verificationStatus 배지는 칩에 표시하지 않음
- 인식 못한 플러그인은 별도 섹션("인식 못한 플러그인")에 이름 나열 — 점수에 미반영
- 초기 화면(빈 상태): "예: claude mcp list 결과를 붙여넣으세요" 안내 + 샘플 버튼
- 기존 /advisor 페이지의 탭 패턴과 시각적 일관성 유지

### Claude's Discretion
- 헤더 디자인 (제목, 아이콘, 설명문)
- 붙여넣기 성공 후 피드백 방식 (즉시 칩 vs 요약+확인)
- 에러 상태 핸들링

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INPUT-01 | 사용자가 `claude mcp list` CLI 결과를 붙여넣으면 플러그인 이름이 자동 추출된다 | Parser regex patterns documented; known format variants covered |
| INPUT-02 | 사용자가 플러그인 이름을 직접 타이핑하면 42개 DB에서 자동완성 제안된다 | PLUGINS object structure confirmed; substring filter pattern documented |
| INPUT-03 | 붙여넣기/타이핑된 플러그인 이름이 alias 정규화로 DB와 매칭된다 | Plugin id/name/tag fields identified; normalization strategy documented |
| PAGE-01 | /optimizer 별도 페이지가 존재하고 네비게이션에서 접근 가능하다 | Nav.tsx links array pattern confirmed; App Router page structure confirmed |
| PAGE-02 | AI 분석 모드가 Coming Soon으로 표시되고 비활성 상태이다 | Coming Soon button pattern identified; disabled + aria pattern established |
| PAGE-03 | /optimizer 페이지가 한국어/영어 다국어를 지원한다 | i18n system fully understood; Translations type extension pattern documented |
</phase_requirements>

---

## Summary

Phase 5 builds the /optimizer page shell with two input modes (paste + type) and bilingual support. The project already has all necessary infrastructure: `useI18n()` hook, `PLUGINS` object (42 entries keyed by id), `shadcn/ui` components (`Button`, `Input`, `Textarea`, `Badge`, `Tabs`), and `Nav.tsx` link array. No new npm packages are needed.

The most technically sensitive piece is the `claude mcp list` output parser (INPUT-01). The output format is undocumented and varies across CLI versions — the STATE.md explicitly flags this as a known pitfall. The parser must handle at least two known format variants and must be a pure function in `lib/parse-mcp-list.ts` so it can be unit-tested in isolation.

Alias normalization (INPUT-03) is solved by a simple normalize function that lowercases, strips common prefixes (`@modelcontextprotocol/server-`, `mcp-`, `@`) and trailing suffixes, then looks up against plugin `id`, `name`, and `tag` fields. With only 42 plugins, substring matching for autocomplete is sufficient — no fuzzy library needed.

**Primary recommendation:** Build all pure logic (`parseMcpList`, `normalizePluginName`, `filterPlugins`) as standalone functions in `lib/` with unit tests before writing any UI, then assemble the page from existing shadcn/ui primitives following the `/advisor` visual pattern.

---

## Standard Stack

### Core (already installed — no new packages)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | ^14.2.0 | Page scaffold at `app/optimizer/page.tsx` | Project framework |
| shadcn/ui (Button, Input, Textarea, Badge) | project | All UI primitives | Already used throughout |
| Tailwind CSS | ^3.4.0 | Styling | Project standard |
| `useI18n()` hook | internal | Bilingual text | Established pattern |
| `PLUGINS` (lib/plugins.ts) | internal | 42-plugin data source for autocomplete | Single source of truth |
| lucide-react | ^0.577.0 | Icons for category display in chips | Already installed |

### No New Packages Required
All requirements are met by the existing stack. Specifically:
- Autocomplete: plain `useState` + substring filter over `Object.values(PLUGINS)` — no Fuse.js, Downshift, or Combobox library needed
- MCP list parsing: plain regex — no parsing library needed
- Chip UI: `Badge` from shadcn/ui — no separate chip library needed

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Substring filter | Fuse.js fuzzy search | Overkill for 42 items; adds bundle size; decided against in CONTEXT.md |
| Custom chip | shadcn/ui Badge + X button | Badge is already in use project-wide; consistent look |
| Inline i18n strings | locale-conditional JSX | Translator-unfriendly; use `t.optimizer.*` keys through Translations type |

---

## Architecture Patterns

### Recommended File Structure
```
app/
└── optimizer/
    └── page.tsx               # Server component shell (metadata + <main>)

components/
├── OptimizerApp.tsx           # 'use client' — root state machine (mirrors PluginAdvisorApp.tsx pattern)
├── MpcPasteInput.tsx          # 'use client' — textarea + paste handler
├── PluginTypeInput.tsx        # 'use client' — text input + autocomplete dropdown
└── SelectedPluginChips.tsx    # 'use client' — chip list with X buttons

lib/
├── parse-mcp-list.ts          # Pure function — no React, fully unit-testable
└── types.ts                   # Add OptimizerInputPlugin, OptimizerState types

lib/i18n/
├── ko.ts                      # Add optimizer: { ... } section
├── en.ts                      # Add optimizer: { ... } section
└── types.ts                   # Add optimizer section to Translations type
```

### Pattern 1: Page Shell (Server Component + Client Island)
**What:** `app/optimizer/page.tsx` is a minimal server component that renders metadata and delegates all interactivity to `<OptimizerApp />` (client component).
**When to use:** All interactive pages in this project follow this pattern — see `app/advisor/page.tsx`.

```typescript
// app/optimizer/page.tsx — server component, no 'use client'
import OptimizerApp from "@/components/OptimizerApp";

export const metadata = { title: "Plugin Optimizer — Claude Code" };

export default function OptimizerPage() {
  return (
    <main className="min-h-screen">
      <OptimizerApp />
    </main>
  );
}
```

### Pattern 2: Nav Link Addition
**What:** Add optimizer entry to the `links` array in `Nav.tsx`. The active state logic (`pathname.startsWith(link.href)`) already handles highlighting correctly.

```typescript
// In Nav.tsx — links array addition
const links = [
  { href: "/", label: t.nav.home },
  { href: "/advisor", label: t.nav.advisor },
  { href: "/plugins", label: t.nav.plugins },
  { href: "/optimizer", label: t.nav.optimizer },   // ADD THIS
  { href: "/services", label: locale === "en" ? "Setup support" : "세팅 지원" },
];
```

The `t.nav.optimizer` key must be added to `Translations` type and both `ko.ts` and `en.ts`.

### Pattern 3: MCP List Parser (Pure Function)
**What:** Extract plugin names from `claude mcp list` terminal output. Must handle two confirmed format variants and unknown future variants gracefully.

**Known format variants (from STATE.md research finding):**
```
# Variant A — simple list
context7 (user):
playwright (user):
github (user):

# Variant B — with status indicators
✓ context7        Connected
✓ playwright      Connected
✗ github          Error: ...
```

**Parser strategy:** Extract candidate tokens by splitting on whitespace/newlines, then strip known prefixes and suffixes:
```typescript
// lib/parse-mcp-list.ts
export type ParseResult = {
  matched: string[];      // plugin ids that resolved in DB
  unmatched: string[];    // raw tokens that didn't resolve
};

export function parseMcpList(raw: string, pluginIds: string[]): ParseResult {
  // 1. Split into lines, strip terminal control chars, filter blanks
  // 2. For each line, extract the first word-like token (ignore ✓, ✗, status words)
  // 3. Normalize each token (see Pattern 4)
  // 4. Bucket into matched (found in pluginIds) vs unmatched
}
```

**Normalization must handle:**
- `@modelcontextprotocol/server-playwright` → `playwright`
- `mcp-context7` → `context7`
- `Context7 (user):` → `context7`
- `✓ github` → `github`

### Pattern 4: Plugin Name Normalization (INPUT-03)
**What:** Map raw token from paste/type to a canonical plugin id.

```typescript
// lib/parse-mcp-list.ts (exported for reuse)
export function normalizeToken(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\(.*\)$/, "")          // strip "(user):", "(project):" suffix
    .replace(/^@modelcontextprotocol\/server-/, "")
    .replace(/^@[^/]+\//, "")        // strip scoped package prefix
    .replace(/^mcp-/, "")
    .replace(/-mcp$/, "")
    .replace(/[^a-z0-9-]/g, "")      // strip non-alphanumeric except hyphen
    .trim();
}

export function resolvePluginId(token: string, plugins: Plugin[]): string | null {
  const norm = normalizeToken(token);
  return plugins.find(
    (p) => p.id === norm || normalizeToken(p.name) === norm || normalizeToken(p.tag) === norm
  )?.id ?? null;
}
```

### Pattern 5: Autocomplete Dropdown (INPUT-02)
**What:** Simple controlled input + filtered list rendered below. No external library.

```typescript
// components/PluginTypeInput.tsx
const suggestions = useMemo(() =>
  query.length < 1
    ? []
    : Object.values(PLUGINS).filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.id.toLowerCase().includes(query.toLowerCase()) ||
          p.tag.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8),   // cap at 8 visible suggestions
  [query]
);
```

Keyboard navigation (ArrowUp/ArrowDown/Enter/Escape) must be implemented for accessibility — no library required, standard `onKeyDown` handler pattern.

### Pattern 6: i18n Extension
**What:** Add `optimizer` namespace to `Translations` type, then populate both `ko.ts` and `en.ts`.

```typescript
// lib/i18n/types.ts — add to Translations type
optimizer: {
  pageTitle: string;
  pageSubtitle: string;
  tabPaste: string;
  tabType: string;
  pasteLabel: string;
  pastePlaceholder: string;
  typeLabel: string;
  typePlaceholder: string;
  analyzeBtn: string;
  analyzeBtnDisabled: string;
  aiComingSoon: string;
  recognizedPlugins: string;
  unrecognizedPlugins: string;
  emptyState: string;
  sampleBtn: string;
  removePlugin: string;
};
```

### Pattern 7: Coming Soon Button (PAGE-02)
**What:** A visually distinct but permanently disabled button for AI analysis mode.

```typescript
<Button
  disabled
  aria-disabled="true"
  className="opacity-60 cursor-not-allowed"
  title={t.optimizer.aiComingSoon}
>
  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
  {t.optimizer.aiComingSoon}
</Button>
```

Use `opacity-60 cursor-not-allowed` — do NOT use `pointer-events-none` as that breaks `title` tooltip display.

### Pattern 8: Selected Plugin Chips
**What:** Horizontal chip list showing selected plugins. Each chip: category icon + name + 1-line desc + X button.

```typescript
// SelectedPluginChips.tsx — chip rendering
{selectedPlugins.map((plugin) => (
  <div key={plugin.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
    <CategoryIcon category={plugin.category} className="h-3.5 w-3.5 shrink-0" />
    <span className="text-xs font-semibold">{plugin.name}</span>
    <span className="text-xs text-muted-foreground truncate max-w-[120px]">{plugin.desc}</span>
    <button onClick={() => onRemove(plugin.id)} aria-label={`${plugin.name} ${t.optimizer.removePlugin}`}>
      <X className="h-3 w-3" />
    </button>
  </div>
))}
```

Category-to-icon mapping must be defined (lucide-react icons for each of the 10 `PluginCategory` values).

### Anti-Patterns to Avoid
- **Importing PLUGINS directly in the parser:** `parseMcpList` must accept `pluginIds: string[]` as a parameter, not import `PLUGINS` directly — keeps it a pure function for testing
- **State in page.tsx:** All state belongs in `OptimizerApp.tsx` (`'use client'`); `page.tsx` is server component
- **Direct `plugin.conflicts[]` access:** Never reference `plugin.conflicts` array directly for conflict detection — that is Phase 6's job using `getConflicts()` from `lib/conflicts.ts`
- **Hardcoded locale strings in JSX:** Every user-visible string goes through `t.optimizer.*` keys, not inline `locale === "en" ? ... : ...` (although the existing codebase does use inline locale checks in some places, the optimizer page should model best practice)
- **Fuse.js or external autocomplete library:** Decided against in CONTEXT.md; substring filter over 42 items is sufficient

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tab UI switching | Custom tab state component | `TabsList` + `TabsTrigger` from `components/ui/tabs` | Already used in InputPanel.tsx and PluginAdvisorApp.tsx |
| Chip/badge styling | Custom CSS chip | `Badge` from `components/ui/badge` + X button | Consistent with existing plugin tags |
| Text input | Raw `<input>` | `Input` from `components/ui/input` | Consistent styling, ring on focus-visible |
| Textarea | Raw `<textarea>` | `Textarea` from `components/ui/textarea` | Project standard, consistent resize behavior |
| Button states | Custom button | `Button` from `components/ui/button` | Variant system handles disabled, loading states |
| Locale-aware text | Inline ternaries | `useI18n()` + `t.optimizer.*` keys | Maintainable; planner/writer can update text without touching component logic |

**Key insight:** Every UI primitive needed for this phase already exists in `components/ui/`. The work is composition, not construction.

---

## Common Pitfalls

### Pitfall 1: `claude mcp list` Output Format Variability
**What goes wrong:** Parser written for Variant A breaks on Variant B (with `✓`/`✗` symbols), or vice versa. Unknown future format variants cause silent failures where all plugins are classified as "unmatched."
**Why it happens:** The output format is undocumented — confirmed by STATE.md. Different Claude CLI versions produce different output.
**How to avoid:** Write the parser defensively: extract the first alphanumeric-looking token from each line, normalize it, then attempt resolution. Discard lines that produce empty tokens after normalization. Unit-test both known variants explicitly.
**Warning signs:** Parser returning 0 matched + many unmatched for clearly valid input.

### Pitfall 2: Translations Type Not Extended
**What goes wrong:** Adding `t.optimizer.x` in a component without first adding it to `Translations` type causes TypeScript errors that block `pnpm typecheck`.
**Why it happens:** The `Translations` type in `lib/i18n/types.ts` is strict — missing keys cause compile errors.
**How to avoid:** Update `lib/i18n/types.ts` first, then populate `ko.ts` and `en.ts`, then use in components. This order avoids partial states where one locale has keys the other lacks.
**Warning signs:** `Property 'optimizer' does not exist on type 'Translations'` TypeScript error.

### Pitfall 3: Nav Link Breaking Active State Detection
**What goes wrong:** Adding `/optimizer` link to Nav causes `/` (home) to also appear active because `pathname.startsWith("/")` is always true.
**Why it happens:** The Nav already handles this — the home link uses `pathname === "/"` (exact match), not `startsWith`. This is correct. The pitfall is accidentally changing the home link's active logic when editing the array.
**How to avoid:** Do not change the home link active logic when adding the optimizer entry. The existing code is: `link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)`.
**Warning signs:** Home nav item always highlighted regardless of route.

### Pitfall 4: Autocomplete Dropdown Z-Index / Overflow Clipping
**What goes wrong:** Autocomplete dropdown renders behind other page elements or gets clipped by an `overflow-hidden` ancestor.
**Why it happens:** The Card components wrapping the input use `overflow-hidden` for rounded corners. A dropdown positioned `absolute` inside will be clipped.
**How to avoid:** Render the dropdown using `position: absolute` on a container that is NOT inside an `overflow-hidden` ancestor, OR use `z-50` and ensure the wrapping Card does not have `overflow-hidden`. Use `overflow-visible` on the direct parent of the input+dropdown pair.
**Warning signs:** Dropdown list appears cut off at the Card boundary.

### Pitfall 5: Missing `aria-label` on X Buttons in Chips
**What goes wrong:** Screen readers announce X buttons as just "button" with no context about which plugin is being removed.
**Why it happens:** Icon-only buttons with no visible text have no accessible name by default.
**How to avoid:** Every chip X button must have `aria-label={`${plugin.name} 제거`}` (ko) / `aria-label={`Remove ${plugin.name}`}` (en). Since locale is available via `useI18n()`, use `t.optimizer.removePlugin` with the plugin name.
**Warning signs:** Axe/accessibility audit reports "Buttons must have discernible text."

### Pitfall 6: `useEffect` Keyboard Trap in Autocomplete
**What goes wrong:** Pressing Escape in the autocomplete does not close the dropdown, or focus gets trapped inside the suggestion list.
**Why it happens:** Keyboard events must be attached to the input element, not the dropdown list. The `onKeyDown` handler on the `<Input>` must intercept Escape, ArrowUp, ArrowDown, and Enter before they bubble.
**How to avoid:** Attach `onKeyDown` to the `<Input>` component. Close dropdown on Escape. On Enter when a suggestion is highlighted, select it and close dropdown. Clicking outside (blur event) closes dropdown.

---

## Code Examples

### Existing Tab Pattern (from InputPanel.tsx)
```typescript
// Source: components/InputPanel.tsx lines 130-166
const tabs = [
  { key: "paste" as const, label: t.optimizer.tabPaste },
  { key: "type" as const, label: t.optimizer.tabType },
];

<TabsList className="w-max min-w-full rounded-full border border-white/10 bg-white/5 p-1 sm:min-w-0">
  {tabs.map((tab) => (
    <TabsTrigger
      key={tab.key}
      active={mode === tab.key}
      className="whitespace-nowrap rounded-full border-transparent px-4 py-2"
      onClick={() => setMode(tab.key)}
    >
      {tab.label}
    </TabsTrigger>
  ))}
</TabsList>
```

### Existing Step Machine Pattern (from useAnalysis.ts)
```typescript
// Source: hooks/useAnalysis.ts lines 9-18
type Step = "input" | "analyzing" | "result";
// For optimizer, the analogous type is:
type OptimizerStep = "input" | "result";
// (no "analyzing" step in Phase 5 — analysis is Phase 6)
```

### PLUGINS Object Access
```typescript
// lib/plugins.ts exports PLUGINS as Record<string, Plugin>
// Access all plugins:
Object.values(PLUGINS)          // Plugin[]
Object.keys(PLUGINS)            // string[] (plugin ids)
PLUGINS["context7"]             // Plugin | undefined
```

### i18n Hook Usage
```typescript
// Standard pattern across all client components
const { locale, t } = useI18n();
// t.optimizer.tabPaste  → "붙여넣기" or "Paste"
// locale === "en"       → boolean for locale-specific logic
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom tab components | `TabsList` + `TabsTrigger` from shadcn/ui | Established in v1.0 | Use existing, don't rebuild |
| Direct string comparisons for i18n | `useI18n()` + `Translations` type | Established in v1.0 | All new strings must go through type-safe translation keys |
| `interface` for types | `type` keyword | Established in CLAUDE.md | New types use `type`, not `interface` |
| `enum` for categories | String literal unions | Established in lib/types.ts | `PluginCategory` is already a union type |

**Deprecated/outdated:**
- `interface` declarations: CLAUDE.md mandates `type` keyword instead
- `enum` for status types: All enums in this codebase are string literal unions (see `VerificationStatus`, `OfficialStatus`, etc.)
- `any` type: Explicitly forbidden in CLAUDE.md

---

## Open Questions

1. **Alias field in Plugin type (INPUT-03)**
   - What we know: Current `Plugin` type has `id`, `name`, `tag`, `keywords[]` fields. No dedicated `aliases[]` field exists.
   - What's unclear: STATE.md flags "alias normalization strategy decision — aliases field vs prefix/suffix stripping rules only" as a pending todo. The normalization-by-stripping approach (Pattern 4 above) may miss some edge cases (e.g., a plugin known as "brave" maps to "brave-search").
   - Recommendation: Implement normalization-by-stripping as the primary strategy. Add a small hardcoded alias map (`{ "brave": "brave-search", "github-mcp": "github" }`) for known problematic cases. Do NOT add `aliases[]` to the `Plugin` type in Phase 5 — that is a data expansion decision that affects `lib/plugins.ts` and belongs to a separate decision.

2. **Sample button content for empty state**
   - What we know: CONTEXT.md specifies "샘플 버튼" in the empty state but does not specify what it inserts.
   - What's unclear: What sample `claude mcp list` output should the button paste in?
   - Recommendation: Use a realistic 4-5 plugin sample that covers both format variants: `context7 (user):\nplaywright (user):\ngithub (user):`. This demonstrates the paste feature without overwhelming new users.

3. **`claude mcp list` output format on Windows**
   - What we know: The project runs on Windows (`win32` platform in env). The `claude mcp list` output on Windows may differ from macOS/Linux (different terminal encoding, no `✓`/`✗` Unicode symbols in some terminals).
   - What's unclear: Whether Windows CMD/PowerShell terminal output includes the Unicode symbols or uses ASCII alternatives.
   - Recommendation: The parser should strip all non-alphanumeric leading characters (not just `✓`/`✗`) to be platform-agnostic. Test on Windows terminal output if possible.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^4.0.18 |
| Config file | `vitest.config.ts` (project root) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INPUT-01 | parseMcpList extracts plugin names from both format variants | unit | `pnpm test -- parse-mcp-list` | Wave 0 |
| INPUT-01 | parseMcpList handles empty input, whitespace-only, invalid formats | unit | `pnpm test -- parse-mcp-list` | Wave 0 |
| INPUT-02 | filterPlugins returns correct subset for substring queries | unit | `pnpm test -- optimizer` | Wave 0 |
| INPUT-02 | filterPlugins returns empty array for empty query | unit | `pnpm test -- optimizer` | Wave 0 |
| INPUT-03 | normalizeToken strips @modelcontextprotocol/server- prefix | unit | `pnpm test -- parse-mcp-list` | Wave 0 |
| INPUT-03 | normalizeToken strips (user): / (project): suffixes | unit | `pnpm test -- parse-mcp-list` | Wave 0 |
| INPUT-03 | resolvePluginId matches id, name, and tag fields | unit | `pnpm test -- parse-mcp-list` | Wave 0 |
| PAGE-01 | /optimizer route exists and renders without crash | smoke (manual) | manual | N/A |
| PAGE-02 | AI Coming Soon button is disabled and non-interactive | smoke (manual) | manual | N/A |
| PAGE-03 | i18n keys present in both ko.ts and en.ts | unit | `pnpm typecheck` (type-safe) | Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm typecheck && pnpm test`
- **Phase gate:** `pnpm typecheck && pnpm lint && pnpm test` all green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `lib/__tests__/parse-mcp-list.test.ts` — covers INPUT-01, INPUT-03 (normalizeToken, resolvePluginId, parseMcpList)
- [ ] `lib/__tests__/optimizer.test.ts` — covers INPUT-02 (filterPlugins substring logic)
- [ ] `lib/parse-mcp-list.ts` — the pure function module itself (no React dependency)

*(Existing test infrastructure: `vitest.config.ts` already configured with `@` alias, test environment `node`. No framework install needed.)*

---

## Sources

### Primary (HIGH confidence)
- Direct codebase read — `components/InputPanel.tsx` (tab pattern, shadcn/ui usage)
- Direct codebase read — `hooks/useAnalysis.ts` (step machine pattern)
- Direct codebase read — `components/Nav.tsx` (links array, active state logic)
- Direct codebase read — `lib/types.ts` (Plugin type, all field names)
- Direct codebase read — `lib/i18n/types.ts` (Translations type structure)
- Direct codebase read — `lib/i18n/index.tsx` (useI18n hook, I18nProvider)
- Direct codebase read — `lib/i18n/ko.ts` + `en.ts` (existing translation patterns)
- Direct codebase read — `lib/plugins.ts` (PLUGINS object structure, 42 plugins confirmed)
- Direct codebase read — `lib/conflicts.ts` (getConflicts API — Phase 6 boundary)
- Direct codebase read — `vitest.config.ts` (test framework, node environment, @ alias)
- Direct codebase read — `package.json` (dependency versions, pnpm scripts)
- Direct codebase read — `.planning/STATE.md` (accumulated research findings, pending todos)

### Secondary (MEDIUM confidence)
- `.planning/phases/05-input-page-scaffold/05-CONTEXT.md` — locked user decisions
- `.planning/REQUIREMENTS.md` — requirement IDs and acceptance criteria

### Tertiary (LOW confidence — flag for validation)
- `claude mcp list` format variants: derived from STATE.md note ("미문서화이며 버전별로 다름") — actual output format not directly observed; parser must be defensive
- Windows terminal Unicode support: inferred from platform `win32` + general knowledge — needs runtime verification

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries confirmed present in package.json and actively used
- Architecture: HIGH — patterns copied directly from existing advisor page structure
- MCP list parser: MEDIUM — format variants documented in STATE.md but not directly tested against real CLI output
- Pitfalls: HIGH — derived from direct code inspection and STATE.md accumulated context
- i18n extension: HIGH — Translations type is fully understood; extension pattern is mechanical

**Research date:** 2026-03-16
**Valid until:** 2026-04-16 (stable stack; 30-day window)

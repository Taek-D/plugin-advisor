# Phase 7: Results UI Assembly - Research

**Researched:** 2026-03-17
**Domain:** React component assembly, progressive disclosure UI, SVG/CSS circular gauge
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**결과 레이아웃**
- 세로 스택 구조: 점수 → 충돌경고 → 커버리지 → 보완추천 → 대체추천 순서로 위에서 아래로 흐름
- 같은 페이지 스크롤: 입력 아래에 결과가 나타남 — 입력 접지 않음
- 애니메이션 전환: Analyze 버튼 클릭 시 분석 중 스피너 후 결과가 페이드인으로 나타남
- 충돌 0건일 때: "충돌 없음 ✔" 긍정 메시지 표시 (섹션 숨기지 않음)
- progressive disclosure: 보완/대체 추천은 접힌 상태로 시작, 사용자가 펼칠 수 있음 (PAGE-04)

**점수 시각화**
- 원형 게이지(circular gauge): 큰 원 안에 점수 숫자 + 등급 텍스트 표시
- 4등급 시스템: 80+ Excellent(녹), 60-79 Good(파랑), 40-59 Fair(노랑), 0-39 Poor(빨강)
- 감점 요인은 원형 게이지 아래에 색상 배지 태그로 표시: "충돌 -20" "중복 -7" "미커버 -14"
- 100점(감점 없음)일 때: 녹색 게이지 + "완벽한 조합!" 긍정 메시지

**커버리지 표시**
- 5x2 아이콘 그리드: 각 카테고리를 getCategoryIcon() 아이콘 + 이름으로 표시
- 커버된 카테고리는 밝게, 미커버는 희미하게(opacity) 표시
- 요약: "7/10 카테고리 커버" 분수 + 작은 프로그레스 바
- 미커버 카테고리 클릭 시 아래 보완 추천 섹션으로 자동 스크롤

**추천 카드 디자인**
- 풀 카드: 플러그인 이름 + 카테고리 아이콘 + 한 줄 설명 + 추천 이유 + 설치 명령 복사 버튼
- 플러그인 이름 클릭 시 /plugins/[id] 상세 페이지로 이동
- 보완 추천과 대체 추천은 별도 접힘 섹션으로 분리, 섹션 아이콘으로 구분
- 대체 추천 카드: "기존 → 대안" 화살표 표시 + 대체 이유 + 대안 설치 명령 복사

### Claude's Discretion
- 애니메이션 구현 방식 (CSS transition vs framer-motion 등)
- 정확한 간격/패딩 수치
- 스피너 디자인
- 컴포넌트 분리 구조
- 원형 게이지 구현 방식 (SVG circle, CSS conic-gradient 등)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAGE-04 | 분석 결과가 progressive disclosure (접기/펼치기)로 표시된다 | Native HTML `<details>`/`<summary>` or controlled `useState` toggle — no external library needed; existing `animate-accordion-down/up` keyframes in tailwind.config.ts support height animation |
</phase_requirements>

---

## Summary

Phase 7 is a pure UI assembly task: wire `scorePlugins(selectedIds)` from `lib/scoring.ts` into a results display inside the existing `OptimizerApp.tsx`. The scoring engine already exists and is fully tested (42 tests). No new business logic is needed — only component authoring and state wiring.

The project has no external animation library (no framer-motion, no react-spring). All animation primitives are Tailwind-based: `animate-fade-in` (0.3s ease), `animate-float-up`, and Accordion keyframes (`accordion-down/up` targeting `--radix-accordion-content-height`). The circular gauge must be hand-built with SVG `<circle>` stroke-dashoffset or CSS `conic-gradient` — both are zero-dependency approaches that fit the stack. No additional `npm install` is required for any part of this phase.

Progressive disclosure (PAGE-04) can be implemented with a controlled `useState(false)` toggle per collapsible section plus a CSS `max-height` or `grid-rows` transition. The existing `accordion-down/up` Tailwind keyframes are available but require the `--radix-accordion-content-height` CSS variable, which comes from `@radix-ui/react-accordion` — that package is not currently installed. The clean alternative is a simple `overflow-hidden` + `max-height` CSS transition driven by a boolean state, or the native `<details>` element, both of which need no extra dependency.

**Primary recommendation:** Wire `scorePlugins` into `OptimizerApp`, extract each result section into its own component (ScoreGauge, ConflictSection, CoverageGrid, ComplementSection, ReplacementSection), keep each file under 200 lines, use `useState(false)` + CSS `max-height` transition for collapsibles, and SVG `<circle>` stroke-dashoffset for the circular gauge.

---

## Standard Stack

### Core (already installed — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.3 | Component state, effects | Project foundation |
| Tailwind CSS | 3.4 | Utility styling | Project foundation |
| tailwindcss-animate | 1.0.7 | `animate-fade-in`, `animate-accordion-*` keyframes | Already in tailwind.config.ts plugins |
| lucide-react | 0.577 | Category icons, chevron, copy, arrow-right | Already used throughout codebase |
| Next.js Link | 14.2 | Navigation to /plugins/[id] | Already used |
| shadcn Card, Badge | existing | Result section containers, deduction badges | Already in `components/ui/` |

### No New Dependencies

| What you might reach for | Why not needed |
|--------------------------|----------------|
| framer-motion | `animate-fade-in` (0.3s ease) + `animate-float-up` already defined in tailwind.config.ts |
| @radix-ui/react-collapsible | Not installed; `useState` + CSS `max-height` transition is sufficient for 2 collapsible sections |
| @radix-ui/react-accordion | Not installed; accordion keyframes need its CSS variable — skip |
| react-circular-progressbar | SVG stroke-dashoffset pattern is ~20 lines, zero-dependency, full color control |

---

## Architecture Patterns

### Recommended Component Structure

```
components/
  OptimizerApp.tsx          # existing — add analyze state, wire scorePlugins, render ResultsPanel
  ResultsPanel.tsx          # new — outer container, animate-fade-in wrapper for all result sections
  ScoreGauge.tsx            # new — SVG circular gauge + grade + deduction badges
  ConflictSection.tsx       # new — conflict list OR "충돌 없음 ✔" positive message
  CoverageGrid.tsx          # new — 5x2 icon grid + summary bar + scroll-to-complements
  ComplementSection.tsx     # new — collapsible, starts closed, complement plugin cards
  ReplacementSection.tsx    # new — collapsible, starts closed, replacement plugin cards
  RecommendPluginCard.tsx   # new — shared card for complement suggestions
  ReplacementCard.tsx       # new — card for "original → replacement" display
```

All existing optimizer components are untouched. 200-line limit enforced by the split above — each component handles one concern.

### Pattern 1: Analyze Button Wiring in OptimizerApp

**What:** Add `analysisState` to OptimizerApp — `"idle" | "analyzing" | "done"` — and call `scorePlugins` inside a short `setTimeout` to allow the spinner to render before the synchronous scoring computation.

**When to use:** Single source of truth for analysis lifecycle; avoids prop drilling by passing `ScoringResult` down to `ResultsPanel`.

```typescript
// OptimizerApp.tsx addition
type AnalysisState = "idle" | "analyzing" | "done";

const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
const [result, setResult] = useState<ScoringResult | null>(null);

const handleAnalyze = useCallback(() => {
  if (!hasPlugins) return;
  setAnalysisState("analyzing");
  // setTimeout 0 lets React flush the spinner render before the sync scorePlugins call
  setTimeout(() => {
    const scored = scorePlugins(selectedIds);
    setResult(scored);
    setAnalysisState("done");
  }, 0);
}, [selectedIds, hasPlugins]);
```

**Empty input guard:** `scorePlugins([])` returns `{ empty: true, score: null, ... }`. Check `result.empty` in `ResultsPanel` and render an informational message instead of a score.

### Pattern 2: SVG Circular Gauge (stroke-dashoffset)

**What:** A single SVG `<circle>` with `stroke-dasharray` set to the circumference and `stroke-dashoffset` controlling the filled arc. No library required.

**When to use:** Any numeric 0-100 score display with color coding.

```typescript
// ScoreGauge.tsx — verified SVG pattern
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~326.7

type Props = { score: number };

function ScoreGauge({ score }: Props) {
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#3b82f6" : score >= 40 ? "#eab308" : "#ef4444";

  return (
    <svg width="136" height="136" viewBox="0 0 136 136" className="-rotate-90">
      {/* Track */}
      <circle cx="68" cy="68" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      {/* Filled arc */}
      <circle
        cx="68" cy="68" r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}
```

Score label is absolutely centered over the SVG using a wrapping `relative` div.

### Pattern 3: Collapsible Section (CSS max-height transition)

**What:** Controlled open/close with `useState(false)`. Expanded state uses `max-height: 9999px` (or a computed value); collapsed uses `max-height: 0`. `overflow-hidden` clips the content.

**When to use:** `ComplementSection` and `ReplacementSection` — both start closed per PAGE-04.

```typescript
// ComplementSection.tsx
const [open, setOpen] = useState(false);

<div>
  <button
    onClick={() => setOpen((v) => !v)}
    className="flex w-full items-center justify-between px-5 py-4"
    aria-expanded={open}
  >
    <span className="font-semibold">{sectionTitle}</span>
    <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
  </button>
  <div
    className="overflow-hidden transition-all duration-300 ease-in-out"
    style={{ maxHeight: open ? "9999px" : "0px" }}
  >
    <div className="px-5 pb-5">
      {/* cards */}
    </div>
  </div>
</div>
```

**Note on max-height animation:** `max-height: 9999px` causes a slow close animation because CSS transitions from the actual content height down to 0, but the duration is calculated against the `max-height` value not the actual height. For short lists this is imperceptible. For pixel-perfect height animation, measure with `useRef` + `scrollHeight` instead.

### Pattern 4: Copy-to-clipboard for Install Commands

**What:** The existing codebase already has copy button patterns (see `components/InstallScript.tsx`). Use `navigator.clipboard.writeText()` + a brief copied state.

```typescript
const [copied, setCopied] = useState(false);

const handleCopy = () => {
  navigator.clipboard.writeText(installCmd);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
};
```

Install commands are `PLUGINS[id].install` — an `string[]` array. Join with `\n` for multi-line commands.

### Pattern 5: Scroll-to-section (coverage → complements)

**What:** Clicking an uncovered category tile scrolls the page to the complements section. Use `useRef` on the complements section and `ref.current.scrollIntoView({ behavior: "smooth" })`.

```typescript
// CoverageGrid.tsx receives complementsRef as prop
type Props = {
  coverage: CoverageResult;
  complementsRef: React.RefObject<HTMLDivElement>;
};

// Click handler on uncovered tile:
const handleUncoveredClick = () => {
  setComplementsOpen(true); // also open the section if closed
  complementsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
};
```

### Anti-Patterns to Avoid

- **Putting all result logic in OptimizerApp.tsx:** Will exceed 200-line limit immediately. Extract to `ResultsPanel` and sub-components.
- **Using `framer-motion` or `@radix-ui/react-collapsible`:** Not installed; would require `pnpm add` and add bundle weight for 2 simple toggles.
- **Calling `scorePlugins` on every render or `selectedPlugins` change:** Results should only update when the Analyze button is clicked. Use the `handleAnalyze` callback pattern, not a `useEffect` watching `selectedPlugins`.
- **Accessing `plugin.conflicts[]` directly:** Always use `getConflicts()` from `lib/conflicts.ts` — established rule from prior phases (carry-forward from STATE.md).
- **Hardcoding Korean strings in JSX:** All UI text goes through `useI18n()` + `t.optimizer.*`. New translation keys must be added to both `lib/i18n/ko.ts` and `lib/i18n/en.ts` and the `Translations` type in `lib/i18n/types.ts`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Plugin data lookup | Custom data fetching | `PLUGINS[id]` direct import | Already client-side static |
| Conflict detection | Custom conflict logic | `getConflicts()` from lib/conflicts.ts | Established rule — see STATE.md |
| Score calculation | Custom scoring | `scorePlugins()` from lib/scoring.ts | Phase 6 output, 42 tests cover it |
| Category icons | Custom icon mapping | lucide-react + a local `getCategoryIcon()` helper | 10-category mapping, ~20 lines |
| Install command display | Custom install renderer | `PLUGINS[id].install.join("\n")` | Already structured as string[] |
| Copy to clipboard | Custom clipboard API wrapper | `navigator.clipboard.writeText()` inline | Already used in InstallScript.tsx pattern |

**Key insight:** All business logic was built in Phases 5-6. Phase 7 is entirely wiring and presentation — the planner should not schedule any logic tasks, only component authoring tasks.

---

## Common Pitfalls

### Pitfall 1: getCategoryIcon does not exist yet

**What goes wrong:** CONTEXT.md references `lib/optimizer-utils.ts` and `getCategoryIcon()`, but that file does not exist in the codebase. Grep confirms zero matches for `getCategoryIcon` across all `.ts` and `.tsx` files.

**Why it happens:** CONTEXT.md listed it as a planned reusable asset, not an existing one.

**How to avoid:** Create `lib/optimizer-utils.ts` in the first task of this phase with the `getCategoryIcon(category: PluginCategory): LucideIcon` mapping. This is a Wave 0 prerequisite for CoverageGrid and all recommendation cards.

**Suggested implementation:**
```typescript
// lib/optimizer-utils.ts
import { Code2, GitBranch, Shield, TestTube, BookOpen, Database, Lock, Plug, Palette, Server } from "lucide-react";
import type { PluginCategory } from "./types";
import type { LucideIcon } from "lucide-react";

export function getCategoryIcon(category: PluginCategory): LucideIcon {
  const map: Record<PluginCategory, LucideIcon> = {
    orchestration: GitBranch,
    workflow: Code2,
    "code-quality": Code2,
    testing: TestTube,
    documentation: BookOpen,
    data: Database,
    security: Lock,
    integration: Plug,
    "ui-ux": Palette,
    devops: Server,
  };
  return map[category] ?? Code2;
}
```

### Pitfall 2: Translations type requires update for new keys

**What goes wrong:** Adding new `t.optimizer.*` keys in `ko.ts` / `en.ts` without updating `lib/i18n/types.ts` causes TypeScript errors everywhere `t.optimizer` is used.

**Why it happens:** `Translations` type has `optimizer: { ... }` as a strict object type, not `Record<string, string>`.

**How to avoid:** Always update `lib/i18n/types.ts` first, then add the actual strings to both `ko.ts` and `en.ts` in the same task. The planner should make i18n updates atomic with the component that uses them.

**New keys needed** (at minimum):
- `optimizer.analyzing` — "분석 중..." / "Analyzing..."
- `optimizer.resultScore` — "조합 점수" / "Combo Score"
- `optimizer.gradeExcellent`, `.gradGood`, `.gradeFair`, `.gradePoor` — grade labels
- `optimizer.noConflict` — "충돌 없음 ✔" / "No conflicts ✔"
- `optimizer.conflictsTitle` — "충돌 경고" / "Conflicts"
- `optimizer.coverageTitle` — "카테고리 커버리지" / "Category Coverage"
- `optimizer.complementTitle` — "보완 추천" / "Complement Suggestions"
- `optimizer.replacementTitle` — "대체 추천" / "Replacement Suggestions"
- `optimizer.emptyInputHint` — "플러그인을 추가한 후 분석하세요" / "Add plugins to analyze"
- `optimizer.perfectCombo` — "완벽한 조합!" / "Perfect combo!"
- `optimizer.installCopy` — "복사" / "Copy"
- `optimizer.installCopied` — "복사됨" / "Copied"

### Pitfall 3: `score: null` when empty — don't render gauge

**What goes wrong:** `scorePlugins([])` returns `{ empty: true, score: null }`. If `ResultsPanel` attempts to render `ScoreGauge` with `score={null}`, it will either crash or render a broken gauge.

**Why it happens:** Empty input is a valid state the UI must handle per success criteria #3.

**How to avoid:** Check `result.empty` first in `ResultsPanel`:
```typescript
if (result.empty) {
  return <EmptyResultMessage />;
}
```

### Pitfall 4: 200-line limit on component files

**What goes wrong:** Attempting to put ScoreGauge, ConflictSection, CoverageGrid, and both recommendation sections all in `ResultsPanel.tsx` quickly exceeds the 200-line project limit.

**Why it happens:** The visual complexity of a results page is high.

**How to avoid:** Each result section is its own file (7 new component files). `ResultsPanel.tsx` is just layout composition — imports and arranges sub-components without internal logic.

### Pitfall 5: `PLUGINS[id].install` is `string[]` not `string`

**What goes wrong:** Displaying install commands with `plugin.install` directly renders `[object Object]` or similar.

**Why it happens:** `Plugin.install` is typed as `string[]` (multi-line commands). The type definition confirms this.

**How to avoid:** `plugin.install.join("\n")` for copy, and render each as a separate `<code>` line in the card.

### Pitfall 6: No Collapsible component in shadcn/ui

**What goes wrong:** CONTEXT.md mentions `components/ui/Collapsible` as potentially reusable, but checking the component directory confirms no such file exists. The shadcn Collapsible uses `@radix-ui/react-collapsible` which is also not in `package.json`.

**Why it happens:** The reference in CONTEXT.md was aspirational, not confirmed.

**How to avoid:** Use the `useState` + CSS `max-height` pattern described above. No new dependency needed.

---

## Code Examples

### ScoringResult fields → component mapping

```typescript
// Source: lib/scoring.ts (Phase 6 output)
type ScoringResult = {
  empty: boolean;                      // → EmptyResultMessage guard
  score: number | null;                // → ScoreGauge (null = empty)
  conflicts: ConflictWarning[];        // → ConflictSection (0 = "충돌 없음 ✔")
  redundancies: RedundancyGroup[];     // → ConflictSection (redundancy subsection)
  coverage: CoverageResult;           // → CoverageGrid
  complements: ComplementSuggestion[]; // → ComplementSection (collapsible)
  replacements: ReplacementSuggestion[]; // → ReplacementSection (collapsible)
};

// RedundancyGroup from lib/conflicts.ts:
type RedundancyGroup = { ids: string[]; msg: string; msgEn: string; };

// ConflictWarning from lib/types.ts:
type ConflictWarning = { ids: string[]; msg: string; };

// ComplementSuggestion from lib/scoring.ts:
type ComplementSuggestion = { pluginId: string; forCategory: PluginCategory; };

// ReplacementSuggestion from lib/scoring.ts:
type ReplacementSuggestion = {
  original: string;
  reason: "unverified" | "partial" | "deprecated";
  replacement: string | null;
};
```

### Grade system implementation

```typescript
// Source: CONTEXT.md locked decision
type Grade = "Excellent" | "Good" | "Fair" | "Poor";

function getGrade(score: number): Grade {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

const GRADE_COLOR: Record<Grade, string> = {
  Excellent: "#22c55e",  // green  (matches --primary in globals.css)
  Good:      "#3b82f6",  // blue
  Fair:      "#eab308",  // yellow
  Poor:      "#ef4444",  // red (matches --destructive)
};
```

### Deduction badges

```typescript
// ScoreGauge deduction badges below the gauge circle
// conflicts.length * 20, redundancies.length * 7, uncovered.length * 7
const deductions = [
  { label: "충돌", value: conflicts.length * 20, show: conflicts.length > 0 },
  { label: "중복", value: redundancies.length * 7, show: redundancies.length > 0 },
  { label: "미커버", value: coverage.uncovered.length * 7, show: coverage.uncovered.length > 0 },
];
// Render as: <Badge className="bg-destructive/20 text-destructive">충돌 -20</Badge>
```

### Existing animate-fade-in usage

```typescript
// From tailwind.config.ts (verified):
// keyframe: opacity 0→1, translateY 5px→0, duration 0.3s ease
// Usage: className="animate-fade-in"
// Already used in OptimizerApp.tsx outer div wrapper

// ResultsPanel should use:
<div className="animate-fade-in mt-6 space-y-4">
  {/* result sections */}
</div>
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Accordion via @radix-ui | CSS max-height + useState | No new dep; fits project pattern |
| External circular progress library | SVG stroke-dashoffset (inline) | ~20 lines, full color/style control |
| Framer Motion fade | Tailwind animate-fade-in | Already defined, consistent with codebase |

**Not available in this project:**
- `@radix-ui/react-collapsible` — not installed, skip
- `@radix-ui/react-accordion` — not installed, skip
- `framer-motion` — not installed, skip
- Radix accordion keyframes (`--radix-accordion-content-height` variable) — requires radix package to inject, skip

---

## Open Questions

1. **getCategoryIcon icon choices**
   - What we know: 10 categories exist (`orchestration`, `workflow`, `code-quality`, `testing`, `documentation`, `data`, `security`, `integration`, `ui-ux`, `devops`)
   - What's unclear: Exact icon mapping is at Claude's discretion (CONTEXT.md)
   - Recommendation: Use semantically obvious lucide-react icons (GitBranch → orchestration, TestTube → testing, etc.). The planner should include `lib/optimizer-utils.ts` creation as the first Wave 0 task.

2. **Collapsible open/close animation smoothness**
   - What we know: `max-height: 9999px` transition has a timing artifact (duration based on max not actual height)
   - What's unclear: Whether this is visually acceptable given the short lists (~5-10 cards)
   - Recommendation: Use `max-height: 9999px` for opening (instant feel), but for closing use `max-height: 0`. The asymmetry (instant open, smooth close) is actually the better UX. If precise height animation is needed, measure `scrollHeight` via `useRef` — but this adds complexity; leave to Claude's discretion.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 |
| Config file | `vitest.config.ts` |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-04 | progressive disclosure: complements/replacements start collapsed, can be expanded | manual-only | visual inspection in browser | N/A |
| PAGE-04 | empty input (0 plugins) shows guidance message, not error | unit | `pnpm test -- scoring` (existing `empty input` suite covers the `empty:true` branch) | ✅ lib/__tests__/scoring.test.ts |
| PAGE-04 | mobile + desktop layout renders without overlap | manual-only | responsive DevTools inspection | N/A |

**Note on testability:** PAGE-04 is fundamentally a UI/UX requirement. The scoring logic it depends on is already unit-tested (42 tests). The UI behavior (collapsible open/close, responsive layout) is manual-only — no component testing framework is configured. The empty-state guard (`result.empty`) is validated indirectly by the existing scoring test `"returns empty:true when no plugins provided"`.

### Sampling Rate
- **Per task commit:** `pnpm test` (42 existing tests must remain green)
- **Per wave merge:** `pnpm test && pnpm typecheck && pnpm lint`
- **Phase gate:** Full suite green + manual browser check of collapsibles, gauge, and mobile layout before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `lib/optimizer-utils.ts` — `getCategoryIcon()` helper; needed by CoverageGrid, RecommendPluginCard, ReplacementCard
- [ ] New i18n keys in `lib/i18n/types.ts`, `lib/i18n/ko.ts`, `lib/i18n/en.ts` — needed by all result components

*(No new test files are required — component tests are not part of this project's testing pattern. Existing scoring tests cover the data layer.)*

---

## Sources

### Primary (HIGH confidence)
- Direct file reads: `lib/scoring.ts`, `lib/types.ts`, `lib/conflicts.ts` — exact types and field names verified
- Direct file reads: `components/OptimizerApp.tsx` — exact integration point confirmed
- Direct file reads: `lib/__tests__/scoring.test.ts` — 42 test cases, full coverage of ScoringResult branches
- Direct file reads: `lib/i18n/ko.ts`, `lib/i18n/en.ts`, `lib/i18n/types.ts` — exact translation key structure
- Direct file reads: `tailwind.config.ts` — `animate-fade-in` (0.3s ease, opacity+translateY), `animate-accordion-*` keyframes confirmed
- Direct file reads: `app/globals.css` — `surface-panel`, `surface-panel-soft` utility classes confirmed
- Direct file reads: `package.json` — no framer-motion, no radix collapsible/accordion, `tailwindcss-animate` present
- Glob scan: `components/ui/` — no Collapsible component confirmed; Card, Badge, Button present

### Secondary (MEDIUM confidence)
- SVG stroke-dashoffset circular gauge — standard SVG technique, widely documented, no library needed

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from package.json and existing component files
- Architecture: HIGH — integration point (OptimizerApp.tsx) and ScoringResult types confirmed by direct reads
- Pitfalls: HIGH — getCategoryIcon absence confirmed by grep; Collapsible absence confirmed by glob; install type confirmed by types.ts

**Research date:** 2026-03-17
**Valid until:** 2026-04-17 (stable — no external API dependencies, all findings from local codebase)

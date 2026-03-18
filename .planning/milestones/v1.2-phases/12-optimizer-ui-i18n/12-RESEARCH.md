# Phase 12: Optimizer UI + i18n - Research

**Researched:** 2026-03-18
**Domain:** React component UI (Badge, autocomplete, chips) + i18n string updates
**Confidence:** HIGH

## Summary

Phase 12 is a focused UI polish phase with three independent work areas: (1) update four existing i18n string values in `ko.ts` and `en.ts` to mention both `claude mcp list` and `claude plugin list`, (2) add type Badge components to the `PluginTypeInput` autocomplete dropdown and `SelectedPluginChips`, and (3) update the sample data in `OptimizerApp.handleSampleData` to include Plugin-type entries.

The i18n work is purely value-replacement — no new keys are added to `Translations` type, so no TypeScript changes to `types.ts` are needed. The badge work uses the existing `Badge` component from `components/ui/badge.tsx` with custom Tailwind class overrides. The sample data update requires knowing the `claude plugin list` output format, which `parseMcpList` already handles via the `❯ name@source` pattern.

**Primary recommendation:** Work in three independent commits — i18n strings first (fastest, validates types.ts stays clean), then sample data update, then badge rendering. Each can be verified in isolation.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**붙여넣기 힌트/라벨 문구**
- pasteLabel: "MCP / Plugin 목록" 형태의 통합 라벨 (두 타입을 함께 언급하는 짧은 라벨)
- pasteHint: "터미널에서 claude mcp list 또는 claude plugin list 명령어를 실행한 후 결과를 복사해서 붙여넣으세요" — 두 명령어를 한 문장에 병기
- pastePlaceholder: "MCP / Plugin 목록을 붙여넣으세요..." 형태의 통합 placeholder
- emptyState: "MCP 또는 Plugin 목록을 붙여넣거나 플러그인을 검색하세요" 형태의 통합 문구

**샘플 데이터 구성**
- MCP 3개 + Plugin 2개 혼합: context7, playwright, github (MCP) + superpowers, omc (Plugin)
- 혼합 샘플로 typeScope 'both' 트리거 및 충돌 감지 체험 가능
- Plugin 부분의 포맷(claude plugin list 출력 형식)은 Claude 재량으로 리서치 후 결정

**타입 뱃지 디자인 (자동완성 드롭다운)**
- 위치: 플러그인 이름 오른쪽에 배치 (카테고리는 그대로 유지)
- 스타일: shadcn Badge 컴포넌트, 색상 구분 — MCP는 파란계, Plugin은 보라계
- 크기: 작은 사이즈 (text-[10px] 수준)
- SelectedPluginChips에도 동일한 타입 뱃지 추가

**i18n 처리**
- 기존 optimizer 키(pasteLabel, pasteHint, pastePlaceholder, emptyState) 값만 수정 — ko.ts + en.ts 양쪽
- Translations 타입에 새 키 추가하지 않음 — 기존 키 값 변경만으로 충분
- MCP/Plugin 뱃지 텍스트는 proper noun이므로 i18n 키 없이 하드코딩 (Phase 11 결정 연장)

### Claude's Discretion
- 뱃지 정확한 색상 값 (파란계/보라계 내에서 구체적 hex/tailwind class)
- Plugin 샘플 데이터의 정확한 포맷 (claude plugin list 실제 출력 형식 리서치)
- 뱃지의 정확한 padding/border-radius 값

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UI-03 | /optimizer paste hint와 sample data가 `claude mcp list` + `claude plugin list` 둘 다 안내한다 | Four i18n keys in ko.ts/en.ts need value updates; `handleSampleData` in OptimizerApp needs mixed MCP+Plugin sample string; `parseMcpList` already handles both formats |
| UI-04 | 자동완성 드롭다운에서 MCP/Plugin 타입 뱃지가 표시된다 | `PluginTypeInput` line 153-159 is the exact insertion point; `SelectedPluginChips` chip div needs badge; Badge component accepts `className` override for color |
| I18N-01 | 탭 라벨, 타입 뱃지 등 신규 UI 텍스트가 한/영 모두 지원된다 | Only existing keys modified (no Translations type change); MCP/Plugin badge text hardcoded as proper nouns per Phase 11 precedent; `pnpm build` type check validates automatically |
| I18N-02 | 신규 Plugin 10-15개의 desc/longDesc 영문 번역이 등록된다 | Already Complete (Phase 9) — no work needed in Phase 12 |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| shadcn/ui Badge | already installed | Type badge rendering | Already used in OptimizerApp for unmatched tokens; supports `className` override |
| Tailwind CSS | already installed | Badge color, size tuning | Project-wide styling system |
| React | already installed | Component state | No new hooks needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `class-variance-authority` (cva) | already installed via shadcn | Badge variant extension | Not needed — className override is sufficient for two custom colors |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Badge + className override | New badgeVariants | className override is simpler for one-off colors; new variants add complexity with no reuse |
| Hardcoded "MCP"/"Plugin" strings | i18n keys | Proper nouns don't need translation (Phase 11 precedent confirmed) |

---

## Architecture Patterns

### Component Touch Points (all files identified)

```
components/
├── McpPasteInput.tsx       # pasteLabel, pasteHint, pastePlaceholder — i18n value consumers
├── OptimizerApp.tsx        # emptyState consumer + handleSampleData sample string
├── PluginTypeInput.tsx     # dropdown item row — add Badge after plugin.name
└── SelectedPluginChips.tsx # chip row — add Badge after plugin.name
lib/i18n/
├── ko.ts                   # 4 value updates in optimizer section
└── en.ts                   # 4 value updates in optimizer section
```

No changes needed to: `lib/i18n/types.ts`, `lib/parse-mcp-list.ts`, `lib/types.ts`, `lib/plugins.ts`

### Pattern 1: Badge Color Override (Tailwind className)

**What:** Pass custom Tailwind classes to Badge to override bg/text color, keeping size small
**When to use:** When adding the type badge to both PluginTypeInput and SelectedPluginChips

```tsx
// MCP badge — blue
<Badge
  className="ml-1 px-1 py-0 text-[10px] border-blue-500/30 bg-blue-500/10 text-blue-400"
>
  MCP
</Badge>

// Plugin badge — purple
<Badge
  className="ml-1 px-1 py-0 text-[10px] border-purple-500/30 bg-purple-500/10 text-purple-400"
>
  Plugin
</Badge>
```

The base `Badge` component uses `rounded-md border px-2 py-0.5 text-xs font-bold`. Override with `px-1 py-0 text-[10px]` for compact size. Colors use `/10` bg and `/30` border to match the project's `bg-white/5`, `border-white/10` glass-morphism aesthetic.

### Pattern 2: Conditional Badge by plugin.type

**What:** Render different Badge depending on `plugin.type` ('mcp' | 'plugin')
**When to use:** In both PluginTypeInput dropdown and SelectedPluginChips

```tsx
// Insertion point in PluginTypeInput (after existing plugin.name span, before category span)
<span className="font-medium text-foreground">{plugin.name}</span>
{plugin.type === 'mcp' ? (
  <Badge className="ml-1 px-1 py-0 text-[10px] border-blue-500/30 bg-blue-500/10 text-blue-400">
    MCP
  </Badge>
) : (
  <Badge className="ml-1 px-1 py-0 text-[10px] border-purple-500/30 bg-purple-500/10 text-purple-400">
    Plugin
  </Badge>
)}
<span className="text-xs text-muted-foreground">{plugin.category}</span>
```

### Pattern 3: Sample Data String Format

**What:** Construct a multi-format string that `parseMcpList` can parse — MCP lines in `name (user):` format, Plugin lines in `❯ name@source` format
**When to use:** In `OptimizerApp.handleSampleData`

The `parseMcpList` function already handles both formats. The `❯` character triggers `isPluginList = true` detection. The function handles mixed input because it scans ALL lines after detecting the format.

**Critical finding:** `parseMcpList` sets `isPluginList` to `true` if ANY line matches `/^\s*❯\s/`. This means a mixed MCP+Plugin string will be treated entirely as plugin list format. The MCP entries in `name (user):` format will NOT be parsed correctly in mixed mode.

**Solution — two-section approach:**
The sample data must be constructed so that `parseMcpList` handles it correctly. Since `isPluginList` detection is global, a mixed string will fail for MCP lines. Options:

1. **Separate parseMcpList calls** — parse MCP section and Plugin section independently, merge results
2. **MCP lines in colon format** — use `name: url` format (not triggering ❯ detection) for MCP lines, and `❯ name@source` for Plugin lines — but `isPluginList` still goes `true`
3. **Use the existing pseudoPlugin constructor in handleSampleData** — bypass parseMcpList entirely and directly call `handlePasteResult` with a manually constructed `ParseResult`

**Recommended approach:** Directly construct the `ParseResult` for sample data, bypassing `parseMcpList`. This is the simplest and most reliable approach:

```tsx
const handleSampleData = useCallback(() => {
  const sampleResult: ParseResult = {
    matched: ["context7", "playwright", "github", "superpowers", "omc"],
    unmatched: [],
  };
  handlePasteResult(sampleResult);
}, [handlePasteResult]);
```

This avoids the mixed-format parsing problem entirely and guarantees the 5 sample plugins are loaded. The CONTEXT.md says "Plugin 부분의 포맷은 Claude 재량으로 리서치 후 결정" — direct construction is the most robust choice.

### Pattern 4: i18n Value Updates (no type change)

**What:** Modify string values in `optimizer` section of ko.ts and en.ts only
**When to use:** All 4 keys: pasteLabel, pasteHint, pastePlaceholder, emptyState

Current values → New values:

| Key | ko.ts current | ko.ts new |
|-----|---------------|-----------|
| pasteLabel | "claude mcp list 결과" | "MCP / Plugin 목록" |
| pasteHint | "터미널에서 claude mcp list 명령어를 실행한 후 결과를 복사해서 붙여넣으세요" | "터미널에서 claude mcp list 또는 claude plugin list 명령어를 실행한 후 결과를 복사해서 붙여넣으세요" |
| pastePlaceholder | "claude mcp list 결과를 붙여넣으세요..." | "MCP / Plugin 목록을 붙여넣으세요..." |
| emptyState | "예: claude mcp list 결과를 붙여넣거나 플러그인을 검색하세요" | "MCP 또는 Plugin 목록을 붙여넣거나 플러그인을 검색하세요" |

| Key | en.ts current | en.ts new |
|-----|---------------|-----------|
| pasteLabel | "claude mcp list output" | "MCP / Plugin list" |
| pasteHint | "Run claude mcp list in your terminal, then copy and paste the output here" | "Run claude mcp list or claude plugin list in your terminal, then copy and paste the output here" |
| pastePlaceholder | "Paste your claude mcp list output here..." | "Paste your MCP / Plugin list output here..." |
| emptyState | "Paste your claude mcp list output or search for plugins" | "Paste your MCP or Plugin list output, or search for plugins" |

### Anti-Patterns to Avoid

- **Adding new keys to Translations type:** The locked decision is to modify existing values only. Adding a new key breaks the type contract for both locales and is explicitly out of scope.
- **i18n keys for MCP/Plugin badge text:** These are proper nouns, hardcoded directly per Phase 11 precedent.
- **Trying to parse mixed MCP+Plugin sample string via parseMcpList:** The `isPluginList` flag is global per call — mixed format won't parse correctly. Use direct ParseResult construction instead.
- **Using badgeVariants for new variants:** One-off Tailwind className override is simpler and sufficient.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Badge component | Custom span/div with inline styles | `Badge` from `components/ui/badge.tsx` | Already used, consistent border-radius/font, supports className |
| Type color mapping | Switch statement inline | Conditional ternary on `plugin.type` | Only 2 types, ternary is clearest |
| i18n string sync | Separate tracking system | Parallel edit of ko.ts + en.ts | Types.ts validates both at build time |

---

## Common Pitfalls

### Pitfall 1: parseMcpList mixed-format detection
**What goes wrong:** If you put MCP lines (`context7 (user):`) and Plugin lines (`❯ superpowers@source`) in the same sample string, `isPluginList` becomes `true` and MCP lines are skipped.
**Why it happens:** `isPluginList` is set once at the top by scanning all lines for the `❯` character — it's not per-line.
**How to avoid:** Use direct `ParseResult` construction for sample data (see Pattern 3 above).
**Warning signs:** Sample data only loads Plugin entries, not MCP entries.

### Pitfall 2: Badge base styles interfering with size override
**What goes wrong:** The base `Badge` cva applies `px-2 py-0.5 text-xs` — these must be overridden to achieve `text-[10px]` compact size.
**Why it happens:** Tailwind class ordering — later classes in `className` don't always override earlier ones without `!` prefix.
**How to avoid:** Use `cn()` utility is NOT needed here since Badge already uses `cn(badgeVariants({variant}), className)` — className wins over base variant for padding/text-size because they're not using `!important` in base.
**Warning signs:** Badge appears too large in the dropdown item row.

### Pitfall 3: Forgetting to import Badge in modified components
**What goes wrong:** Build fails with "Badge is not defined" in PluginTypeInput or SelectedPluginChips.
**Why it happens:** Badge is currently only imported in OptimizerApp.tsx.
**How to avoid:** Add `import { Badge } from "@/components/ui/badge"` to both PluginTypeInput.tsx and SelectedPluginChips.tsx.

### Pitfall 4: pnpm build type error from mismatched i18n
**What goes wrong:** If ko.ts and en.ts diverge structurally (different keys), TypeScript throws `Type 'X' is not assignable to type 'Translations'`.
**Why it happens:** Both files are typed `as Translations`.
**How to avoid:** Only change values, not keys. Both files must have identical key structure.

---

## Code Examples

### PluginTypeInput — dropdown row with badge (modification area)

Current code (lines 153-159 in PluginTypeInput.tsx):
```tsx
<div className="flex items-center gap-2">
  <span className="font-medium text-foreground">
    {plugin.name}
  </span>
  <span className="text-xs text-muted-foreground">
    {plugin.category}
  </span>
</div>
```

Updated code:
```tsx
<div className="flex items-center gap-2">
  <span className="font-medium text-foreground">
    {plugin.name}
  </span>
  {plugin.type === 'mcp' ? (
    <Badge className="px-1 py-0 text-[10px] border-blue-500/30 bg-blue-500/10 text-blue-400">
      MCP
    </Badge>
  ) : (
    <Badge className="px-1 py-0 text-[10px] border-purple-500/30 bg-purple-500/10 text-purple-400">
      Plugin
    </Badge>
  )}
  <span className="text-xs text-muted-foreground">
    {plugin.category}
  </span>
</div>
```

### SelectedPluginChips — chip row with badge (modification area)

Current chip inner content (after Icon, plugin.name span):
```tsx
<span className="text-xs font-semibold text-foreground">
  {plugin.name}
</span>
```

Add badge after the name span:
```tsx
<span className="text-xs font-semibold text-foreground">
  {plugin.name}
</span>
{plugin.type === 'mcp' ? (
  <Badge className="px-1 py-0 text-[10px] border-blue-500/30 bg-blue-500/10 text-blue-400">
    MCP
  </Badge>
) : (
  <Badge className="px-1 py-0 text-[10px] border-purple-500/30 bg-purple-500/10 text-purple-400">
    Plugin
  </Badge>
)}
```

### OptimizerApp — handleSampleData updated

```tsx
const handleSampleData = useCallback(() => {
  const sampleResult: ParseResult = {
    matched: ["context7", "playwright", "github", "superpowers", "omc"],
    unmatched: [],
  };
  handlePasteResult(sampleResult);
}, [handlePasteResult]);
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| MCP-only sample data (3 entries) | Mixed MCP+Plugin sample (5 entries) | Phase 12 | Triggers typeScope='both', shows conflict detection |
| MCP-only paste hint | MCP + Plugin paste hint | Phase 12 | Users learn both commands exist |
| No type badge in autocomplete | MCP/Plugin badge per item | Phase 12 | Visual type differentiation in search results |

**Note on `claude plugin list` output format (confirmed from existing test):**
The parse-mcp-list.test.ts at line 235-250 contains a real example:
```
Installed plugins:

  ❯ context7@some-marketplace
    Version: 1.0.0
    Scope: user
    Status: ✔ enabled

  ❯ superpowers@claude-plugins-official
    Version: 2.0.0
```
The `normalizeToken` function strips `@source` suffixes (verified: `normalizeToken("superpowers@claude-plugins-official") === "superpowers"`). This confirms `superpowers` and `omc` IDs will resolve correctly from `claude plugin list` format. However, the mixed-format parsing issue (Pitfall 1) still applies.

---

## Open Questions

1. **claude plugin list exact marketplace source string for omc**
   - What we know: `omc` resolves via alias `oh-my-claudecode` in ALIAS_MAP, and also directly as `omc` id
   - What's unclear: The exact `@source` suffix a real `claude plugin list` output would show for omc
   - Recommendation: Does not matter — we use direct ParseResult construction, bypassing parseMcpList for sample data

2. **Badge visual balance in SelectedPluginChips**
   - What we know: Chip has `px-3 py-1.5` with icon + name + desc — adding a badge increases width
   - What's unclear: Whether compact badge fits cleanly on mobile without wrapping
   - Recommendation: The chip already has `flex flex-wrap gap-2` at the container level so wrapping is handled; the badge is small enough (`text-[10px]`) to fit

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (vitest.config.ts present) |
| Config file | vitest.config.ts |
| Quick run command | `pnpm test -- --reporter=verbose lib/__tests__/parse-mcp-list.test.ts` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UI-03 | parseMcpList handles ❯ plugin list format | unit | `pnpm test -- lib/__tests__/parse-mcp-list.test.ts` | ✅ existing test covers format |
| UI-03 | sample data loads 5 plugins (3 MCP + 2 Plugin) | manual smoke | `pnpm dev` → /optimizer → click sample btn | manual |
| UI-04 | Badge renders for MCP type | visual | `pnpm dev` → /optimizer → type tab → search | manual |
| UI-04 | Badge renders for Plugin type | visual | `pnpm dev` → /optimizer → type tab → search | manual |
| I18N-01 | ko.ts/en.ts compile without type errors | type check | `pnpm typecheck` | ✅ existing typecheck |
| I18N-01 | build passes with no i18n errors | build | `pnpm build` | ✅ existing build |

### Sampling Rate
- **Per task commit:** `pnpm typecheck && pnpm build`
- **Per wave merge:** `pnpm test`
- **Phase gate:** `pnpm build` green (zero type errors) before `/gsd:verify-work`

### Wave 0 Gaps
None — existing test infrastructure covers all phase requirements. No new test files needed.

---

## Sources

### Primary (HIGH confidence)
- Direct code inspection of `lib/i18n/ko.ts`, `lib/i18n/en.ts`, `lib/i18n/types.ts` — confirmed exact keys to modify, no new keys needed
- Direct code inspection of `components/PluginTypeInput.tsx` — confirmed exact insertion point (lines 153-159)
- Direct code inspection of `components/SelectedPluginChips.tsx` — confirmed chip structure
- Direct code inspection of `components/ui/badge.tsx` — confirmed className override pattern
- Direct code inspection of `lib/parse-mcp-list.ts` — confirmed isPluginList detection logic and mixed-format limitation
- `lib/__tests__/parse-mcp-list.test.ts` line 235-250 — confirmed real `claude plugin list` format with `❯ name@source` pattern
- `lib/plugins.ts` PLUGIN_FIELD_OVERRIDES — confirmed `omc` and `superpowers` have `type: "plugin" as const`

### Secondary (MEDIUM confidence)
- N/A for this phase — all findings from direct code inspection

### Tertiary (LOW confidence)
- N/A

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already in project, Badge component confirmed
- Architecture: HIGH — all touch points verified from direct source reading
- Pitfalls: HIGH — parseMcpList mixed-format issue confirmed by reading the actual detection logic
- i18n: HIGH — Translations type structure fully read, modification scope is clear

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable codebase, no external dependencies changing)

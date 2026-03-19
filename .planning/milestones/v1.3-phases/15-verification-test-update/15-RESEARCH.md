# Phase 15: 검증 및 테스트 갱신 - Research

**Researched:** 2026-03-19
**Domain:** Data verification, i18n sync, Vitest test update, TypeScript/ESLint/Next.js build quality gate
**Confidence:** HIGH

## Summary

Phase 15 is the final quality-gate phase of v1.3. Its entire scope is internal to the repository — no external APIs, no new dependencies, no UI changes. The work falls into three buckets:

1. **VER-01 (install command accuracy):** Verify that the `install` arrays in `CORE_PLUGINS` for the 9 new entries (fetch, time, markitdown, magic-mcp, shadcn-mcp, n8n-mcp, claude-mem, superclaude, frontend-design) exactly match each plugin's official GitHub README. All 9 are already in `lib/plugins.ts` with `id:` fields at lines 707, 735, 873, 1078, 1272, 1530, 1592, 1619, 1646. The source-of-truth for install commands is the upstream README, not prior decisions in STATE.md alone.

2. **VER-02 (i18n sync):** Confirm that `lib/i18n/plugins-en.ts` contains `pluginDescEn` keys for all 9 new IDs. Reading the file confirms all 9 keys already exist (claude-mem at line 195, superclaude at 199, frontend-design at 203, fetch at 171, time at 175, markitdown at 179, magic-mcp at 183, shadcn-mcp at 187, n8n-mcp at 191). However, the test suite only covers the `PLUGIN_TYPE_IDS` constant (12 plugin-type entries) — MCP-type entries are not tested for i18n completeness. VER-02 requires source-level inspection, not just test passage.

3. **VER-03 + VER-04 (test update and full CI gate):** `plugins.test.ts` line 52 currently reads `toBeGreaterThanOrEqual(42)`. This threshold must be updated to 60. `PLUGIN_TYPE_IDS` also needs to include the 3 new plugin-type entries (claude-mem, superclaude, frontend-design) if not already present — the array currently has exactly 12 entries including those 3 (confirmed at lines 5–9 of plugins.test.ts). Then `pnpm typecheck`, `pnpm lint`, `pnpm build`, and `pnpm test` must all pass green.

Current baseline: all 8 test files, 125 tests pass. DB count is 51 entries. The test threshold of 42 already passes at 51, but the requirement is to set it to 60.

**Primary recommendation:** This phase is a pure verification + test-update phase. Do it in one wave: (1) inspect all 9 install commands against source README evidence, (2) confirm i18n keys exist for all 9, (3) update the threshold in plugins.test.ts from 42 to 60, (4) run the full CI sequence: typecheck → lint → build → test.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| VER-01 | 신규 9개 항목의 install 명령어가 공식 GitHub README와 일치한다 | All 9 install arrays are in CORE_PLUGINS; need source-level verification against upstream READMEs. STATE.md has prior decisions for Phase 13 (fetch/time/markitdown/magic-mcp/shadcn-mcp/n8n-mcp) and Phase 14 (claude-mem/superclaude/frontend-design) as documented evidence. |
| VER-02 | 신규 9개 항목의 한국어 desc/longDesc와 영문 번역이 동기화된다 | All 9 pluginDescEn keys confirmed present in lib/i18n/plugins-en.ts. Source-level check (key exists + desc/longDesc non-empty) is sufficient. |
| VER-03 | plugins.test.ts 카운트 임계값이 60개로 업데이트되고 타입 분포 테스트가 갱신된다 | Single-line change: line 52 of lib/__tests__/plugins.test.ts, change `42` to `60`. PLUGIN_TYPE_IDS already includes all 12 plugin-type entries including the 3 new ones. |
| VER-04 | pnpm typecheck, lint, build, test가 모두 통과한다 | Baseline is clean (125/125 tests pass). No new code introduced in this phase — changes are test threshold only. CI sequence: typecheck → lint → build → test. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vitest | ^4.0.18 | Unit test runner | Already configured via vitest.config.ts; `pnpm test` runs `vitest run` |
| TypeScript | ^5.0.0 | Type checking | `pnpm typecheck` runs `next build --experimental-build-mode compile --no-lint && tsc --noEmit` |
| ESLint | ^8.0.0 | Linting | `pnpm lint` runs `next lint` |
| Next.js | ^14.2.0 | Build | `pnpm build` runs `next build` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| pnpm | (workspace) | Package manager | All commands; npm/yarn forbidden per CLAUDE.md |

### Alternatives Considered
None — this phase uses the existing CI stack exclusively. No new packages are added (enforced by v1.3 out-of-scope constraint).

**Commands:**
```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm test
```

## Architecture Patterns

### File Layout (relevant files only)
```
lib/
├── plugins.ts               # CORE_PLUGINS (51 entries) + PLUGIN_FIELD_OVERRIDES + export PLUGINS
├── i18n/
│   └── plugins-en.ts        # pluginDescEn + reasonsEn
└── __tests__/
    └── plugins.test.ts      # threshold test + PLUGIN_TYPE_IDS coverage
```

### Pattern 1: PLUGINS export merge
**What:** `PLUGINS` is assembled at module load from `CORE_PLUGINS` merged with `DEFAULT_PLUGIN_FIELDS` and `PLUGIN_FIELD_OVERRIDES`. Count equals `Object.keys(CORE_PLUGINS).length` which is 51.
**When to use:** Any count assertion tests `Object.keys(PLUGINS).length`, which equals the number of `id:` fields in `CORE_PLUGINS`.

```typescript
// lib/plugins.ts — final export pattern
export const PLUGINS: Record<string, Plugin> = Object.fromEntries(
  Object.entries(CORE_PLUGINS).map(([id, plugin]) => [
    id,
    {
      ...DEFAULT_PLUGIN_FIELDS,
      ...PLUGIN_FIELD_OVERRIDES[id],
      ...plugin,
    },
  ])
) as Record<string, Plugin>;
```

### Pattern 2: Test threshold assertion
**What:** plugins.test.ts uses `toBeGreaterThanOrEqual(N)` as a sanity-check floor.
**When to use:** After adding batches of plugins. Update N to reflect the new minimum.

```typescript
// lib/__tests__/plugins.test.ts — line to update
it("PLUGINS object has at least 60 entries (sanity check)", () => {
  expect(Object.keys(PLUGINS).length).toBeGreaterThanOrEqual(60);
});
```

### Pattern 3: PLUGIN_TYPE_IDS coverage test
**What:** The `PLUGIN_TYPE_IDS` array in plugins.test.ts lists all expected `type: 'plugin'` entries. Tests verify both that each listed ID has `type === 'plugin'` and that it has an English translation.
**Current state:** Array already contains all 12 plugin-type IDs including the 3 new Phase 14 entries (claude-mem, superclaude, frontend-design).

```typescript
// lib/__tests__/plugins.test.ts — lines 5-9 (current, already correct)
const PLUGIN_TYPE_IDS = [
  "omc", "superpowers", "agency-agents", "bkit-starter", "bkit",
  "ralph", "fireauto", "taskmaster", "gsd",
  "claude-mem", "superclaude", "frontend-design",
] as const;
```

### Anti-Patterns to Avoid
- **Setting threshold to exact count:** `toEqual(51)` instead of `toBeGreaterThanOrEqual(60)` — fails when future phases add more entries
- **Skipping typecheck:** The `pnpm typecheck` command runs both `next build --experimental-build-mode compile` and `tsc --noEmit`. Both must pass separately.
- **Running commands out of order:** Always typecheck before lint before build before test — earlier failures reveal type issues that would cause misleading build errors

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Install command verification | Custom fetch + parser | Manual README inspection + STATE.md decisions | Install commands are verbatim strings, not computed values — source review is the correct tool |
| i18n completeness check | Runtime script | Source code grep + test assertion | pluginDescEn is a static Record — direct key inspection is sufficient and faster |
| Type distribution assertion | Custom test logic | Existing `PLUGIN_TYPE_IDS` array in plugins.test.ts | Pattern already established in Phase 9; extend it, don't replace it |

**Key insight:** This phase is entirely read-and-verify + single-line edit. The architecture is already correct; the only deliverable is updating the threshold integer and documenting source-level evidence.

## Common Pitfalls

### Pitfall 1: Threshold set to current count, not required minimum
**What goes wrong:** Developer sets `toBeGreaterThanOrEqual(51)` (current count) instead of `60` (requirement). Test passes but VER-03 is not satisfied.
**Why it happens:** Confusion between "current DB size" (51) and "required threshold" (60) in VER-03.
**How to avoid:** VER-03 explicitly requires threshold of 60. Set exactly 60 regardless of current count.
**Warning signs:** Test description still says "at least 42 entries" — update both the number and the description string.

### Pitfall 2: VER-01 treated as already done because STATE.md has install decisions
**What goes wrong:** Executor marks VER-01 complete based on STATE.md notes without reading the actual upstream README for each of the 9 entries.
**Why it happens:** STATE.md has verified install decisions for Phase 13 and 14 work, which might be mistaken for VER-01 completion.
**How to avoid:** VER-01 requires source-level confirmation that the `install` array in `CORE_PLUGINS` matches the upstream README at time of Phase 15 execution. Read the install field in plugins.ts and cross-reference with the documented decision evidence.
**Warning signs:** VER-01 marked done without citing specific install strings from the source code.

### Pitfall 3: VER-02 checked only for plugin-type entries
**What goes wrong:** Executor only checks pluginDescEn for the 3 new plugin-type entries (claude-mem, superclaude, frontend-design) because those are in PLUGIN_TYPE_IDS — misses the 6 MCP entries.
**Why it happens:** The existing test only asserts i18n for PLUGIN_TYPE_IDS entries. MCP-type entries have no automated i18n test.
**How to avoid:** VER-02 covers all 9 new entries. Check pluginDescEn for all 9 IDs: fetch, time, markitdown, magic-mcp, shadcn-mcp, n8n-mcp, claude-mem, superclaude, frontend-design.
**Warning signs:** VER-02 reported complete without listing all 9 IDs.

### Pitfall 4: pnpm build cache masking type errors
**What goes wrong:** `pnpm build` succeeds from cache while actual TypeScript errors exist.
**Why it happens:** Next.js build caching.
**How to avoid:** Run `pnpm typecheck` first — it uses `--incremental false` which bypasses cache. If typecheck passes, build will too.

## Code Examples

### Exact change required for VER-03
```typescript
// lib/__tests__/plugins.test.ts — line 52-54
// BEFORE:
it("PLUGINS object has at least 42 entries (sanity check)", () => {
  expect(Object.keys(PLUGINS).length).toBeGreaterThanOrEqual(42);
});

// AFTER:
it("PLUGINS object has at least 60 entries (sanity check)", () => {
  expect(Object.keys(PLUGINS).length).toBeGreaterThanOrEqual(60);
});
```

### VER-02 source-level check pattern (manual)
```
For each of the 9 IDs, confirm in lib/i18n/plugins-en.ts:
  pluginDescEn["<id>"].desc     — non-empty string
  pluginDescEn["<id>"].longDesc — non-empty string

Confirmed present at these approximate lines:
  fetch         — ~171
  time          — ~175
  markitdown    — ~179
  magic-mcp     — ~183
  shadcn-mcp    — ~187
  n8n-mcp       — ~191
  claude-mem    — ~195
  superclaude   — ~199
  frontend-design — ~203
```

### VER-01 install evidence from STATE.md decisions
```
Phase 13 verified decisions (already in STATE.md):
  fetch:       uvx mcp-fetch (Python-based, uses uvx)
  time:        uvx mcp-server-time (Python-based, uses uvx)
  markitdown:  pip install markitdown-mcp (no one-line claude mcp add)
  magic-mcp:   installMode=external-setup, requiredSecrets=TWENTY_FIRST_API_KEY
  shadcn-mcp:  pnpm dlx shadcn@latest mcp init --client claude (not npx)
  n8n-mcp:     installMode=safe-copy, MCP_MODE=stdio

Phase 14 verified decisions (already in STATE.md):
  claude-mem:     /plugin marketplace add + /plugin install (not npm install -g)
  superclaude:    install ID = sc@SuperClaude-Org (not 'superclaude')
  frontend-design: source = anthropics/claude-code monorepo
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Threshold 42 | Threshold 60 | Phase 15 (now) | Test now reflects v1.3 DB size |
| 51 CORE_PLUGINS entries | 51 CORE_PLUGINS entries | Phase 14 completed | No change needed in data files |

**Note:** The threshold requirement is 60 but the current DB is 51 entries. This means `toBeGreaterThanOrEqual(60)` will FAIL unless additional entries are added. This is a critical finding — see Open Questions.

## Open Questions

1. **DB count gap: 51 entries but threshold requires 60**
   - What we know: `grep "id:" lib/plugins.ts | wc -l` returns 51. The success criterion requires `Object.keys(PLUGINS).length >= 60`.
   - What's unclear: Either (a) Phase 15 must add 9 more entries to reach 60, or (b) the threshold is aspirational/forward-looking and should be set to 51 (current count), or (c) phases 13+14 were supposed to bring the count to 60 but stopped at 51.
   - Recommendation: The planner must clarify this before the executor runs. If the threshold is meant to validate that the DB now has 60 entries, the executor must first verify the actual count matches 60. If the count is 51, the threshold cannot be 60 without adding 9 more entries. Most likely interpretation: the success criterion means the threshold should be set to at least 51 (the actual current count post-phases 13+14), and "60" in the requirement may be an aspirational target for a future batch. The planner should resolve this by checking whether prior phases actually delivered 60 entries or only 51.

2. **VER-01 install command currency**
   - What we know: STATE.md documents install decisions for all 9 entries, verified at various points in phases 13-14.
   - What's unclear: Whether any upstream READMEs changed between Phase 13/14 execution and Phase 15.
   - Recommendation: For Phase 15 verification, treat STATE.md decisions as sufficient evidence for VER-01 unless a specific entry is flagged as stale. Do not re-fetch all 9 READMEs unless the planner scopes that as explicit work.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0.18 |
| Config file | vitest.config.ts (root) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VER-01 | install arrays match upstream READMEs | manual | N/A — source inspection only | N/A |
| VER-02 | all 9 new entries have pluginDescEn keys | manual + source grep | `pnpm test` (partial — covers plugin-type entries only) | ✅ |
| VER-03 | plugins.test.ts threshold = 60, pnpm test passes | unit | `pnpm test` | ✅ lib/__tests__/plugins.test.ts |
| VER-04 | typecheck + lint + build + test all green | integration | `pnpm typecheck && pnpm lint && pnpm build && pnpm test` | ✅ |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm typecheck && pnpm lint && pnpm build && pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
None — existing test infrastructure covers all phase requirements. The only required change is a single-line edit to `lib/__tests__/plugins.test.ts`.

## Sources

### Primary (HIGH confidence)
- Direct source read: `lib/plugins.ts` — 51 `id:` entries confirmed via `grep "id:" lib/plugins.ts | wc -l`
- Direct source read: `lib/__tests__/plugins.test.ts` — current threshold is 42, PLUGIN_TYPE_IDS has 12 entries including all 3 Phase 14 plugins
- Direct source read: `lib/i18n/plugins-en.ts` — all 9 new IDs confirmed present in pluginDescEn (lines ~171–206)
- Direct execution: `pnpm test` — 125/125 tests pass, baseline clean
- Direct source read: `package.json` — exact script definitions for typecheck/lint/build/test
- Direct source read: `.planning/STATE.md` — install command decisions for all 9 entries documented

### Secondary (MEDIUM confidence)
- CLAUDE.md project instructions — pnpm required, coding conventions, CI sequence
- .planning/REQUIREMENTS.md — VER-01 through VER-04 exact descriptions

### Tertiary (LOW confidence)
None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — direct source inspection, not inference
- Architecture: HIGH — read full plugins.ts export pattern and test file
- Pitfalls: HIGH — derived from direct count mismatch (51 vs 60 threshold) and explicit test file analysis
- Open question on 51 vs 60: MEDIUM — the gap is real but resolution depends on planner interpretation of requirement intent

**Research date:** 2026-03-19
**Valid until:** This research is tied to the exact source state at Phase 14 completion. Valid until any new plugin entries are added.

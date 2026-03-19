# Phase 16: 추천 이유 문자열 보완 - Research

**Researched:** 2026-03-19
**Domain:** TypeScript data file editing — `lib/plugin-reasons.ts` and `lib/i18n/plugins-en.ts`
**Confidence:** HIGH

## Summary

Phase 16 is a pure data-fill task. The recommendation engine (`lib/recommend.ts`) already works correctly: line 433 reads `REASONS[plugin.id] || plugin.desc`, which means any plugin whose ID is absent from `REASONS` silently falls back to `plugin.desc`. The 9 newly added entries (fetch, time, markitdown, magic-mcp, n8n-mcp, shadcn-mcp, claude-mem, superclaude, frontend-design) are all missing from the `REASONS` object, so users currently see the generic `desc` string on their recommendation cards instead of a tailored Korean reason.

RSN-01 requires adding Korean reason strings for all 9 IDs to `lib/plugin-reasons.ts`. RSN-02 requires resolving the orphaned `reasonsEn` export in `lib/i18n/plugins-en.ts`: that export already contains all 9 new entries (lines 252-261), but nothing in the codebase imports or uses it, making it a dead export. The fix is either to wire `reasonsEn` into the recommendation flow or delete it.

The correct resolution for RSN-02 is **deletion**: the English-facing recommendation flow does not currently use a separate reason string (the `AnalysisResult.recommendations[].reason` field is a single string, not locale-split), and the existing `REASONS` object is Korean-only. Introducing `reasonsEn` as a parallel lookup would require changes to `recommend.ts`, `types.ts`, and the card component — all out of scope for a data-only phase. Deleting `reasonsEn` is the minimal, safe path.

**Primary recommendation:** Add 9 Korean reason strings to `REASONS` in `lib/plugin-reasons.ts`; delete the orphaned `reasonsEn` export from `lib/i18n/plugins-en.ts`.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| RSN-01 | 신규 9개 항목의 Korean reason 문자열이 lib/plugin-reasons.ts REASONS 객체에 존재한다 | REASONS 객체 구조 확인 완료. 9개 ID 모두 누락 확인. 기존 패턴(Korean 서술형 1-2문장) 파악 완료. |
| RSN-02 | lib/i18n/plugins-en.ts의 reasonsEn export가 orphaned 상태가 아니다 (consumer 연결 또는 제거) | reasonsEn은 전체 codebase에서 단 한 곳도 import하지 않음 확인. 삭제가 안전한 유일한 옵션임을 확인. |
</phase_requirements>

---

## Standard Stack

### Core
| File | Purpose | Notes |
|------|---------|-------|
| `lib/plugin-reasons.ts` | REASONS: Record<string, string> — Korean tailored reason per plugin ID | Primary edit target for RSN-01 |
| `lib/i18n/plugins-en.ts` | English plugin descriptions + orphaned reasonsEn export | reasonsEn section to be deleted for RSN-02 |

### Supporting (read-only reference)
| File | Purpose | Notes |
|------|---------|-------|
| `lib/recommend.ts` line 433 | `REASONS[plugin.id] \|\| plugin.desc` — fallback logic | No changes needed here |
| `lib/i18n/plugins-en.ts` `pluginDescEn` | English desc/longDesc for all 9 new IDs | Already complete; reference for wording |
| `components/PluginCard.tsx` line 149 | `text={recommendation.reason}` — renders reason in card | No changes needed |

### Installation
No new packages needed. This is a data-only phase.

---

## Architecture Patterns

### How reason strings flow to the card

```
recommend(text)
  → REASONS[plugin.id] || plugin.desc   (lib/recommend.ts:433)
  → recommendation.reason               (AnalysisResult type)
  → <PluginCard recommendation={...} /> (components/PluginCard.tsx:149)
  → text={recommendation.reason}        (rendered in card body)
```

The `reason` field is a single string (not locale-split). The existing system is Korean-only for tailored reasons. English users currently also see Korean reason strings (no i18n switch exists in the recommendation card for this field).

### Pattern: REASONS object entry

All existing entries follow this pattern — Korean, 1-2 sentences, ends with `요.`:

```typescript
// Source: lib/plugin-reasons.ts (verified by reading file)
"sequential-thinking":
  "복잡한 추론이나 설계가 필요한 작업이에요. 단계별 사고로 아키텍처 품질을 높여줘요.",

context7:
  "외부 라이브러리나 API를 많이 쓰는 구조예요. 최신 공식 문서를 실시간 주입해서 환각 오류를 줄여줘요.",
```

Pattern rules (HIGH confidence, derived from reading all 35 existing entries):
- Korean only
- 1-2 sentences separated by a space
- Each sentence ends with `요.` (polite form)
- First sentence: describes the detected project signal (what triggers recommendation)
- Second sentence: what the plugin does to address that signal
- Length: 40-120 chars total

### Pattern: reasonsEn deletion

The `reasonsEn` export occupies lines 209-261 of `lib/i18n/plugins-en.ts`. Deleting it requires:
1. Removing lines 209-261 (the entire `export const reasonsEn = { ... }` block)
2. Running typecheck/lint to confirm no consumers existed

```typescript
// Before (lib/i18n/plugins-en.ts lines 209-261) — DELETE THIS BLOCK
export const reasonsEn: Record<string, string> = {
  omc: "Complex multi-agent tasks detected. ...",
  // ... 53 entries ...
  "frontend-design": "Frontend UI development detected. ...",
};
```

### Anti-Patterns to Avoid
- **Wiring reasonsEn into the recommendation flow**: Would require `recommend.ts`, `types.ts`, and `PluginCard.tsx` changes — all out of scope for a data phase
- **Adding only partial reason strings**: All 9 IDs must be present; the test suite does not yet check this, but the success criteria does
- **Using English in REASONS entries**: All existing entries are Korean; new entries must match the convention

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Finding good reason text | Custom analysis | Reference `pluginDescEn[id].desc` and existing Korean entries for each plugin — the wording is already established |
| Checking orphaned exports | Runtime analysis | Read the grep result: `reasonsEn` has zero imports in codebase |

---

## Common Pitfalls

### Pitfall 1: Forgetting the ID naming convention
**What goes wrong:** Entries with hyphens must use quoted string keys: `"magic-mcp"`, `"n8n-mcp"`, `"shadcn-mcp"`, `"claude-mem"`, `"frontend-design"`. Plain identifier keys would be a syntax error.
**How to avoid:** Match the existing pattern — `"agency-agents"`, `"brave-search"`, `"sequential-thinking"` all use quoted keys.

### Pitfall 2: Deleting too much from plugins-en.ts
**What goes wrong:** Accidentally deleting `pluginDescEn` (lines 1-207) which IS used by the test suite (`plugins.test.ts` line 3 imports it).
**How to avoid:** Delete only the `reasonsEn` block (lines 209-261). The `pluginDescEn` export on lines 1-207 must remain intact.

### Pitfall 3: Reason strings that don't match the style guide
**What goes wrong:** Writing English sentences, using formal `입니다` ending, or writing 3+ sentences would be inconsistent with the existing corpus.
**How to avoid:** Follow the pattern — Korean, polite `요.` ending, 1-2 sentences, signal + benefit structure.

### Pitfall 4: Not running the full CI pipeline
**What goes wrong:** typecheck passes but `pnpm test` reveals the plugins.test.ts `pluginDescEn` import broke because of a bad delete.
**How to avoid:** Run `pnpm typecheck && pnpm lint && pnpm build && pnpm test` in sequence after each file edit.

---

## Code Examples

### RSN-01: Adding 9 entries to REASONS

The 9 entries to add, following the established style:

```typescript
// Source: derived from lib/plugin-reasons.ts patterns + pluginDescEn wording
// Add to lib/plugin-reasons.ts REASONS object

// Existing last entry is cloudflare. Add after it:

fetch:
  "URL 콘텐츠를 가져와야 하는 작업이에요. API 응답이나 웹 페이지를 마크다운으로 변환해 Claude가 바로 읽을 수 있어요.",
time:
  "시간대 변환이나 현재 시각 조회가 필요한 프로젝트예요. 글로벌 팀 일정 조율과 로그 분석에 바로 활용할 수 있어요.",
markitdown:
  "PDF, Word, Excel 등 다양한 문서 파일을 분석해야 해요. 마크다운으로 변환해서 Claude가 문서 내용을 직접 이해할 수 있어요.",
"magic-mcp":
  "AI로 UI 컴포넌트를 빠르게 생성해야 하는 프로젝트예요. 자연어 명령으로 21st.dev 라이브러리 기반 프로덕션 품질 컴포넌트를 즉시 만들 수 있어요.",
"n8n-mcp":
  "워크플로 자동화나 n8n 연동이 필요한 프로젝트예요. n8n 인스턴스 없이도 7개 핵심 도구로 워크플로 설계와 검증을 시작할 수 있어요.",
"shadcn-mcp":
  "shadcn/ui 컴포넌트를 자주 쓰는 프로젝트예요. 공식 레지스트리에서 컴포넌트를 검색하고 설치까지 Claude Code 안에서 바로 처리해요.",
"claude-mem":
  "세션 간 컨텍스트 유지가 중요한 장기 프로젝트예요. 매 세션 작업 내용을 자동 저장해서 다음 세션에 바로 이어서 작업할 수 있어요.",
superclaude:
  "체계적인 개발 워크플로가 필요한 프로젝트예요. 29개 /sc: 커맨드와 23개 전문 에이전트로 Claude Code를 구조화된 개발 플랫폼으로 확장해요.",
"frontend-design":
  "프론트엔드 UI 개발이 포함된 프로젝트예요. Anthropic 공식 플러그인으로 진부한 AI 디자인에서 벗어나 독창적인 타이포그래피와 레이아웃을 만들 수 있어요.",
```

### RSN-02: Deleting reasonsEn from plugins-en.ts

```typescript
// lib/i18n/plugins-en.ts — DELETE lines 209-261 (the entire reasonsEn block)
// The file should end at line 207 with the closing }; of pluginDescEn

// BEFORE (keep):
export const pluginDescEn: Record<string, { desc: string; longDesc: string }> = {
  // ... all entries ...
};  // line 207 — this stays

// AFTER (delete everything from line 209 to EOF):
// export const reasonsEn: Record<string, string> = { ... };  <- DELETE
```

---

## State of the Art

| Old State | Current State | Impact |
|-----------|---------------|--------|
| 9 new plugins show `plugin.desc` in recommendation cards | After RSN-01: show tailored Korean reason | Card quality improvement for new entries |
| `reasonsEn` export exists but has 0 consumers | After RSN-02: export removed | Eliminates dead code, TypeScript orphan warning |

---

## Open Questions

1. **Should reasonsEn be preserved for future English locale support?**
   - What we know: The current recommendation card renders a single `reason` string with no locale switch. `reasonsEn` has 0 import consumers.
   - What's unclear: Whether a future phase plans to add English reason support via this export.
   - Recommendation: Delete it per RSN-02 — it can be re-added when the English locale flow is designed. Dead exports create confusion. If the team wants to preserve the strings, move them to a comment block or a separate notes file, not a live export.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest |
| Config file | `vitest.config.ts` (inferred from project conventions) |
| Quick run command | `pnpm test --run lib/__tests__/plugins.test.ts` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| RSN-01 | REASONS has all 9 new IDs | unit | Manual verification or new test | ❌ Wave 0 |
| RSN-02 | reasonsEn export removed, no TS error | type-check | `pnpm typecheck` | ✅ existing |

### Sampling Rate
- **Per task commit:** `pnpm typecheck && pnpm lint`
- **Per wave merge:** `pnpm typecheck && pnpm lint && pnpm build && pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Optional: add a test to `lib/__tests__/plugins.test.ts` verifying `REASONS` contains all 9 new IDs — not strictly required by RSN-01 success criteria but aligns with the project's test-per-data-change pattern.

---

## Sources

### Primary (HIGH confidence)
- `lib/plugin-reasons.ts` — direct read; confirmed 9 IDs absent
- `lib/i18n/plugins-en.ts` — direct read; confirmed `reasonsEn` export at lines 209-261 with all 9 entries already written
- `lib/recommend.ts` line 433 — direct read; confirmed `REASONS[plugin.id] || plugin.desc` fallback pattern
- `components/PluginCard.tsx` line 149 — direct read; confirmed `reason` renders as text
- `lib/__tests__/plugins.test.ts` — direct read; confirmed `pluginDescEn` is imported (must not be deleted)

### Secondary (MEDIUM confidence)
- Grep across all `lib/` and `app/` for `reasonsEn` — zero matches outside `plugins-en.ts` itself

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all files directly read
- Architecture: HIGH — data flow traced end-to-end in source
- Pitfalls: HIGH — derived from reading actual file structure and test assertions

**Research date:** 2026-03-19
**Valid until:** Stable — pure data file, no external dependencies

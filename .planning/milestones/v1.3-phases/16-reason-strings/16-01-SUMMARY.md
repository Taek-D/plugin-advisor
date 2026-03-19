---
phase: 16-reason-strings
plan: "01"
subsystem: recommendation-engine
tags: [reason-strings, i18n, cleanup, plugin-reasons]
dependency_graph:
  requires: []
  provides: [RSN-01, RSN-02]
  affects: [lib/recommend.ts, /advisor recommendation cards]
tech_stack:
  added: []
  patterns: [REASONS object lookup, Korean polite ending style]
key_files:
  created: []
  modified:
    - lib/plugin-reasons.ts
    - lib/i18n/plugins-en.ts
decisions:
  - "9 new Korean reason strings added to REASONS using quoted string keys for hyphenated IDs (magic-mcp, n8n-mcp, shadcn-mcp, claude-mem, frontend-design)"
  - "reasonsEn export deleted — was dead code with zero consumers; pluginDescEn retained intact"
metrics:
  duration: "4m 7s"
  completed_date: "2026-03-19"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 16 Plan 01: Reason Strings for Phase 13/14 Plugins Summary

**One-liner:** Added 9 tailored Korean reason strings for Phase 13/14 plugins (fetch through frontend-design) and removed the orphaned reasonsEn dead export from plugins-en.ts.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add 9 Korean reason strings to REASONS object | ae49d0f | lib/plugin-reasons.ts |
| 2 | Delete orphaned reasonsEn export and run full CI | 3478b6e | lib/i18n/plugins-en.ts |

## What Was Built

### Task 1: Korean Reason Strings (RSN-01)

Added 9 entries to the `REASONS` object in `lib/plugin-reasons.ts`, grouped under section comments matching the file's established pattern:

**MCP Servers (Phase 13):**
- `fetch` — URL 콘텐츠/API 응답 마크다운 변환
- `time` — 시간대 변환/글로벌 팀 일정 조율
- `markitdown` — PDF/Word/Excel 문서 마크다운 변환
- `magic-mcp` — AI UI 컴포넌트 자연어 생성
- `n8n-mcp` — 워크플로 자동화/n8n 연동
- `shadcn-mcp` — shadcn/ui 컴포넌트 검색/설치

**Plugins (Phase 14):**
- `claude-mem` — 세션 간 컨텍스트 자동 저장
- `superclaude` — 29개 /sc: 커맨드 구조화 워크플로
- `frontend-design` — Anthropic 공식 독창적 UI 디자인

All entries follow the established pattern: Korean, polite `요.` ending, 1-2 sentences, signal + benefit structure, ~60-100 chars. Hyphenated IDs use quoted string keys per TypeScript requirement.

### Task 2: Dead Code Removal (RSN-02)

Deleted the entire `reasonsEn` export block (53 lines) from `lib/i18n/plugins-en.ts`. This export had zero consumers in the codebase. The `pluginDescEn` export above it was left completely intact — it is imported by `lib/__tests__/plugins.test.ts` and remains the only export in the file.

## Verification Results

```
grep -c "fetch:|time:|markitdown:|magic-mcp|n8n-mcp|shadcn-mcp|claude-mem|superclaude|frontend-design" lib/plugin-reasons.ts
=> 9  ✓

grep -c "reasonsEn" lib/i18n/plugins-en.ts
=> 0  ✓

grep -c "pluginDescEn" lib/i18n/plugins-en.ts
=> 1  ✓

pnpm typecheck  ✓
pnpm lint       ✓
pnpm build      ✓
pnpm test       ✓  (125/125 tests pass)
```

## Decisions Made

1. **Quoted string keys for hyphenated IDs** — `magic-mcp`, `n8n-mcp`, `shadcn-mcp`, `claude-mem`, `frontend-design` all use `"key":` syntax per TypeScript identifier rules. Consistent with existing `"agency-agents"`, `"brave-search"`, etc.
2. **Section comment grouping** — New entries placed under `// MCP Servers (Phase 13)` and `// Plugins (Phase 14)` comments, mirroring the file's existing `// Orchestration`, `// Workflow`, etc. section style.
3. **reasonsEn fully deleted, not commented out** — Zero consumers confirmed by typecheck passing. No deprecation period needed for internal dead code.

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `lib/plugin-reasons.ts` exists and contains all 9 new entries
- [x] `lib/i18n/plugins-en.ts` exists with `pluginDescEn` intact and `reasonsEn` removed
- [x] Commit ae49d0f exists (Task 1)
- [x] Commit 3478b6e exists (Task 2)
- [x] Full CI (typecheck + lint + build + 125 tests) green

## Self-Check: PASSED

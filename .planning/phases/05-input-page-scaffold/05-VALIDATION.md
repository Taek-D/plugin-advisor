---
phase: 5
slug: input-page-scaffold
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-16
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest ^4.0.18 |
| **Config file** | `vitest.config.ts` (project root) |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm typecheck && pnpm lint && pnpm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm typecheck && pnpm test`
- **Before `/gsd:verify-work`:** `pnpm typecheck && pnpm lint && pnpm test` all green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-T1 | 01 | 1 | INPUT-01, INPUT-03 | unit | `pnpm test -- parse-mcp-list` | ❌ W0 | ⬜ pending |
| 05-01-T2 | 01 | 1 | INPUT-02, PAGE-03 | unit | `pnpm typecheck` | ❌ W0 | ⬜ pending |
| 05-02-T1 | 02 | 2 | PAGE-01, PAGE-02 | smoke | manual | N/A | ⬜ pending |
| 05-02-T2 | 02 | 2 | INPUT-01, INPUT-02 | smoke | manual | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/__tests__/parse-mcp-list.test.ts` — covers INPUT-01 (parseMcpList), INPUT-03 (normalizeToken, resolvePluginId)
- [ ] `lib/__tests__/optimizer.test.ts` — covers INPUT-02 (filterPlugins substring logic)

*Existing infrastructure: `vitest.config.ts` configured with `@` alias, test environment `node`. No framework install needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| /optimizer route renders | PAGE-01 | Page shell + layout requires browser | Navigate to /optimizer, verify page loads |
| AI Coming Soon disabled | PAGE-02 | Button interaction state | Click AI button, verify no action |
| i18n language switch | PAGE-03 | Full page render in both locales | Toggle ko/en, verify all text translates |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 5s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-03-16

---
phase: 06
slug: scoring-engine
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 06 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (vitest.config.ts confirmed) |
| **Config file** | `vitest.config.ts` — root-level, node environment, `@` alias configured |
| **Quick run command** | `pnpm test --reporter=verbose lib/__tests__/scoring.test.ts` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test lib/__tests__/scoring.test.ts`
- **After every plan wave:** Run `pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | ANLYS-01 | unit | `pnpm test lib/__tests__/scoring.test.ts` | ❌ W0 | ⬜ pending |
| 06-01-02 | 01 | 1 | ANLYS-02 | unit | `pnpm test lib/__tests__/scoring.test.ts` | ❌ W0 | ⬜ pending |
| 06-01-03 | 01 | 1 | ANLYS-03 | unit | `pnpm test lib/__tests__/scoring.test.ts` | ❌ W0 | ⬜ pending |
| 06-01-04 | 01 | 1 | RECOM-01 | unit | `pnpm test lib/__tests__/scoring.test.ts` | ❌ W0 | ⬜ pending |
| 06-01-05 | 01 | 1 | RECOM-02 | unit | `pnpm test lib/__tests__/scoring.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/__tests__/scoring.test.ts` — stubs for ANLYS-01, ANLYS-02, ANLYS-03, RECOM-01, RECOM-02
- [ ] `lib/scoring.ts` — the module under test (must exist before tests can run)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Score changes when plugins added/removed | ANLYS-02 | UI reactivity | Add/remove plugin in /optimizer, observe score update |
| Covered/uncovered categories visually distinct | ANLYS-03 | Visual check | Verify coverage display in Phase 7 UI |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

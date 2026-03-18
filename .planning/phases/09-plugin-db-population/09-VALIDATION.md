---
phase: 9
slug: plugin-db-population
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm test -- lib/__tests__/plugins.test.ts` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck && pnpm test -- lib/__tests__/plugins.test.ts`
- **After every plan wave:** Run `pnpm typecheck && pnpm lint && pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green (`pnpm build` included)
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | DATA-01 | unit | `pnpm test -- lib/__tests__/plugins.test.ts` | ❌ W0 update | ⬜ pending |
| 09-01-02 | 01 | 1 | DATA-02 | typecheck | `pnpm typecheck` | ✅ | ⬜ pending |
| 09-01-03 | 01 | 1 | DATA-03 | typecheck | `pnpm typecheck` | ✅ | ⬜ pending |
| 09-02-01 | 02 | 1 | I18N-02 | unit | `pnpm test -- lib/__tests__/plugins.test.ts` | ❌ W0 update | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/__tests__/plugins.test.ts` — Phase 8 baseline 테스트 업데이트:
  - Plugin 재분류 항목들(13개 이상)이 `type === 'plugin'`임을 검증
  - MCP 항목들이 `type === 'mcp'`임을 검증
  - `pluginDescEn`에 모든 Plugin 항목 영문 번역이 존재함을 검증

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

---
phase: 8
slug: type-system-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm test -- lib/__tests__/parse-mcp-list.test.ts` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck && pnpm test -- lib/__tests__/parse-mcp-list.test.ts`
- **After every plan wave:** Run `pnpm typecheck && pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | TYPE-01 | typecheck | `pnpm typecheck` | ✅ | ⬜ pending |
| 08-01-02 | 01 | 1 | TYPE-01 | unit | `pnpm test -- lib/__tests__/plugins.test.ts` | ❌ W0 | ⬜ pending |
| 08-01-03 | 01 | 1 | TYPE-02 | typecheck | `pnpm typecheck` | ✅ | ⬜ pending |
| 08-01-04 | 01 | 1 | TYPE-02 | unit | `pnpm test -- lib/__tests__/parse-mcp-list.test.ts` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/__tests__/plugins.test.ts` — TYPE-01: getPlugins() 반환값에 type 필드 존재 및 'mcp' 값 검증 (최소 2 assertions)

*Existing infrastructure covers TYPE-02 (parse-mcp-list.test.ts exists).*

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

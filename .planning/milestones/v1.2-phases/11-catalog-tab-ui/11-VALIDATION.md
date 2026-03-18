---
phase: 11
slug: catalog-tab-ui
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (vitest.config.ts, environment: node) |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm test --run lib/__tests__/catalog-tab.test.ts` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck && pnpm lint`
- **After every plan wave:** Run `pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green + `pnpm build` green + manual browser verify
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | UI-01 | unit | `pnpm test --run lib/__tests__/catalog-tab.test.ts` | ❌ W0 | ⬜ pending |
| 11-01-02 | 01 | 1 | UI-01 | typecheck | `pnpm typecheck` | ✅ | ⬜ pending |
| 11-01-03 | 01 | 1 | UI-02 | manual | manual: open /plugins?type=plugin, verify tab | N/A | ⬜ pending |
| 11-01-04 | 01 | 1 | UI-02 | manual | manual: navigate to detail, back, verify tab preserved | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/__tests__/catalog-tab.test.ts` — unit test for type-filter AND logic (covers UI-01 filter behavior)
- [ ] No framework install needed — Vitest already configured

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| URL param ?type=plugin initializes correct tab | UI-02 | useSearchParams requires browser environment | Open /plugins?type=plugin, verify Plugin tab is active |
| Back navigation preserves tab state | UI-02 | Router behavior requires real browser | Navigate to /plugins/[id], press back, verify tab preserved |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

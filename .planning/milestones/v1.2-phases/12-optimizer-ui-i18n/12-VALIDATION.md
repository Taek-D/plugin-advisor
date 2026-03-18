---
phase: 12
slug: optimizer-ui-i18n
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm typecheck` |
| **Full suite command** | `pnpm test && pnpm build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck`
- **After every plan wave:** Run `pnpm test && pnpm build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 12-01-01 | 01 | 1 | I18N-01 | type check | `pnpm typecheck` | ✅ existing | ⬜ pending |
| 12-01-02 | 01 | 1 | UI-03 | type check | `pnpm typecheck` | ✅ existing | ⬜ pending |
| 12-01-03 | 01 | 1 | UI-03 | manual smoke | `pnpm dev` → /optimizer → sample btn | manual | ⬜ pending |
| 12-01-04 | 01 | 1 | UI-04 | manual smoke | `pnpm dev` → /optimizer → type tab → search | manual | ⬜ pending |
| 12-01-05 | 01 | 1 | UI-04 | manual smoke | `pnpm dev` → /optimizer → check chips | manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test files needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sample data loads 5 plugins (3 MCP + 2 Plugin) | UI-03 | Visual confirmation of correct plugin loading | Click "샘플 데이터로 시작", verify 5 chips appear |
| MCP badge renders blue in dropdown | UI-04 | Visual styling check | Type "context7" in autocomplete, verify blue MCP badge |
| Plugin badge renders purple in dropdown | UI-04 | Visual styling check | Type "superpowers" in autocomplete, verify purple Plugin badge |
| Badge appears on selected chips | UI-04 | Visual styling check | Add plugins, verify chips show type badge |

*All automated verifications use existing `pnpm typecheck` and `pnpm build`.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

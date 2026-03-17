---
phase: 07
slug: results-ui-assembly
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 07 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0.18 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test && pnpm typecheck && pnpm lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| TBD | 01 | 1 | PAGE-04 | unit (existing) | `pnpm test` | ✅ lib/__tests__/scoring.test.ts | ⬜ pending |
| TBD | 01 | 1 | PAGE-04 | typecheck | `pnpm typecheck` | ✅ tsconfig.json | ⬜ pending |
| TBD | 01 | 2 | PAGE-04 | manual | browser visual inspection | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/optimizer-utils.ts` — `getCategoryIcon()` helper; needed by CoverageGrid, RecommendPluginCard, ReplacementCard
- [ ] New i18n keys in `lib/i18n/types.ts`, `lib/i18n/ko.ts`, `lib/i18n/en.ts` — needed by all result components

*No new test files required — component tests are not part of this project's testing pattern. Existing scoring tests cover the data layer.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Collapsible sections start closed, expand on click | PAGE-04 | UI interaction, no component test framework | Open /optimizer, analyze, verify complement/replacement sections are collapsed, click to expand |
| Mobile + desktop layout without overlap | PAGE-04 | Responsive layout, visual inspection | Resize browser or use DevTools device mode, verify no content overlap or clipping |
| Empty input (0 plugins) shows guidance message | PAGE-04 | Could be unit-tested but empty branch already covered in scoring.test.ts | Click Analyze with no plugins, verify friendly message (not error) appears |
| Circular gauge renders correct color per grade | PAGE-04 | SVG visual rendering | Test scores 90, 70, 50, 30 — verify green, blue, yellow, red respectively |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

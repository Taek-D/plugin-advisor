---
phase: 19
slug: share-feedback-newsletter
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 19 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (vitest.config.ts) |
| **Config file** | `vitest.config.ts` — esbuild jsx automatic, node environment, `@` alias |
| **Quick run command** | `pnpm test -- share-utils` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck && pnpm test -- [test-file-name]`
- **After every plan wave:** Run `pnpm test && pnpm typecheck && pnpm lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 19-01-01 | 01 | 1 | SHAR-01,SHAR-02,SHAR-03 | unit | `pnpm test -- share-utils` | ❌ W0 | ⬜ pending |
| 19-01-02 | 01 | 1 | FDBK-02 | unit | `pnpm test -- feedback-route` | ❌ W0 | ⬜ pending |
| 19-01-03 | 01 | 1 | NEWS-02 | unit | `pnpm test -- newsletter-route` | ❌ W0 | ⬜ pending |
| 19-02-01 | 02 | 1 | SHAR-01,SHAR-02 | unit | `pnpm test -- share-utils` | ❌ W0 | ⬜ pending |
| 19-03-01 | 03 | 2 | FDBK-01 | manual | `pnpm dev` visual check | — | ⬜ pending |
| 19-03-02 | 03 | 2 | FDBK-02 | unit | `pnpm test -- feedback-route` | ❌ W0 | ⬜ pending |
| 19-03-03 | 03 | 2 | FDBK-03 | manual | `pnpm dev` + admin login | — | ⬜ pending |
| 19-03-04 | 03 | 2 | NEWS-01 | manual | `pnpm dev` visual check | — | ⬜ pending |
| 19-03-05 | 03 | 2 | NEWS-02 | unit | `pnpm test -- newsletter-route` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `lib/__tests__/share-utils.test.ts` — stubs for SHAR-01, SHAR-02, SHAR-03
- [ ] `lib/__tests__/feedback-route.test.ts` — stubs for FDBK-02
- [ ] `lib/__tests__/newsletter-route.test.ts` — stubs for NEWS-02

*Existing infrastructure covers framework install — Vitest already configured.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| FeedbackWidget renders and slides up on click | FDBK-01 | CSS transition + DOM positioning requires visual verification | 1. Open any page 2. Click floating feedback button 3. Verify panel slides up 4. Submit form 5. Verify success state |
| Admin feedback list shows submitted items | FDBK-03 | Server component with admin auth requires login flow | 1. Login to /admin 2. Navigate to /admin/feedback 3. Verify feedback items display |
| NewsletterForm renders above footer and submits | NEWS-01 | Inline form positioning + success state requires visual verification | 1. Open landing page 2. Scroll to newsletter section 3. Enter email 4. Submit 5. Verify success message |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

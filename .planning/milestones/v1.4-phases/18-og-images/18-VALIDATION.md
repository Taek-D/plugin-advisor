---
phase: 18
slug: og-images
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 18 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm build && pnpm test` |
| **Estimated runtime** | ~30 seconds (build generates all static OG images) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm build && pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 18-01-01 | 01 | 1 | OGIM-01 | build + manual | `pnpm build` | ✅ | ⬜ pending |
| 18-01-02 | 01 | 1 | OGIM-01 | build | `pnpm build` | ✅ | ⬜ pending |
| 18-02-01 | 02 | 2 | OGIM-02 | build + manual | `pnpm build` | ✅ | ⬜ pending |
| 18-02-02 | 02 | 2 | OGIM-03 | build + manual | `pnpm build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

- OG image generation uses `next/og` built-in — no additional test framework needed
- Build process (`pnpm build`) validates all `opengraph-image.tsx` files compile and generate images
- Existing vitest setup handles any unit tests for shared utilities

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Default OG renders with brand elements | OGIM-01 | Visual design quality check | 1. Run `pnpm dev` 2. Visit `/opengraph-image` 3. Verify dark bg, accent bars, brand text, URL |
| Plugin OG shows correct data + color | OGIM-02 | Visual + data accuracy | 1. Visit `/plugins/context7/opengraph-image` 2. Verify plugin name, tag, type badge, category, accent color matches plugin.color |
| Guide OG shows title + summary | OGIM-03 | Visual + Korean text rendering | 1. Visit `/guides/first-project/opengraph-image` 2. Verify guide title, summary text, brand accent |
| Social card preview | ALL | External platform rendering | Use Facebook Sharing Debugger / Twitter Card Validator with deployed URLs |
| Meta tags in page source | ALL | HTML output verification | View source of each page type, confirm `og:image` and `twitter:image` meta tags present |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

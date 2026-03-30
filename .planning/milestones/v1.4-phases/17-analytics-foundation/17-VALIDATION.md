---
phase: 17
slug: analytics-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-29
---

# Phase 17 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm typecheck && pnpm lint && pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green + browser smoke test (DevTools: no CSP errors, Umami dashboard shows pageview)
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 17-01-01 | 01 | 1 | ANLY-02 | unit | `pnpm test -- csp` | ❌ W0 | ⬜ pending |
| 17-01-02 | 01 | 1 | ANLY-01 | unit | `pnpm test -- analytics` | ❌ W0 | ⬜ pending |
| 17-01-03 | 01 | 1 | ANLY-01 | unit | `pnpm test -- analytics` | ❌ W0 | ⬜ pending |
| 17-02-01 | 02 | 2 | ANLY-03 | unit | `pnpm test -- analytics` | ❌ W0 | ⬜ pending |
| 17-02-02 | 02 | 2 | ANLY-04 | unit (mock fetch) | `pnpm test -- umami` | ❌ W0 | ⬜ pending |
| 17-02-03 | 02 | 2 | FDBK-02 | manual | n/a — SQL migration | ❌ W0 | ⬜ pending |
| 17-02-04 | 02 | 2 | NEWS-02 | manual | n/a — SQL migration | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/analytics.test.ts` — stubs for ANLY-01, ANLY-03 (UmamiScript render + trackEvent forwarding)
- [ ] `tests/csp.test.ts` — stubs for ANLY-02 (parse CSP string, assert `cloud.umami.is` in directives)
- [ ] `tests/umami-proxy.test.ts` — stubs for ANLY-04 (mock fetch, assert upstream URL and response)
- [ ] `supabase/migrations/20260329_create_feedback.sql` — covers FDBK-02 table
- [ ] `supabase/migrations/20260329_create_newsletter_subscribers.sql` — covers NEWS-02 table

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Umami dashboard shows pageview | ANLY-01 | Requires live Umami Cloud account | 1. Deploy to Vercel preview 2. Visit any page 3. Check Umami Cloud dashboard for pageview |
| No CSP errors in browser DevTools | ANLY-02 | Requires real browser CSP enforcement | 1. Open deployed site 2. Open DevTools Console 3. Confirm no CSP violation errors |
| Supabase `feedback` table exists with RLS | FDBK-02 | SQL migration applied via Supabase dashboard | 1. Run migration SQL 2. Check table in Supabase dashboard 3. Verify RLS policies |
| Supabase `newsletter_subscribers` table exists with RLS | NEWS-02 | SQL migration applied via Supabase dashboard | 1. Run migration SQL 2. Check table in Supabase dashboard 3. Verify RLS policies and unique constraint |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

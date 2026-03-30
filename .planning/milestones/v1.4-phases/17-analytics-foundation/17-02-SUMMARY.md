---
phase: 17-analytics-foundation
plan: 02
subsystem: analytics
tags: [umami, analytics, proxy, supabase, migrations, tdd]

# Dependency graph
requires:
  - 17-01 (UmamiScript component + Window.umami type declaration)
provides:
  - Umami event forwarding in trackEvent() (analytics.ts)
  - /api/umami proxy route for ad-blocker bypass
  - feedback Supabase table with RLS (Phase 19 ready)
  - newsletter_subscribers Supabase table with RLS + unique email (Phase 19 ready)
affects:
  - Phase 19 (feedback widget + newsletter form will write to these tables)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Optional chaining for graceful Umami forwarding (window.umami?.track)
    - Fetch proxy pattern with prefix stripping (/api/umami -> cloud.umami.is)
    - Supabase RLS pattern: anon INSERT + service_role SELECT/UPDATE
    - vi.mock("next/server") for route handler unit tests in broken node_modules env

key-files:
  created:
    - app/api/umami/route.ts
    - supabase/migrations/20260329_create_feedback.sql
    - supabase/migrations/20260329_create_newsletter_subscribers.sql
    - lib/__tests__/analytics-umami.test.ts
    - lib/__tests__/umami-proxy.test.ts
  modified:
    - lib/analytics.ts

key-decisions:
  - "Umami forwarding is purely additive — localStorage logic untouched, window.umami?.track added after try/catch"
  - "Proxy route uses Object.fromEntries(req.headers.entries()) to spread headers then overrides host"
  - "vi.mock('next/server') pattern established for all route handler tests in this project"
  - "newsletter confirmed column defaults false — email verification deferred to NEWS-03 v2"

requirements-completed: [ANLY-03, ANLY-04, FDBK-02, NEWS-02]

# Metrics
duration: 8min
completed: 2026-03-29
---

# Phase 17 Plan 02: Analytics Event Forwarding + DB Foundation Summary

**Umami event forwarding wired into trackEvent() via optional chaining, ad-blocker bypass proxy route created, and Supabase tables for feedback and newsletter prepared**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-29T11:55:51Z
- **Completed:** 2026-03-29T12:04:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- `lib/analytics.ts`: added `window.umami?.track(event, payload)` after localStorage write — events now flow to Umami Cloud while preserving all existing behavior
- `app/api/umami/route.ts`: proxy route strips `/api/umami` prefix and forwards GET/POST to `https://cloud.umami.is` with correct host header — bypasses ad-blockers
- `supabase/migrations/20260329_create_feedback.sql`: feedback table with id, created_at, page, rating (1-5 check), message, contact; RLS anon INSERT + service_role SELECT
- `supabase/migrations/20260329_create_newsletter_subscribers.sql`: newsletter_subscribers table with unique email constraint, confirmed boolean (default false), source; RLS anon INSERT + service_role SELECT/UPDATE
- 10 new unit tests added (5 analytics-umami + 5 umami-proxy); full test suite 139/139 passing

## Task Commits

Each task was committed atomically:

1. **Task 1: analytics.ts Umami forwarding + proxy route** — `ecb08e5` (feat)
2. **Task 1 fix: proxy test next/server mock** — `d867e07` (fix)
3. **Task 2: Supabase migration files** — `8c75159` (feat)

## Files Created/Modified

- `lib/analytics.ts` — added `window.umami?.track(event, payload)` line after localStorage try/catch
- `app/api/umami/route.ts` — GET/POST proxy handler forwarding to cloud.umami.is
- `lib/__tests__/analytics-umami.test.ts` — 5 tests: Umami forwarding, localStorage preservation, SSR guard, graceful no-op
- `lib/__tests__/umami-proxy.test.ts` — 5 tests: prefix stripping, POST body forwarding, status passthrough, host header, query string
- `supabase/migrations/20260329_create_feedback.sql` — feedback table + RLS policies
- `supabase/migrations/20260329_create_newsletter_subscribers.sql` — newsletter_subscribers table + RLS policies

## Decisions Made

- Used `window.umami?.track(event, payload)` optional chaining — zero-throw guarantee when Umami script not loaded or blocked
- Proxy route spreads all incoming headers then overrides `host` to `cloud.umami.is` — preserves user-agent and content-type
- `newsletter_subscribers.confirmed` defaults to `false` — email verification is a v2 feature (NEWS-03), not needed for Phase 17
- RLS service_role check uses `auth.role() = 'service_role'` consistent with existing project migrations

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added vi.mock("next/server") to umami-proxy.test.ts**
- **Found during:** Task 1 (TDD GREEN phase — first test run of proxy tests)
- **Issue:** `app/api/umami/route.ts` imports from `next/server`; vitest node environment throws `Cannot find package 'next/server'` (broken node_modules, same root cause as Plan 01)
- **Fix:** Added `vi.mock("next/server", ...)` at top of test file providing MockNextRequest and MockNextResponse; replaced direct NextRequest usage with `makeMockReq()` helper to avoid type dependency
- **Files modified:** `lib/__tests__/umami-proxy.test.ts`
- **Verification:** All 5 proxy tests pass; 139/139 full suite passes
- **Committed in:** `d867e07` (separate fix commit after initial Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Fix required due to pre-existing broken node_modules (next package missing). No scope creep. All plan goals met.

## Issues Encountered

- `pnpm lint` and `pnpm build` cannot run — `next` binary missing from node_modules (pre-existing EPERM issue, confirmed in Plan 01 summary)
- `pnpm typecheck` also blocked; ran `tsc --noEmit` directly — confirmed our new files (`lib/analytics.ts`, `app/api/umami/route.ts`) introduce zero new TypeScript errors; all visible errors are pre-existing in untouched files

## User Setup Required

Before production use, the following manual steps are needed:

1. **Umami Cloud**: Create account at https://cloud.umami.is, add website, copy Website ID
   - Set `NEXT_PUBLIC_UMAMI_WEBSITE_ID=<your-website-id>` in Vercel dashboard + `.env.local`
   - Set `NEXT_PUBLIC_UMAMI_PROXY_URL=/api/umami` in Vercel dashboard + `.env.local`

2. **Supabase**: Run both migration files in Supabase SQL Editor:
   - `supabase/migrations/20260329_create_feedback.sql`
   - `supabase/migrations/20260329_create_newsletter_subscribers.sql`

## Next Phase Readiness

- Analytics pipeline complete: `trackEvent()` → localStorage + Umami → `/api/umami` proxy → `cloud.umami.is`
- Phase 19 can write to `feedback` and `newsletter_subscribers` tables via Supabase service role
- Phase 18 (OG images) is independent and can proceed without dependencies on this plan

---
*Phase: 17-analytics-foundation*
*Completed: 2026-03-29*

## Self-Check: PASSED

- FOUND: lib/analytics.ts
- FOUND: app/api/umami/route.ts
- FOUND: lib/__tests__/analytics-umami.test.ts
- FOUND: lib/__tests__/umami-proxy.test.ts
- FOUND: supabase/migrations/20260329_create_feedback.sql
- FOUND: supabase/migrations/20260329_create_newsletter_subscribers.sql
- FOUND: .planning/phases/17-analytics-foundation/17-02-SUMMARY.md
- FOUND commit: ecb08e5 (feat(17-02): add Umami event forwarding and ad-blocker bypass proxy route)
- FOUND commit: d867e07 (fix(17-02): update umami-proxy test to mock next/server)
- FOUND commit: 8c75159 (feat(17-02): add Supabase migration files for feedback and newsletter tables)

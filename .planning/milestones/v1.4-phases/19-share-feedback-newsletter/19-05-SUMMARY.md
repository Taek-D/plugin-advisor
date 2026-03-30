---
phase: 19-share-feedback-newsletter
plan: 05
subsystem: feedback
tags: [supabase, types, feedback, rating, i18n, gap-closure]
dependency_graph:
  requires: ["19-04"]
  provides: ["typed-supabase-client", "star-rating-ui", "feedback-rating-storage"]
  affects: ["components/FeedbackWidget.tsx", "app/api/feedback/route.ts", "app/api/newsletter/route.ts", "lib/supabase-admin.ts"]
tech_stack:
  added: []
  patterns: ["manual Database type definition for Supabase", "SupabaseClient<Database> generic", "star rating with hover preview"]
key_files:
  created:
    - lib/supabase-types.ts
  modified:
    - lib/supabase-admin.ts
    - app/api/feedback/route.ts
    - app/api/newsletter/route.ts
    - components/FeedbackWidget.tsx
    - lib/i18n/types.ts
    - lib/i18n/ko.ts
    - lib/i18n/en.ts
    - app/admin/feedback/page.tsx
    - lib/__tests__/feedback-route.test.ts
decisions:
  - "Relationships: [] required on each table in Database type — GenericTable contract from @supabase/postgrest-js@2.98.0 requires this field"
  - "Use SupabaseClient<Database> instead of ReturnType<typeof createClient<Database>> — TypeScript cannot infer generics from typeof"
  - "Rating is optional (nullable) in both DB and UI — no validation error for missing rating"
metrics:
  duration_minutes: 9
  tasks_completed: 2
  files_changed: 9
  completed_date: "2026-03-30"
---

# Phase 19 Plan 05: Supabase Types + Star Rating Gap Closure Summary

**One-liner:** Manual Supabase Database type with Relationships field restores type safety, star rating UI sends 1-5 nullable rating to feedback table.

## What Was Built

### Task 1: Supabase Type Definitions + Remove @ts-expect-error

Created `lib/supabase-types.ts` with manual `Database` type covering the two Phase 17 tables (`feedback`, `newsletter_subscribers`). The critical discovery was that `@supabase/postgrest-js@2.98.0`'s `GenericTable` contract requires a `Relationships: []` field — omitting it caused TypeScript to resolve insert values as `never`. Also discovered that `ReturnType<typeof createClient<Database>>` is invalid TypeScript; `SupabaseClient<Database>` is the correct approach.

Updated `lib/supabase-admin.ts` to import `SupabaseClient` from `@supabase/supabase-js` and use `createClient<Database>` + `SupabaseClient<Database>` for the cached client type. Both `@ts-expect-error` directives removed from `app/api/feedback/route.ts` and `app/api/newsletter/route.ts`.

### Task 2: Star Rating UI + i18n + API Route

Added 1-5 star rating selector to `FeedbackWidget.tsx`:
- `rating` state (0 = none selected) and `hoverRating` for visual hover preview
- Star row rendered between type selector and textarea using `★` character with yellow-500/muted-foreground/30 color toggle
- Rating sent as `number | null` in POST body; reset to 0 on close
- Added `ratingLabel` key to i18n: "만족도" (ko) / "Satisfaction" (en)

Updated `app/api/feedback/route.ts` to parse, validate (1-5 range, round to int), and insert `rating` into Supabase. Added `rating: number | null` field to `FeedbackRow` type and star display (`★☆` pattern) in `app/admin/feedback/page.tsx`.

Updated `lib/__tests__/feedback-route.test.ts` to expect `rating: null` in the insert mock call (Rule 1 auto-fix — test was testing the correct behavior but needed updating to match new schema).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Missing `Relationships` field in Database type caused `never` insert type**
- **Found during:** Task 1 typecheck
- **Issue:** `@supabase/postgrest-js@2.98.0` `GenericTable` requires `Relationships: GenericRelationship[]`. Without it, the table's Insert/Row types resolve to `never`, causing TS2769 overload errors.
- **Fix:** Added `Relationships: []` to both `feedback` and `newsletter_subscribers` table definitions in `lib/supabase-types.ts`.
- **Files modified:** `lib/supabase-types.ts`
- **Commit:** 83bbcad

**2. [Rule 1 - Bug] `ReturnType<typeof createClient<Database>>` is invalid TypeScript**
- **Found during:** Task 1 (same typecheck pass)
- **Issue:** TypeScript cannot infer generic parameters from `typeof` — the expression doesn't compile as expected, leaving `cachedClient` un-typed.
- **Fix:** Changed to `SupabaseClient<Database>` by importing `SupabaseClient` from `@supabase/supabase-js`.
- **Files modified:** `lib/supabase-admin.ts`
- **Commit:** 83bbcad

**3. [Rule 1 - Bug] Feedback route test expected insert call without `rating` field**
- **Found during:** Task 2 test run
- **Issue:** `feedback-route.test.ts` line 98 checked `toHaveBeenCalledWith({ page, message, type })` but after the Task 2 change the route always passes `rating` (null when absent).
- **Fix:** Updated test expectation to include `rating: null`.
- **Files modified:** `lib/__tests__/feedback-route.test.ts`
- **Commit:** fce33d1

## Verification Results

- `pnpm typecheck` — passes, no errors, no @ts-expect-error
- `pnpm test -- feedback-route` — 151/151 tests pass (13 test files)
- `pnpm build` — full production build succeeds (84 static pages)
- No `@ts-expect-error` in `app/api/feedback/route.ts` or `app/api/newsletter/route.ts`
- `rating` present in `components/FeedbackWidget.tsx` (3 occurrences)
- `Database` present in `lib/supabase-admin.ts` (3 occurrences)

## Commits

| Hash | Message |
|------|---------|
| 83bbcad | feat(19-05): create Supabase type definitions + remove @ts-expect-error |
| fce33d1 | feat(19-05): add star rating UI to FeedbackWidget + extend i18n + API |

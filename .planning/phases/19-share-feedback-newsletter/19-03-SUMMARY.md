---
phase: 19-share-feedback-newsletter
plan: "03"
subsystem: feedback-newsletter
tags: [feedback, newsletter, api-routes, admin, components, tdd]
dependency-graph:
  requires:
    - 19-01 (i18n feedback/newsletter keys, analytics event names)
  provides:
    - POST /api/feedback (rate limited, Supabase insert)
    - POST /api/newsletter (rate limited, Supabase upsert)
    - FeedbackWidget component (global floating button + drawer)
    - NewsletterForm component (landing page subscription)
    - /admin/feedback page (feedback list view)
  affects:
    - app/layout.tsx (FeedbackWidget integrated globally)
    - app/page.tsx (NewsletterForm section added)
    - app/admin/suggestions/page.tsx (feedback nav link added)
tech-stack:
  added: []
  patterns:
    - vi.mock("next/server") for route handler unit tests (established in 17-02)
    - ts-expect-error for untyped Supabase tables (no generated types yet)
    - upsert with ignoreDuplicates for idempotent newsletter subscriptions
    - Floating widget pattern: fixed positioning + CSS translate-y transition
key-files:
  created:
    - app/api/feedback/route.ts
    - app/api/newsletter/route.ts
    - components/FeedbackWidget.tsx
    - components/NewsletterForm.tsx
    - app/admin/feedback/page.tsx
    - lib/__tests__/feedback-route.test.ts
    - lib/__tests__/newsletter-route.test.ts
  modified:
    - app/layout.tsx (FeedbackWidget import + render)
    - app/page.tsx (NewsletterForm import + section)
    - app/admin/suggestions/page.tsx (피드백 확인 nav link)
decisions:
  - ts-expect-error used for Supabase insert/upsert on untyped tables (feedback, newsletter_subscribers) — types pending Supabase codegen regeneration
  - FeedbackWidget placed inside I18nProvider (requires t.feedback translations) but outside page content — renders on all routes
  - Newsletter section placed above implicit bottom of landing page, inside max-w-6xl container for layout consistency
metrics:
  duration: "11m"
  completed_date: "2026-03-30"
  tasks_completed: 2
  files_created: 7
  files_modified: 3
---

# Phase 19 Plan 03: Feedback + Newsletter Implementation Summary

**One-liner:** Floating FeedbackWidget + inline NewsletterForm with rate-limited Supabase-backed API routes and admin feedback list page.

## What Was Built

### Task 1: API Routes + Unit Tests (TDD)

**POST /api/feedback** (`app/api/feedback/route.ts`)
- Accepts `type` (bug|feature|other), `message` (1-500 chars), `page`
- Rate limit: 5 requests/hour per IP
- Inserts to Supabase `feedback` table
- Returns 201 on success, 400 on validation failure, 429 on rate limit, 503 on Supabase not configured

**POST /api/newsletter** (`app/api/newsletter/route.ts`)
- Accepts `email` (validated with regex, normalized to lowercase)
- Rate limit: 3 requests/hour per IP
- Upserts to Supabase `newsletter_subscribers` with `ignoreDuplicates: true`
- Always returns 201 for valid email (hides duplicate status for security)
- Returns 400 on invalid email, 429 on rate limit, 503 on Supabase not configured

**Tests:** 13 new test cases (6 feedback + 7 newsletter), all passing. Full suite: 151/151.

### Task 2: Components + Admin Page + Integrations

**FeedbackWidget** (`components/FeedbackWidget.tsx`)
- Fixed bottom-right floating pill button with MessageSquare icon
- Slide-up drawer with CSS `translate-y` + `opacity` transition (duration-300)
- Type selector: 3 radio-style buttons (bug/feature/other)
- Textarea (shadcn) with maxLength 500
- Success state: auto-closes after 1500ms
- Analytics: `feedback_open` on open, `feedback_submit` on success

**NewsletterForm** (`components/NewsletterForm.tsx`)
- Centered layout, max-w-md, flex row on sm+ (stacked on mobile)
- Input + Button in one row, success message replaces form
- Analytics: `newsletter_subscribe` on success, `newsletter_error` on failure

**Admin Feedback Page** (`app/admin/feedback/page.tsx`)
- Server component, `force-dynamic`, `requireAdminSession` gate
- Fetches all feedback ordered by `created_at` descending
- Type badges: bug=red, feature=blue, other=gray
- Nav links: 플러그인 관리, 제안 검토, AdminLogoutButton

**Page Integrations:**
- `app/layout.tsx`: `<FeedbackWidget />` added before closing `</I18nProvider>` — renders on all pages
- `app/page.tsx`: `<NewsletterForm />` section added before `</main>` in landing page
- `app/admin/suggestions/page.tsx`: 피드백 확인 link added to nav row

## Verification

```
pnpm test:       151/151 passed (13 new)
pnpm typecheck:  PASS
pnpm lint:       No warnings or errors
pnpm build:      Successful — /api/feedback, /api/newsletter, /admin/feedback all present
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] ts-expect-error for untyped Supabase tables**
- **Found during:** Task 2 (typecheck)
- **Issue:** `supabase.from("feedback").insert(...)` and `supabase.from("newsletter_subscribers").upsert(...)` fail TS2769 because Supabase client has no generated types for these tables — values typed as `never`
- **Fix:** Added `// @ts-expect-error — Supabase generated types pending regeneration for [table] table` comment directly above the offending call in both route files
- **Files modified:** `app/api/feedback/route.ts`, `app/api/newsletter/route.ts`
- **Commit:** included in 73875c5 / d4005c8

**2. [Rule 3 - Blocking] Transient .next cache corruption**
- **Found during:** Task 2 (second typecheck run)
- **Issue:** `ENOENT: no such file or directory, .next/server/pages-manifest.json` after first partial build
- **Fix:** `rm -rf .next` before re-running typecheck
- **Impact:** None — build succeeded on retry

## Self-Check: PASSED

All 7 created files exist on disk. Task commits verified:
- `73875c5` — test(19-03): API route tests (RED + GREEN)
- `d4005c8` — feat(19-03): components + admin page + integrations

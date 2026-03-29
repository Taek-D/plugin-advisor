---
phase: 17-analytics-foundation
verified: 2026-03-29T12:30:00Z
status: passed
score: 7/7 must-haves verified
re_verification: false
---

# Phase 17: Analytics Foundation Verification Report

**Phase Goal:** 모든 페이지의 사용자 행동이 Umami Cloud에서 측정되고, 피드백/뉴스레터에 필요한 Supabase 테이블이 준비된다
**Verified:** 2026-03-29T12:30:00Z
**Status:** PASSED
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | Umami Cloud 스크립트가 NEXT_PUBLIC_UMAMI_WEBSITE_ID 환경변수 설정 시 모든 페이지에서 로드된다 | VERIFIED | `components/UmamiScript.tsx` conditionally renders `next/script` tag; mounted in `app/layout.tsx` line 69 — applies to every page |
| 2  | NEXT_PUBLIC_UMAMI_WEBSITE_ID가 없으면 UmamiScript 컴포넌트가 null을 반환한다 | VERIFIED | Line 5 of `UmamiScript.tsx`: `if (!websiteId) return null;` — confirmed by unit test in `umami-script.test.ts` |
| 3  | CSP 헤더가 cloud.umami.is를 script-src와 connect-src에 포함하여 스크립트 차단을 방지한다 | VERIFIED | `next.config.mjs` line 22: both directives contain `https://cloud.umami.is`; asserted by 2 CSP unit tests |
| 4  | trackEvent() 호출 시 기존 localStorage 저장과 함께 window.umami.track()도 호출된다 | VERIFIED | `lib/analytics.ts` line 54: `window.umami?.track(event, payload)` added after try/catch localStorage block; 5 unit tests confirm both paths |
| 5  | /api/umami 프록시 경로가 요청을 cloud.umami.is로 전달하여 광고차단기를 우회한다 | VERIFIED | `app/api/umami/route.ts` exports `GET` and `POST`; strips `/api/umami` prefix and forwards to `https://cloud.umami.is`; 5 unit tests pass |
| 6  | Supabase에 feedback 테이블이 RLS 정책과 함께 존재한다 | VERIFIED | `supabase/migrations/20260329_create_feedback.sql` creates table with id, created_at, page, rating (1-5 check), message, contact; RLS enabled with anon INSERT + service_role SELECT policies |
| 7  | Supabase에 newsletter_subscribers 테이블이 unique email 제약조건 및 RLS 정책과 함께 존재한다 | VERIFIED | `supabase/migrations/20260329_create_newsletter_subscribers.sql` creates table with unique email constraint, confirmed boolean (default false); RLS with anon INSERT + service_role SELECT/UPDATE |

**Score:** 7/7 truths verified

---

## Required Artifacts

### Plan 01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `components/UmamiScript.tsx` | Umami script loader server component | VERIFIED | 15 lines; conditional render on `NEXT_PUBLIC_UMAMI_WEBSITE_ID`; uses `next/script` with `strategy="afterInteractive"` and `data-website-id` |
| `next.config.mjs` | CSP header with cloud.umami.is allowed | VERIFIED | Line 22: CSP value includes `https://cloud.umami.is` in both `script-src` and `connect-src` directives |
| `types/umami.d.ts` | TypeScript global Window.umami declaration | VERIFIED | 6 lines; global `Window` interface augmentation with `track` and `identify` methods; no import/export (correct pattern) |
| `app/layout.tsx` | UmamiScript mounted in root layout | VERIFIED | Line 5: `import UmamiScript from "@/components/UmamiScript"` — Line 69: `<UmamiScript />` after `</I18nProvider>` inside `<body>` |

### Plan 02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/analytics.ts` | Umami forwarding in trackEvent | VERIFIED | Line 54: `window.umami?.track(event, payload)` — purely additive after existing try/catch; localStorage logic untouched; 16 EventName members present |
| `app/api/umami/route.ts` | Proxy route to cloud.umami.is | VERIFIED | 46 lines; exports `GET` and `POST`; strips `/api/umami` prefix; forwards body, headers, host override to `cloud.umami.is` |
| `supabase/migrations/20260329_create_feedback.sql` | feedback table with RLS | VERIFIED | Creates `public.feedback` with all required columns; RLS enabled; `anon_insert` and `service_role_select` policies present |
| `supabase/migrations/20260329_create_newsletter_subscribers.sql` | newsletter_subscribers table with RLS and unique email | VERIFIED | Creates `public.newsletter_subscribers`; `unique (email)` constraint; `confirmed boolean not null default false`; RLS with 3 policies (INSERT, SELECT, UPDATE) |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/layout.tsx` | `components/UmamiScript.tsx` | `import UmamiScript` and JSX render inside body | WIRED | `import UmamiScript from "@/components/UmamiScript"` on line 5; `<UmamiScript />` rendered on line 69 after `</I18nProvider>` |
| `next.config.mjs` | CSP allows `cloud.umami.is` | `https://cloud.umami.is` in both script-src and connect-src | WIRED | Line 22 contains `https://cloud.umami.is` in both directives |
| `lib/analytics.ts` | `window.umami` | optional chaining call `window.umami?.track` in trackEvent | WIRED | Line 54: `window.umami?.track(event, payload)` — placed after localStorage try/catch, inside `trackEvent()` |
| `app/api/umami/route.ts` | `https://cloud.umami.is` | fetch proxy with path stripping | WIRED | `const UPSTREAM = "https://cloud.umami.is"` on line 3; `buildUpstreamUrl` strips `/api/umami` prefix; used in both GET and POST handlers |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| ANLY-01 | 17-01 | Umami Cloud 스크립트가 모든 페이지에서 로드되어 페이지뷰를 자동 추적한다 | SATISFIED | `UmamiScript` in `app/layout.tsx` — applies to every route via root layout |
| ANLY-02 | 17-01 | CSP 헤더가 Umami 도메인을 허용하여 스크립트가 차단되지 않는다 | SATISFIED | `next.config.mjs` CSP includes `https://cloud.umami.is` in `script-src` and `connect-src` |
| ANLY-03 | 17-02 | 기존 16개 localStorage 이벤트가 Umami 커스텀 이벤트로 마이그레이션된다 | SATISFIED | 16 `EventName` literals confirmed in `lib/analytics.ts`; all forwarded via `window.umami?.track(event, payload)` in single `trackEvent()` function — all 16 events flow through one code path |
| ANLY-04 | 17-02 | /api/umami proxy 라우트가 광고차단기를 우회하여 데이터 손실을 최소화한다 | SATISFIED | `app/api/umami/route.ts` proxies GET/POST to `cloud.umami.is`; `data-host-url` in `UmamiScript` points to `/api/umami` proxy via `NEXT_PUBLIC_UMAMI_PROXY_URL` |
| FDBK-02 | 17-02 | 피드백이 Supabase에 저장되고 rate limit이 적용된다 (table only — Phase 17 scope) | SATISFIED (partial scope) | `supabase/migrations/20260329_create_feedback.sql` table ready; rate limiting is Phase 19 scope per REQUIREMENTS.md note |
| NEWS-02 | 17-02 | 구독 정보가 Supabase에 저장되고 중복/rate limit이 적용된다 (table only — Phase 17 scope) | SATISFIED (partial scope) | `supabase/migrations/20260329_create_newsletter_subscribers.sql` table with `unique (email)` constraint ready; API route + rate limiting is Phase 19 scope |

**Note on FDBK-02 and NEWS-02:** REQUIREMENTS.md explicitly documents these span Phase 17 (table creation) + Phase 19 (API route + rate limiting). Phase 17's scope is confirmed as table-only. Both are appropriately marked complete in REQUIREMENTS.md for their Phase 17 portion.

**Orphaned requirements check:** No Phase 17 requirements in REQUIREMENTS.md fall outside the plans' declared `requirements:` fields. All 6 IDs (ANLY-01, ANLY-02, ANLY-03, ANLY-04, FDBK-02, NEWS-02) are accounted for.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `lib/analytics.ts` | 40-42 | `console.debug("[analytics]", ...)` | INFO | Development-only guard (`process.env.NODE_ENV === "development"`) — acceptable, not a leak |

No blockers or warnings found. The `console.debug` is correctly gated behind `NODE_ENV === "development"` and is intentional for development visibility.

---

## Human Verification Required

### 1. Umami Cloud Pageview Tracking in Production

**Test:** Set `NEXT_PUBLIC_UMAMI_WEBSITE_ID` to a real Umami Cloud website ID in `.env.local`, run `pnpm dev`, open any page, check Umami Cloud dashboard for pageview.
**Expected:** Pageview recorded in Umami Cloud dashboard within 30 seconds.
**Why human:** Requires a live Umami Cloud account and real env var — cannot verify cloud receipt programmatically.

### 2. Ad-blocker Proxy Bypass

**Test:** Install an ad-blocker (e.g., uBlock Origin), set `NEXT_PUBLIC_UMAMI_PROXY_URL=/api/umami` and a real website ID, load the site, confirm events still reach Umami.
**Expected:** Analytics events appear in Umami dashboard despite ad-blocker active.
**Why human:** Requires a browser with ad-blocker extension — cannot simulate ad-blocking programmatically.

### 3. Supabase Table Availability

**Test:** Run both SQL migration files in Supabase SQL Editor for the production project.
**Expected:** `feedback` and `newsletter_subscribers` tables visible in Supabase Table Editor with correct columns and RLS policies.
**Why human:** Supabase migration files exist locally but have not been applied to the live database — requires manual SQL Editor execution per the plan's `user_setup` instructions.

---

## Commits Verified

| Commit | Description | Files |
|--------|-------------|-------|
| `8e67f3b` | feat(17-01): add Umami Cloud analytics script foundation | `components/UmamiScript.tsx`, `types/umami.d.ts`, `lib/__tests__/umami-script.test.ts`, `next.config.mjs`, `vitest.config.ts` |
| `01a8333` | feat(17-01): mount UmamiScript in root layout | `app/layout.tsx` |
| `ecb08e5` | feat(17-02): add Umami event forwarding and ad-blocker bypass proxy route | `lib/analytics.ts`, `app/api/umami/route.ts`, `lib/__tests__/analytics-umami.test.ts`, `lib/__tests__/umami-proxy.test.ts` |
| `d867e07` | fix(17-02): update umami-proxy test to mock next/server | `lib/__tests__/umami-proxy.test.ts` |
| `8c75159` | feat(17-02): add Supabase migration files for feedback and newsletter tables | `supabase/migrations/20260329_create_feedback.sql`, `supabase/migrations/20260329_create_newsletter_subscribers.sql` |

---

## Summary

Phase 17 goal is fully achieved at the code level. All 7 observable truths are verified, all 8 required artifacts exist and are substantive (no stubs), and all 4 key links are wired. All 6 requirement IDs (ANLY-01 through ANLY-04, FDBK-02 table scope, NEWS-02 table scope) have implementation evidence.

The analytics pipeline is complete end-to-end in code: `trackEvent()` writes to localStorage and forwards to `window.umami?.track()`, the Umami script loads from `cloud.umami.is` via `UmamiScript` in the root layout, and the `/api/umami` proxy route is in place to bypass ad-blockers. CSP headers allow the Umami domain. The Supabase migration SQL files are ready to run for Phase 19's feedback widget and newsletter form.

Three items require human verification: live Umami Cloud account setup (env var + dashboard), ad-blocker bypass smoke test, and running the SQL migration files against the live Supabase project.

---

_Verified: 2026-03-29T12:30:00Z_
_Verifier: Claude (gsd-verifier)_

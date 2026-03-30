---
phase: 17-analytics-foundation
plan: 01
subsystem: infra
tags: [umami, analytics, csp, next-script, typescript]

# Dependency graph
requires: []
provides:
  - UmamiScript server component (conditional on NEXT_PUBLIC_UMAMI_WEBSITE_ID)
  - CSP header updated to allow cloud.umami.is in script-src and connect-src
  - Window.umami global TypeScript declaration
  - Umami script mounted in root layout (all pages)
affects:
  - 17-analytics-foundation (plan 02 — event forwarding builds on this component)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Server component as script loader (no client bundle cost)
    - Env-var-conditional rendering pattern (null guard before render)
    - CSP updated before script load (locked decision)

key-files:
  created:
    - components/UmamiScript.tsx
    - types/umami.d.ts
    - lib/__tests__/umami-script.test.ts
  modified:
    - next.config.mjs
    - app/layout.tsx
    - vitest.config.ts

key-decisions:
  - "UmamiScript is a server component — no 'use client' needed, no client bundle cost"
  - "CSP updated in same commit as UmamiScript (locked decision: CSP before script load)"
  - "vitest esbuild jsx automatic runtime configured to support component unit tests without @vitejs/plugin-react"
  - "UmamiScript placed after </I18nProvider> inside <body> — no i18n context needed, loads after main content"

patterns-established:
  - "Script loader pattern: server component returning next/script element with env-var null guard"
  - "Window type augmentation: types/*.d.ts global interface extension (no import/export)"

requirements-completed: [ANLY-01, ANLY-02]

# Metrics
duration: 9min
completed: 2026-03-29
---

# Phase 17 Plan 01: Analytics Foundation Summary

**Umami Cloud script wired into all pages via server component with CSP allowlist and Window.umami TypeScript declaration**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-29T11:42:11Z
- **Completed:** 2026-03-29T11:51:25Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- CSP header updated to allow `https://cloud.umami.is` in both `script-src` and `connect-src` directives
- `UmamiScript` server component created — conditionally renders `next/script` tag when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set, returns null otherwise
- `types/umami.d.ts` provides global `Window.umami` declaration with `track` and `identify` methods
- `UmamiScript` mounted in `app/layout.tsx` — every page now automatically includes Umami tracking when env var is configured
- 4 unit tests added and passing; full test suite remains green (129/129 tests)

## Task Commits

Each task was committed atomically:

1. **Task 1: CSP update + UmamiScript component + TypeScript declaration** - `8e67f3b` (feat)
2. **Task 2: Mount UmamiScript in root layout** - `01a8333` (feat)

## Files Created/Modified
- `components/UmamiScript.tsx` — server component that loads Umami script.js via next/script
- `types/umami.d.ts` — global Window augmentation for window.umami type safety
- `lib/__tests__/umami-script.test.ts` — unit tests for CSP directives and component behavior
- `next.config.mjs` — CSP header updated with cloud.umami.is in script-src and connect-src
- `app/layout.tsx` — UmamiScript imported and rendered after I18nProvider
- `vitest.config.ts` — esbuild jsx automatic runtime added for component test support

## Decisions Made
- Used `next/script` with `strategy="afterInteractive"` to avoid blocking page render
- No new npm packages added (zero-package constraint from STATE.md decisions)
- `vitest.config.ts` updated with `esbuild: { jsx: "automatic" }` to support JSX component tests in node environment without @vitejs/plugin-react

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added esbuild jsx automatic runtime to vitest.config.ts**
- **Found during:** Task 1 (TDD GREEN phase — component tests)
- **Issue:** vitest node environment threw `ReferenceError: React is not defined` when testing UmamiScript component with JSX; no `@vitejs/plugin-react` available
- **Fix:** Added `esbuild: { jsx: "automatic" }` to vitest.config.ts to use React 17+ automatic JSX runtime
- **Files modified:** vitest.config.ts
- **Verification:** All 4 umami-script tests pass; full 129-test suite passes
- **Committed in:** 8e67f3b (Task 1 commit)

**2. [Rule 3 - Blocking] Added `vi.mock("next/script")` in test file**
- **Found during:** Task 1 (TDD GREEN phase — first test run)
- **Issue:** `next/script` could not be resolved in the vitest node environment (`Cannot find package 'next/script'`) due to broken node_modules (next binary missing)
- **Fix:** Added `vi.mock("next/script", ...)` at top of test file to mock the Script component as a plain function returning props object
- **Files modified:** lib/__tests__/umami-script.test.ts
- **Verification:** Component tests pass, CSP tests unaffected
- **Committed in:** 8e67f3b (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes required due to broken node_modules (next package missing). No scope creep. All plan goals met.

## Issues Encountered
- `pnpm typecheck` could not run — `next` binary missing from node_modules due to EPERM error during `pnpm install --force`. This is a pre-existing environment issue confirmed via git stash test. All typecheck errors are project-wide (affect all files), not caused by this plan's changes.
- Workaround: ran `tsc --noEmit` directly and confirmed errors are pre-existing. Unit tests (vitest) ran successfully for all plan deliverables.

## Next Phase Readiness
- Umami script foundation complete — Plan 02 (event forwarding + proxy route) can build on `UmamiScript` component and `window.umami` type
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` env var must be set in Vercel dashboard and `.env.local` to activate tracking
- Blocker from STATE.md still applies: Umami Cloud account + website ID required before production use

---
*Phase: 17-analytics-foundation*
*Completed: 2026-03-29*

## Self-Check: PASSED

- FOUND: components/UmamiScript.tsx
- FOUND: types/umami.d.ts
- FOUND: lib/__tests__/umami-script.test.ts
- FOUND: next.config.mjs
- FOUND: app/layout.tsx
- FOUND: .planning/phases/17-analytics-foundation/17-01-SUMMARY.md
- FOUND commit: 8e67f3b (feat(17-01): add Umami Cloud analytics script foundation)
- FOUND commit: 01a8333 (feat(17-01): mount UmamiScript in root layout)

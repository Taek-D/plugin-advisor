---
phase: 18-og-images
plan: "01"
subsystem: ui
tags: [next-og, opengraph, twitter-card, edge-runtime, social-sharing]

# Dependency graph
requires: []
provides:
  - "lib/og-utils.ts: shared OG utilities (OG_SIZE, OG_COLORS, OG_FOOTER_TEXT, loadSpaceGrotesk)"
  - "app/opengraph-image.tsx: branded root OG image for / route"
  - "app/twitter-image.tsx: Twitter summary_large_image card for / route"
  - "app/advisor/opengraph-image.tsx: static OG for /advisor"
  - "app/plugins/opengraph-image.tsx: static OG for /plugins catalog"
  - "app/guides/opengraph-image.tsx: static OG for /guides listing"
  - "app/layout.tsx: metadataBase + openGraph + twitter metadata fields"
affects: [18-og-images-plan-02, plugins-detail, guides-detail]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "next/og ImageResponse with edge runtime for OG image generation"
    - "opengraph-image.tsx convention file pattern (Next.js App Router auto-injection)"
    - "Shared OG utilities in lib/og-utils.ts imported by all OG image files"
    - "Space Grotesk Bold fetched via Google Fonts CDN (gstatic.com woff) at edge runtime"

key-files:
  created:
    - lib/og-utils.ts
    - app/opengraph-image.tsx
    - app/twitter-image.tsx
    - app/advisor/opengraph-image.tsx
    - app/plugins/opengraph-image.tsx
    - app/guides/opengraph-image.tsx
  modified:
    - app/layout.tsx

key-decisions:
  - "metadataBase set to https://pluginadvisor.cc to resolve OG image URLs correctly in production"
  - "All OG images use edge runtime for low-latency image generation at CDN edge"
  - "twitter-image.tsx mirrors opengraph-image.tsx design (same layout, different convention file)"
  - "No images field in openGraph/twitter metadata — convention files auto-inject image URLs"

patterns-established:
  - "OG image pattern: import from @/lib/og-utils, export runtime/alt/size/contentType, return ImageResponse"
  - "Dark bg (#0f172a) + 6px accent bars (#6366f1) + Space Grotesk Bold — brand OG visual language"

requirements-completed: [OGIM-01]

# Metrics
duration: 6min
completed: "2026-03-30"
---

# Phase 18 Plan 01: Static OG Images Summary

**5 next/og edge ImageResponse files (root + advisor + plugins + guides + twitter) with shared utilities and layout metadataBase, establishing the OG image visual system for all social sharing**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-29T18:44:03Z
- **Completed:** 2026-03-29T18:50:03Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Created `lib/og-utils.ts` with shared OG_SIZE, OG_COLORS, OG_FOOTER_TEXT, and loadSpaceGrotesk() font loader
- Created 5 opengraph-image.tsx files (root, /advisor, /plugins, /guides) + twitter-image.tsx, all using edge runtime with dark bg + accent bars + Space Grotesk + pluginadvisor.cc footer
- Updated `app/layout.tsx` with metadataBase, openGraph (website type, ko_KR locale), and twitter (summary_large_image) metadata

## Task Commits

Each task was committed atomically:

1. **Task 1: Create shared OG utilities and root OG/Twitter images** - `bf37224` (feat)
2. **Task 2: Create static page OG images and update root metadata** - `514f2a6` (feat)

**Plan metadata:** *(pending)*

## Files Created/Modified

- `lib/og-utils.ts` - Shared constants and font loader for all OG images
- `app/opengraph-image.tsx` - Root branded OG image (dark bg, accent bars, Space Grotesk)
- `app/twitter-image.tsx` - Twitter summary_large_image card (same design as root OG)
- `app/advisor/opengraph-image.tsx` - Static OG for /advisor: "Find the right plugins for your project"
- `app/plugins/opengraph-image.tsx` - Static OG for /plugins: "Browse all verified Claude Code plugins"
- `app/guides/opengraph-image.tsx` - Static OG for /guides: "Step-by-step guides for your Claude Code setup"
- `app/layout.tsx` - Added metadataBase + openGraph + twitter metadata fields

## Decisions Made

- Added `metadataBase: new URL("https://pluginadvisor.cc")` to eliminate Next.js build warning about unresolved social image URLs — this is required for correct OG image URL injection in production
- Used `twitter-image.tsx` convention file (mirrors opengraph-image.tsx) rather than setting `twitter.images` in metadata, consistent with `opengraph-image.tsx` pattern
- All 5 OG images share identical visual structure (dark bg, top/bottom accent bars, center title+subtitle, footer) — only text content differs per page

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added metadataBase to layout.tsx**
- **Found during:** Task 2 (build verification)
- **Issue:** Build produced repeated warnings: "metadataBase property in metadata export is not set for resolving social open graph or twitter images, using http://localhost:3000". Without metadataBase, all OG image URLs resolve to localhost in production meta tags — social crawlers would get broken image URLs.
- **Fix:** Added `metadataBase: new URL("https://pluginadvisor.cc")` to the metadata export in app/layout.tsx
- **Files modified:** app/layout.tsx
- **Verification:** Build output confirmed warnings eliminated; all OG image routes (5 total) generated correctly
- **Committed in:** 514f2a6 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Essential for correct OG URL resolution in production. No scope creep.

## Issues Encountered

Pre-existing typecheck errors in `lib/__tests__/umami-script.test.ts` (TS2722, TS18048) — confirmed pre-existing before this plan's changes. Logged to deferred items, out of scope.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `lib/og-utils.ts` (loadSpaceGrotesk, OG_COLORS, OG_SIZE) ready for Plan 02 dynamic OG images (/plugins/[id], /guides/[slug])
- All static OG routes building and serving correctly at edge runtime
- metadataBase set — Plan 02 dynamic OG images will inherit correct base URL

---
*Phase: 18-og-images*
*Completed: 2026-03-30*

## Self-Check: PASSED

- FOUND: lib/og-utils.ts
- FOUND: app/opengraph-image.tsx
- FOUND: app/twitter-image.tsx
- FOUND: app/advisor/opengraph-image.tsx
- FOUND: app/plugins/opengraph-image.tsx
- FOUND: app/guides/opengraph-image.tsx
- FOUND: app/layout.tsx (modified)
- FOUND commit bf37224: feat(18-01): create shared OG utilities and root OG/Twitter images
- FOUND commit 514f2a6: feat(18-01): create page OG images and update root layout metadata

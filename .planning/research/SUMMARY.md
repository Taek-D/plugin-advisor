# Research Summary: v1.4 Marketing Prep

**Domain:** Marketing readiness features for Plugin Advisor (Claude Code plugin recommendation tool)
**Researched:** 2026-03-29
**Overall confidence:** HIGH

## Executive Summary

The v1.4 milestone adds five marketing-readiness features to the existing Next.js 14 Plugin Advisor app: analytics, OG images, share buttons, feedback form, and newsletter signup. The most significant finding from this research is that **zero new npm packages are needed**. All five features can be implemented using built-in Next.js capabilities (next/og for OG images), browser APIs (Web Share API, Clipboard API), an external script tag (Umami analytics), and the existing Supabase + shadcn/ui stack.

For analytics, the research compared six options in depth: Umami Cloud, Plausible, PostHog, Vercel Analytics, Mixpanel, and OpenPanel. **Umami Cloud is recommended** because it offers 100K free events/month (vs Vercel's 2,500 on Hobby), includes custom event tracking in the free tier (Vercel requires Pro at $20/mo/seat), is cookieless/GDPR-compliant by default (no cookie banner needed), and integrates via a lightweight ~2KB script tag with no npm dependency. The main trade-off is ad blocker susceptibility, mitigatable with a proxy route.

For OG images, Next.js 14's built-in `opengraph-image.tsx` file convention with `ImageResponse` from `next/og` is the clear choice -- zero dependencies, automatic metadata wiring, edge-cached by Vercel. The main pitfalls are Satori CSS limitations (flexbox only) and Korean font loading on edge runtime (use Noto Sans KR subset).

For share buttons, feedback, and newsletter: the existing codebase already has all the patterns needed. Share uses native Web Share API + URL templates (no react-share needed). Feedback and newsletter follow the exact `plugin-suggestions` pattern: Supabase table + API route with rate limiting + client form component.

## Key Findings

**Stack:** Zero new npm packages. Umami Cloud (external script), next/og (built-in), Web Share API (browser), Supabase (existing) for all five features.

**Architecture:** 14 new files + 10 modified files. Two new Supabase tables (feedback, newsletter_subscribers). Two new API routes. Seven opengraph-image.tsx files across route segments.

**Critical pitfall:** CSP headers must be updated BEFORE adding the Umami script, or analytics will silently fail with zero data collected.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Foundation** - Analytics setup + Supabase migrations
   - Addresses: Umami Cloud integration, feedback/newsletter table creation
   - Avoids: CSP blocking pitfall (update CSP first), schema inconsistency pitfall (plan both tables together)
   - Rationale: Unblocks all downstream features. Analytics provides immediate value.

2. **OG Images** - Default + per-page + dynamic social cards
   - Addresses: All social sharing preview cards
   - Avoids: Font loading pitfall (test on Vercel preview early), Satori CSS pitfall (flexbox-only design)
   - Rationale: Independent of other features, can run in parallel with Phase 3.

3. **Interactive Features** - Share buttons + feedback widget + newsletter form
   - Addresses: User engagement features (share, feedback, subscribe)
   - Avoids: Web Share API desktop failure (three-tier fallback), spam pitfall (honeypot + rate limiting)
   - Rationale: All require i18n additions; batch together for efficiency.

4. **Verification** - Full build + typecheck + social platform testing
   - Addresses: End-to-end validation
   - Avoids: OG caching pitfall (test with Facebook Debugger + Twitter Card Validator before public launch)

**Phase ordering rationale:**
- Foundation must come first (CSP + Supabase tables unblock everything)
- OG images and interactive features are independent and can be parallelized
- Verification last to catch cross-feature interactions

**Research flags for phases:**
- Phase 2 (OG Images): Needs attention on Korean font strategy -- test edge runtime early
- Phase 1 (Analytics): Consider implementing Umami proxy route to mitigate ad blocker data loss
- Phase 3 (Newsletter): Ensure compliance statement is visible on form before launch

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack (Analytics) | HIGH | Six options compared with verified pricing/features from official sources |
| Stack (OG Images) | HIGH | Official Next.js feature, well-documented |
| Stack (Share/Feedback/Newsletter) | HIGH | Uses existing patterns and browser APIs |
| Features | HIGH | Well-scoped milestone, clear feature boundaries |
| Architecture | HIGH | All patterns verified against existing codebase |
| Pitfalls | HIGH | Critical pitfalls verified from official docs and GitHub issues |

## Gaps to Address

- **Umami proxy route implementation:** If ad blocker data loss is unacceptable, the proxy approach needs a concrete implementation plan during Phase 1
- **Korean font for OG images:** Need to test Noto Sans KR subset size on Vercel edge runtime before committing to Korean text in OG images
- **Newsletter compliance language:** Legal review of the consent/purpose statement before launch
- **FEATURES.md analytics divergence:** Another researcher's FEATURES.md recommends Vercel Analytics; STACK.md/ARCHITECTURE.md/PITFALLS.md recommend Umami. The roadmap phase should make the final decision based on the comparison table in STACK.md.

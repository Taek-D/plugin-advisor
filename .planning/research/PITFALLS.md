# Domain Pitfalls: v1.4 Marketing Prep Features

**Domain:** Adding analytics, OG images, share buttons, feedback form, newsletter form to existing Next.js 14 / Vercel app
**Researched:** 2026-03-29
**Confidence:** HIGH (verified against official docs, GitHub issues, and existing codebase)
**Analytics recommendation:** Umami Cloud (see STACK.md for full comparison)

---

## Critical Pitfalls

Mistakes that cause broken deployments, security incidents, or data loss.

### Pitfall 1: CSP Header Blocks Umami Analytics Script

**What goes wrong:** The existing `Content-Security-Policy` in `next.config.mjs` has strict `script-src` and `connect-src` directives. Umami's tracking script loads from `https://cloud.umami.is/script.js` and sends beacons to `https://cloud.umami.is/api/send`. The current CSP does not whitelist this domain, so the analytics script will be silently blocked.

**Why it happens:** CSP was configured during initial security hardening (v0) when no third-party scripts were needed. Adding any external analytics introduces a new script origin that must be explicitly allowed.

**Consequences:**
- Analytics script silently fails -- zero data collected, no visible error to users
- Developers may not notice for days because the `<Script>` component renders without error
- Both `script-src` and `connect-src` need updating

**Prevention:**
1. Update CSP in `next.config.mjs` BEFORE adding the analytics script:
   - `script-src`: add `https://cloud.umami.is`
   - `connect-src`: add `https://cloud.umami.is`
2. Test in production-like environment (CSP is often not enforced in dev mode)
3. Check browser DevTools Console for `Refused to load the script` CSP violation messages after deployment

**Detection:** Open browser DevTools Console on deployed site. Look for CSP violation messages. Or check Umami Cloud dashboard: if page views show 0 after deployment, CSP is the likely cause.

**Confidence:** HIGH -- verified from existing `next.config.mjs` CSP configuration.

---

### Pitfall 2: OG Image Font Loading Fails on Edge Runtime

**What goes wrong:** `opengraph-image.tsx` files using custom fonts (Pretendard, Space Grotesk) fail in production because `fs.readFile` is unavailable in Edge Runtime, or the font file exceeds Edge Runtime size limits.

**Why it happens:** Next.js OG image generation uses `ImageResponse` which runs on Edge Runtime by default. Edge Runtime cannot access the filesystem (`node:fs`), so the common pattern of `readFile(join(process.cwd(), 'public/font.ttf'))` throws at runtime. Additionally, CJK fonts like Pretendard can be 15MB+, far exceeding edge function limits.

**Consequences:**
- OG images return 500 errors in production but work fine locally
- Social media previews show broken/missing images
- Korean text renders as tofu (empty boxes) if font is missing but image generation succeeds

**Prevention:**
1. Use `fetch(new URL('./font.woff', import.meta.url))` pattern instead of `fs.readFile`
2. For Korean text, use Noto Sans KR subset (< 500KB) rather than full Pretendard Variable
3. Test OG image generation on Vercel preview deployment, not just `next dev`
4. Consider using system fonts (`sans-serif`) for OG images to avoid font loading entirely
5. If using custom fonts, keep total font data under 1-2MB per image handler

**Detection:** Deploy to Vercel preview, then test OG URLs directly: `https://your-site.vercel.app/opengraph-image`. A 500 response means font/runtime issue.

**Confidence:** HIGH -- documented in Next.js GitHub issues #77796 and #48081.

---

### Pitfall 3: Newsletter Email Collection Without Compliance

**What goes wrong:** Collecting email addresses without proper consent mechanism or purpose disclosure creates legal liability under GDPR (EU users), CCPA (California), and CAN-SPAM (US).

**Why it happens:** Developers treat newsletter signup as "just a form" and store emails without consent records or unsubscribe mechanism. The project targets international users (Korean + English i18n).

**Consequences:**
- GDPR fines up to 20M EUR or 4% of global revenue
- CAN-SPAM violations: $51,744 per email
- User trust erosion

**Prevention:**
1. Display clear purpose statement on the form: what will be sent and how often
2. Store consent timestamp alongside email in Supabase
3. Never pre-check the subscription checkbox
4. Plan unsubscribe mechanism (can be a simple status toggle in Supabase for v1.4, full unsubscribe link when email sending is added)
5. If not sending emails yet (just collecting), state clearly on the form
6. Double opt-in deferred to when email sending infrastructure exists -- acceptable for v1.4 if purpose is clearly stated

**Detection:** Legal review checklist before launch.

**Confidence:** HIGH -- GDPR requirements are well-established regulation.

---

### Pitfall 4: Umami Script Blocked by Ad Blockers

**What goes wrong:** Analytics data is significantly undercounted because ad blockers block the Umami Cloud script. The target audience (developers using Claude Code) has a very high ad blocker usage rate (estimated 30-50%).

**Why it happens:** Ad blocker filter lists include `cloud.umami.is` as a known analytics domain. Some blockers also pattern-match `*/script.js` with tracking-related `data-` attributes.

**Consequences:**
- 30-50% of traffic goes untracked, making analytics unreliable for marketing decisions
- Skewed data: ad-blocker users (often power users) are systematically undercounted

**Prevention:**
1. **Proxy approach (recommended):** Create Next.js API route rewrites that proxy the Umami script and API through your own domain:
   ```
   /api/um/script.js -> https://cloud.umami.is/script.js
   /api/um/api/send  -> https://cloud.umami.is/api/send
   ```
   This makes analytics requests look like first-party traffic
2. Alternative: accept the undercount and note it as a known limitation
3. Supplement with server-side signals (API route hit counts, Supabase query counts) that ad blockers cannot affect

**Detection:** Compare Umami dashboard numbers with Vercel's built-in request metrics. If Umami shows 50-60% of Vercel's traffic count, ad blockers are the cause.

**Confidence:** HIGH -- well-documented behavior, especially relevant for developer-audience tools.

---

## Moderate Pitfalls

Mistakes that cause degraded UX, partial functionality, or significant rework.

### Pitfall 5: OG Image Caching Prevents Updates

**What goes wrong:** After deploying updated OG images, social media platforms continue showing old images for days or weeks.

**Why it happens:** Two layers of caching:
1. Vercel CDN caches OG images aggressively
2. Social platforms cache OG data (Twitter: ~7 days, Facebook: until manual purge, KakaoTalk: until cache clear)

**Prevention:**
1. Test with Facebook Sharing Debugger and Twitter Card Validator before public launch
2. Include version param in OG image URL for cache-busting if needed
3. Get OG images right BEFORE sharing links publicly
4. Manual purge steps: Facebook Debugger scrape, Twitter Card Validator fetch

**Detection:** Share a link on each platform in a test/private post. Check the preview card.

**Confidence:** HIGH -- well-documented caching behavior.

---

### Pitfall 6: Web Share API Silent Failure on Desktop

**What goes wrong:** Share buttons using `navigator.share()` work on mobile but fail on desktop Firefox. The API may exist in `navigator` on some desktop browsers but throw `NotAllowedError`.

**Prevention:**
1. ALWAYS check `navigator.share` before calling
2. Wrap in try/catch -- `navigator.share()` can reject if user cancels
3. Three-tier fallback:
   - Tier 1: `navigator.share()` (mobile + supported desktop)
   - Tier 2: `navigator.clipboard.writeText()` + toast "Link copied!"
   - Tier 3: Manual share links (Twitter/LinkedIn URLs)
4. Never hide fallback buttons -- show them alongside native share

**Detection:** Test on Firefox desktop. If share button does nothing, fallback is missing.

**Confidence:** HIGH -- MDN compatibility tables confirm.

---

### Pitfall 7: Feedback Form Spam Without Server-Side Protection

**What goes wrong:** Public feedback form gets flooded with bot submissions. The existing `rate-limit.ts` uses in-memory Map which resets on every Vercel serverless cold start.

**Why it happens:** On Vercel serverless architecture, each function invocation may run in a different instance. The Map is empty on cold starts, so bots hitting different instances bypass the limit.

**Prevention:**
1. Layer multiple defenses:
   - Honeypot field (hidden CSS field, real-sounding name like `website`)
   - Server-side timing check: reject submissions faster than 2 seconds after page load
   - Existing rate limiter as basic defense (effective for single-instance bursts)
2. Validate content server-side: minimum length, basic content checks
3. Consider reCAPTCHA v3 if bot volume is high, but start with honeypot (zero UX cost)

**Detection:** Monitor Supabase table for submission patterns -- sudden spikes, identical content, honeypot field filled.

**Confidence:** HIGH -- verified that existing `rate-limit.ts` uses in-memory Map.

---

### Pitfall 8: OG Image CSS Limitations Cause Layout Surprises

**What goes wrong:** Dynamic OG images using `ImageResponse` render incorrectly because Satori only supports a subset of CSS.

**Prevention:**
1. Use ONLY flexbox (`display: 'flex'`) -- never grid
2. No `calc()`, no CSS variables, no `transform`, no animations
3. All elements need explicit `display: "flex"` -- Satori does not inherit display
4. Use inline `style` objects, not Tailwind classes
5. Start minimal, add incrementally, test after each change
6. Test at: https://og-playground.vercel.app/

**Detection:** Visit `http://localhost:3002/opengraph-image` during development.

**Confidence:** HIGH -- Satori CSS limitations are officially documented.

---

### Pitfall 9: Missing twitter:card Meta Tag

**What goes wrong:** Twitter/X shows small preview or no image because card type is not specified.

**Prevention:**
- Add `twitter-image.tsx` alongside `opengraph-image.tsx` (can re-export same function)
- OR add `twitter: { card: "summary_large_image" }` in metadata export
- Note: `opengraph-image.tsx` does NOT automatically generate Twitter card tags

**Detection:** Test with Twitter Card Validator before launch.

**Confidence:** HIGH -- Next.js docs specify separate file conventions for OG and Twitter.

---

### Pitfall 10: Newsletter Email Validation Too Permissive

**What goes wrong:** Database fills with invalid emails (typos, fake addresses, bot submissions).

**Prevention:**
- Server-side regex validation (basic format check)
- Supabase UNIQUE constraint on email column prevents duplicates
- Rate limiting prevents mass insertion
- Do NOT rely on client-side validation alone
- Consider honeypot field for spam prevention

**Confidence:** HIGH.

---

## Minor Pitfalls

### Pitfall 11: Feedback Widget Z-Index Conflicts

**What goes wrong:** Floating feedback button overlaps with Nav, modals, or toast notifications.

**Prevention:**
- Audit existing z-index values before placing widget
- Use z-index scale: Nav (40), Feedback widget (45), Modals (50), Toast (60)
- On mobile, ensure no overlap with bottom navigation area
- Widget must NOT appear on `/admin/*` pages

**Confidence:** MEDIUM -- depends on implementation.

---

### Pitfall 12: Umami Not Tracking SPA Navigation

**What goes wrong:** Umami only tracks initial page load, not client-side route changes.

**Prevention:** Next.js App Router triggers History API events that Umami's default script handles automatically. However, if loaded with `data-auto-track="false"`, manual `umami.track()` calls are needed on route changes. Recommendation: use default auto-tracking and only add custom events on top.

**Confidence:** HIGH -- verified in Umami documentation.

---

### Pitfall 13: Clipboard API Requires Secure Context

**What goes wrong:** The Clipboard API fails in non-HTTPS contexts or without user gesture.

**Prevention:**
- Always wrap in try/catch with `document.execCommand('copy')` as legacy fallback
- Only call from direct click handlers
- Not an issue on Vercel (always HTTPS) but matters for local dev with custom domains

**Confidence:** HIGH -- MDN documentation.

---

### Pitfall 14: Share URL Encoding with Korean Characters

**What goes wrong:** Korean characters in plugin or guide URLs get double-encoded when shared.

**Prevention:**
- Use `window.location.href` (already encoded once by browser) as the share URL
- For `navigator.share()`, pass URL as-is
- For manual share links, use `encodeURIComponent(window.location.href)` -- only encode the URL parameter, not internal path segments
- Current plugin IDs are ASCII-only, but verify no Korean slugs exist

**Confidence:** MEDIUM -- current IDs are ASCII, but future content may use Korean.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Severity | Mitigation |
|-------------|---------------|----------|------------|
| Analytics setup | CSP blocks script (P1) | CRITICAL | Update CSP first, before adding script |
| Analytics setup | Ad blocker data loss (P4) | MODERATE | Proxy route or accept undercount |
| OG images | Font loading crash on Edge (P2) | CRITICAL | Use fetch-based loading or system fonts; test on Vercel preview |
| OG images | Caching prevents updates (P5) | MODERATE | Test with debugger tools before launch |
| OG images | CSS limitations (P8) | MODERATE | Flexbox only; test in Satori playground |
| OG images | Missing twitter:card (P9) | MODERATE | Add twitter-image.tsx files |
| Share buttons | Desktop browser failure (P6) | MODERATE | Three-tier fallback pattern |
| Share buttons | URL encoding (P14) | MINOR | Use window.location.href as-is |
| Feedback form | Bot spam (P7) | MODERATE | Honeypot + timing + rate limiter |
| Feedback form | Widget z-index (P11) | MINOR | Audit z-index scale |
| Newsletter form | Compliance (P3) | CRITICAL | Clear purpose statement + consent timestamp |
| Newsletter form | Email validation (P10) | MODERATE | Server-side validation + UNIQUE constraint |
| All features | CSP holistic update | CRITICAL | Single CSP update covering all features in first phase |
| All features | Layout.tsx crowding | MODERATE | Clean component composition in layout |
| All features | Supabase schema planning | MODERATE | Plan both tables together with consistent naming |

---

## Sources

### Official Documentation
- [Umami Track Events](https://docs.umami.is/docs/track-events) -- custom event API
- [Umami Running on Vercel](https://docs.umami.is/docs/guides/running-on-vercel) -- proxy guide
- [Next.js ImageResponse API](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Next.js Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [MDN Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [Satori Supported CSS](https://github.com/vercel/satori#css)

### GitHub Issues
- [OG image + Edge Runtime -- Next.js #77796](https://github.com/vercel/next.js/issues/77796)
- [Custom fonts in ImageResponse -- Next.js #48081](https://github.com/vercel/next.js/issues/48081)

### Implementation Guides
- [Newsletter with Next.js + Supabase (Hashnode)](https://madza.hashnode.dev/how-to-create-a-secure-newsletter-subscription-with-nextjs-supabase-nodemailer-and-arcjet)
- [Honeypot Implementation Guide (FormShield)](https://formshield.dev/blog/form-honeypot-implementation-guide)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Codebase References
- `lib/analytics.ts` -- localStorage-only tracking, 17 event types
- `lib/rate-limit.ts` -- in-memory Map rate limiter
- `lib/supabase-admin.ts` -- server-only Supabase client pattern
- `app/api/plugin-suggestions/route.ts` -- existing API route pattern
- `next.config.mjs` -- current CSP headers

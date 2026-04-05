# Feature Landscape: v1.4 Marketing Prep

**Domain:** Marketing-readiness features for a Next.js 14 plugin advisor tool
**Researched:** 2026-03-29
**Scope:** Analytics, OG images, share buttons, feedback form, newsletter form

---

## 1. Server-Side Analytics (Vercel Analytics + Custom Events)

### Table Stakes

| Feature | Why Expected | Complexity | Dependency |
|---------|-------------|------------|------------|
| Page view tracking (all routes) | Baseline for any marketing launch; needed to measure traffic | Low | Root layout change |
| Vercel Analytics `<Analytics />` component in layout | Standard Vercel deployment pattern; zero-config page views | Low | `@vercel/analytics` package, root `layout.tsx` |
| Custom event tracking via `track()` from `@vercel/analytics` | Must measure meaningful actions (analysis start, script copy, etc.) to evaluate feature usage | Medium | Replace or augment existing `trackEvent` calls in `lib/analytics.ts` |
| CSP header update for Vercel Analytics script domain | Current CSP is strict (`connect-src 'self'`); Vercel Analytics will be blocked without allowing its domains | Low | `next.config.mjs` headers |

### Differentiators

| Feature | Value Proposition | Complexity | Dependency |
|---------|-------------------|------------|------------|
| Server-side custom events (`@vercel/analytics/server`) | Track API route usage (GitHub fetch, AI analyze, plugin suggestions) without client JS; more accurate than client-only | Medium | API route modifications, `@vercel/analytics >= 1.1.0` |
| Migration of existing localStorage analytics to Vercel events | Unify 16 existing event types into Vercel dashboard; single source of truth instead of two systems | Medium | Touching all `trackEvent()` call sites across ~10 components |
| Vercel Speed Insights | Core Web Vitals monitoring, performance regression detection | Low | `@vercel/speed-insights` package, layout addition |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|-------------|-----------|-------------------|
| Google Analytics / gtag.js | Adds cookie consent burden, GDPR complexity, heavier bundle; Vercel Analytics is privacy-friendly and already part of the deployment platform | Use Vercel Analytics exclusively |
| Keeping localStorage analytics as primary system | Two analytics systems create confusion; localStorage data is invisible to marketing and non-exportable | Migrate events to Vercel `track()`, keep localStorage as optional local-dev debug fallback only |
| Tracking PII (email, IP) in custom events | Privacy violation, not needed for marketing metrics | Track only action names + non-PII metadata (plugin count, score range, locale) |
| Paid analytics tier features at launch | Custom events limited to 2 keys on Pro plan; sufficient for launch needs | Start with Pro-tier limits; upgrade only if data proves need |
| Umami self-hosted or Umami Cloud | Adds infrastructure management or another SaaS; Vercel Analytics is native to the deployment platform with zero additional setup | Use Vercel Analytics which is already integrated into the Vercel dashboard |

### Complexity Assessment

**Overall: Low-Medium.** The `<Analytics />` drop-in is trivial. The real work is migrating the 16 existing `trackEvent` call sites to use `track()` from `@vercel/analytics` and updating the CSP. Server-side events require touching each API route but follow a simple pattern.

### Dependencies on Existing Code

- `lib/analytics.ts`: Current 16 event types need mapping to Vercel `track()` calls
- `app/layout.tsx`: Add `<Analytics />` and optionally `<SpeedInsights />`
- `next.config.mjs`: CSP update for `*.vercel-insights.com` and `*.vercel-analytics.com`
- ~10 components calling `trackEvent()`: Gradual migration or wrapper function

---

## 2. OG Image Optimization (Dynamic Social Cards)

### Table Stakes

| Feature | Why Expected | Complexity | Dependency |
|---------|-------------|------------|------------|
| Default OG image for the site | Any shared link without OG image looks broken on social media; absolute minimum for marketing launch | Low | `app/opengraph-image.tsx` file convention |
| `<meta>` title + description on all pages | Currently only 2 dynamic pages use `generateMetadata`; `/advisor`, `/optimizer`, `/services` are missing or minimal | Low | Add/update `metadata` exports on each page |
| Twitter card meta tags (`twitter:card`, `twitter:image`) | Twitter/X is a primary sharing channel for developer tools | Low | `app/twitter-image.tsx` or metadata export |
| 1200x630 image dimensions | Standard OG image size expected by all platforms (Facebook, Twitter, LinkedIn, Discord, Slack) | N/A | Design constraint |

### Differentiators

| Feature | Value Proposition | Complexity | Dependency |
|---------|-------------------|------------|------------|
| Per-plugin dynamic OG images via `opengraph-image.tsx` route convention | Each plugin detail page (`/plugins/[id]`) gets a branded card showing plugin name, category, verification status; looks professional when shared | Medium | `app/plugins/[id]/opengraph-image.tsx` using `ImageResponse` from `next/og` |
| Optimizer result OG image (shareable score card) | When users share their combo analysis result, the preview shows their score + plugin count; creates viral sharing loop | High | Requires URL-encodable state (query params or short ID), dedicated OG route |
| Guide-specific OG images | Each guide gets a card with its title and topic icon | Medium | `app/guides/[slug]/opengraph-image.tsx` |
| Consistent brand template across all OG images | Dark theme matching the site, Space Grotesk font, consistent layout builds brand recognition | Medium | Shared OG utility/template component |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|-------------|-----------|-------------------|
| Static pre-rendered PNG files per page | Does not scale with 51+ plugins; cannot reflect real-time data; maintenance burden | Use `ImageResponse` API for dynamic generation |
| Complex illustrations in OG images | Satori (the rendering engine) supports only Flexbox, basic text, borders, gradients; no CSS Grid, transforms, or SVG paths | Keep designs simple: text, colored backgrounds, basic shapes |
| External image generation service (Cloudinary, imgix) | Adds external dependency, cost, complexity; Next.js built-in solution is sufficient and free | Use `next/og` `ImageResponse` |
| Custom font loading for every OG image render | Fonts must be loaded as ArrayBuffer for Satori; adds latency per request | Fetch Space Grotesk once at build time and cache, or fall back to system fonts |
| Internationalized OG images (ko + en variants) | Doubles the work with minimal SEO benefit at launch; primary audience is Korean | Korean OG images only for launch; English variants can be added later if needed |

### Complexity Assessment

**Overall: Medium.** The default site-wide OG image is trivial. Per-plugin dynamic images are medium because the pattern is well-documented in Next.js docs. The optimizer share card is the hardest part because it requires serializing analysis state into a URL. Satori CSS limitations require designing within Flexbox-only constraints.

### Dependencies on Existing Code

- `app/layout.tsx`: Root metadata needs `openGraph` and `twitter` fields
- `app/plugins/[id]/page.tsx`: Already has `generateMetadata` -- extend with `openGraph` image reference
- `app/guides/[slug]/page.tsx`: Already has `generateMetadata` -- same extension needed
- `lib/plugins.ts`: Plugin data (name, category, icon color) feeds into dynamic OG
- `next.config.mjs`: CSP may need update if OG images fetch external fonts at runtime
- Font files: Space Grotesk needs to be available as raw ArrayBuffer for Satori

---

## 3. Share Buttons (Combo Analysis Result SNS Sharing)

### Table Stakes

| Feature | Why Expected | Complexity | Dependency |
|---------|-------------|------------|------------|
| "Copy link" button | Universal fallback; works everywhere; most basic sharing action | Low | `navigator.clipboard.writeText()` + toast notification |
| Twitter/X share button | Primary developer community platform for this niche | Low | `https://twitter.com/intent/tweet?url=...&text=...` URL pattern |
| Share button placement on optimizer results | The optimizer result (`ResultsPanel`) is the most shareable output of the product | Low | `components/ResultsPanel.tsx` modification |

### Differentiators

| Feature | Value Proposition | Complexity | Dependency |
|---------|-------------------|------------|------------|
| Native Web Share API with fallback | Mobile users get the native OS share sheet (contacts, apps); feels native, higher share completion rate | Low | `navigator.share()` with `navigator.canShare()` check; fall back to button row on desktop |
| Shareable optimizer URL with encoded state | Users share a link that recreates their combo analysis (selected plugins + score); recipients see the same result | High | URL state serialization: query params (`?plugins=ctx7,playwright,...`) or Supabase-stored short IDs |
| Pre-composed share text with score | "My Claude Code plugin combo scored 85/100!" -- compelling social proof that drives clicks | Low | Template string using `ScoringResult.totalScore` |
| LinkedIn share button | Relevant for team/enterprise audience sharing setup recommendations | Low | `https://linkedin.com/sharing/share-offsite?url=...` URL pattern |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|-------------|-----------|-------------------|
| `next-share` or `react-share` library | Adds dependency for what is 5 lines of URL construction; these libraries are thin wrappers over intent URLs | Build share buttons manually with platform intent URLs + Lucide icons already in the project |
| Facebook share button | Developer tools audience is primarily Twitter/X and LinkedIn; Facebook adds noise without value | Offer Twitter/X, LinkedIn, and native share (which includes Facebook on mobile via OS share sheet) |
| Share count display | Requires server-side API calls to each platform; adds complexity, rate limits, and stale data | Skip counts entirely; the share action itself is what matters |
| Auto-sharing (share on analysis complete) | Annoying UX pattern; user should explicitly choose to share | Show share buttons only after results are displayed, require explicit click |

### Complexity Assessment

**Overall: Low for basic buttons, High for shareable URLs.** The share buttons themselves are trivial (URL intent patterns). The hard part is making the optimizer result reproducible from a URL. Two approaches:
1. **Query params** (recommended first): `/optimizer?plugins=context7,playwright,github&analyze=true` -- limited by URL length but works for typical combos of 3-10 plugins
2. **Supabase short ID** (future): Store result in Supabase, generate short ID, share `/optimizer/s/abc123` -- handles any combo size but requires new API + DB table

Recommend query params first. Typical combo of 5-10 plugins produces URLs under 200 chars, well within all platform limits.

### Dependencies on Existing Code

- `components/ResultsPanel.tsx`: Add share button row after results render
- `components/OptimizerApp.tsx`: Read query params on mount to restore plugin selection + trigger analysis
- `lib/scoring.ts`: `ScoringResult` type provides `totalScore`, `conflicts`, `complementary` for share text
- OG Image feature (Feature 2): Shareable URLs are only valuable if the link preview shows a good OG image -- **build OG images before share buttons**

---

## 4. Feedback Form (Site-wide Feedback Widget)

### Table Stakes

| Feature | Why Expected | Complexity | Dependency |
|---------|-------------|------------|------------|
| Floating feedback button (bottom-right corner) | Standard pattern; always accessible without interfering with main content | Low | New client component in layout |
| Simple text input + category selector (bug/feature/other) | Minimizes friction; users can leave feedback in seconds | Low | Form component with textarea + select |
| Server-side submission to Supabase | Data must be stored persistently; Supabase is already configured | Medium | New `feedback` table in Supabase, new API route |
| Rate limiting on submission | Prevent spam; existing `lib/rate-limit.ts` pattern can be reused directly | Low | Reuse `checkRateLimit` with new bucket name |
| Success/error feedback to user | User must know their submission went through | Low | Inline confirmation state change |

### Differentiators

| Feature | Value Proposition | Complexity | Dependency |
|---------|-------------------|------------|------------|
| Page context auto-capture | Automatically include current URL path, locale, and viewport size with each submission; helps triage without asking user | Low | `window.location.pathname` + `useI18n().locale` |
| Optional email field | Lets users who want a response provide contact info; not required, keeps friction low | Low | Extra input field, optional |
| Admin panel feedback review | View/manage/archive feedback in existing `/admin` panel | Medium | New admin page + API routes following existing `suggestions` pattern |
| Feedback categorization in admin | Filter by page, category, date; basic triage workflow | Medium | Supabase query filters, admin UI |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|-------------|-----------|-------------------|
| Third-party feedback widget (Canny, UserVoice, Formbricks) | Adds external dependency, branding, cost; form is simple enough to build in-house with existing Supabase + shadcn | Build custom with Supabase + existing component library |
| Feedback voting/ranking system | Over-engineering at current scale; just collect raw feedback | Simple list in admin sorted by date |
| Real-time notification on new feedback | Not needed at current traffic; admin can check periodically | Optionally add webhook later using existing `/api/lead` pattern as template |
| Anonymous feedback without any throttle | Spam vector | Require rate limiting (IP-based, reuse existing pattern) |
| Complex categorization (tags, priorities, status workflow) | Overkill for early stage feedback volume | Simple category field: bug, feature, general |

### Complexity Assessment

**Overall: Medium.** The UI is straightforward (floating button that opens a popover/drawer with form). The backend work is the Supabase table setup, API route creation, and admin integration. All patterns already exist in the codebase -- the `plugin-suggestions` flow (`/api/plugin-suggestions` + admin review page) is nearly identical in structure and can be used as a direct template.

### Dependencies on Existing Code

- `lib/supabase-admin.ts`: Reuse `getSupabaseAdminClient()` for server-side writes
- `lib/rate-limit.ts`: Reuse `checkRateLimit()` for spam prevention
- `app/layout.tsx`: Add floating feedback button component to the body
- `app/admin/suggestions/page.tsx`: Direct template for the new feedback admin page
- `app/api/plugin-suggestions/route.ts`: Direct template for the new feedback API route
- `lib/i18n/`: Add ko/en translations for form labels and messages

---

## 5. Newsletter Signup Form (Email Collection)

### Table Stakes

| Feature | Why Expected | Complexity | Dependency |
|---------|-------------|------------|------------|
| Email input + subscribe button | Minimal viable newsletter signup; single field reduces friction | Low | New client component |
| Email format validation (client + server) | Prevent garbage data; standard HTML5 `type="email"` + server regex | Low | Built into HTML + API route validation |
| Supabase storage of subscribers | Persistent storage; Supabase is already configured | Low | New `newsletter_subscribers` table |
| Duplicate prevention | Same email should not create duplicate rows; user should see friendly message | Low | Supabase unique constraint + upsert |
| Rate limiting | Prevent abuse of the endpoint | Low | Reuse existing `checkRateLimit` |
| Success confirmation UI | User must know subscription worked | Low | Inline success message replacing the form |

### Differentiators

| Feature | Value Proposition | Complexity | Dependency |
|---------|-------------------|------------|------------|
| Placement in footer (global) | Visible on every page; standard marketing pattern for content sites | Low | Footer section in `app/layout.tsx` |
| Placement on landing page (bottom CTA section) | Higher visibility; catches users at peak engagement after reading value props | Low | `app/page.tsx` modification |
| Locale-aware copy (ko/en) | Matches existing i18n pattern; Korean users see Korean CTA, English users see English | Low | `lib/i18n/` translations |
| Admin subscriber list view | Export/manage subscribers from existing admin panel | Medium | New admin page following existing patterns |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|-------------|-----------|-------------------|
| Double opt-in email confirmation flow | Requires email sending infrastructure (SMTP, SendGrid, etc.) which is not in the current stack; overkill for initial launch | Single opt-in with Supabase storage; add double opt-in later when email service is chosen |
| Third-party newsletter service integration (Mailchimp, ConvertKit, Buttondown) | Premature optimization; need to collect emails first, decide on service later; adds API key management | Store in Supabase now; export CSV to any service when ready to send newsletters |
| Animated/complex signup form | Over-designed for a secondary action; should not distract from primary product flow | Simple inline form matching existing shadcn/ui design language |
| Topic segmentation checkboxes at launch | No email campaigns exist yet; segmenting before there is content to segment for adds complexity without value | Store with default topic; add segmentation when first campaign is planned |
| Social login for newsletter | Email-only collection is simpler and has higher conversion | Plain email input, no OAuth complexity |

### Complexity Assessment

**Overall: Low.** This is the simplest of the 5 features. One input field, one button, one API route, one Supabase table. The UI follows existing patterns (shadcn `Input` + `Button`). The only decision is placement (footer, landing page, or both -- recommend both).

### Dependencies on Existing Code

- `lib/supabase-admin.ts`: Reuse for server-side writes
- `lib/rate-limit.ts`: Reuse for spam prevention
- `app/layout.tsx`: Footer modification for global placement
- `app/page.tsx`: Landing page bottom CTA section for high-visibility placement
- `lib/i18n/`: Add ko/en translations for CTA copy
- `app/admin/`: Optional subscriber management page

---

## Feature Dependencies (Cross-Feature)

```
Analytics (1)  <-- Share Buttons (3), Feedback (4), Newsletter (5)
  All new user actions should emit Vercel Analytics events.
  Set up analytics FIRST so new features are tracked from day one.

OG Images (2)  <-- Share Buttons (3)
  Share buttons are only valuable if shared links have good previews.
  Build OG images BEFORE share buttons.

Feedback (4)  ||  Newsletter (5)
  These are independent of each other. Can be built in parallel.
  Both follow the same pattern: form component -> API route -> Supabase table.
```

**Recommended build order:**
```
Phase 1: Analytics (foundation -- measure everything from the start)
Phase 2: OG Images (prerequisite for share buttons looking good)
Phase 3: Share Buttons (depends on OG images being in place)
Phase 4: Feedback + Newsletter (parallel, independent, both use Supabase form pattern)
```

---

## MVP Recommendation

**Prioritize in this order:**

1. **Analytics** (table stakes) -- Without this, the impact of every other marketing feature is unmeasurable. The `<Analytics />` drop-in gives immediate page view data. Migrate existing `trackEvent` to Vercel `track()` to unify into a single dashboard.

2. **OG Images** (table stakes) -- Every shared link currently shows no image preview. A default site-wide OG image plus per-plugin dynamic images are the minimum for social sharing to not look broken.

3. **Share Buttons** (table stakes for optimizer) -- The optimizer result is the most viral-worthy output. Start with query-param based shareable URLs (simpler), add copy-link + Twitter/X + native Web Share API.

4. **Feedback Form** (differentiator) -- Captures early user signals before broader launch. The existing `plugin-suggestions` flow provides an exact blueprint for the Supabase + API route + admin pattern.

5. **Newsletter Form** (differentiator) -- Email collection for future marketing. Simplest feature technically, but lowest urgency because there is no email sending infrastructure yet. Still worth building since it is trivial.

**Defer to later milestones:**
- Double opt-in email confirmation: Until email sending service is chosen
- Supabase short-ID share links: Until query-param approach proves insufficient (URL length issues)
- Feedback voting/ranking: Until feedback volume justifies triage tooling
- Speed Insights: Nice-to-have, can add alongside Analytics but not critical for launch
- Topic segmentation for newsletter: Until first email campaign is planned
- English OG image variants: Until English audience justifies the effort
- A/B testing: Until traffic volume supports statistical significance
- Session replay: Overkill for a content/tool site at this stage

---

## Supabase Schema Requirements

Two new tables needed. Both follow the existing `plugin_suggestions` table pattern.

**feedback table:**
- `id` (uuid, PK, auto-generated)
- `category` (text: 'bug' | 'feature' | 'general', default 'general')
- `message` (text, required)
- `page_path` (text, auto-captured from client)
- `locale` (text, default 'ko')
- `email` (text, optional)
- `created_at` (timestamptz, default now())

**newsletter_subscribers table:**
- `id` (uuid, PK, auto-generated)
- `email` (text, unique, required)
- `locale` (text, default 'ko')
- `subscribed_at` (timestamptz, default now())
- `unsubscribed_at` (timestamptz, nullable -- for soft delete)

---

## New Package Dependencies

| Package | Version | Purpose | Required By |
|---------|---------|---------|-------------|
| `@vercel/analytics` | `^1.4` | Page views + custom event tracking | Feature 1 (Analytics) |
| `@vercel/speed-insights` | `^1.0` | Core Web Vitals monitoring (optional) | Feature 1 (Analytics, differentiator) |

No other new packages needed. OG images use built-in `next/og`. Share buttons use native URL intent patterns. Forms use existing shadcn/ui components + Lucide icons.

---

## Sources

- [Vercel Analytics Quickstart](https://vercel.com/docs/analytics/quickstart) -- HIGH confidence
- [Vercel Custom Events](https://vercel.com/docs/analytics/custom-events) -- HIGH confidence
- [Vercel Server-Side Custom Events Changelog](https://vercel.com/changelog/track-server-side-custom-events-with-vercel-web-analytics) -- HIGH confidence
- [Next.js opengraph-image File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) -- HIGH confidence
- [Next.js ImageResponse API](https://nextjs.org/docs/app/api-reference/functions/image-response) -- HIGH confidence
- [Web Share API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) -- HIGH confidence
- [Web Share API Browser Support - Can I Use](https://caniuse.com/web-share) -- HIGH confidence
- [Supabase + Next.js Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs) -- HIGH confidence
- [Newsletter with Next.js + Supabase](https://madza.hashnode.dev/how-to-create-a-secure-newsletter-subscription-with-nextjs-supabase-nodemailer-and-arcjet) -- MEDIUM confidence

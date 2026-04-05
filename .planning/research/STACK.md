# Technology Stack — v1.4 Marketing Prep

**Project:** Plugin Advisor
**Researched:** 2026-03-29
**Scope:** New libraries/patterns for Analytics, OG Images, Share Buttons, Feedback Form, Newsletter Form

## Existing Stack (DO NOT CHANGE)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | ^14.2.0 | App Router framework |
| React | ^18.3.0 | UI library |
| TypeScript | ^5.0.0 | Type safety |
| Tailwind CSS | ^3.4.0 | Styling |
| shadcn/ui | latest | Component library |
| Supabase | ^2.98.0 | Database (admin, suggestions) |
| Vercel | - | Deployment platform |
| Vitest | ^4.0.18 | Testing |
| lucide-react | ^0.577.0 | Icons |

---

## Analytics: Comprehensive Comparison

### Recommendation: Umami Cloud (Free Tier)

**Why Umami over alternatives:** Privacy-first, cookieless, GDPR-compliant out of the box, generous free tier (100K events/month), lightweight script (<2KB), and the simplest integration path for a small-to-medium Next.js project. No cookie banner needed. Custom event tracking supported on the free tier.

### Full Comparison Matrix

| Criterion | Umami Cloud | Plausible Cloud | PostHog Cloud | Vercel Analytics | Mixpanel | OpenPanel |
|-----------|-------------|-----------------|---------------|-----------------|----------|-----------|
| **Free tier** | 100K events/mo, 3 sites | None ($9/mo minimum) | 1M events/mo | 2,500 events/mo (Hobby) | 1M events/mo | 50K events/mo |
| **Paid pricing** | $20/mo (1M events) | $9/mo (10K views) | $0.00005/event after free | $14/100K events (Pro $20/mo/seat) | $20/mo+ (Growth) | $2.50/mo+ |
| **Custom events** | Yes (free tier) | Yes (all tiers) | Yes (free tier) | Pro only ($20/mo/seat) | Yes (free tier) | Yes |
| **Privacy/GDPR** | Cookieless, GDPR by default | Cookieless, GDPR by default | Configurable, needs consent banner | Privacy-friendly | Needs consent banner | Cookieless, GDPR by default |
| **Cookie banner needed** | No | No | Yes (default config) | No | Yes | No |
| **Script size** | ~2KB | <1KB | ~100KB+ | ~1KB | ~30KB+ | ~2KB |
| **Self-host option** | Yes (free, unlimited) | Yes (AGPL, free) | Yes (free, complex) | No | No | Yes (free, unlimited) |
| **Next.js integration** | Script tag or next-umami | next-plausible package | @posthog/next package | @vercel/analytics (native) | mixpanel-browser SDK | @openpanel/nextjs SDK |
| **Dashboard** | Clean, simple | Clean, simple | Complex, powerful | Basic (Vercel dashboard) | Complex, powerful | Clean, Mixpanel-like |
| **Session replay** | No | No | Yes (5K free/mo) | No | Basic (10K free) | No |
| **Funnels/retention** | Basic (paid) | Goals only | Yes (free tier) | No | Yes (free tier) | Yes |
| **Data retention** | 6mo (free), unlimited (paid) | Unlimited | 1 year (free) | 30 days (Hobby) | Unlimited (free) | 6mo (free) |
| **Best for** | Simple traffic + events | Simple traffic stats | Product analytics | Vercel-native basics | Product analytics | Mixpanel alternative |
| **Confidence** | HIGH | HIGH | HIGH | HIGH | MEDIUM | MEDIUM |

### Decision Rationale

| Option | Verdict | Why |
|--------|---------|-----|
| **Umami Cloud** | **RECOMMENDED** | 100K free events covers this project's scale. Cookieless = no cookie banner. Custom events included in free tier. Simple dashboard. Can self-host later if needed. |
| Plausible | Good but costly | No free tier. $9/mo minimum is unnecessary for a project that may not generate revenue yet. |
| PostHog | Overkill | 1M free events is generous, but ~100KB script, complex dashboard, and cookie consent needed. Better suited for SaaS products with product analytics needs. |
| Vercel Analytics | Too limited | Only 2,500 events on Hobby. Custom events require Pro ($20/mo/seat). Data retention 30 days. |
| Mixpanel | Overkill | Product analytics platform. Heavy SDK. Cookie consent needed. The project needs traffic analytics, not product analytics. |
| OpenPanel | Promising but immature | Newer project, smaller community. Good option to revisit in 6-12 months. |

### Umami Integration Plan

**No new npm package required.** Umami loads via a `<Script>` tag from Next.js. Custom events use the global `window.umami.track()` API. This is simpler and lighter than installing an npm package.

Integration method: Script tag in root layout via `next/script`. Custom events via `window.umami.track()` calls. The existing `lib/analytics.ts` trackEvent() function can be extended to dual-write: keep localStorage tracking AND forward to Umami for server-side persistence.

**New environment variables:**

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Yes | Umami website ID from dashboard |
| `NEXT_PUBLIC_UMAMI_URL` | No | Custom Umami instance URL (defaults to cloud.umami.is) |

---

## OG Image Generation

### Recommendation: `next/og` (built-in, zero dependencies)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `next/og` | Built into Next.js 14 | Dynamic OG image generation | Zero additional dependencies. Uses ImageResponse API with Satori rendering engine. File convention (`opengraph-image.tsx`) auto-wires metadata. |

**No new npm package required.** `next/og` ships with Next.js 14. The `ImageResponse` class is imported from `next/og`.

### Implementation Pattern

Use the **file convention method**: place `opengraph-image.tsx` files in route segments. Next.js automatically generates `<meta property="og:image" ...>` tags.

```
app/opengraph-image.tsx              -- Default site-wide OG image
app/advisor/opengraph-image.tsx      -- Advisor page OG
app/plugins/opengraph-image.tsx      -- Plugin catalog OG
app/plugins/[id]/opengraph-image.tsx -- Per-plugin dynamic OG
app/optimizer/opengraph-image.tsx    -- Optimizer page OG
app/guides/opengraph-image.tsx       -- Guides listing OG
```

### CSS Limitations (Satori engine)

**Supported:** Flexbox, basic typography, borders, shadows, gradients, absolute positioning
**NOT supported:** CSS Grid, calc(), CSS variables, transform, animations, advanced selectors

### Font Strategy

The project uses Space Grotesk + Pretendard. For OG images, embed font files directly (Satori needs raw font data via ArrayBuffer). Use Space Grotesk for English text. For Korean text, use Noto Sans KR (freely embeddable, widely used for Korean OG images; Pretendard Variable is too large to embed in edge functions).

**Confidence:** HIGH (official Next.js feature, well-documented)

---

## Share Buttons

### Recommendation: Native Web Share API + manual fallback links (zero dependencies)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Web Share API | Browser native | Mobile/desktop native sharing | Zero bundle cost. Native OS share sheet on supported browsers. |
| URL template links | N/A | Fallback for unsupported browsers | Twitter/X, Facebook, LinkedIn share URLs are stable and simple. |

**No new npm package required.** The project already uses lucide-react for icons (Share2, Twitter, Facebook, Linkedin, Link, Copy). Social share URLs are trivial to construct:

```
Twitter/X:  https://twitter.com/intent/tweet?text={text}&url={url}
Facebook:   https://www.facebook.com/sharer/sharer.php?u={url}
LinkedIn:   https://www.linkedin.com/sharing/share-offsite/?url={url}
Copy link:  navigator.clipboard.writeText(url)
```

### Why NOT react-share or next-share

| Library | Why Skip |
|---------|----------|
| react-share | Heavy dependency for trivial URL construction. Adds unnecessary bundle weight for 4 share targets. |
| next-share | Wrapper around react-share with the same overhead. |
| react-share-lite | Smaller but still an unnecessary abstraction over simple URL templates. |

### Web Share API Browser Support

- Chrome (Android): Full support
- Safari (iOS/macOS): Full support
- Edge: Full support
- Firefox: Partial (desktop limited)
- **Strategy:** Feature-detect with `navigator.share`, use it when available, show individual platform buttons as fallback.

**Confidence:** HIGH (Web standards, stable social share URL patterns)

---

## Feedback Form

### Recommendation: Custom form + existing Supabase (zero new dependencies)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Supabase (existing) | ^2.98.0 | Store feedback submissions | Already in the stack. Follow existing plugin-suggestions pattern. |
| shadcn/ui (existing) | latest | Form UI (Textarea, Button, Dialog) | Already available components. |
| lib/rate-limit.ts (existing) | N/A | API rate limiting | Reuse existing rate limiter. |

**No new npm package required.** Follow the exact pattern of `lib/plugin-suggestions-store.ts` + `/api/plugin-suggestions/route.ts`.

### Why NOT third-party feedback widgets

| Option | Why Skip |
|--------|----------|
| Formbricks | External JS widget, overkill for simple text feedback |
| Canny / UserVoice | SaaS pricing, external redirect |
| Typeform embed | Heavy iframe, branding on free tier |

### New Supabase Table

```sql
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  page_url TEXT,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_agent TEXT
);
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON feedback FOR INSERT WITH CHECK (true);
```

### New API Route

`POST /api/feedback` -- rate-limited, validates message length, writes to Supabase.

**Environment variables needed:** None new (uses existing Supabase credentials)

**Confidence:** HIGH (reuses existing patterns verbatim)

---

## Newsletter Signup Form

### Recommendation: Custom form + existing Supabase (zero new dependencies)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Supabase (existing) | ^2.98.0 | Store email subscriptions | Already in the stack. Simple table with unique email constraint. |
| shadcn/ui (existing) | latest | Input + Button components | Already available. |

**No new npm package required.** When the project later needs to actually send emails (newsletters, confirmations), add Resend or similar at that point. For v1.4, the goal is purely email collection.

### Why NOT email service providers now

| Option | Why Defer |
|--------|-----------|
| Resend | Would need npm package + API key. No emails to send yet. |
| Mailchimp | Heavy, external dashboard, overkill for collection-only. |
| ConvertKit / Buttondown | SaaS dependency premature when only collecting addresses. |

### New Supabase Table

```sql
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  source_page TEXT
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
```

### New API Route

`POST /api/newsletter` -- rate-limited, validates email format, writes to Supabase with conflict handling (ON CONFLICT DO NOTHING for duplicate emails).

**Environment variables needed:** None new

**Confidence:** HIGH (reuses existing patterns)

---

## Summary: What to Install

### New npm Packages: NONE

This is a key finding. All five features can be implemented with:
1. **Built-in Next.js features** (`next/og` for OG images)
2. **Browser APIs** (Web Share API, Clipboard API)
3. **Existing dependencies** (Supabase, shadcn/ui, lucide-react)
4. **External script** (Umami analytics via `<Script>` tag, not npm)

Zero new npm packages means zero new bundle weight, zero new supply chain risk, zero version management overhead.

### New Environment Variables

| Variable | Feature | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Analytics | Yes (when using Umami) |
| `NEXT_PUBLIC_UMAMI_URL` | Analytics | No (defaults to cloud) |

### New Supabase Tables

| Table | Feature | Key Columns |
|-------|---------|-------------|
| `feedback` | Feedback form | id, message, page_url, rating, created_at, user_agent |
| `newsletter_subscribers` | Newsletter | id, email (unique), subscribed_at, source_page |

### New API Routes

| Route | Feature | Method |
|-------|---------|--------|
| `/api/feedback` | Feedback form | POST |
| `/api/newsletter` | Newsletter signup | POST |

### New Files (OG Images)

| File | Feature |
|------|---------|
| `app/opengraph-image.tsx` | Default site-wide OG image |
| `app/advisor/opengraph-image.tsx` | Advisor page social card |
| `app/plugins/opengraph-image.tsx` | Plugin catalog social card |
| `app/optimizer/opengraph-image.tsx` | Optimizer page social card |
| Additional route-specific files | Per-page dynamic cards |

---

## Alternatives Considered (Full Record)

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Analytics | Umami Cloud (free) | Vercel Analytics | 2,500 event limit on Hobby, custom events require Pro ($20/mo/seat) |
| Analytics | Umami Cloud (free) | Plausible | No free tier, $9/mo minimum |
| Analytics | Umami Cloud (free) | PostHog | Overkill, heavy SDK (~100KB), needs cookie consent |
| Analytics | Umami Cloud (free) | Mixpanel | Product analytics overkill, needs cookie consent |
| Analytics | Umami Cloud (free) | OpenPanel | Newer/less mature community |
| OG Images | next/og (built-in) | @vercel/og | next/og is the same engine re-exported; prefer the Next.js import |
| Share Buttons | Native + URL templates | react-share | ~250KB bundle for what 20 lines of code achieves |
| Share Buttons | Native + URL templates | next-share | Wrapper around react-share, same overhead |
| Feedback | Supabase table | Formbricks | External widget, unnecessary dependency |
| Newsletter | Supabase table | Resend | Premature -- no emails to send yet, only collecting |
| Newsletter | Supabase table | Mailchimp | Heavy SaaS for collection-only use case |

---

## Sources

### Analytics
- [Umami Official](https://umami.is/) -- pricing, features
- [Umami Pricing](https://umami.is/pricing) -- cloud tier details
- [Umami Track Events Docs](https://docs.umami.is/docs/track-events) -- custom event API
- [Plausible Analytics](https://plausible.io/) -- pricing, features
- [PostHog Pricing](https://posthog.com/pricing) -- free tier details
- [PostHog Next.js Docs](https://posthog.com/docs/libraries/next-js) -- integration guide
- [Vercel Analytics Pricing](https://vercel.com/docs/analytics/limits-and-pricing) -- event limits
- [Mixpanel Pricing](https://mixpanel.com/pricing/) -- free tier details
- [OpenPanel](https://openpanel.dev/) -- overview and pricing
- [PostHog: Best Plausible Alternatives](https://posthog.com/blog/best-plausible-alternatives) -- ecosystem comparison
- [Umami vs Plausible vs Matomo](https://aaronjbecker.com/posts/umami-vs-plausible-vs-matomo-self-hosted-analytics/) -- self-hosted comparison

### OG Images
- [Next.js opengraph-image File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) -- official docs
- [Next.js ImageResponse API](https://nextjs.org/docs/app/api-reference/functions/image-response) -- API reference
- [Next.js Metadata and OG Images Guide](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) -- getting started
- [Vercel OG Image Generation](https://vercel.com/docs/og-image-generation) -- Satori engine details

### Share
- [Web Share API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API) -- browser API reference
- [Can I Use: Web Share](https://caniuse.com/web-share) -- browser support table

### Feedback / Newsletter
- [Creating a Contact Form with Next.js and Supabase](https://huntertrammell.dev/blog/creating-a-contact-form-using-nextjs-and-supabase) -- pattern reference
- [Secure Newsletter with Next.js and Supabase](https://madza.hashnode.dev/how-to-create-a-secure-newsletter-subscription-with-nextjs-supabase-nodemailer-and-arcjet) -- implementation guide

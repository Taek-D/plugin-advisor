# Architecture Research: v1.4 Marketing Prep Features

**Domain:** Marketing infrastructure integration -- Analytics, OG images, share buttons, feedback form, newsletter form
**Researched:** 2026-03-29
**Confidence:** HIGH -- based on direct codebase inspection + official Next.js/Umami documentation

---

## System Overview -- Current State + New Features

```
+-----------------------------------------------------------------------------+
|                         EXISTING ARCHITECTURE                               |
|                                                                             |
|  app/layout.tsx  ------------ Root layout (I18nProvider, Nav, footer)       |
|       |                                                                     |
|       +-- app/page.tsx           Landing (client, trackEvent)               |
|       +-- app/advisor/           PluginAdvisorApp (client)                  |
|       +-- app/optimizer/         OptimizerApp (client) -> ResultsPanel      |
|       +-- app/plugins/           Plugin catalog + [id] detail (server meta) |
|       +-- app/guides/            Guides + [slug] detail (server meta)       |
|       +-- app/services/          Services page (client)                     |
|       +-- app/admin/             Admin panel                                |
|                                                                             |
|  lib/analytics.ts  --- localStorage-only trackEvent() -- 17 event types    |
|  lib/supabase-admin.ts -- server-only Supabase client                      |
|  lib/rate-limit.ts -- in-memory IP-based rate limiter                      |
|  lib/i18n/ -- ko/en translations, I18nProvider context                     |
|                                                                             |
|  API Routes: /api/github, /api/analyze, /api/lead (503),                   |
|              /api/plugin-suggestions, /api/versions, /api/admin/*           |
|                                                                             |
|  Supabase tables: plugin_suggestions, custom_plugins                       |
|  CSP: connect-src 'self' https://*.supabase.co https://api.anthropic.com   |
+-----------------------------------------------------------------------------+

                    +===================================+
                    |    v1.4 NEW FEATURES (5 items)    |
                    +===================================+
                    |  1. Umami Analytics + custom evt   |
                    |  2. OG images (per-page dynamic)   |
                    |  3. Share buttons (optimizer)       |
                    |  4. Feedback widget                 |
                    |  5. Newsletter subscription form    |
                    +===================================+
```

---

## Feature 1: Server-Side Analytics (Umami Cloud + Custom Events)

### Current State

`lib/analytics.ts` stores events in **localStorage only** -- 17 event types, max 200 entries, no server persistence. `getEventStats()` reads from localStorage (per-browser, ephemeral). This data is invisible to the team and lost when users clear storage.

### Architecture Change

**Strategy:** Layer Umami Cloud analytics on top of existing localStorage tracking. Do NOT remove localStorage analytics -- it serves as client-side debug/dev instrumentation. Add Umami as the production visibility layer.

Umami was chosen over Vercel Analytics because:
- Free tier: 100K events/mo vs Vercel's 2,500 on Hobby plan
- Custom events included in free tier (Vercel requires Pro at $20/mo/seat)
- Cookieless and GDPR-compliant by default -- no cookie banner needed
- Lightweight script (~2KB) loaded via `next/script`
- No npm package needed (external script tag)

```
BEFORE:
  trackEvent("analysis_start") -> localStorage only

AFTER:
  trackEvent("analysis_start") -> localStorage (unchanged)
                               -> window.umami.track() (new, if available)
  Umami script                 -> automatic page view tracking (all pages)
```

### New / Modified Files

| File | Action | Change |
|------|--------|--------|
| `components/UmamiScript.tsx` | NEW | Server component that renders `<Script>` tag for Umami |
| `app/layout.tsx` | MODIFY | Add `<UmamiScript />` inside `<body>` after children |
| `lib/analytics.ts` | MODIFY | Add `window.umami.track()` call alongside localStorage write |
| `next.config.mjs` | MODIFY | Update CSP `connect-src` to allow Umami domain |

### Integration Detail

```typescript
// components/UmamiScript.tsx
import Script from "next/script";

export default function UmamiScript() {
  if (!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) return null;

  const src = process.env.NEXT_PUBLIC_UMAMI_URL
    ? `${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`
    : "https://cloud.umami.is/script.js";

  return (
    <Script
      src={src}
      data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  );
}
```

```typescript
// lib/analytics.ts -- modified trackEvent (addition only)
export function trackEvent(event: EventName, payload: EventPayload = {}): void {
  if (typeof window === "undefined") return;

  // Existing localStorage tracking (unchanged)
  const entry = { event, payload, ts: Date.now() };
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, payload);
  }
  try {
    const events = getStoredEvents();
    events.push(entry);
    const trimmed = events.slice(-MAX_STORED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch { /* Storage full -- silently skip */ }

  // NEW: Forward to Umami if available
  try {
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track(event, payload);
    }
  } catch { /* Umami not loaded -- silently skip */ }
}
```

### CSP Update

Current `connect-src`:
```
connect-src 'self' https://*.supabase.co https://api.anthropic.com;
```

Updated (for Umami Cloud):
```
connect-src 'self' https://*.supabase.co https://api.anthropic.com https://cloud.umami.is;
script-src ... https://cloud.umami.is;
```

If self-hosting Umami later, replace `cloud.umami.is` with the self-hosted domain.

### Key Constraints

- Umami Cloud free tier: 100K events/month, 3 websites, 6 months data retention
- The `window.umami` global is only available after the script loads (hence the guard check)
- Existing `trackEvent()` callers (17 call sites across 9+ files) require **zero changes** -- the wrapper handles forwarding transparently
- No npm package added to `package.json` -- Umami loads as an external script
- TypeScript: Add `window.umami` to global type declarations

### TypeScript Declaration

```typescript
// types/umami.d.ts (new file)
interface UmamiTracker {
  track: (event: string, data?: Record<string, string | number | boolean>) => void;
}

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}
```

---

## Feature 2: OG Images (Per-Page Dynamic Social Cards)

### Current State

Metadata is exported in several patterns across the app:

| Page | Metadata Pattern | Current OG |
|------|-----------------|------------|
| `app/layout.tsx` | `export const metadata: Metadata` | Title + description only, no OG image |
| `app/optimizer/page.tsx` | `export const metadata` (untyped) | Title + description only |
| `app/plugins/page.tsx` | `export const metadata: Metadata` | Title + description only |
| `app/plugins/[id]/page.tsx` | `generateMetadata({ params })` | Dynamic title + desc per plugin |
| `app/guides/[slug]/page.tsx` | `generateMetadata({ params })` | Dynamic title + desc per guide |
| `app/advisor/page.tsx` | None | Inherits from layout |
| `app/page.tsx` | None (`"use client"`) | Inherits from layout |

**No `opengraph-image` files exist anywhere.**

### Architecture Change

Use Next.js App Router's **file-based OG image convention** (`opengraph-image.tsx`) for dynamic image generation via `ImageResponse` from `next/og`.

```
app/
+-- opengraph-image.tsx          # DEFAULT -- used for /, /advisor, /services
+-- twitter-image.tsx            # Re-export for Twitter card
+-- plugins/
|   +-- opengraph-image.tsx      # /plugins catalog page
|   +-- [id]/
|       +-- opengraph-image.tsx  # Dynamic per-plugin OG image
+-- optimizer/
|   +-- opengraph-image.tsx      # /optimizer page
+-- guides/
    +-- opengraph-image.tsx      # /guides catalog page
    +-- [slug]/
        +-- opengraph-image.tsx  # Dynamic per-guide OG image
```

### New Files

| File | Type | Content |
|------|------|---------|
| `app/opengraph-image.tsx` | NEW | Default OG image -- "Plugin Advisor" branding, 1200x630, dark theme |
| `app/twitter-image.tsx` | NEW | Re-export of opengraph-image for Twitter card |
| `app/plugins/opengraph-image.tsx` | NEW | "Plugin Catalog" card with plugin count badge |
| `app/plugins/[id]/opengraph-image.tsx` | NEW | Dynamic -- reads PLUGINS[params.id] for name, tag, category |
| `app/optimizer/opengraph-image.tsx` | NEW | "Plugin Optimizer" branded card |
| `app/guides/opengraph-image.tsx` | NEW | "Starter Guides" branded card |
| `app/guides/[slug]/opengraph-image.tsx` | NEW | Dynamic -- reads guide title/description |

### Implementation Pattern

Each `opengraph-image.tsx` follows the same structure:

```typescript
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Plugin Advisor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #080810 0%, #0f1729 50%, #080810 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Content varies per page */}
      </div>
    ),
    { ...size }
  );
}
```

For dynamic routes like `[id]`:

```typescript
import { PLUGINS } from "@/lib/plugins";

export default async function Image({ params }: { params: { id: string } }) {
  const plugin = PLUGINS[params.id];
  if (!plugin) {
    return new ImageResponse(/* generic fallback card */);
  }
  return new ImageResponse(
    // Uses plugin.name, plugin.tag, plugin.category, plugin.color
  );
}

export function generateStaticParams() {
  return Object.keys(PLUGINS).map((id) => ({ id }));
}
```

### Key Constraints

- `opengraph-image.tsx` uses **Edge runtime** -- cannot use Node.js APIs. `PLUGINS` import works because it is a static JS object.
- `ImageResponse` supports a **subset of CSS** -- flexbox and absolute positioning only. No grid, no advanced CSS.
- Custom fonts require explicit loading via `fetch()`. For Korean text, use Noto Sans KR subset (< 500KB). Pretendard Variable is too large for edge functions.
- The dark theme colors (`#080810`, green primary) should be hardcoded as hex/rgb since CSS variables are not available in ImageResponse.
- `generateStaticParams()` in dynamic routes ensures images are generated at build time.

### Metadata Enhancement

```typescript
// app/layout.tsx -- add base openGraph to metadata
export const metadata: Metadata = {
  title: "Plugin Advisor -- Claude Code",
  description: "...",
  openGraph: {
    type: "website",
    siteName: "Plugin Advisor",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

---

## Feature 3: Share Buttons (Optimizer Results)

### Current State

`OptimizerApp` renders `ResultsPanel` after analysis. **No share functionality exists anywhere in the app.** The `ScoringResult` type contains all data needed for a shareable summary: score (0-100), conflicts count, coverage ratio, typeScope.

### Architecture Change

Add a `ShareResultButton` component inside `ResultsPanel` that:
1. Generates a text summary from `ScoringResult`
2. Uses the **Web Share API** (native on mobile) with URL share fallback (social links + copy to clipboard on desktop)
3. No external library needed -- lucide-react already provides share icons

```
ResultsPanel
  +-- ScoreGauge
  +-- ConflictSection
  +-- CoverageGrid
  +-- ComplementSection
  +-- ReplacementSection
  +-- ShareResultButton  <-- NEW
        +-- Share via Web Share API (mobile/supported browsers)
        +-- Copy link + summary to clipboard (desktop fallback)
        +-- Direct social links: Twitter/X, LinkedIn
```

### New / Modified Files

| File | Action | Change |
|------|--------|--------|
| `components/ShareResultButton.tsx` | NEW | Share button with Web Share API + fallback |
| `lib/share-utils.ts` | NEW | Helper to generate share text from `ScoringResult` |
| `components/ResultsPanel.tsx` | MODIFY | Import and render `ShareResultButton` |
| `lib/i18n/types.ts` | MODIFY | Add `share` section to `Translations` type |
| `lib/i18n/ko.ts` | MODIFY | Add Korean share strings |
| `lib/i18n/en.ts` | MODIFY | Add English share strings |
| `lib/analytics.ts` | MODIFY | Add `"share_result"` to `EventName` union |

### Data Flow

```
ScoringResult (from OptimizerApp state)
    |
ShareResultButton receives result as prop
    |
lib/share-utils.ts generateShareText(result)
    -> "My Claude Code plugin score: 85/100 | 5 plugins, 8/10 categories covered"
    |
navigator.share() available?
    +-- YES -> Web Share API (title, text, url)
    +-- NO  -> Show dropdown: Twitter/X, LinkedIn, Copy Link
              +-- Twitter: https://twitter.com/intent/tweet?text={encoded}
              +-- LinkedIn: https://www.linkedin.com/sharing/share-offsite/?url={encoded}
              +-- Copy: navigator.clipboard.writeText(url)
    |
trackEvent("share_result", { method: "native" | "clipboard" | "twitter" | "linkedin" })
```

### Key Constraints

- **No URL state for results:** The optimizer runs client-side only. Share text includes the score summary + the base site URL (`/optimizer`), NOT a result-specific URL. Building shareable result URLs would require server-side storage -- not v1.4 scope.
- **No external dependencies:** `navigator.share()` + `navigator.clipboard.writeText()` + `encodeURIComponent()`. Lucide's `Share2` icon is already available.
- Share button only appears when `analysisState === "done"`.

---

## Feature 4: Feedback Widget

### Current State

No feedback mechanism exists. The closest pattern is `PluginSuggestionCallout.tsx` -- a collapsible callout that opens a form, posts to `/api/plugin-suggestions`, and stores in Supabase. This is the reference pattern.

### Architecture Change

Add a floating feedback widget (bottom-right corner) that expands into a compact form. Submissions go to a new Supabase table via a new API route.

```
app/layout.tsx
  +-- Nav
  +-- {children}
  +-- footer
  +-- FeedbackWidget  <-- NEW (fixed position, bottom-right)
  +-- UmamiScript     <-- NEW
```

### New / Modified Files

| File | Action | Change |
|------|--------|--------|
| `components/FeedbackWidget.tsx` | NEW | Floating feedback widget (client component) |
| `app/api/feedback/route.ts` | NEW | POST handler -- validate, rate-limit, store in Supabase |
| `app/layout.tsx` | MODIFY | Import and render `<FeedbackWidget />` |
| `lib/i18n/types.ts` | MODIFY | Add `feedback` section to `Translations` |
| `lib/i18n/ko.ts` | MODIFY | Korean feedback strings |
| `lib/i18n/en.ts` | MODIFY | English feedback strings |
| `lib/analytics.ts` | MODIFY | Add `"feedback_submit"` to `EventName` union |

### Supabase Table

```sql
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  locale TEXT CHECK (locale IN ('ko', 'en')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'archived'))
);

CREATE INDEX IF NOT EXISTS feedback_status_idx
  ON public.feedback (status, created_at DESC);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.feedback
  FOR INSERT WITH CHECK (true);
```

### API Route Pattern

Follows existing `plugin-suggestions` pattern:

```typescript
// app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, cleanupExpiredEntries } from "@/lib/rate-limit";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  cleanupExpiredEntries();
  const { allowed } = checkRateLimit(request, {
    name: "feedback",
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 5 per hour
  });
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const body = await request.json();
  // Validate: rating (1-5), message (optional, max 1000 chars), page_path
  // Insert into Supabase feedback table
}
```

### Key Constraints

- Widget must NOT appear on `/admin/*` pages
- Position `fixed` bottom-right, z-index above content but below modals
- Rate limit: 5 submissions per hour per IP
- Lazy-load expanded form on click to minimize initial bundle impact

---

## Feature 5: Newsletter Subscription Form

### Current State

No email collection exists. The `/api/lead` route returns 503. The `LeadCaptureCard` shows "coming soon" with no form.

### Architecture Change

Standalone newsletter section on landing page footer area + compact inline form on `/guides` page. Separate from the lead capture flow (newsletter is email-only, lead form is multi-field).

### New / Modified Files

| File | Action | Change |
|------|--------|--------|
| `components/NewsletterForm.tsx` | NEW | Reusable newsletter form component |
| `app/api/newsletter/route.ts` | NEW | POST handler -- validate, rate-limit, store in Supabase |
| `app/page.tsx` | MODIFY | Add `<NewsletterForm />` section |
| `app/guides/page.tsx` | MODIFY | Add `<NewsletterForm compact />` |
| `lib/i18n/types.ts` | MODIFY | Add `newsletter` section |
| `lib/i18n/ko.ts` | MODIFY | Korean newsletter strings |
| `lib/i18n/en.ts` | MODIFY | English newsletter strings |
| `lib/analytics.ts` | MODIFY | Add `"newsletter_subscribe"` to `EventName` union |

### Supabase Table

```sql
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL,
  locale TEXT CHECK (locale IN ('ko', 'en')),
  source_page TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_status_idx
  ON public.newsletter_subscribers (status, created_at DESC);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);
```

### Key Constraints

- **No double opt-in in v1.4.** Collect with clear purpose statement. Add confirmation email later with Resend.
- **Duplicate handling:** `ON CONFLICT (email) DO NOTHING` -- return friendly "already subscribed" message.
- Rate limit: 3 submissions per hour per IP
- Validate email format client-side AND server-side

---

## Cross-Cutting Concerns

### i18n Impact

All 5 features add new translation keys:

```typescript
// New sections in Translations type
share: {
  shareResult: string;
  copyLink: string;
  copied: string;
  shareText: string;
  shareOnTwitter: string;
  shareOnLinkedIn: string;
};
feedback: {
  title: string;
  placeholder: string;
  ratingLabel: string;
  submit: string;
  submitted: string;
  error: string;
};
newsletter: {
  title: string;
  subtitle: string;
  placeholder: string;
  subscribe: string;
  subscribed: string;
  alreadySubscribed: string;
  error: string;
};
```

### Analytics Event Expansion

Current 17 events expand to 20:

| New Event | Trigger | Payload |
|-----------|---------|---------|
| `share_result` | User shares optimizer result | `{ method, score }` |
| `feedback_submit` | User submits feedback | `{ rating, pagePath }` |
| `newsletter_subscribe` | User subscribes to newsletter | `{ source }` |

### CSP Updates Summary

Update CSP for Umami Cloud:

```
script-src: add https://cloud.umami.is
connect-src: add https://cloud.umami.is
```

Supabase connections already allowed. OG images are same-origin.

### New Dependencies

**Zero new npm packages.** All features use:
- Built-in `next/og` for OG images
- External Umami script via `<Script>` tag
- Native Web Share API + Clipboard API
- Existing Supabase client + rate limiter

---

## Complete File Inventory

### New Files (14)

| File | Feature | Type |
|------|---------|------|
| `components/UmamiScript.tsx` | Analytics | Server component |
| `types/umami.d.ts` | Analytics | TypeScript declaration |
| `app/opengraph-image.tsx` | OG | Server (Edge) |
| `app/twitter-image.tsx` | OG | Server (Edge) |
| `app/plugins/opengraph-image.tsx` | OG | Server (Edge) |
| `app/plugins/[id]/opengraph-image.tsx` | OG | Server (Edge) |
| `app/optimizer/opengraph-image.tsx` | OG | Server (Edge) |
| `app/guides/opengraph-image.tsx` | OG | Server (Edge) |
| `app/guides/[slug]/opengraph-image.tsx` | OG | Server (Edge) |
| `components/ShareResultButton.tsx` | Share | Client |
| `lib/share-utils.ts` | Share | Shared |
| `components/FeedbackWidget.tsx` | Feedback | Client |
| `app/api/feedback/route.ts` | Feedback | Server |
| `components/NewsletterForm.tsx` | Newsletter | Client |
| `app/api/newsletter/route.ts` | Newsletter | Server |

### Modified Files (10)

| File | Features Affecting It |
|------|-----------------------|
| `app/layout.tsx` | Analytics (`<UmamiScript />`), Feedback (`<FeedbackWidget />`), OG (metadata) |
| `lib/analytics.ts` | Analytics (Umami forwarding), Share/Feedback/Newsletter (new event names) |
| `next.config.mjs` | Analytics (CSP update for Umami) |
| `components/ResultsPanel.tsx` | Share (`<ShareResultButton />`) |
| `app/page.tsx` | Newsletter (`<NewsletterForm />` section) |
| `app/guides/page.tsx` | Newsletter (`<NewsletterForm compact />`) |
| `lib/i18n/types.ts` | Share + Feedback + Newsletter (new translation sections) |
| `lib/i18n/ko.ts` | Share + Feedback + Newsletter (Korean strings) |
| `lib/i18n/en.ts` | Share + Feedback + Newsletter (English strings) |

### Supabase Migrations (2)

| Table | Feature |
|-------|---------|
| `feedback` | Feedback widget |
| `newsletter_subscribers` | Newsletter form |

---

## Dependency Graph and Build Order

```
Phase A: Foundation (no feature dependencies)
  +-- A1: Umami Cloud setup + UmamiScript component
  |     CSP update -> UmamiScript.tsx -> layout.tsx -> analytics.ts
  |     (Can verify: page views appear in Umami dashboard)
  |
  +-- A2: Supabase migrations
        Create feedback + newsletter_subscribers tables
        (Required before feedback and newsletter API routes)

Phase B: OG Images (independent of all other features)
  +-- B1: Base OG image (app/opengraph-image.tsx + twitter-image.tsx)
  +-- B2: Static page OG images (/plugins, /optimizer, /guides)
  +-- B3: Dynamic OG images (/plugins/[id], /guides/[slug])

Phase C: i18n Foundation (required by Share, Feedback, Newsletter)
  +-- C1: Add share, feedback, newsletter sections to i18n types + ko + en

Phase D: Features (after A2 + C1)
  +-- D1: Share buttons (lib/share-utils.ts -> ShareResultButton -> ResultsPanel)
  +-- D2: Feedback widget (api/feedback -> FeedbackWidget -> layout.tsx)
  +-- D3: Newsletter form (api/newsletter -> NewsletterForm -> page.tsx + guides)

Phase E: Verification
  +-- E1: Full build + typecheck + lint + test
```

### Recommended Execution Sequence

```
1. Analytics setup (A1)           -- standalone, immediate value
2. Supabase migrations (A2)       -- unblocks D2 + D3
3. i18n additions (C1)            -- unblocks D1 + D2 + D3
4. OG images (B1 -> B2 -> B3)    -- standalone, can parallel with 5-7
5. Share buttons (D1)             -- after C1
6. Feedback widget (D2)           -- after A2 + C1
7. Newsletter form (D3)           -- after A2 + C1
8. Final verification (E1)        -- after all
```

Items 4, 5, 6, 7 can execute in parallel after prerequisites are met.

---

## Architectural Patterns to Follow

### Pattern 1: Wrapper Enhancement (Analytics)
Enhance `trackEvent()` to forward to Umami without changing any call site. All 17+ existing call sites continue working identically. Lowest-risk integration pattern.

### Pattern 2: File Convention (OG Images)
Use Next.js file-based conventions (`opengraph-image.tsx`) rather than manual `<meta>` tags. Framework handles meta tag generation, content-type headers, and caching.

### Pattern 3: Existing API Route Pattern (Feedback + Newsletter)
Both new API routes replicate the pattern from `plugin-suggestions`: rate-limit + Supabase admin client + validation + structured JSON responses.

### Pattern 4: Client Component with Server API (Feedback + Newsletter)
Same pattern as `PluginSuggestionCallout.tsx`: `"use client"` component with form state, `fetch("/api/...")` on submit, loading/success/error states, `trackEvent()` on success.

---

## Anti-Patterns to Avoid

### 1: Removing localStorage Analytics
Keep both layers. localStorage provides dev debug visibility. Umami provides production metrics.

### 2: Using External Libraries for Share Buttons
Web Share API + clipboard API + URL construction covers all needs. No react-share or next-share.

### 3: Putting OG Image Logic in generateMetadata
Use `opengraph-image.tsx` file convention. Simpler, auto-cached, co-located with route.

### 4: Shared Form Component for Feedback + Newsletter
Different shapes (rating+message vs email-only), different validation, different endpoints. Keep separate.

### 5: Double Opt-In for Newsletter in v1.4
No email sending infrastructure. Collect emails with clear purpose statement. Add double opt-in later with Resend.

---

## Sources

- Direct codebase inspection: `lib/analytics.ts`, `app/layout.tsx`, `next.config.mjs`, `components/ResultsPanel.tsx`, `lib/supabase-admin.ts`, `lib/rate-limit.ts`, `app/api/plugin-suggestions/route.ts`, `lib/i18n/types.ts`
- [Umami Track Events Docs](https://docs.umami.is/docs/track-events)
- [Umami Cloud](https://cloud.umami.is) -- dashboard and setup
- [Next.js opengraph-image convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [Next.js ImageResponse API](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Next.js Script component](https://nextjs.org/docs/app/api-reference/components/script)
- [Web Share API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)
- [Clipboard API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)

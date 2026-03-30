# Phase 17: Analytics Foundation - Research

**Researched:** 2026-03-29
**Domain:** Umami Cloud analytics integration, Next.js CSP, Supabase schema migrations
**Confidence:** HIGH

## Summary

Phase 17 installs the analytics and data-layer foundation needed by all subsequent marketing phases. It has two clean concerns: (1) wiring Umami Cloud into every page with proper CSP and ad-blocker bypass, and (2) creating the Supabase tables that Phases 18/19 will write data into.

The Umami integration is a well-understood Next.js pattern: a single `UmamiScript` server component placed in `app/layout.tsx`, a `next.config.mjs` CSP update, a thin `/api/umami` proxy route, and a one-line addition to `lib/analytics.ts` that forwards `trackEvent` calls to `window.umami.track`. No new npm packages are required — everything uses `next/script` (already in Next.js) and fetch. The Supabase work is pure SQL: two `CREATE TABLE … ENABLE ROW LEVEL SECURITY` migration files following the same pattern already established in the codebase.

**Primary recommendation:** Add `cloud.umami.is` to `script-src` and `connect-src` in `next.config.mjs` first, then add the `UmamiScript` component to `layout.tsx`, then add the `/api/umami` proxy, then patch `analytics.ts` — in that order. Ship the Supabase migrations in the same PR as a second independent task.

---

<user_constraints>
## User Constraints (from STATE.md / accumulated decisions)

### Locked Decisions
- Umami Cloud selected (not Vercel Analytics, not GA4) — 100K free events, cookieless, custom events included
- Zero new npm packages — use `next/script` (built-in), Web Share API (browser-native), `next/og` (built-in)
- CSP update MUST be applied before the Umami script tag is added (prevents initial block)
- localStorage analytics layer MUST be kept — Umami forwarding is additive, not a replacement
- Supabase `feedback` and `newsletter_subscribers` tables created in Phase 17 (table only; API routes in Phase 19)

### Claude's Discretion
- Proxy route implementation approach (next.config.mjs rewrites vs. API route handler)
- TypeScript declaration strategy for `window.umami`
- Exact SQL column definitions for feedback/newsletter tables (within reason for Phase 19 use-cases)
- Whether to use `next/script` `strategy="afterInteractive"` or `strategy="lazyOnload"`

### Deferred Ideas (OUT OF SCOPE)
- Umami dashboard embed in admin pages (ANLY-05, v2)
- A/B testing framework (ANLY-06, v2)
- Double opt-in email verification (NEWS-03, v2)
- Newsletter send functionality / Resend integration (NEWS-04, v2)
- Cookie consent banner (explicitly not needed — Umami is cookieless)
- Real-time notifications for feedback/subscriptions
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ANLY-01 | Umami Cloud 스크립트가 모든 페이지에서 로드되어 페이지뷰를 자동 추적한다 | `UmamiScript` server component + `layout.tsx` integration; Umami auto-tracks SPA page navigations via `next/script` |
| ANLY-02 | CSP 헤더가 Umami 도메인을 허용하여 스크립트가 차단되지 않는다 | `next.config.mjs` headers() update: add `cloud.umami.is` to `script-src` and `connect-src` |
| ANLY-03 | 기존 16개 localStorage 이벤트가 Umami 커스텀 이벤트로 마이그레이션된다 | Single `window.umami?.track(event, payload)` call appended inside existing `trackEvent()` in `lib/analytics.ts` |
| ANLY-04 | /api/umami proxy 라우트가 광고차단기를 우회하여 데이터 손실을 최소화한다 | Next.js API route at `app/api/umami/route.ts` that proxies to `https://cloud.umami.is`; `data-host-url` attribute points to proxy |
| FDBK-02 (table only) | 피드백이 Supabase에 저장되고 rate limit이 적용된다 — table creation portion | SQL migration: `feedback` table with RLS; `anon` INSERT allowed, service_role reads/updates |
| NEWS-02 (table only) | 구독 정보가 Supabase에 저장되고 중복/rate limit이 적용된다 — table creation portion | SQL migration: `newsletter_subscribers` table with RLS, unique constraint on email, `anon` INSERT allowed |
</phase_requirements>

---

## Standard Stack

### Core
| Library / API | Version | Purpose | Why Standard |
|---------------|---------|---------|--------------|
| `next/script` | Next.js 14 built-in | Load Umami `<script>` with lifecycle control | Official Next.js pattern; handles SPA routing correctly |
| `window.umami` | Umami Cloud script | Custom event API in browser | Injected by the Umami script; no install needed |
| Next.js `headers()` in `next.config.mjs` | Next.js 14 | Set CSP header site-wide | Already used in project; same file, same pattern |
| Next.js App Router API route | Next.js 14 | `/api/umami` proxy | Standard Next.js server-side fetch; no extra package |
| Supabase SQL migrations | existing pattern | Create tables + RLS | Matches `supabase/migrations/` convention already in repo |

### Supporting
| Library / API | Version | Purpose | When to Use |
|---------------|---------|---------|-------------|
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | env var | Website ID from Umami Cloud dashboard | Required for script `data-website-id` |
| `NEXT_PUBLIC_UMAMI_PROXY_URL` | env var | Points to `/api/umami` on own domain | Used as `data-host-url` in script tag |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Next.js API route proxy | `next.config.mjs` rewrites | Rewrites are simpler but cannot manipulate headers; API route gives more control and is easier to debug |
| `strategy="afterInteractive"` | `strategy="lazyOnload"` | `afterInteractive` fires sooner (after hydration) which captures more events; `lazyOnload` is fine for pure analytics |
| `window.umami?.track` inline in analytics.ts | Separate `umami.ts` wrapper | Inline keeps the change minimal; a wrapper adds abstraction that isn't needed yet |

**Installation:** No new packages. Everything ships with Next.js 14.

---

## Architecture Patterns

### Recommended Project Structure
```
app/
├── api/
│   └── umami/
│       └── route.ts          # Proxy to cloud.umami.is (ANLY-04)
├── layout.tsx                # Add <UmamiScript /> here
components/
└── UmamiScript.tsx           # Server component wrapping next/script (ANLY-01)
lib/
└── analytics.ts              # Add window.umami?.track() call (ANLY-03)
next.config.mjs               # CSP update (ANLY-02)
supabase/migrations/
├── 20260329_create_feedback.sql
└── 20260329_create_newsletter_subscribers.sql
```

### Pattern 1: UmamiScript Server Component
**What:** A minimal server component that renders `<Script>` only when `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set. This prevents errors in local dev where the var is absent.
**When to use:** Placed once in `app/layout.tsx` inside `<body>`. Renders on every page automatically.
**Example:**
```typescript
// components/UmamiScript.tsx
// Source: https://fabian-rosenthal.com/blog/integrate-umami-analytics-into-nextjs-app-router
import Script from "next/script";

export default function UmamiScript() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const proxyUrl = process.env.NEXT_PUBLIC_UMAMI_PROXY_URL; // e.g. "/api/umami"
  if (!websiteId) return null;
  return (
    <Script
      async
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      data-host-url={proxyUrl}
      strategy="afterInteractive"
    />
  );
}
```

### Pattern 2: CSP Update in next.config.mjs
**What:** Add `https://cloud.umami.is` to both `script-src` and `connect-src` directives.
**When to use:** This MUST happen in the same commit as or before the UmamiScript component. The existing CSP already uses `'unsafe-inline'` so no nonce infrastructure is needed.
**Example:**
```javascript
// next.config.mjs — updated Content-Security-Policy value
// Source: https://nextjs.org/docs/14/app/building-your-application/configuring/content-security-policy
"default-src 'self'; " +
"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is; " +
"style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
"font-src 'self' https://cdn.jsdelivr.net data:; " +
"img-src 'self' data: https:; " +
"connect-src 'self' https://*.supabase.co https://api.anthropic.com https://cloud.umami.is; " +
"frame-ancestors 'none';"
```
Note: when using the `/api/umami` proxy the browser only connects to `'self'`, so the `connect-src` entry for `cloud.umami.is` is technically only needed for the script download. Keep it anyway for correctness.

### Pattern 3: /api/umami Proxy Route
**What:** A Next.js route handler that forwards all requests to `https://cloud.umami.is`, stripping the `/api/umami` prefix.
**When to use:** Always — this is what `data-host-url` points to, ensuring ad-blocker resistant data collection.
**Example:**
```typescript
// app/api/umami/route.ts
// Source: https://docs.umami.is/docs/bypass-ad-blockers
import { NextRequest, NextResponse } from "next/server";

const UMAMI_BASE = "https://cloud.umami.is";

export async function GET(req: NextRequest) {
  return proxyToUmami(req);
}

export async function POST(req: NextRequest) {
  return proxyToUmami(req);
}

async function proxyToUmami(req: NextRequest): Promise<NextResponse> {
  const { pathname, search } = req.nextUrl;
  // Strip the /api/umami prefix
  const upstreamPath = pathname.replace(/^\/api\/umami/, "");
  const upstreamUrl = `${UMAMI_BASE}${upstreamPath}${search}`;

  const headers = new Headers(req.headers);
  headers.set("host", "cloud.umami.is");

  const body = req.method === "POST" ? await req.text() : undefined;

  const res = await fetch(upstreamUrl, {
    method: req.method,
    headers,
    body,
  });

  return new NextResponse(res.body, {
    status: res.status,
    headers: res.headers,
  });
}
```

### Pattern 4: analytics.ts Umami Forwarding
**What:** Add a single `window.umami?.track()` call at the end of the existing `trackEvent()` function. The `?.` guard means it silently no-ops when the Umami script hasn't loaded yet (e.g., in SSR, tests, or dev without the env var).
**When to use:** Always — this satisfies ANLY-03 with minimal diff to an existing file.
**Example:**
```typescript
// lib/analytics.ts — addition inside trackEvent()
// Source: https://docs.umami.is/docs/track-events
export function trackEvent(event: EventName, payload: EventPayload = {}): void {
  if (typeof window === "undefined") return;

  // ... existing localStorage logic unchanged ...

  // Forward to Umami (no-op if script not loaded)
  (window as Window & { umami?: { track: (name: string, data?: Record<string, unknown>) => void } }).umami?.track(event, payload);
}
```

### Pattern 5: TypeScript window.umami Declaration
**What:** Augment the global `Window` interface so TypeScript knows about `window.umami`. Place in a `.d.ts` file so it doesn't pollute any module.
**Example:**
```typescript
// types/umami.d.ts
interface Window {
  umami?: {
    track: (eventName: string, eventData?: Record<string, unknown>) => void;
    identify: (sessionData: Record<string, unknown>) => void;
  };
}
```

### Pattern 6: Supabase Migration — feedback table
**What:** Migration following existing repo conventions (`supabase/migrations/YYYYMMDD_description.sql`).
**Example:**
```sql
-- supabase/migrations/20260329_create_feedback.sql
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  page text not null,
  rating smallint null check (rating between 1 and 5),
  message text not null,
  contact text null
);

alter table public.feedback enable row level security;

-- Anonymous users can submit feedback
create policy "anon_insert" on public.feedback
  for insert
  with check (true);

-- Only service_role can read (admin backend)
create policy "service_role_select" on public.feedback
  for select
  using (auth.role() = 'service_role');
```

### Pattern 7: Supabase Migration — newsletter_subscribers table
```sql
-- supabase/migrations/20260329_create_newsletter_subscribers.sql
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  source text null,
  confirmed boolean not null default false,
  constraint newsletter_subscribers_email_key unique (email)
);

alter table public.newsletter_subscribers enable row level security;

-- Anonymous users can subscribe (Phase 19 API route will enforce rate limit)
create policy "anon_insert" on public.newsletter_subscribers
  for insert
  with check (true);

-- Only service_role can read/update (admin backend)
create policy "service_role_select" on public.newsletter_subscribers
  for select
  using (auth.role() = 'service_role');

create policy "service_role_update" on public.newsletter_subscribers
  for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
```

### Anti-Patterns to Avoid
- **Adding Umami script before CSP update:** The browser blocks the script with a CSP violation, and it never loads. Always update CSP first.
- **Using `next.config.mjs` rewrites for the proxy:** Rewrites cannot read or modify request/response headers and bodies. Use an API route handler instead.
- **Replacing `trackEvent` localStorage logic:** ANLY-03 says "migrated to Umami" but STATE.md locks "localStorage analytics 유지". The correct implementation is additive: keep localStorage, add `umami.track` call.
- **Hard-coding the Umami website ID:** Use `NEXT_PUBLIC_UMAMI_WEBSITE_ID` so the component returns `null` in environments where the var is absent (local dev, CI).
- **Installing `next-umami` npm package:** STATE.md locks "zero new npm packages". Use `next/script` directly.
- **Adding `confirmed boolean default true`:** The `confirmed` column in `newsletter_subscribers` must default to `false`; a future Phase (NEWS-03, v2) will flip it via email verification.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SPA page-view tracking | Custom `usePathname` listener | Umami script auto-tracking | Umami script natively handles Next.js SPA navigation via History API |
| Ad-blocker bypass script renaming | Custom script serving | Next.js API route proxy with `data-host-url` | Simpler, no static file management, works with Vercel deployment |
| Umami event batching / retry | Custom queue | Umami SDK handles internally | Over-engineering — Umami's script handles delivery |
| Cookie consent management | Consent banner | Nothing needed | Umami is cookieless by design — no consent banner required |

**Key insight:** Umami is designed to be drop-in. The entire Umami integration surface is: one script tag, one env var, one `umami.track()` call per custom event. Do not abstract further.

---

## Common Pitfalls

### Pitfall 1: CSP blocks Umami script silently in production
**What goes wrong:** Script loads fine locally (no CSP), but Vercel production blocks `cloud.umami.is` with a 403/CSP error. Pageviews never appear in dashboard.
**Why it happens:** The existing `next.config.mjs` CSP is already restrictive. `cloud.umami.is` is not in `script-src` or `connect-src`.
**How to avoid:** Update CSP first, verify with browser DevTools console (no CSP errors), then add the script component.
**Warning signs:** Console shows `Refused to load script from 'https://cloud.umami.is/script.js' because it violates the following Content Security Policy directive`.

### Pitfall 2: Proxy route does not strip /api/umami prefix
**What goes wrong:** Requests hit `https://cloud.umami.is/api/umami/api/send` instead of `https://cloud.umami.is/api/send` — 404 from Umami.
**Why it happens:** `req.nextUrl.pathname` includes the full path. The upstream URL must have the prefix stripped.
**How to avoid:** Use `pathname.replace(/^\/api\/umami/, "")` before building the upstream URL.
**Warning signs:** Network tab shows `/api/umami/...` requests returning 404.

### Pitfall 3: window.umami called before script loads
**What goes wrong:** `window.umami is undefined` error in console on first page load, especially for events triggered early.
**Why it happens:** `strategy="afterInteractive"` still loads asynchronously; early `onClick` or `useEffect` calls may race.
**How to avoid:** Always use optional chaining `window.umami?.track(...)`. The existing `trackEvent` wrapper already handles this with the `?.` guard shown in Pattern 4.
**Warning signs:** TypeScript error `Property 'umami' does not exist on type 'Window'` — fixed by `types/umami.d.ts`.

### Pitfall 4: Supabase migration naming collision
**What goes wrong:** Two migrations with the same timestamp prefix fail to apply in the right order.
**Why it happens:** Supabase applies migrations sorted lexicographically by filename. Using `20260329_create_feedback.sql` and `20260329_create_newsletter_subscribers.sql` is fine as long as neither depends on the other (they don't).
**How to avoid:** Name migrations clearly; verify with `supabase db push` or manual `psql` apply.
**Warning signs:** `relation does not exist` errors in Phase 19 when the API route tries to insert.

### Pitfall 5: data-host-url misconfiguration
**What goes wrong:** `data-host-url` is set to an absolute URL in dev (e.g., `http://localhost:3002/api/umami`) but the env var is missing in production, falling back to direct Umami — defeating the proxy purpose.
**Why it happens:** The env var is optional and silently ignored when absent.
**How to avoid:** Set `NEXT_PUBLIC_UMAMI_PROXY_URL=/api/umami` (relative path, no host) in both `.env.local` and Vercel environment variables. A relative path works on any domain.
**Warning signs:** Network tab shows requests going to `cloud.umami.is` directly in production.

---

## Code Examples

### Complete UmamiScript component
```typescript
// components/UmamiScript.tsx
// Source: https://fabian-rosenthal.com/blog/integrate-umami-analytics-into-nextjs-app-router
import Script from "next/script";

export default function UmamiScript() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return null;
  return (
    <Script
      async
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      data-host-url={process.env.NEXT_PUBLIC_UMAMI_PROXY_URL}
      strategy="afterInteractive"
    />
  );
}
```

### layout.tsx integration (minimal diff)
```typescript
// app/layout.tsx — add one import + one JSX tag inside <body>
import UmamiScript from "@/components/UmamiScript";
// ...
<body ...>
  <I18nProvider>
    <Nav />
    <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
    <footer>...</footer>
  </I18nProvider>
  <UmamiScript />
</body>
```

### TypeScript global declaration
```typescript
// types/umami.d.ts
// No import/export — this is a global augmentation file
interface Window {
  umami?: {
    track: (eventName: string, eventData?: Record<string, unknown>) => void;
    identify: (sessionData: Record<string, unknown>) => void;
  };
}
```

### analytics.ts diff — Umami forwarding line
```typescript
// lib/analytics.ts — inside trackEvent(), after localStorage block
// Source: https://docs.umami.is/docs/track-events
  // Forward to Umami (no-op guard: script may not be loaded yet)
  (window as Window & { umami?: { track: (n: string, d?: Record<string, unknown>) => void } })
    .umami?.track(event, payload);
```
Alternative if `types/umami.d.ts` is in place (cleaner):
```typescript
  window.umami?.track(event, payload);
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| GA4 with gtag.js | Umami Cloud (cookieless) | 2023-2024 shift | No cookie banner needed; 50-70% better capture rate with developer audiences |
| next.config.js rewrites proxy | API route handler proxy | 2024 | More control over headers/body; required for correct `POST /api/send` forwarding |
| `strategy="lazyOnload"` | `strategy="afterInteractive"` | Best practice clarified ~2023 | Fires sooner; better event capture on fast interactions |

**Deprecated/outdated:**
- `next-umami` npm package: unnecessary wrapper; `next/script` + manual setup is simpler and avoids a dependency.
- Hosting `script.js` as a static file: brittle (breaks when Umami updates script); proxy approach is preferred.

---

## Open Questions

1. **Umami website ID and proxy URL env vars in Vercel**
   - What we know: Phase 17 requires `NEXT_PUBLIC_UMAMI_WEBSITE_ID` and `NEXT_PUBLIC_UMAMI_PROXY_URL` to be set
   - What's unclear: Whether the user has already created the Umami Cloud account and obtained the website ID (STATE.md flags this as a blocker)
   - Recommendation: Planner should include a Wave 0 step: "Verify `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set in `.env.local` and Vercel dashboard before implementing ANLY-01"

2. **Proxy route: `/api/send` vs full path forwarding**
   - What we know: Umami Cloud uses `POST /api/send` for event collection and `GET /api/collect` (script serves from `/script.js`)
   - What's unclear: Whether the proxy needs to forward only `/api/send` or all paths under `cloud.umami.is`
   - Recommendation: Forward all paths under `/api/umami/*` to `cloud.umami.is/*` — this is more future-proof and aligns with the official docs pattern

3. **Supabase migration apply method**
   - What we know: Migrations are in `supabase/migrations/` but there is no `supabase/config.toml` visible
   - What's unclear: Whether migrations are applied via `supabase db push`, `supabase migration up`, or directly via Supabase dashboard SQL editor
   - Recommendation: Planner should note "apply via Supabase dashboard SQL editor or `supabase db push`" — leave the specific command to the implementer

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.x |
| Config file | `vitest.config.ts` (exists) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ANLY-01 | UmamiScript renders Script tag when env var set; returns null when absent | unit | `pnpm test -- analytics` | ❌ Wave 0 |
| ANLY-02 | CSP header string contains `cloud.umami.is` in both `script-src` and `connect-src` | unit | `pnpm test -- csp` | ❌ Wave 0 |
| ANLY-03 | `trackEvent()` calls `window.umami.track` with correct name and payload | unit | `pnpm test -- analytics` | ❌ Wave 0 |
| ANLY-04 | `/api/umami` proxy route forwards GET/POST to upstream and returns response | unit (mock fetch) | `pnpm test -- umami` | ❌ Wave 0 |
| FDBK-02 (table) | `feedback` table exists with correct columns | manual / Supabase dashboard | n/a — SQL migration | ❌ Wave 0 (SQL file) |
| NEWS-02 (table) | `newsletter_subscribers` table exists with unique email constraint | manual / Supabase dashboard | n/a — SQL migration | ❌ Wave 0 (SQL file) |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm typecheck && pnpm lint && pnpm test`
- **Phase gate:** Full suite green + browser smoke test (DevTools: no CSP errors, Umami dashboard shows pageview) before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/analytics.test.ts` — covers ANLY-01, ANLY-03 (`trackEvent` + UmamiScript null-render)
- [ ] `tests/csp.test.ts` — covers ANLY-02 (parse CSP string from next.config.mjs, assert domains present)
- [ ] `tests/umami-proxy.test.ts` — covers ANLY-04 (mock `fetch`, assert upstream URL and response forwarding)
- [ ] `supabase/migrations/20260329_create_feedback.sql` — covers FDBK-02 table
- [ ] `supabase/migrations/20260329_create_newsletter_subscribers.sql` — covers NEWS-02 table

---

## Sources

### Primary (HIGH confidence)
- [docs.umami.is/docs/bypass-ad-blockers](https://docs.umami.is/docs/bypass-ad-blockers) — proxy setup, `data-host-url` attribute
- [docs.umami.is/docs/track-events](https://docs.umami.is/docs/track-events) — `umami.track()` API signature
- [nextjs.org/docs/14/app/building-your-application/configuring/content-security-policy](https://nextjs.org/docs/14/app/building-your-application/configuring/content-security-policy) — CSP headers without nonces, `next.config.js` pattern

### Secondary (MEDIUM confidence)
- [fabian-rosenthal.com/blog/integrate-umami-analytics-into-nextjs-app-router](https://fabian-rosenthal.com/blog/integrate-umami-analytics-into-nextjs-app-router) — `UmamiScript` component pattern, env var gating
- [supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security) — RLS policy patterns for anon insert

### Tertiary (LOW confidence — flagged)
- Medium: "Analytics vs Adblockers" (Aug 2025) — general proxy patterns; not Umami-specific

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against official Umami docs and Next.js 14 docs
- Architecture: HIGH — patterns derived from official sources and existing codebase conventions
- Pitfalls: MEDIUM — CSP and proxy pitfalls from official docs; migration pitfall from repo inspection
- Supabase SQL: HIGH — mirrors established migration patterns already in `supabase/migrations/`

**Research date:** 2026-03-29
**Valid until:** 2026-04-29 (Umami Cloud API is stable; Next.js 14 CSP approach is stable)

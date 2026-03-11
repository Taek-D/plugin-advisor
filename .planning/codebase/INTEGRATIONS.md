# External Integrations

**Analysis Date:** 2025-03-11

## APIs & External Services

**Anthropic (AI Analysis):**
- Claude API (Sonnet 4 model)
  - Purpose: AI-powered plugin recommendation analysis
  - SDK: @anthropic-ai/sdk 0.78.0
  - Auth: `ANTHROPIC_API_KEY` environment variable
  - Endpoint: `/app/api/analyze/route.ts`
  - Rate limit: 5 requests per 60 seconds (client IP-based)
  - Max input: 10,000 characters per request
  - Features: Text analysis with JSON response parsing

**GitHub API:**
- Purpose: Fetch README files from repositories
- SDK: Native `fetch` with GitHub API v2022-11-28
- Auth: `GITHUB_TOKEN` environment variable (optional, increases rate limits)
- Endpoint: `/app/api/github/route.ts` (POST)
- Request: Extracts owner/repo from GitHub URL, fetches README.md
- Timeout: 5 seconds per request
- Format: Accepts raw text response, returns in JSON

## Data Storage

**Databases:**
- Supabase PostgreSQL (primary backend)
  - Connection: `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
  - Client: @supabase/supabase-js 2.98.0
  - Admin client: `lib/supabase-admin.ts` (server-side only)
  - Auth mode: Service role key (server-only, bypasses RLS for admin operations)
  - Tables managed:
    - `plugin_suggestions` - User plugin recommendations/submissions
    - `admin_sessions` - Session tokens for admin panel
    - Likely: plugin metadata, plugin data cache

**File Storage:**
- Supabase Storage (implied, not explicitly configured in reviewed code)

**Caching:**
- In-memory session cache in `lib/admin-session-core.ts`
- Browser localStorage for user history and favorites (client-side)

## Authentication & Identity

**Auth Provider:**
- Custom password-based admin authentication
  - Implementation: `lib/admin-session.ts` and `lib/admin-session-core.ts`
  - Method: Password + JWT session tokens
  - Login endpoint: `app/api/admin/login/route.ts` (POST)
  - Session: HTTP-only cookie with `sameSite: strict`, secure in production
  - Cookie name: Dynamic via `getAdminCookieName()`
  - Max age: Configured via `getAdminSessionMaxAgeSeconds()`
  - Rate limiting: 5 attempts per 5 minutes per IP
  - Secret: `ADMIN_SESSION_SECRET` (HMAC-SHA256 for token signing)

**Supabase Auth (implied):**
- Anon key available: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public, client-side)
- Service role key: `SUPABASE_SERVICE_ROLE_KEY` (server-only, admin operations)

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry, LogRocket, or similar configuration)

**Logs:**
- Server logs via Next.js runtime
- Client-side: No explicit logging framework detected
- Rate limit cleanup in memory-based tracking

## CI/CD & Deployment

**Hosting:**
- Vercel (primary target per CLAUDE.md)
  - Config directory: `.vercel/` (present)
  - Environment variables managed via Vercel dashboard

**CI Pipeline:**
- Not detected (no GitHub Actions, GitLab CI, or similar configuration)

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key (public)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key (secret)
- `ADMIN_REVIEW_PASSWORD` - Admin login password (secret)
- `ADMIN_SESSION_SECRET` - JWT signing secret (secret)

**Optional env vars:**
- `ANTHROPIC_API_KEY` - Claude API key (enables AI analysis feature; if missing, AI endpoint returns 503)
- `GITHUB_TOKEN` - GitHub personal access token (optional, improves rate limits)
- `LEAD_WEBHOOK_URL` - External webhook for lead capture (optional)

**Secrets location:**
- `.env.local` (git-ignored, local development)
- Vercel dashboard (production)
- Environment variables in `.env.local.example` as template

## Webhooks & Callbacks

**Incoming:**
- `app/api/analyze/route.ts` - POST endpoint for AI plugin analysis
  - Request body: `{ text: string, candidatePluginIds?: string[] }`
  - Response: AnalysisResult with recommendations
  - Rate limited: 5 req/min per IP

- `app/api/github/route.ts` - POST endpoint for GitHub README fetching
  - Request body: `{ url: string }`
  - Response: `{ content: string }` or error
  - Timeout: 5 seconds

- `app/api/admin/login/route.ts` - POST endpoint for admin authentication
  - Request body: `{ password: string, next?: string }`
  - Response: Session cookie + redirect path
  - Rate limited: 5 attempts/5 minutes per IP

- `app/api/admin/logout/route.ts` - POST endpoint for admin session termination

- `app/api/admin/plugins/route.ts` - Admin plugin CRUD operations (requires auth)

- `app/api/admin/plugin-suggestions/route.ts` - Admin review of user suggestions

- `app/api/plugin-suggestions/route.ts` - POST endpoint for users to suggest plugins
  - Request body: PluginSuggestionPayload
  - Stores to Supabase `plugin_suggestions` table

- `app/api/versions/route.ts` - Plugin version checking (endpoint exists, implementation TBD)

- `app/api/reviews/route.ts` - Plugin reviews/ratings (endpoint exists, implementation TBD)

**Outgoing:**
- `LEAD_WEBHOOK_URL` - Optional: forwards lead capture data to external webhook
  - Purpose: Setup request forwarding to external CRM or mailing service
  - Implementation: `app/api/lead/route.ts` (currently returns 503 - "in preparation")

## Rate Limiting

**Strategy:** In-memory IP-based tracking with configurable windows
- Implementation: `lib/rate-limit.ts`
- Cleanup: Automatic on each request (removes expired entries)
- Windows:
  - `analyze`: 5 requests per 60 seconds
  - `admin-login`: 5 requests per 5 minutes
  - Default: Configurable per endpoint

**Client IP detection:**
- Uses request headers for client IP (handles proxies/reverse proxies)

## Data Flow Summary

```
User Input (text/file/GitHub URL)
  ↓
[Client: InputPanel/PluginAdvisorApp]
  ↓
Text → app/api/analyze/route.ts (AI analysis)
GitHub URL → app/api/github/route.ts (README fetch)
  ↓
[Server: Anthropic API] + [Supabase for plugin list]
  ↓
AnalysisResult (recommendations)
  ↓
[Client: Display results, allow selection]
  ↓
[Admin: Optional review via /admin routes]
  ↓
[Server: Supabase stores suggestions/history]
```

---

*Integration audit: 2025-03-11*

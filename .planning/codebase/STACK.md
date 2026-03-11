# Technology Stack

**Analysis Date:** 2025-03-11

## Languages

**Primary:**
- TypeScript 5.0 - Full codebase (components, pages, API routes, libraries)

**Secondary:**
- JavaScript (JSX/TSX) - React components and configuration files

## Runtime

**Environment:**
- Node.js 18+ (inferred from package.json and Next.js 14.2 requirement)

**Package Manager:**
- pnpm (configured in CLAUDE.md, mandatory for this project)
- Lockfile: `pnpm-lock.yaml` (present at 155KB)

## Frameworks

**Core:**
- Next.js 14.2.0 - App Router, full-stack React framework
  - App directory at `app/` with file-based routing
  - API routes at `app/api/`
  - Server components by default

**UI & Styling:**
- React 18.3.0 - Component library and state management
- Tailwind CSS 3.4.0 - Utility-first CSS framework
- shadcn/ui (component library built on Radix UI)
  - Components in `components/ui/` (badge, button, card, dialog, input, tabs, textarea)
- Lucide React 0.577.0 - Icon library

**Testing:**
- Vitest 4.0.18 - Unit test runner
  - Config implied from package.json scripts
  - Test files at `lib/__tests__/` (admin-session.test.ts, conflicts.test.ts, plugin-suggestions.test.ts, recommend.test.ts, setup.test.ts)

**Build/Dev:**
- PostCSS 8.4.0 - CSS transformation
- Autoprefixer 10.4.0 - CSS vendor prefixing
- ESLint 8.0.0 - Code linting
- TypeScript compiler (via `next typecheck`)

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.98.0 - Backend-as-a-service database and auth
  - Client created in `lib/supabase-admin.ts` with service role key
  - Used for plugin suggestions, admin sessions, plugin data storage
- @anthropic-ai/sdk 0.78.0 - Claude AI API for plugin recommendations
  - API route at `app/api/analyze/route.ts` (Claude Sonnet 4 model)
  - Rate-limited to 5 requests per 60 seconds

**UI Components:**
- @radix-ui/react-slot 1.2.4 - Base component composition primitive
- class-variance-authority 0.7.1 - CSS class composition for shadcn components
- clsx 2.1.1 - Classname utility
- tailwind-merge 3.5.0 - Merge Tailwind classes without conflicts
- tailwindcss-animate 1.0.7 - Tailwind CSS animation utilities

**Server-Only:**
- server-only 0.0.1 - Ensures code runs only on server (used in `lib/supabase-admin.ts`)

**Dev Dependencies:**
- @types/node 20.0.0 - Node.js type definitions
- @types/react 18.3.0 - React type definitions
- @types/react-dom 18.3.0 - React DOM type definitions
- eslint-config-next 14.2.0 - Next.js ESLint configuration

## Configuration

**Environment:**
- File: `.env.local.example` - Template for environment variables (must copy to `.env.local`)
- Required vars:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key (public, client-side)
  - `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key (server-only secret)
  - `ANTHROPIC_API_KEY` - Claude API key (server-only, optional for AI analysis)
  - `GITHUB_TOKEN` - GitHub API token (optional, for higher rate limits on README fetch)
  - `LEAD_WEBHOOK_URL` - External webhook for lead capture (optional)
  - `ADMIN_REVIEW_PASSWORD` - Password for admin panel login
  - `ADMIN_SESSION_SECRET` - Secret key for admin session JWT signing

**Build:**
- `next.config.mjs` - Next.js configuration with security headers (CSP, HSTS, X-Frame-Options)
- `tsconfig.json` - TypeScript compiler options with path alias `@/*` pointing to project root
- `postcss.config.mjs` - PostCSS with Tailwind and Autoprefixer
- `.eslintrc.json` - ESLint configuration
- `.gitignore` - Git exclusions (node_modules, .next, .env.local, etc.)

## Platform Requirements

**Development:**
- Node.js 18+ with pnpm
- Git for version control
- Environment variables in `.env.local`

**Production:**
- Vercel (primary deployment target per CLAUDE.md)
- Supabase instance (for database and plugin data)
- Anthropic API access (for AI-powered analysis feature)
- GitHub Token (optional, for better API rate limits)

## Package Scripts

```bash
pnpm dev              # Start dev server on port 3002
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm typecheck       # TypeScript type checking (no emit, incremental)
pnpm test            # Run Vitest
```

## Security Headers (next.config.mjs)

- `X-Frame-Options: DENY` - Prevent framing
- `X-Content-Type-Options: nosniff` - Prevent MIME type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer sharing
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` - Force HTTPS
- `Content-Security-Policy` - Strict CSP with:
  - `default-src 'self'` - Only same-origin by default
  - Allow inline styles and scripts for next.js/React
  - Allow external CDN (jsdelivr.net)
  - Allow Supabase and Anthropic API connections
  - Allow Google Fonts
- `Permissions-Policy` - Disable camera, microphone, geolocation

---

*Stack analysis: 2025-03-11*

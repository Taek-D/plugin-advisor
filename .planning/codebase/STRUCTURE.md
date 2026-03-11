# Codebase Structure

**Analysis Date:** 2026-03-11

## Directory Layout

```
plugin-advisor/
├── app/                          # Next.js App Router pages and API routes
│   ├── layout.tsx               # Root layout with I18nProvider, Nav, fonts
│   ├── page.tsx                 # Landing page (/)
│   ├── globals.css              # Global styles
│   ├── favicon.ico, icon.png, apple-icon.png
│   ├── advisor/
│   │   └── page.tsx             # Main advisor interface
│   ├── admin/
│   │   ├── login/page.tsx       # Admin login form
│   │   ├── plugins/page.tsx     # Plugin CRUD management
│   │   └── suggestions/page.tsx # Review user plugin suggestions
│   ├── guides/
│   │   ├── page.tsx             # Starter guides listing
│   │   └── [slug]/
│   │       ├── page.tsx         # Guide detail page
│   │       └── GuideDetailClient.tsx # Client component for guide
│   ├── plugins/
│   │   └── [id]/page.tsx        # Individual plugin detail page
│   ├── services/
│   │   └── page.tsx             # Setup support/services page
│   └── api/
│       ├── analyze/route.ts     # AI analysis endpoint
│       ├── github/route.ts      # GitHub README fetch endpoint
│       ├── lead/route.ts        # Lead capture form submission
│       ├── plugin-suggestions/route.ts # Submit plugin suggestion
│       ├── versions/route.ts    # Fetch plugin versions from GitHub
│       ├── admin/
│       │   ├── login/route.ts   # Admin login API
│       │   ├── logout/route.ts  # Admin logout API
│       │   ├── plugins/route.ts # Plugin list/create
│       │   │   └── [id]/route.ts # Plugin update/delete
│       │   └── plugin-suggestions/
│       │       ├── route.ts     # List suggestions
│       │       └── [id]/route.ts # Update suggestion status
│       └── reviews/              # (placeholder for future)
│
├── components/                    # React components (client & server)
│   ├── PluginAdvisorApp.tsx     # Main app component orchestrating flow
│   ├── InputPanel.tsx           # Text/file/GitHub input interface
│   ├── PluginCard.tsx           # Individual plugin recommendation card
│   ├── PluginModal.tsx          # Plugin detail modal
│   ├── PluginDetail.tsx         # Plugin detail info display
│   ├── PluginGrid.tsx           # Grid of plugins
│   ├── PluginGridCard.tsx       # Card variant for grid
│   ├── PluginSearch.tsx         # Plugin search/filter
│   ├── PresetPacks.tsx          # Preset pack selection interface
│   ├── OnboardingFlow.tsx       # Guided onboarding flow
│   ├── ConflictWarning.tsx      # Conflict alert display
│   ├── InstallScript.tsx        # Install command generation & copy
│   ├── HistoryPanel.tsx         # Past analysis history
│   ├── FavoritesPanel.tsx       # Saved favorite combinations
│   ├── NotRecommendedPanel.tsx  # Intentionally excluded plugins
│   ├── SetupReadiness.tsx       # Preflight checks and warnings
│   ├── HighlightedText.tsx      # Keyword highlighting display
│   ├── RelatedPlugins.tsx       # Related plugins suggestions
│   ├── PluginSuggestionCallout.tsx # Suggest new plugin prompt
│   ├── LeadCaptureCard.tsx      # Lead capture form
│   ├── Nav.tsx                  # Navigation bar
│   ├── admin/
│   │   ├── AdminLoginForm.tsx   # Login form component
│   │   ├── AdminLogoutButton.tsx # Logout button
│   │   ├── AdminPluginManager.tsx # Plugin CRUD interface
│   │   ├── AdminSuggestionReviewList.tsx # List suggestions
│   │   └── AdminSuggestionReviewCard.tsx # Individual suggestion review
│   └── ui/                      # shadcn/ui primitives (generated)
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── tabs.tsx
│       └── textarea.tsx
│
├── hooks/                        # React hooks
│   └── useAnalysis.ts           # Main analysis state and logic hook
│
├── lib/                         # Utility libraries and core logic
│   ├── plugins.ts              # Plugin database (50+ plugins)
│   ├── types.ts                # TypeScript type definitions
│   ├── recommend.ts            # Keyword-matching recommendation engine
│   ├── conflicts.ts            # Conflict and redundancy rules
│   ├── presets.ts              # Preset pack definitions
│   ├── all-plugins.ts          # Fetch all plugins (includes Supabase)
│   ├── plugin-store.ts         # Plugin operations
│   ├── plugin-suggestions.ts   # User suggestion utilities
│   ├── plugin-suggestions-store.ts # Suggestion database ops
│   ├── plugin-reasons.ts       # Predefined recommendation reasons
│   ├── setup.ts                # Preflight checks and warnings builder
│   ├── admin-session.ts        # Admin session (client-side)
│   ├── admin-session-core.ts   # Admin auth logic (password check)
│   ├── history.ts              # Analysis history utilities
│   ├── favorites.ts            # Favorite combinations utilities
│   ├── versions.ts             # GitHub release version fetcher
│   ├── analytics.ts            # Event tracking
│   ├── utils.ts                # Utility functions (classname helpers)
│   ├── rate-limit.ts           # Request rate limiting
│   ├── sync.ts                 # Data sync utilities
│   ├── supabase-admin.ts       # Supabase client (admin)
│   ├── first-run-tips.ts       # Onboarding tips
│   ├── guides.ts               # Starter guides data
│   ├── i18n/                   # Internationalization
│   │   ├── index.tsx           # I18nContext and useI18n hook
│   │   ├── types.ts            # i18n type definitions
│   │   ├── ko.ts               # Korean strings
│   │   ├── en.ts               # English strings
│   │   ├── plugins-en.ts       # English plugin descriptions
│   │   └── (implicit plugins-ko in plugins.ts)
│   └── __tests__/              # Unit tests
│       ├── admin-session.test.ts
│       ├── conflicts.test.ts
│       ├── plugin-suggestions.test.ts
│       ├── recommend.test.ts
│       └── setup.test.ts
│
├── supabase/                    # Supabase configuration
│   └── (migrations and schema)
│
├── docs/                        # Documentation
│   ├── PRD.md
│   └── WIREFRAME.md
│
├── prototype/                   # Legacy prototype (reference)
│   └── plugin-recommender.jsx
│
├── public/                      # Static assets
│   └── (favicon, icons, screenshots)
│
├── .planning/                   # GSD planning documents
│   └── codebase/
│       ├── ARCHITECTURE.md     # This document
│       └── STRUCTURE.md        # Directory structure guide
│
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
├── vitest.config.ts
├── .eslintrc.json
├── CLAUDE.md                   # Project instructions
├── AGENTS.md                   # Agent documentation
├── README.md
├── SECURITY_AUDIT.md
└── START.md
```

## Directory Purposes

**app/**
- Purpose: Next.js App Router structure with all routes and API handlers
- Contains: Page components (SSR/hybrid), API endpoints (server-only), layouts
- Key files: `layout.tsx` (global setup), `page.tsx` (landing)

**components/**
- Purpose: Reusable React components for UI rendering and interaction
- Contains: Feature components (InputPanel, PluginCard, etc.), admin forms, shadcn primitives
- Key files: `PluginAdvisorApp.tsx` (main orchestrator)

**hooks/**
- Purpose: Custom React hooks for state management and logic
- Contains: `useAnalysis` hook managing entire analysis workflow
- Key files: `useAnalysis.ts` (central state)

**lib/**
- Purpose: Core business logic, data definitions, and utilities
- Contains: Plugin database, recommendation algorithm, type definitions, Supabase client
- Key files: `plugins.ts` (50+ plugins), `recommend.ts` (keyword matching), `types.ts` (types)

**lib/i18n/**
- Purpose: Internationalization strings and context
- Contains: Korean/English string definitions, I18nContext provider
- Key files: `ko.ts`, `en.ts` (locale strings)

**lib/__tests__/**
- Purpose: Unit tests for core logic
- Contains: Tests for recommend, conflicts, admin-session, setup
- Key files: `recommend.test.ts` (recommendation logic tests)

**supabase/**
- Purpose: Database migrations and schema definitions
- Contains: SQL migrations for admin, plugins, suggestions tables

**docs/**
- Purpose: Project documentation
- Contains: PRD.md, WIREFRAME.md

**prototype/**
- Purpose: Reference implementation (legacy)
- Contains: Original React single-component prototype

## Key File Locations

**Entry Points:**
- `app/page.tsx`: Landing page (public entry point)
- `app/advisor/page.tsx`: Advisor interface (main product)
- `app/admin/login/page.tsx`: Admin authentication
- `app/api/analyze/route.ts`: AI analysis endpoint

**Configuration:**
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript compiler options
- `next.config.mjs`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS theme
- `CLAUDE.md`: Project development guidelines

**Core Logic:**
- `lib/plugins.ts`: Plugin database (50+ plugins with metadata)
- `lib/recommend.ts`: Keyword matching and recommendation scoring
- `hooks/useAnalysis.ts`: Client-side analysis state machine
- `lib/conflicts.ts`: Plugin conflict and redundancy rules

**Testing:**
- `lib/__tests__/recommend.test.ts`: Tests for keyword matching algorithm
- `lib/__tests__/conflicts.test.ts`: Tests for conflict detection
- `vitest.config.ts`: Vitest configuration

**Admin/Database:**
- `lib/admin-session-core.ts`: Admin password authentication
- `lib/supabase-admin.ts`: Supabase client initialization
- `app/api/admin/*`: Admin API routes (CRUD)

## Naming Conventions

**Files:**
- Components: PascalCase.tsx (e.g., `PluginAdvisorApp.tsx`)
- Utilities: kebab-case.ts (e.g., `admin-session.ts`)
- API routes: route.ts in [slug] directories
- Tests: [name].test.ts (e.g., `recommend.test.ts`)

**Directories:**
- Feature directories: lowercase (e.g., `admin/`, `api/`)
- Dynamic routes: [brackets] (e.g., `[slug]/`, `[id]/`)
- Nested api: flat structure under `app/api/` (e.g., `app/api/admin/plugins/[id]/route.ts`)

**Types:**
- Type definitions: types.ts (single file)
- Types follow pattern: PluginCategory, AnalysisResult, Recommendation
- Use `type` over `interface` (per CLAUDE.md)
- String literal unions instead of `enum`

**Variables:**
- camelCase for functions and variables
- UPPER_CASE for constants (e.g., PLUGINS, CONFLICT_PAIRS)
- Leading underscore for unused parameters (e.g., `_msg`)

## Where to Add New Code

**New Feature (e.g., new analysis mode):**
- Primary code: `lib/` (logic), `components/` (UI)
- Entry point: Add route in `app/` if new page needed
- Tests: `lib/__tests__/` with matching name
- Types: Update `lib/types.ts`
- Example: New mode → add to `AnalysisMode` union, implement in `useAnalysis`, add UI component

**New Component/Module:**
- Implementation: `components/` (UI) or `lib/` (logic)
- Client components: Add `"use client"` at top
- Server components: Default (no directive needed)
- Export from parent with named export (not default)
- Tests: Create adjacent `.test.ts` file if logic-heavy

**Utilities:**
- Shared helpers: `lib/utils.ts` (general) or feature-specific file (e.g., `lib/setup.ts`)
- Follow existing pattern: pure functions, no side effects
- Document with JSDoc comments

**New Plugin:**
- Add entry to `lib/plugins.ts` in CORE_PLUGINS object
- Include all fields from Plugin type (or use defaults)
- Add keywords matching use case
- Add to tests if affects recommendation logic
- Update `lib/i18n/plugins-en.ts` if adding English description

**Admin Feature:**
- Page: `app/admin/[feature]/page.tsx`
- API: `app/api/admin/[feature]/route.ts`
- Component: `components/admin/AdminFeature.tsx`
- Protect API with session check (see `app/api/admin/login/route.ts`)

## Special Directories

**app/api:**
- Purpose: All server-side API routes
- Generated: No (checked into git)
- Committed: Yes
- Pattern: Each endpoint is folder with `route.ts` inside
- Example: `app/api/admin/plugins/[id]/route.ts` handles `PATCH /api/admin/plugins/:id`

**lib/__tests__:**
- Purpose: Unit tests (Vitest)
- Generated: No
- Committed: Yes
- Run with: `pnpm test`
- Coverage target: Core logic (recommend, conflicts, setup)

**.next/:**
- Purpose: Build output (Next.js)
- Generated: Yes (by `pnpm build`)
- Committed: No (in .gitignore)

**node_modules/:**
- Purpose: Package dependencies
- Generated: Yes (by `pnpm install`)
- Committed: No (in .gitignore)

**supabase/**
- Purpose: Database migrations
- Generated: No
- Committed: Yes
- Schema: Managed via Supabase migrations

---

*Structure analysis: 2026-03-11*

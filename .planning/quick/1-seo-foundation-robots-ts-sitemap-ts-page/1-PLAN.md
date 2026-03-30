---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - app/robots.ts
  - app/sitemap.ts
  - app/page.tsx
  - app/advisor/page.tsx
  - app/guides/page.tsx
  - app/services/page.tsx
  - marketing_plan.md
autonomous: true
requirements: [seo-robots, seo-sitemap, seo-metadata]

must_haves:
  truths:
    - "robots.txt blocks /admin/* and /api/admin/* from crawlers"
    - "robots.txt references sitemap at https://pluginadvisor.cc/sitemap.xml"
    - "sitemap.xml lists all static pages plus dynamic /plugins/[id] and /guides/[slug] URLs"
    - "Pages /, /advisor, /guides, /services each have unique title and description metadata"
  artifacts:
    - path: "app/robots.ts"
      provides: "Dynamic robots.txt generation"
      exports: ["default"]
    - path: "app/sitemap.ts"
      provides: "Dynamic sitemap.xml with static + dynamic URLs"
      exports: ["default"]
  key_links:
    - from: "app/sitemap.ts"
      to: "lib/plugins.ts"
      via: "import PLUGINS for dynamic plugin page URLs"
      pattern: "import.*PLUGINS.*from.*lib/plugins"
    - from: "app/sitemap.ts"
      to: "lib/guides.ts"
      via: "import STARTER_GUIDES for dynamic guide page URLs"
      pattern: "import.*STARTER_GUIDES.*from.*lib/guides"
---

<objective>
Create SEO foundation files (robots.ts, sitemap.ts) and add missing page metadata for four pages.

Purpose: Enable search engine discovery and proper indexing of all public pages while blocking admin routes. Ensure every public page has unique, descriptive metadata for search result snippets.

Output: robots.ts, sitemap.ts, updated metadata on 4 pages, marketing_plan.md checkbox updated.
</objective>

<execution_context>
@C:/Users/PC/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/PC/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@CLAUDE.md
@app/layout.tsx (metadataBase already set to https://pluginadvisor.cc)
@app/plugins/page.tsx (metadata pattern reference: title + description)
@lib/plugins.ts (PLUGINS: Record<string, Plugin> — use Object.keys(PLUGINS) for IDs)
@lib/guides.ts (STARTER_GUIDES array — 6 guides, each has .slug field)

<interfaces>
From lib/plugins.ts:
```typescript
export const PLUGINS: Record<string, Plugin> = Object.fromEntries(...)
// 51 plugins, keyed by id string (e.g., "omc", "superpowers", "gsd", ...)
// Use: Object.keys(PLUGINS) to get all plugin IDs for sitemap
```

From lib/guides.ts:
```typescript
export type StarterGuide = { slug: string; title: string; ... };
export const STARTER_GUIDES: StarterGuide[] = [
  // 6 guides with slugs:
  // "claude-code-first-setup-checklist"
  // "windows-mcp-npx-setup-fixes"
  // "webapp-starter-stack"
  // "backend-starter-stack"
  // "claude-code-cost-and-ops-mistakes"
  // "starter-security-mistakes"
];
```

From app/layout.tsx:
```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://pluginadvisor.cc"),
  // ... title, description, openGraph, twitter already set as defaults
};
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create robots.ts and sitemap.ts</name>
  <files>app/robots.ts, app/sitemap.ts</files>
  <action>
**app/robots.ts** — Create using Next.js Metadata API (`import type { MetadataRoute } from "next"`):
- Export default function returning `MetadataRoute.Robots` object
- `rules`: single rule with `userAgent: "*"`, `allow: "/"`, `disallow: ["/admin/", "/api/admin/"]`
- `sitemap`: `"https://pluginadvisor.cc/sitemap.xml"`

**app/sitemap.ts** — Create using Next.js Metadata API (`import type { MetadataRoute } from "next"`):
- Import `PLUGINS` from `@/lib/plugins` and `STARTER_GUIDES` from `@/lib/guides`
- Export default function returning `MetadataRoute.Sitemap` (array of URL objects)
- Static pages (each with `lastModified: new Date()`, `changeFrequency` and `priority`):
  - `/` — changeFrequency: "weekly", priority: 1.0
  - `/advisor` — changeFrequency: "weekly", priority: 0.9
  - `/plugins` — changeFrequency: "weekly", priority: 0.8
  - `/guides` — changeFrequency: "monthly", priority: 0.8
  - `/services` — changeFrequency: "monthly", priority: 0.6
  - `/optimizer` — changeFrequency: "monthly", priority: 0.7
- Dynamic plugin pages: `Object.keys(PLUGINS).map(id => ({ url: \`https://pluginadvisor.cc/plugins/${id}\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 }))`
- Dynamic guide pages: `STARTER_GUIDES.map(g => ({ url: \`https://pluginadvisor.cc/guides/${g.slug}\`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 }))`
- Return spread of all arrays: `[...staticPages, ...pluginPages, ...guidePages]`

Both files are server-only (no "use client"). Keep each under 60 lines.
  </action>
  <verify>
    <automated>cd "E:/프로젝트/plugin-advisor" && pnpm typecheck</automated>
  </verify>
  <done>robots.ts exports valid MetadataRoute.Robots; sitemap.ts exports valid MetadataRoute.Sitemap including all 6 static pages + 51 plugin URLs + 6 guide URLs (63 total URLs). Both pass typecheck.</done>
</task>

<task type="auto">
  <name>Task 2: Add missing page metadata and update marketing_plan.md</name>
  <files>app/page.tsx, app/advisor/page.tsx, app/guides/page.tsx, app/services/page.tsx, marketing_plan.md</files>
  <action>
**Problem:** app/page.tsx, app/advisor/page.tsx, app/guides/page.tsx, app/services/page.tsx are "use client" or lack metadata exports. In Next.js App Router, `export const metadata` only works in server components. For client component pages, create a **separate layout.tsx** or convert approach.

**Solution approach — use per-route layout.tsx files** for the 3 client pages (page.tsx already has "use client", guides/page.tsx has "use client", services/page.tsx has "use client"). For advisor/page.tsx (server component, no "use client"), add metadata export directly.

1. **app/advisor/page.tsx** — This is already a server component. Add at top:
   ```typescript
   import type { Metadata } from "next";
   export const metadata: Metadata = {
     title: "Plugin Advisor | Plugin Advisor",
     description: "프로젝트 설명을 입력하면 Claude Code에 맞는 플러그인 조합을 추천받을 수 있습니다.",
     openGraph: {
       title: "Plugin Advisor | Plugin Advisor",
       description: "프로젝트 설명을 입력하면 Claude Code에 맞는 플러그인 조합을 추천받을 수 있습니다.",
     },
   };
   ```

2. **app/layout.tsx already provides default metadata** for `/` route. But the home page title/description in layout.tsx is generic. Since app/page.tsx is "use client", we cannot add metadata export there. However, layout.tsx metadata already serves as the home page metadata and the title "Plugin Advisor -- Claude Code" + description are appropriate for home. **No change needed for app/page.tsx** — the root layout metadata IS the home page metadata.

3. **app/guides/layout.tsx** — Create NEW file (server component):
   ```typescript
   import type { Metadata } from "next";
   export const metadata: Metadata = {
     title: "Starter Guides | Plugin Advisor",
     description: "Claude Code 초기 세팅 실패를 줄이기 위한 실전 가이드 모음. 첫 세팅 체크리스트부터 보안 실수까지.",
     openGraph: {
       title: "Starter Guides | Plugin Advisor",
       description: "Claude Code 초기 세팅 실패를 줄이기 위한 실전 가이드 모음.",
     },
   };
   export default function GuidesLayout({ children }: { children: React.ReactNode }) {
     return <>{children}</>;
   }
   ```

4. **app/services/layout.tsx** — Create NEW file (server component):
   ```typescript
   import type { Metadata } from "next";
   export const metadata: Metadata = {
     title: "Setup Services | Plugin Advisor",
     description: "Claude Code 세팅 점검, 프로젝트 맞춤 추천, 팀 온보딩까지. 직접 도와드립니다.",
     openGraph: {
       title: "Setup Services | Plugin Advisor",
       description: "Claude Code 세팅 점검, 프로젝트 맞춤 추천, 팀 온보딩까지.",
     },
   };
   export default function ServicesLayout({ children }: { children: React.ReactNode }) {
     return <>{children}</>;
   }
   ```

5. **marketing_plan.md** — Update Phase 3 seo-audit checkbox from `- [ ]` to `- [x]`:
   Change: `- [ ] /marketing-skills:seo-audit` to `- [x] /marketing-skills:seo-audit — robots.ts, sitemap.ts, page metadata 추가 완료`
   Also update the Progress Summary table: Phase 3 completed count from 0 to 1, and overall total from 11 to 12 and percentage to ~35%.

Note: files_modified for this task also includes app/guides/layout.tsx and app/services/layout.tsx (new files).
  </action>
  <verify>
    <automated>cd "E:/프로젝트/plugin-advisor" && pnpm build 2>&1 | tail -20</automated>
  </verify>
  <done>All 4 pages have unique metadata (title + description). /advisor has direct metadata export, /guides and /services use layout.tsx wrappers, / inherits from root layout. Build succeeds with no errors. marketing_plan.md seo-audit checkbox is checked.</done>
</task>

</tasks>

<verification>
1. `pnpm typecheck` passes with no errors
2. `pnpm build` completes successfully
3. After `pnpm dev`, verify:
   - `curl http://localhost:3000/robots.txt` shows Disallow: /admin/ and /api/admin/, and Sitemap reference
   - `curl http://localhost:3000/sitemap.xml` contains 63 URLs (6 static + 51 plugins + 6 guides)
   - View page source at `/`, `/advisor`, `/guides`, `/services` — each has unique `<title>` and `<meta name="description">`
</verification>

<success_criteria>
- robots.txt properly blocks admin routes and references sitemap
- sitemap.xml lists all public pages with correct URLs and priorities
- Every public page (/, /advisor, /plugins, /guides, /services, /optimizer) has distinct metadata
- Build passes, no type errors
- marketing_plan.md Phase 3 seo-audit marked complete
</success_criteria>

<output>
After completion, create `.planning/quick/1-seo-foundation-robots-ts-sitemap-ts-page/1-SUMMARY.md`
</output>

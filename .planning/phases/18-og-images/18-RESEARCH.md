# Phase 18: OG Images — Research

**Researched:** 2026-03-30
**Status:** Complete

## Executive Summary

Next.js 14 App Router provides built-in OG image generation via `opengraph-image.tsx` convention files using `next/og` ImageResponse API. No additional packages needed. The implementation splits into static OG images (main pages) and dynamic OG images (plugin/guide detail pages). Edge Runtime is used automatically for image generation routes.

## 1. Next.js OG Image Generation (next/og)

### Convention File Approach
- Place `opengraph-image.tsx` in a route directory → Next.js auto-generates `<meta property="og:image">` tag
- Place `twitter-image.tsx` alongside → generates `<meta name="twitter:image">` tag
- **OR** use a single `opengraph-image.tsx` and set `twitter` metadata in `generateMetadata` to point to the same OG image URL

### ImageResponse API
```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Plugin Advisor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ display: "flex", /* ... */ }}>
      {/* JSX with inline styles only — no Tailwind, no CSS classes */}
    </div>,
    { ...size }
  );
}
```

### Key Constraints
- **Inline styles only**: No Tailwind, no CSS-in-JS — only `style={{ }}` with subset of CSS (Flexbox layout)
- **JSX subset**: `div`, `span`, `p`, `img` supported; no `className`
- **Edge Runtime**: Automatic for opengraph-image convention files
- **Image format**: PNG default (recommended for text-heavy OG images)
- **Size**: 1200x630 is the standard for `summary_large_image` Twitter cards and most social platforms

### Font Loading in Edge Runtime
```tsx
export default async function Image() {
  const fontData = await fetch(
    new URL("https://fonts.gstatic.com/s/spaceGroteskgrotesk/v16/...woff2")
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div style={{ fontFamily: "Space Grotesk" }}>...</div>,
    {
      ...size,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
```

**Font loading strategy for this project:**
- Space Grotesk (Latin): Fetch from Google Fonts CDN via direct .woff URL
- Korean text (guide titles): System font fallback — Korean OG fonts are too large for Edge Runtime (4MB+ subset). Use `sans-serif` fallback which renders system Korean fonts acceptably
- Alternative: Keep guide OG text in English only (guide.summary is Korean, but can use a short English tagline)

## 2. Static OG Images (Convention Files)

For pages with fixed content, place `opengraph-image.tsx` directly in the route:

```
app/
  opengraph-image.tsx          → default site OG (/)
  twitter-image.tsx            → twitter card image (/)
  advisor/
    opengraph-image.tsx        → /advisor OG
  plugins/
    opengraph-image.tsx        → /plugins catalog OG
  guides/
    opengraph-image.tsx        → /guides listing OG
```

Each renders static text (branding, tagline) with consistent dark theme.

**Twitter card**: Set `twitter.card = "summary_large_image"` in root metadata and per-page metadata. The `twitter-image.tsx` convention or `twitter.images` in metadata handles the image.

## 3. Dynamic OG Images (Route Parameters)

For `/plugins/[id]` and `/guides/[slug]`, the `opengraph-image.tsx` receives route params:

```tsx
// app/plugins/[id]/opengraph-image.tsx
export default async function Image({ params }: { params: { id: string } }) {
  const plugin = PLUGINS[params.id];
  // Render plugin-specific OG with plugin.name, plugin.tag, plugin.color, etc.
}

export function generateStaticParams() {
  return Object.keys(PLUGINS).map((id) => ({ id }));
}
```

### generateStaticParams Integration
- Both `app/plugins/[id]/page.tsx` and `app/guides/[slug]/page.tsx` already have `generateStaticParams`
- The `opengraph-image.tsx` files need their OWN `generateStaticParams` export — they are separate route handlers
- At build time, Next.js pre-renders all OG images as static files

## 4. Existing Code Integration Points

### Plugin Data Access
- `PLUGINS` from `@/lib/plugins` — object keyed by ID
- Relevant fields: `name`, `tag`, `color` (hex string), `category`, `type` (ItemType: "mcp" | "plugin")
- `color` field is available on all plugins for accent bar customization

### Guide Data Access
- `STARTER_GUIDES` from `@/lib/guides` — array of guide objects
- Relevant fields: `title` (Korean), `summary` (Korean), `slug`
- No individual `color` field — use fixed brand accent

### Root Layout Metadata
- Currently has `title` and `description` only
- Need to add `openGraph` and `twitter` fields to root `metadata` export
- Twitter card type: `summary_large_image` for all pages (1200x630 images)

### Per-page generateMetadata
- `app/plugins/[id]/page.tsx` line 14: `generateMetadata` returns title + description
- `app/guides/[slug]/page.tsx` line 14: `generateMetadata` returns title + description
- These will auto-pick up the `opengraph-image.tsx` convention — no manual `openGraph.images` needed in metadata when using convention files

## 5. Visual Design Specifications

Based on CONTEXT.md decisions:

### Common Elements
- **Background**: Dark (e.g., `#0f172a` or `#1a1a2e` — aligned with site dark theme)
- **Accent bar**: Top/bottom colored strip for visual distinction
- **Footer**: `pluginadvisor.cc` URL in muted text
- **Font**: Space Grotesk Bold for headings
- **Tone**: Minimal, text-centric, no icons/emoji
- **Dimensions**: 1200x630px PNG

### Default/Static OG
- Site name: "Plugin Advisor"
- Tagline: "Claude Code Starter Setup Guide" or similar
- Brand accent color for bars

### Plugin Dynamic OG
- Plugin name (large)
- Plugin tag (subtitle)
- Type badge: "MCP Server" or "Plugin"
- Category badge
- Accent bar color: `plugin.color` (per-plugin unique)

### Guide Dynamic OG
- Guide title (large)
- Guide summary (truncated, smaller text)
- Fixed brand accent color
- Note: Korean text will use system font fallback

## 6. Implementation Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Korean font rendering in Edge Runtime | Guide OG text may use system fallback font | Accept system font for Korean; Space Grotesk for English text. Alternatively, keep a short English subtitle |
| Font fetch latency on cold start | First OG image request may be slow | `generateStaticParams` pre-renders at build time — no cold start for known routes |
| Large number of static OG images at build | 33+ plugins + guides = ~40 images at build time | Acceptable — OG images are small, build time increase is minimal |
| Color contrast with dark background | Some plugin colors may not be visible | Use color only for accent bars, not text — bars are thick enough to be visible |

## 7. File Structure Plan

```
app/
  opengraph-image.tsx              # Default brand OG (/)
  twitter-image.tsx                # Twitter card (can share same design)
  advisor/
    opengraph-image.tsx            # /advisor page OG
  plugins/
    opengraph-image.tsx            # /plugins catalog OG
    [id]/
      opengraph-image.tsx          # Dynamic plugin OG
  guides/
    opengraph-image.tsx            # /guides listing OG
    [slug]/
      opengraph-image.tsx          # Dynamic guide OG
```

**Shared utilities** (to avoid duplication):
- `lib/og-utils.ts` — shared styles, colors, font loading helper
- Keep under 200 lines per CLAUDE.md convention

## 8. Testing Strategy

- **Local**: `next dev` → visit `/opengraph-image` path directly in browser to preview
- **Build verification**: `pnpm build` should generate all static OG images without errors
- **Social debuggers**: Facebook Sharing Debugger, Twitter Card Validator, LinkedIn Post Inspector
- **Meta tag verification**: Check `<meta property="og:image">` in page source

## Validation Architecture

### Automated Checks
1. **Build success**: All `opengraph-image.tsx` files compile and generate images at build time
2. **Meta tag presence**: Each page HTML includes `<meta property="og:image">` with valid URL
3. **Image response**: GET request to `/opengraph-image` route returns 200 with `content-type: image/png`
4. **Static params coverage**: Dynamic routes generate OG for all known plugins and guides

### Manual Verification
1. **Visual inspection**: Each OG image renders correct text, colors, and layout
2. **Social preview**: Share URLs on Twitter/Facebook/LinkedIn to verify card display
3. **Dark theme consistency**: OG images visually match site dark theme aesthetic

### Requirement Tracing
- **OGIM-01** → `app/opengraph-image.tsx` (default) + root metadata `openGraph` + `twitter` fields
- **OGIM-02** → `app/plugins/[id]/opengraph-image.tsx` with `generateStaticParams`
- **OGIM-03** → `app/guides/[slug]/opengraph-image.tsx` with `generateStaticParams`

---

## RESEARCH COMPLETE

*Phase: 18-og-images*
*Researched: 2026-03-30*

# Coding Conventions

**Analysis Date:** 2026-03-11

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `PluginCard.tsx`, `InputPanel.tsx`)
- Utilities/libraries: camelCase (e.g., `recommend.ts`, `conflicts.ts`, `analytics.ts`)
- Pages/routes: lowercase with hyphens or PascalCase (e.g., `page.tsx`, `layout.tsx`)
- Test files: `.test.ts` suffix (e.g., `recommend.test.ts`, `conflicts.test.ts`)

**Functions:**
- camelCase for all functions (e.g., `getConflicts()`, `handleAnalyze()`, `scorePlugin()`)
- Prefix conventions: `handle*` for event handlers, `get*` for data retrieval, `set*` for state updates
- Examples: `handleAnalyze()`, `getKeywordMatches()`, `setDetailPlugin()`

**Variables:**
- camelCase for all variables (e.g., `selectedIds`, `analysisMode`, `ghUrl`)
- Abbreviated variables acceptable for short scope (e.g., `sel` for selection object, `res` for result)
- Boolean prefixes: `is*`, `has*`, `can*`, `should*` (e.g., `inConflict`, `aiAvailable`, `canGo`)

**Types:**
- PascalCase for type names (e.g., `Plugin`, `AnalysisResult`, `ConflictWarning`)
- Use `type` keyword (not `interface`) for all types: `export type Plugin = { ... }`
- Union type patterns: `"keyword" | "ai"` (string literals over enums)
- Example from codebase: `export type AnalysisMode = "keyword" | "ai"`

## Code Style

**Formatting:**
- ESLint config extends `next/core-web-vitals`
- No Prettier configuration file (uses ESLint defaults)
- 2-space indentation (standard for Next.js)
- Semicolons required (ESLint standard)

**Linting:**
- Tool: ESLint (config: `extends: "next/core-web-vitals"`)
- Configuration file: `.eslintrc.json`

## Import Organization

**Order:**
1. React/Next.js imports: `import { useState } from "react"`, `import Link from "next/link"`
2. Third-party packages: `import { Button } from "@/components/ui/button"`
3. Local library/type imports: `import { PLUGINS } from "@/lib/plugins"`, `import type { Plugin } from "@/lib/types"`
4. Local component imports: `import PluginCard from "./PluginCard"`

**Path Aliases:**
- `@/*` maps to project root: Use `@/lib/`, `@/components/`, `@/hooks/`
- No relative paths like `../` (always use `@/` alias)

**Pattern example from `components/PluginAdvisorApp.tsx`:**
```typescript
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, Hand, Compass } from "lucide-react";
import { PLUGINS } from "@/lib/plugins";
import { getConflicts } from "@/lib/conflicts";
import { useAnalysis } from "@/hooks/useAnalysis";
import type { VersionInfo, Plugin } from "@/lib/types";
```

## Error Handling

**Patterns:**
- Try-catch with instanceof Error check: `catch (error) { const message = error instanceof Error ? error.message : "Unknown error" }`
- Async/await over `.then()` chains
- Error state management in React: `const [error, setError] = useState<string | null>(null)`
- API responses checked: `if (!response.ok) throw new Error(data.error)`
- Graceful fallbacks on catch: `effectiveMode = "keyword"` when AI analysis fails

**Example from `components/InputPanel.tsx`:**
```typescript
try {
  const response = await fetch("/api/github", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: ghUrl }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  content = data.content;
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  setErr(message);
  setMode("text");
} finally {
  setLoading(false);
}
```

## Logging

**Framework:** Console only (debug-level only, not in production paths)

**Patterns:**
- Single instance: `console.debug("[analytics]", event, payload)` in `lib/analytics.ts`
- Debug conditional: Check for dev environment before logging
- No `console.log()` allowed in production code (lint/commit check needed)

## Comments

**When to Comment:**
- Not required for obvious code
- Required for complex algorithm logic (see `lib/recommend.ts` scoring functions)
- Required for non-obvious intent (e.g., "score adjustment for beginner safety")

**JSDoc/TSDoc:**
- Not enforced in codebase
- Type annotations preferred over JSDoc

## Function Design

**Size:**
- Limit to ~100 lines per component file (target stated in CLAUDE.md)
- Helper functions extracted to `lib/` utilities for reuse

**Parameters:**
- Destructured objects for component props: `function PluginCard({ plugin, recommendation, selected }: Props)`
- Explicit type annotations: `type Props = { plugin: Plugin; recommendation: Recommendation }`
- Callback handlers passed as props: `onToggle: () => void`, `onAnalyze: (text: string, mode: InputMode) => void`

**Return Values:**
- Explicit return types on functions
- Nullable returns: `string | null`, `Plugin | null`
- Example: `function getConflicts(selectedIds: string[]): ConflictWarning[]`

## Module Design

**Exports:**
- Default exports for React components: `export default function ComponentName() {}`
- Named exports for utilities: `export function recommend(text: string)`, `export const PLUGINS = {...}`
- Mixed exports acceptable: types exported as named, functions/components as default

**Barrel Files:**
- Not used in codebase; imports reference specific files directly
- Pattern: `import { PLUGINS } from "@/lib/plugins"` not `import { PLUGINS } from "@/lib"`

## Client vs Server Components

**Default:** Server components (no `"use client"` directive)

**Client Components (`"use client"` required):**
- Interactive components using hooks: `useState`, `useCallback`, `useRef`
- Pages with event handlers or state
- Examples: `components/InputPanel.tsx`, `components/PluginAdvisorApp.tsx`, `hooks/useAnalysis.ts`

**Server Components (no directive):**
- Layout: `app/layout.tsx`
- Pure data/utility modules: `lib/recommend.ts`, `lib/plugins.ts`

---

*Convention analysis: 2026-03-11*

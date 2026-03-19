---
phase: 13-mcp-6
plan: "02"
subsystem: plugin-db
tags: [mcp, plugins, ui-ux, workflow, i18n]
dependency_graph:
  requires: [13-01]
  provides: [magic-mcp, n8n-mcp, shadcn-mcp DB entries]
  affects: [lib/plugins.ts, lib/i18n/plugins-en.ts, /plugins MCP tab, /advisor scoring]
tech_stack:
  added: []
  patterns: [CORE_PLUGINS PluginSeed insertion, PLUGIN_FIELD_OVERRIDES, pluginDescEn + reasonsEn]
key_files:
  created: []
  modified:
    - lib/plugins.ts
    - lib/i18n/plugins-en.ts
decisions:
  - magic-mcp installMode=external-setup (requires TWENTY_FIRST_API_KEY from 21st.dev Magic Console)
  - shadcn-mcp uses pnpm dlx install (official shadcn/ui CLI pattern), officialStatus=official
  - n8n-mcp installMode=safe-copy (works without n8n instance in 7-tool core mode)
  - magic-mcp and shadcn-mcp conflicts=[] (complementary, not conflicting)
metrics:
  duration: "~6 minutes"
  completed: "2026-03-19T04:11:22Z"
  tasks_completed: 2
  files_modified: 2
---

# Phase 13 Plan 02: magic-mcp, n8n-mcp, shadcn-mcp Registration Summary

**One-liner:** Registered magic-mcp (AI UI generation + TWENTY_FIRST_API_KEY), n8n-mcp (workflow automation, 7-tool core mode), and shadcn-mcp (official pnpm dlx install) to complete Phase 13 DB expansion from 45 to 48 plugins.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add magic-mcp, n8n-mcp, shadcn-mcp to CORE_PLUGINS and PLUGIN_FIELD_OVERRIDES | 02ea92a | lib/plugins.ts |
| 2 | Add English translations for magic-mcp, n8n-mcp, shadcn-mcp | a511dae | lib/i18n/plugins-en.ts |

## What Was Built

Three MCP server entries added to the plugin DB completing Phase 13's goal of 6 new MCP servers:

**magic-mcp** (category: ui-ux)
- AI UI component generation via /ui command using 21st.dev library
- installMode: external-setup, requiredSecrets: TWENTY_FIRST_API_KEY
- keywords: ai ui, ui 생성, 컴포넌트 생성, ai component, magic, 21st, frontend, ui

**shadcn-mcp** (category: ui-ux)
- Official shadcn/ui MCP by Vercel team, one-line pnpm dlx install
- installMode: safe-copy, officialStatus: official, no API key required
- keywords: shadcn, 컴포넌트 라이브러리, component library, design system

**n8n-mcp** (category: workflow)
- n8n workflow automation, 7 core tools work without n8n instance
- installMode: safe-copy, MCP_MODE=stdio optimized install command
- keywords: n8n, 자동화, automation, 워크플로, workflow, nocode, zapier

## Verification

```
pnpm typecheck  PASS
pnpm lint       PASS (no ESLint warnings or errors)
pnpm build      PASS (48 plugin static pages generated)
pnpm test       PASS (125 tests, 8 test files)
```

Plugin count: `grep -c "^\s*id:" lib/plugins.ts` → **48** (target met)

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] lib/plugins.ts modified with 3 CORE_PLUGINS entries + 3 PLUGIN_FIELD_OVERRIDES entries
- [x] lib/i18n/plugins-en.ts modified with 3 pluginDescEn entries + 3 reasonsEn entries
- [x] Commit 02ea92a exists (Task 1)
- [x] Commit a511dae exists (Task 2)
- [x] Plugin count = 48
- [x] Full CI suite passes

## Self-Check: PASSED

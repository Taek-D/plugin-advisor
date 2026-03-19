---
phase: 13-mcp-6
plan: "01"
subsystem: plugin-db
tags: [mcp, plugins, data, integration, documentation, i18n]
dependency_graph:
  requires: []
  provides: [fetch-plugin, time-plugin, markitdown-plugin]
  affects: [lib/plugins.ts, lib/i18n/plugins-en.ts, /advisor scoring engine, /plugins catalog]
tech_stack:
  added: []
  patterns: [CORE_PLUGINS PluginSeed insertion, PLUGIN_FIELD_OVERRIDES override pattern, pluginDescEn + reasonsEn i18n]
key_files:
  created: []
  modified:
    - lib/plugins.ts
    - lib/i18n/plugins-en.ts
decisions:
  - fetch/time use uvx (Python-based) — NOT npx; markitdown uses pip install
  - fetch/time verificationStatus=verified difficulty=beginner; markitdown difficulty=intermediate (pip manual setup)
  - All 3 set officialStatus=official (fetch/time=modelcontextprotocol/servers, markitdown=microsoft/markitdown)
metrics:
  duration: "~12 minutes"
  completed_date: "2026-03-19T04:03:49Z"
  tasks_completed: 2
  files_modified: 2
---

# Phase 13 Plan 01: Fetch, Time, MarkItDown MCP Registration Summary

**One-liner:** Registered fetch, time, and markitdown official MCP servers (Python/uvx-based) expanding the plugin DB from 42 to 45 entries with verified metadata and English translations.

## What Was Built

Added 3 new MCP server entries to the plugin database with full metadata, operational overrides, and English i18n translations:

| Plugin | Category | Install Method | verificationStatus |
|--------|----------|----------------|--------------------|
| Fetch MCP | data | `uvx mcp-server-fetch` | verified |
| Time MCP | integration | `uvx mcp-server-time` | verified |
| MarkItDown MCP | documentation | `pip install markitdown-mcp` | verified |

## Tasks Completed

### Task 1: Add fetch, time, markitdown to CORE_PLUGINS and PLUGIN_FIELD_OVERRIDES
**Commit:** 5503634

- `markitdown` inserted in `documentation` section after `notion` entry (before `// Data` header)
- `fetch` inserted in `data` section after `postgres` entry (before `// Security` header)
- `time` inserted in `integration` section after `figma` entry (before `// UI/UX` header)
- `PLUGIN_FIELD_OVERRIDES` entries added for all 3 with `officialStatus: "official"`, `verificationStatus: "verified"`, correct `installMode` and `prerequisites`
- `pnpm typecheck` passed (Next.js build + tsc --noEmit)

### Task 2: Add English translations for fetch, time, markitdown
**Commit:** bee9ea7

- `pluginDescEn`: `desc` + `longDesc` added for fetch, time, markitdown
- `reasonsEn`: recommendation rationale strings added for all 3
- `pnpm typecheck` + `pnpm lint` + `pnpm test` all passed (125 tests)

## Verification Results

```
pnpm typecheck  — PASSED (compiled successfully, tsc --noEmit clean)
pnpm lint       — PASSED (no ESLint warnings or errors)
pnpm test       — PASSED (125/125 tests)
```

Spot-checks:
- `CORE_PLUGINS.fetch` at line 1144 — category: "data", install: `uvx mcp-server-fetch`
- `CORE_PLUGINS.time` at line 1402 — category: "integration", install: `uvx mcp-server-time`
- `CORE_PLUGINS.markitdown` at line 950 — category: "documentation", install: `pip install markitdown-mcp`
- `PLUGIN_FIELD_OVERRIDES.fetch/time/markitdown` at lines 309–334
- `id:` count in plugins.ts = 45 (was 42)

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

1. **fetch/time use uvx, NOT npx** — these are Python-based official servers in `modelcontextprotocol/servers`. Install commands are verbatim from verified READMEs.
2. **markitdown uses pip** — Microsoft's markitdown-mcp package requires `pip install markitdown-mcp` followed by running `markitdown-mcp` as the server command. No one-line `claude mcp add` available.
3. **Insertion order** — markitdown placed in `documentation` (after notion), fetch in `data` (after postgres), time in `integration` (after figma) per plan spec.

## Self-Check: PASSED

- FOUND: lib/plugins.ts
- FOUND: lib/i18n/plugins-en.ts
- FOUND: .planning/phases/13-mcp-6/13-01-SUMMARY.md
- FOUND commit: 5503634 (Task 1)
- FOUND commit: bee9ea7 (Task 2)

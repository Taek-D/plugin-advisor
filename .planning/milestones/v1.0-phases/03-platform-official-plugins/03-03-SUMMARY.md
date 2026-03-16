---
phase: 03-platform-official-plugins
plan: "03"
subsystem: plugin-db
tags: [verification, devops, docker, cloudflare, vercel, metadata]
dependency_graph:
  requires: [03-02]
  provides: [verified-devops-plugins]
  affects: [lib/plugins.ts, lib/i18n/plugins-en.ts]
tech_stack:
  added: []
  patterns: [remote-mcp-oauth, docker-mcp-gateway]
key_files:
  modified:
    - lib/plugins.ts
    - lib/i18n/plugins-en.ts
decisions:
  - "[03-03]: docker install → Docker MCP Gateway CLI (not npx) — @docker/mcp-server npm package does NOT exist; correct install is `docker mcp client connect claude-code --profile <profile-id> --global` via Docker Desktop 4.40+ MCP Toolkit"
  - "[03-03]: docker features 수정 — 컨테이너 기반 MCP 서버 관리/프로파일 관리/OAuth+시크릿/동적 툴 디스커버리/모니터링으로 교체; 단순 컨테이너 빌드/로그 조회는 README 범위 아님"
  - "[03-03]: cloudflare → remote OAuth MCP servers (15+ servers) — 기존 @cloudflare/mcp-server-cloudflare npm (v0.2.0 legacy local server)에서 완전 전환; requiredSecrets [] (OAuth); install은 HTTP transport URL per server"
  - "[03-03]: cloudflare features 확장 — Workers/KV/R2/D1만이 아니라 observability, Radar, browser-rendering, logpush, ai-gateway, autorag, audit-logs, dns-analytics, DEX, CASB, GraphQL 15개+ 서버 반영"
  - "[03-03]: vercel install → remote HTTP MCP (https://mcp.vercel.com) — @vercel/mcp npm package 존재하지 않음; claude mcp add --transport http vercel https://mcp.vercel.com"
  - "[03-03]: vercel requiredSecrets → [] — OAuth 인증 방식; API 키 불필요"
  - "[03-03]: vercel difficulty → intermediate — OAuth 연결 후 바로 사용 가능; advanced 과대표현"
  - "[03-03]: vercel githubRepo: null 유지 — 공개 GitHub repo 없음 확인 (vercel-mcp, mcp 모두 404); 공식 문서 URL도 vercel.com/docs/agent-resources/vercel-mcp로 업데이트"
metrics:
  duration: 18m
  completed_date: "2026-03-12"
  tasks_completed: 1
  tasks_total: 1
  files_modified: 2
---

# Phase 3 Plan 3: Docker, Cloudflare, Vercel Plugin Verification Summary

**One-liner:** Docker MCP Gateway CLI flow, Cloudflare remote OAuth multi-server suite (15+), Vercel remote HTTP MCP — all three corrected from npm-based assumptions to their actual install mechanisms.

## What Was Done

Verified metadata for the three DevOps/platform plugins (docker, cloudflare, vercel) against their official GitHub repositories and documentation pages. All three required significant corrections — none of them use the simple `npx` install pattern assumed by the original metadata.

## Verification Results

### VERIFY-01: Repo Existence and Activity

- **docker**: `docker/docker-mcp` exists and is active. The repo is the Docker MCP Gateway — a Docker CLI plugin, NOT a standalone npx MCP server for Claude Code.
- **cloudflare**: `cloudflare/mcp-server-cloudflare` exists and is active. The repo now contains a collection of 15+ remote MCP servers with OAuth. The old local npm package approach is legacy.
- **vercel**: No public GitHub repo found (`vercel/vercel-mcp` and `vercel/mcp` both 404). `githubRepo: null` retained as correct. The official server is at `https://mcp.vercel.com` (documented at vercel.com/docs/agent-resources/vercel-mcp).

### VERIFY-02: Description Accuracy

- **docker**: Completely rewritten. The actual purpose is MCP Gateway management (containerized MCP servers, profiles, OAuth, monitoring) — not direct Docker container management.
- **cloudflare**: Rewritten to reflect the multi-server remote MCP architecture covering the full Cloudflare platform stack.
- **vercel**: Rewritten to reflect the remote OAuth MCP server at mcp.vercel.com with its actual tools (docs search, project/deployment management, log analysis).

### VERIFY-03: Features Accuracy

- **docker**: Features replaced — original [컨테이너 관리, 이미지 빌드, 로그 조회, Docker Compose] was wrong. Actual features: containerized MCP server execution, profile-based multi-server management, OAuth/secrets, dynamic tool discovery, monitoring/tracing.
- **cloudflare**: Features expanded from 4 to 5, reflecting actual server categories (Workers + KV/R2/D1/Hyperdrive, observability, Radar, browser rendering).
- **vercel**: Features updated to reflect actual tools: docs search, project management, deployment management, log analysis. Removed "원클릭 배포" (not a feature of the MCP server).

### VERIFY-04: Keywords Accuracy

All three keyword arrays retained — they accurately reflect use cases and remain discoverable for relevant project types.

### VERIFY-05: Install Command Accuracy

All three install commands were WRONG:

| Plugin | Old (incorrect) | New (correct) |
|--------|----------------|---------------|
| docker | `claude mcp add docker -- npx -y @docker/mcp-server` | `docker mcp client connect claude-code --profile <profile-id> --global` (requires Docker Desktop 4.40+ MCP Toolkit) |
| cloudflare | `claude mcp add cloudflare -- npx -y @cloudflare/mcp-server-cloudflare` | `claude mcp add --transport http cloudflare-bindings https://bindings.mcp.cloudflare.com/mcp` (per-server HTTP transport) |
| vercel | `claude mcp add vercel -- npx -y @vercel/mcp` | `claude mcp add --transport http vercel https://mcp.vercel.com` |

npm package status:
- `@docker/mcp-server`: does NOT exist on npm
- `@cloudflare/mcp-server-cloudflare`: exists (v0.2.0) but is legacy local server — deprecated in favor of remote
- `@vercel/mcp`: does NOT exist on npm

### VERIFY-06: Conflicts Accuracy

All three retain `conflicts: []` — no conflicts needed. Confirmed correct.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Docker install command pointed to non-existent npm package**
- **Found during:** Task 1 (VERIFY-05)
- **Issue:** `@docker/mcp-server` does not exist on npm. The actual Docker MCP product is a CLI plugin (`docker-mcp`) installed via Docker Desktop, not via `npx`. The correct Claude Code integration is `docker mcp client connect claude-code`.
- **Fix:** Replaced install array with the correct 4-step flow (catalog pull → profile create → client connect). Updated desc, longDesc, features, prerequisites to reflect actual MCP Gateway functionality.
- **Files modified:** lib/plugins.ts, lib/i18n/plugins-en.ts
- **Commit:** 92c4891

**2. [Rule 1 - Bug] Cloudflare install used legacy local npm server**
- **Found during:** Task 1 (VERIFY-05)
- **Issue:** `@cloudflare/mcp-server-cloudflare` v0.2.0 is a legacy local server. The current official approach is a collection of 15+ remote MCP servers with OAuth (no API token). `requiredSecrets: ["Cloudflare API token"]` was therefore wrong.
- **Fix:** Updated install to per-server HTTP transport URLs. Cleared requiredSecrets. Added OAuth prerequisites. Expanded features to reflect 15+ server categories.
- **Files modified:** lib/plugins.ts, lib/i18n/plugins-en.ts
- **Commit:** 92c4891

**3. [Rule 1 - Bug] Vercel install pointed to non-existent npm package**
- **Found during:** Task 1 (VERIFY-05)
- **Issue:** `@vercel/mcp` does not exist on npm. Vercel MCP is a remote server at `mcp.vercel.com` using OAuth.
- **Fix:** Corrected install to `claude mcp add --transport http vercel https://mcp.vercel.com`. Cleared requiredSecrets (OAuth, no API key). Updated URL to vercel-mcp docs page. Downgraded difficulty to intermediate.
- **Files modified:** lib/plugins.ts, lib/i18n/plugins-en.ts
- **Commit:** 92c4891

## Self-Check

Checking files exist and commit is recorded:

## Self-Check: PASSED

- lib/plugins.ts: FOUND
- lib/i18n/plugins-en.ts: FOUND
- .planning/phases/03-platform-official-plugins/03-03-SUMMARY.md: FOUND
- commit 92c4891: FOUND
- pnpm typecheck: PASSED
- pnpm lint: PASSED
- pnpm build: PASSED

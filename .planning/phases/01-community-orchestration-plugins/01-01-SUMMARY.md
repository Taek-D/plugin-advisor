---
phase: 01-community-orchestration-plugins
plan: "01"
subsystem: plugin-metadata
tags: [verification, plugins, metadata, omc, agency-agents, ralph]
dependency_graph:
  requires: []
  provides: [verified-omc-metadata, verified-agency-agents-metadata, unverified-ralph-metadata]
  affects: [lib/plugins.ts, lib/i18n/plugins-en.ts]
tech_stack:
  added: []
  patterns: [plugin-field-overrides, verification-status]
key_files:
  created: []
  modified:
    - lib/plugins.ts
    - lib/i18n/plugins-en.ts
decisions:
  - "ralph verificationStatus set to unverified — haizelabs/ralph-wiggum repo returned 404 as of 2026-03-11; metadata retained from original description"
  - "agency-agents install method updated to cp -r (Claude Code native) instead of ./scripts/install.sh (other-tools script)"
  - "omc install step 3 corrected to /omc-setup (README-confirmed) from /oh-my-claudecode:omc-setup"
  - "omc conflicts: [superpowers] retained — design decision, omc README does not mention it but tools serve overlapping orchestration roles"
metrics:
  duration: "7m"
  completed_date: "2026-03-11"
  tasks_completed: 1
  tasks_total: 1
  files_modified: 2
---

# Phase 1 Plan 01: Community Orchestration Plugin Metadata Verification Summary

omc, agency-agents, ralph 3개 커뮤니티 오케스트레이션 플러그인 메타데이터를 GitHub README와 대조해 검증 및 수정했고, 영문 번역을 동기화했다.

## What Was Built

GitHub API와 raw README fetch를 통해 omc, agency-agents, ralph 3개 플러그인의 메타데이터를 실제 소스와 대조하여 검증했다. omc와 agency-agents는 active 상태로 확인(각각 9,306/27,949 stars)하여 verificationStatus를 "verified"로 승격했다. ralph는 githubRepo(haizelabs/ralph-wiggum)가 404를 반환해 "unverified"로 설정하고 코드 주석으로 사유를 명시했다.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Fetch GitHub READMEs and verify all metadata for omc, agency-agents, ralph | 17a57ae | lib/plugins.ts, lib/i18n/plugins-en.ts |

## Verification Results

### VERIFY-01: Repo Status
- **omc** (Yeachan-Heo/oh-my-claudecode): ACTIVE — pushed 2026-03-11, 9,306 stars
- **agency-agents** (msitarzewski/agency-agents): ACTIVE — pushed 2026-03-10, 27,949 stars
- **ralph** (haizelabs/ralph-wiggum): NOT FOUND — GitHub API and raw README both return 404

### VERIFY-02: Description Accuracy
- **omc**: Updated desc to mention "팀 기반" (team-based). Updated longDesc to describe Team pipeline (team-plan → team-prd → team-exec → team-verify → team-fix), tmux CLI workers for Codex/Gemini, and 30-50% token savings.
- **agency-agents**: Updated agent count from "61개+" to "90개+" (98 agent files linked in README). Updated longDesc to reflect 10+ divisions (engineering, design, paid media, marketing, product, PM, testing, support, spatial computing, specialized).
- **ralph**: Longdesc updated to add disclaimer about unverified repo.

### VERIFY-03: Features Accuracy
- **omc**: Updated features — "자율 실행 모드" → "Team 파이프라인 오케스트레이션", "Codex/Gemini 연동" → "Codex/Gemini tmux CLI 연동", "토큰 최적화 라우팅" → "토큰 30~50% 절감 라우팅"
- **agency-agents**: Updated features — "61개+ 전문 에이전트" → "90개+ 전문 에이전트", added "10개 이상 부서별 역할 분리", "Claude Code 네이티브 지원", "멀티툴 변환 스크립트 제공"
- **ralph**: No change (unverified)

### VERIFY-04: Keywords
- **omc**: Added "team", "오케스트레이션" keywords
- **agency-agents**: Added "devops", "mobile", "paid media", "support" keywords
- **ralph**: No change

### VERIFY-05: Install Commands
- **omc**: Step 3 corrected from `/oh-my-claudecode:omc-setup` to `/omc-setup` (README-confirmed)
- **agency-agents**: Changed from `./scripts/install.sh --tool claude-code` to `cp -r agency-agents/* ~/.claude/agents/` — README shows this as the Claude Code recommended method; install.sh is for Cursor/Aider/Windsurf/etc.
- **ralph**: No change (unverified)

### VERIFY-06: Conflicts
- **omc `conflicts: ["superpowers"]`**: Retained. The omc README does not explicitly mention superpowers incompatibility, but both serve overlapping orchestration roles and the conflict rule is a valid UX design decision for the recommender.

## Deviations from Plan

### Auto-fixed Issues

None — plan executed as written with the following expected findings:

**1. [Rule 1 - Finding] ralph-wiggum repo is 404**
- **Found during:** Task 1 (VERIFY-01)
- **Resolution:** Set verificationStatus to "unverified" per plan instruction ("If a README is unavailable or repo appears dead, set verificationStatus to 'unverified' instead of 'verified' and document why in a code comment")
- **Added:** PLUGIN_FIELD_OVERRIDES entry for ralph with verificationStatus, bestFor, avoidFor
- **Commit:** 17a57ae

## Key Decisions

1. **ralph verificationStatus: "unverified"** — repo 404, cannot verify install method or current features. Metadata preserved from original description with disclaimer in longDesc.
2. **agency-agents install method** — `cp -r` is the Claude Code native path per README; `./scripts/install.sh` is explicitly for other tools (Cursor, Aider, Windsurf). Updated accordingly.
3. **omc /omc-setup** — README Quick Start clearly shows `/omc-setup` (not `/oh-my-claudecode:omc-setup`) as step 2 after plugin install.
4. **omc conflicts retained** — This is a product decision in the recommender system, not a claim from the plugin's own README. Retained as-is.

## English Translation Sync

Updated `pluginDescEn` for all 3 plugins:
- omc: Reflects Team pipeline, tmux CLI workers, 30-50% token savings
- agency-agents: Updated agent count (90+), 10+ departments, Claude Code install method
- ralph: Added note about unverified repo status

Updated `reasonsEn` for omc and agency-agents to match updated descriptions.

## Self-Check: PASSED

- FOUND: lib/plugins.ts
- FOUND: lib/i18n/plugins-en.ts
- FOUND: .planning/phases/01-community-orchestration-plugins/01-01-SUMMARY.md
- FOUND: commit 17a57ae (feat(01-01): verify and update omc, agency-agents, ralph plugin metadata)
- pnpm typecheck: PASSED
- pnpm lint: PASSED
- pnpm build: PASSED

---
phase: 03-platform-official-plugins
plan: "01"
subsystem: plugin-metadata
tags: [verification, plugins, metadata, mcp, search, scraping]
dependency_graph:
  requires: []
  provides: [verified-notion-metadata, verified-firecrawl-metadata, verified-exa-metadata, verified-tavily-metadata]
  affects: [lib/plugins.ts, lib/i18n/plugins-en.ts]
tech_stack:
  added: []
  patterns: [readme-verification, remote-mcp-http-transport]
key_files:
  modified:
    - lib/plugins.ts
    - lib/i18n/plugins-en.ts
decisions:
  - "notion requiredSecrets → NOTION_TOKEN — README confirms NOTION_TOKEN as the recommended env var (not NOTION_API_KEY or generic 'Notion integration token')"
  - "firecrawl install fixed — /plugin marketplace add firecrawl was completely wrong; correct package is firecrawl-mcp via npx"
  - "exa install → remote HTTP MCP — exa-labs migrated to hosted server at mcp.exa.ai; old npx exa-mcp-server still works but remote is now the primary install path"
  - "exa requiredSecrets → [] — basic tools (web/code/company search) work without an API key on the remote server"
  - "tavily install → remote HTTP MCP — tavily-ai now provides mcp.tavily.com remote server; API key passed as URL param tavilyApiKey"
  - "tavily conflicts: [brave-search] confirmed valid — both are web search APIs; recommender should avoid suggesting both simultaneously"
  - "notion features updated for v2.0 — v2.0.0 replaced database tools with data source tools (query-data-source, create-a-data-source, etc.); now 22 total tools"
  - "firecrawl features updated — current README documents 14 tools (scrape, batch_scrape, map, crawl, search, extract, agent, browser_*); old features (스케줄링) were not documented"
metrics:
  duration: 6m
  completed_date: "2026-03-12"
  tasks_completed: 1
  files_modified: 2
---

# Phase 03 Plan 01: Notion, Firecrawl, Exa, Tavily Metadata Verification Summary

Verified and updated metadata for 4 standalone official MCP plugins (notion, firecrawl, exa, tavily) against their official GitHub READMEs. All 4 plugins now have verificationStatus "verified" with accurate install commands, env var names, features, and English translations.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Fetch READMEs and verify metadata for notion, firecrawl, exa, tavily | 12a35a2 | lib/plugins.ts, lib/i18n/plugins-en.ts |

## Verification Results

### VERIFY-01: Repo existence and activity
- notion: makenotion/notion-mcp-server — active, v2.0.0 released with breaking tool changes (22 tools now)
- firecrawl: mendableai/firecrawl-mcp-server — active, 14 tools documented
- exa: exa-labs/exa-mcp-server — active, migrated to remote HTTP MCP at mcp.exa.ai
- tavily: tavily-ai/tavily-mcp — active, remote MCP at mcp.tavily.com with 4 tools

### VERIFY-02: Description accuracy
- notion: Updated desc and longDesc to mention 22 tools and NOTION_TOKEN requirement; updated to reference "데이터소스(DB)" instead of "데이터베이스" to match v2.0 terminology
- firecrawl: Updated longDesc to mention 14 tools and FIRECRAWL_API_KEY; kept core desc accurate
- exa: Updated desc and longDesc to reflect remote server, actual 3 default tools, and no-API-key-needed for basic use
- tavily: Updated desc and longDesc to list actual 4 tools and TAVILY_API_KEY requirement

### VERIFY-03: Features accuracy
- notion: Updated from ["페이지 CRUD", "데이터베이스 쿼리", "블록 단위 편집", "댓글/코멘트 관리"] to reflect v2.0 data source terminology
- firecrawl: Updated from ["동적 페이지 크롤링", "데이터 추출", "파이프라인 구축", "스케줄링"] to 4 groups covering actual 14 tools (scrape/batch, crawl/map, search/extract, agent/browser)
- exa: Updated from ["시맨틱 검색", "자연어 쿼리", "콘텐츠 하이라이트", "카테고리 필터"] to ["웹 시맨틱 검색", "코드/문서 컨텍스트 검색", "기업 리서치", "논문/개인 사이트 검색 (고급)"] matching actual tools
- tavily: Updated from ["검색 + 자동 요약", "소스 신뢰도 평가", "심층 검색 모드", "AI 에이전트 최적화"] to ["웹 검색 (자동 요약 포함)", "웹 페이지 콘텐츠 추출", "사이트 URL 맵핑", "사이트 크롤링"] matching actual 4 tools

### VERIFY-04: Keywords accuracy
- All 4: Added relevant missing keywords (firecrawl: "추출", "extract", "firecrawl"; exa: "코드 검색", "기업 조사"; tavily: "추출", "extract", "크롤링", "crawl")
- No misleading keywords removed (existing keywords remain valid)

### VERIFY-05: Install command accuracy
- notion: `claude mcp add notion -- npx -y @notionhq/notion-mcp-server` — confirmed correct package name from README; no standalone `claude mcp add` command in README but JSON config uses same npx package
- firecrawl: FIXED from `/plugin marketplace add firecrawl` (completely wrong) to `claude mcp add firecrawl -- npx -y firecrawl-mcp` — package name is `firecrawl-mcp` per README
- exa: UPDATED from `claude mcp add exa -- npx -y exa-mcp-server` to `claude mcp add --transport http exa https://mcp.exa.ai/mcp` — remote HTTP MCP is now the primary install path per README
- tavily: UPDATED from `claude mcp add tavily -- npx -y tavily-mcp@latest` to `claude mcp add --transport http tavily https://mcp.tavily.com/mcp/?tavilyApiKey=<YOUR_API_KEY>` — remote HTTP MCP per README Claude Code section

### VERIFY-06: Conflicts accuracy
- notion: conflicts: [] — confirmed, no conflicting tools
- firecrawl: conflicts: [] — confirmed, web scraping has no direct conflict with other plugins
- exa: conflicts: [] — confirmed valid; exa (semantic/code search) is complementary to brave-search (web search) and tavily (agent-optimized search)
- tavily: conflicts: ["brave-search"] — confirmed valid; both are web search APIs and recommending both to the same user would be redundant

### PLUGIN_FIELD_OVERRIDES updates
- All 4 plugins: verificationStatus set to "verified"
- requiredSecrets updated to actual env var names: NOTION_TOKEN, FIRECRAWL_API_KEY, [] (exa), TAVILY_API_KEY
- bestFor/avoidFor added for all 4 plugins

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed firecrawl install command format**
- **Found during:** Task 1, VERIFY-05
- **Issue:** Install command used `/plugin marketplace add firecrawl` format which is not a valid Claude Code command for MCP servers
- **Fix:** Updated to `claude mcp add firecrawl -- npx -y firecrawl-mcp` using the correct npm package name `firecrawl-mcp` confirmed from README
- **Files modified:** lib/plugins.ts
- **Commit:** 12a35a2

**2. [Rule 1 - Bug] Updated exa install to remote HTTP MCP**
- **Found during:** Task 1, VERIFY-05
- **Issue:** Previous install `claude mcp add exa -- npx -y exa-mcp-server` still works but exa-labs has migrated to a hosted remote MCP server as the primary install path
- **Fix:** Updated to `claude mcp add --transport http exa https://mcp.exa.ai/mcp` per official Claude Code instructions in README
- **Files modified:** lib/plugins.ts
- **Commit:** 12a35a2

**3. [Rule 1 - Bug] Updated tavily install to remote HTTP MCP**
- **Found during:** Task 1, VERIFY-05
- **Issue:** Previous install `claude mcp add tavily -- npx -y tavily-mcp@latest` is local; tavily now provides a remote MCP server with a dedicated Claude Code section in their README
- **Fix:** Updated to `claude mcp add --transport http tavily https://mcp.tavily.com/mcp/?tavilyApiKey=<YOUR_API_KEY>` per README
- **Files modified:** lib/plugins.ts
- **Commit:** 12a35a2

**4. [Rule 1 - Bug] Updated exa requiredSecrets to [] (no API key needed for basic use)**
- **Found during:** Task 1, VERIFY-07
- **Issue:** Current override had `requiredSecrets: ["Exa API key"]` but the remote MCP server at mcp.exa.ai provides 3 default tools without requiring an API key
- **Fix:** Set requiredSecrets to [] for exa
- **Files modified:** lib/plugins.ts
- **Commit:** 12a35a2

## Self-Check: PASSED

Files exist:
- lib/plugins.ts: FOUND
- lib/i18n/plugins-en.ts: FOUND
- .planning/phases/03-platform-official-plugins/03-01-SUMMARY.md: FOUND (this file)

Commits exist:
- 12a35a2: FOUND (feat(03-01): verify and update notion, firecrawl, exa, tavily plugin metadata)

verificationStatus "verified" confirmed for all 4 plugins in PLUGIN_FIELD_OVERRIDES.
pnpm typecheck, lint, build all passed.

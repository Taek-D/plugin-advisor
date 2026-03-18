# Stack Research

**Domain:** Claude Code MCP Server + Plugin ecosystem — DB expansion (v1.3)
**Researched:** 2026-03-18
**Confidence:** MEDIUM-HIGH (MCP entries verified via GitHub; Plugin entries verified via official plugin system docs and star counts; star counts from multiple sources as of March 2026)

---

## Context: This is a data-only milestone

No new npm dependencies are needed. The existing stack (Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Vitest) handles everything. All work is adding entries to `lib/plugins.ts` and `lib/i18n/plugins-en.ts`. The research question is: **which specific MCP servers and Plugins to add?**

---

## Existing DB (51 entries — do NOT re-add)

### MCPs already in DB (42)
`sequential-thinking`, `todoist`, `linear`, `repomix`, `context7`, `memory`, `playwright`,
`puppeteer`, `notion`, `firecrawl`, `brave-search`, `exa`, `tavily`, `perplexity`, `postgres`,
`security`, `sentry`, `github`, `slack`, `filesystem`, `git`, `supabase`, `figma`, `uiux`,
`docker`, `vercel`, `aws`, `atlassian`, `browserbase`, `stripe`, `neon`,
`desktop-commander`, `cloudflare`

### Plugins already in DB (9)
`omc`, `superpowers`, `bkit-starter`, `bkit`, `taskmaster`, `gsd`, `fireauto`,
`agency-agents`, `ralph`

---

## Recommended New MCP Servers (10 entries)

### Tier 1 — High confidence, high stars, actively maintained

| ID | Name | GitHub Repo | Stars | npm / Install | Category | Why Add |
|----|------|-------------|-------|---------------|----------|---------|
| `fetch` | Fetch | `modelcontextprotocol/servers` (src/fetch) | 81.4k (parent repo) | `uvx mcp-server-fetch` | web | Official MCP reference; fetches URLs → markdown for LLMs; most requested "read a webpage" tool |
| `magic-mcp` | Magic (21st.dev) | `21st-dev/magic-mcp` | 4.5k | `npx @21st-dev/cli@latest install` | ui | "v0 but in your editor" — generates polished UI components from natural language; fastest-growing frontend MCP |
| `n8n-mcp` | n8n MCP | `czlonkowski/n8n-mcp` | 15.4k | `npx n8n-mcp` | automation | Access to 1,239+ n8n workflow nodes + docs; massive workflow automation use case |
| `markitdown` | MarkItDown | `microsoft/markitdown` (packages/markitdown-mcp) | 90.9k (parent repo) | `uvx markitdown-mcp` | files | Microsoft-backed; converts 30+ file formats (PDF, DOCX, XLSX, PPTX, images) → markdown; complementary to filesystem MCP |
| `mongodb` | MongoDB | `mongodb-js/mongodb-mcp-server` | ~1k | `npx -y mongodb-mcp-server@latest` | database | Official MongoDB server; Atlas + local MongoDB; completes DB tier alongside postgres/supabase/neon |
| `obsidian` | Obsidian | `MarkusPfundstein/mcp-obsidian` | 3k | `uvx mcp-obsidian` | knowledge | 3k stars; connects Claude to Obsidian vault via REST API; popular for PKM workflows |
| `shadcn-mcp` | shadcn/ui MCP | `shadcn-ui/ui` (built-in MCP) | 110k (parent repo) | `pnpm dlx shadcn@latest mcp init --client claude` | ui | Official shadcn/ui MCP; browse/search/install shadcn components via natural language; pairs with magic-mcp |
| `time` | Time | `modelcontextprotocol/servers` (src/time) | 81.4k (parent repo) | `uvx mcp-server-time` | utility | Official MCP reference; timezone conversion + current time; no API key; fills obvious gap |

### Tier 2 — Strong candidates (pick 2 of these to reach 10 total MCP additions)

| ID | Name | GitHub Repo | Stars | npm / Install | Category | Notes |
|----|------|-------------|-------|---------------|----------|-------|
| `redis` | Redis | `redis/mcp-redis` | ~450 | `uvx --from redis-mcp-server redis-mcp-server` | database | Official Redis server; vector search + all Redis data structures; good for caching/session workflows |
| `sqlite` | SQLite | `modelcontextprotocol/servers-archived` (src/sqlite) | archived | `npx -y @modelcontextprotocol/server-sqlite` | database | Official reference; local SQLite DB ops; archived but npm package still functions; lightweight DB option |

**Recommendation: Add `redis` over `sqlite`.** Redis is maintained by an official org, actively developed, and covers a distinct use case. SQLite is archived — mark as `verificationStatus: "partial"`.

---

## Recommended New Plugins (5 entries)

### Tier 1 — Highest priority

| ID | Name | GitHub Repo | Stars | Install | Category | Why Add |
|----|------|-------------|-------|---------|----------|---------|
| `claude-mem` | Claude-Mem | `thedotmack/claude-mem` | 37.7k | `/plugin marketplace add thedotmack/claude-mem` then `/plugin install claude-mem` | memory | Fastest-growing plugin in Claude Code history (37k+ stars, trended #1 Feb 2026). Persistent memory across sessions via SQLite + vector embeddings. Solves the single biggest pain point: context loss. |
| `superclaude` | SuperClaude | `SuperClaude-Org/SuperClaude_Framework` | 21.6k | `pipx install superclaude && superclaude install` | workflow | 21k+ stars; 30 slash commands, 16 specialized agents, 7 behavioral modes; major productivity framework comparable to OMC but different approach |
| `peon-ping` | Peon Ping | `PeonPing/peon-ping` | ~4k | `brew install PeonPing/tap/peon-ping` OR `curl -fsSL https://raw.githubusercontent.com/PeonPing/peon-ping/main/install.sh \| bash` | productivity | ~100k users; audio+visual notifications when Claude needs attention; unique DX tool with no equivalent in current DB |

### Tier 2 — Additional candidates

| ID | Name | GitHub Repo | Stars | Install | Category | Notes |
|----|------|-------------|-------|---------|----------|-------|
| `ccpm` | CCPM | `automazeio/ccpm` | 6k | Clone + symlink `.claude/skills/ccpm` | project-management | 6k stars; GitHub Issues + Git worktrees for parallel agent execution; differentiates from taskmaster (linear tasks) and gsd (phases) |
| `voicemode` | VoiceMode | `mbailey/voicemode` | ~900 | `claude mcp add --scope user voicemode -- uvx --refresh voice-mode` | voice | Bidirectional voice conversations with Claude Code; unique category not covered by any existing DB entry |

**Recommendation for prioritization:** claude-mem + superclaude + peon-ping are must-adds (high stars, active, distinct value). ccpm adds if targeting project-management completeness. voicemode adds if covering experimental/novel categories.

---

## What NOT to Add

| Candidate | Why Exclude | Status |
|-----------|-------------|--------|
| `google-maps` | `@modelcontextprotocol/server-google-maps` archived (moved to servers-archived); no maintained official replacement with significant stars | Archived |
| `gdrive` | `@modelcontextprotocol/server-gdrive` archived May 2025; community forks exist but no canonical maintained version with >1k stars | Archived |
| `azure` | `Azure/azure-mcp` archived Feb 2026; moved to `microsoft/mcp` — incomplete transition, install process unclear | Archived |
| `discord` | Multiple competing community implementations, none >100 stars; no official Discord MCP server | Fragmented |
| `linear` (replacement) | Already in DB as deprecated pointing to `mcp.linear.app`; official Linear MCP now exists at `https://mcp.linear.app/mcp` — update existing entry, do not add new | Update existing |
| `n8n-skills` | Skill set (not MCP), not yet in plugin system format | Out of scope |
| `claude-squad` | Standalone CLI tool (brew install), not a Claude Code plugin or MCP | Wrong type |
| `shadcn-ui-mcp-server` (Jpisnice) | Community fork (2.5k stars) — prefer official `shadcn/ui` built-in MCP via `pnpm dlx shadcn@latest mcp init` | Use official |
| `pipedream` | Enterprise/commercial; free tier limited; no clean `npx` install; overlaps with n8n | Commercial |
| `voicemode` (Tier 2) | Requires FFmpeg + PortAudio system dependencies + optional Whisper/Kokoro setup; high friction for beginners; only ~900 stars | HIGH difficulty |

---

## Data Format for New Entries

Each new entry requires:

1. **`CORE_PLUGINS` in `lib/plugins.ts`** — `PluginSeed` object:
   - `id`, `name`, `tag`, `color`, `category`, `githubRepo`, `desc`, `longDesc`, `url`, `install[]`, `features[]`, `conflicts[]`, `keywords[]`

2. **`PLUGIN_FIELD_OVERRIDES` in `lib/plugins.ts`** (for plugins and non-default MCPs):
   - `type: "plugin"` for Plugin entries
   - `verificationStatus`, `difficulty`, `bestFor`, `avoidFor`, `officialStatus`, `installMode` as needed

3. **`lib/i18n/plugins-en.ts`** — English translations:
   - `pluginDescEn[id]` — short English description
   - `reasonsEn[id]` — English recommendation reasons array

### Classification Rules

| installMode | type | When |
|-------------|------|------|
| `claude mcp add` / `npx` / `uvx` / remote HTTP | `"mcp"` | Standard MCP server |
| `/plugin install` / `git clone + ~/.claude copy` | `"plugin"` | Claude Code Plugin |
| `brew install` / `curl \| bash` (standalone CLI) | `"plugin"` if it hooks into Claude, otherwise exclude | Standalone tool |

---

## Suggested DB Expansion Plan (51 → ~65)

| Wave | Entries | Type | Net Total |
|------|---------|------|-----------|
| Wave A: Must-adds | fetch, markitdown, magic-mcp, n8n-mcp, mongodb, time | MCP (6) | 57 |
| Wave B: High value | obsidian, shadcn-mcp, redis, claude-mem, superclaude | MCP (3) + Plugin (2) | 62 |
| Wave C: Reach | peon-ping, ccpm | Plugin (2) | 64 |

This hits the 60-65 target with clear prioritization.

---

## Full Entry Reference Data

### MCP: Fetch
- **GitHub:** `modelcontextprotocol/servers/src/fetch`
- **Install:** `uvx mcp-server-fetch`
- **Claude Code:** `claude mcp add fetch -- uvx mcp-server-fetch`
- **Category:** `web`
- **Official:** `officialStatus: "official"` (Anthropic reference impl)
- **Difficulty:** `beginner`
- **bestFor:** URL 내용 읽기, 웹 페이지 → 마크다운 변환, 외부 문서 참조
- **avoidFor:** 자바스크립트 렌더링 필요 시 (Firecrawl/Playwright 권장)
- **Confidence:** HIGH

### MCP: Time
- **GitHub:** `modelcontextprotocol/servers/src/time`
- **Install:** `uvx mcp-server-time`
- **Claude Code:** `claude mcp add time -- uvx mcp-server-time`
- **Category:** `utility`
- **Official:** `officialStatus: "official"` (Anthropic reference impl)
- **Difficulty:** `beginner`
- **bestFor:** 현재 시각 조회, 타임존 변환, 스케줄 계산
- **Confidence:** HIGH

### MCP: MarkItDown
- **GitHub:** `microsoft/markitdown` (packages/markitdown-mcp)
- **Install:** `uvx markitdown-mcp`
- **Claude Code:** `claude mcp add markitdown -- uvx markitdown-mcp`
- **Category:** `files`
- **Official:** `officialStatus: "official"` (Microsoft)
- **Difficulty:** `beginner`
- **bestFor:** PDF/DOCX/XLSX → 마크다운 변환, 다양한 파일 포맷 처리
- **avoidFor:** 단순 텍스트 파일 (filesystem MCP로 충분)
- **Confidence:** HIGH

### MCP: Magic (21st.dev)
- **GitHub:** `21st-dev/magic-mcp`
- **Stars:** 4.5k
- **Install:** `npx @21st-dev/cli@latest install claude --api-key <key>`
- **Requires:** 21st.dev API key (free tier available)
- **Category:** `ui`
- **Official:** `officialStatus: "community"`
- **Difficulty:** `beginner`
- **bestFor:** UI 컴포넌트 즉시 생성, React/Next.js 프론트엔드 개발
- **avoidFor:** 백엔드 전용 프로젝트
- **Confidence:** HIGH

### MCP: shadcn/ui MCP
- **GitHub:** `shadcn-ui/ui` (built-in MCP server, 110k stars on parent)
- **Install:** `pnpm dlx shadcn@latest mcp init --client claude`
- **Category:** `ui`
- **Official:** `officialStatus: "official"` (shadcn project)
- **Difficulty:** `beginner`
- **bestFor:** shadcn/ui 컴포넌트 검색/설치, Next.js + Tailwind 프로젝트
- **avoidFor:** shadcn/ui 미사용 프로젝트
- **Confidence:** HIGH

### MCP: n8n MCP
- **GitHub:** `czlonkowski/n8n-mcp`
- **Stars:** 15.4k
- **Install:** `npx n8n-mcp`
- **Claude Code:** `claude mcp add n8n -- npx n8n-mcp`
- **Category:** `automation`
- **Official:** `officialStatus: "community"`
- **Difficulty:** `intermediate`
- **bestFor:** n8n 워크플로 자동화, 1,200개+ 노드 문서 접근
- **avoidFor:** n8n 미사용 환경
- **Confidence:** HIGH (15k+ stars, actively maintained)

### MCP: MongoDB
- **GitHub:** `mongodb-js/mongodb-mcp-server`
- **Stars:** ~1k
- **Install:** `npx -y mongodb-mcp-server@latest`
- **Category:** `database`
- **Official:** `officialStatus: "official"` (MongoDB Inc.)
- **Difficulty:** `intermediate`
- **Requires:** MongoDB connection URI
- **bestFor:** MongoDB Atlas/로컬 MongoDB 쿼리, NoSQL 데이터 탐색
- **avoidFor:** SQL 데이터베이스 (postgres MCP 권장)
- **Confidence:** HIGH (official MongoDB org)

### MCP: Obsidian
- **GitHub:** `MarkusPfundstein/mcp-obsidian`
- **Stars:** 3k
- **Install:** `uvx mcp-obsidian`
- **Claude Code:** `claude mcp add obsidian -- uvx mcp-obsidian`
- **Requires:** Obsidian + Local REST API community plugin + API key
- **Category:** `knowledge`
- **Official:** `officialStatus: "community"`
- **Difficulty:** `intermediate`
- **bestFor:** Obsidian 노트 검색/수정, 지식베이스 연동
- **avoidFor:** Obsidian 미사용자
- **Confidence:** HIGH (3k stars, single maintained owner)

### MCP: Redis
- **GitHub:** `redis/mcp-redis`
- **Stars:** ~450
- **Install:** `uvx --from redis-mcp-server redis-mcp-server --url redis://localhost:6379/0`
- **Category:** `database`
- **Official:** `officialStatus: "official"` (Redis Inc.)
- **Difficulty:** `intermediate`
- **Requires:** Redis server running
- **bestFor:** 캐시 데이터 조회/수정, 세션 관리, 벡터 검색
- **avoidFor:** Redis 미사용 환경, 단순 캐싱만 필요한 경우
- **Confidence:** MEDIUM (official org, but only ~450 stars)

### Plugin: Claude-Mem
- **GitHub:** `thedotmack/claude-mem`
- **Stars:** 37.7k (March 2026)
- **Install:** `/plugin marketplace add thedotmack/claude-mem` then `/plugin install claude-mem`
- **Type:** `plugin`
- **Category:** `memory`
- **Official:** `officialStatus: "community"`
- **Difficulty:** `beginner`
- **bestFor:** 장기 프로젝트, 세션 간 컨텍스트 유지, 대형 코드베이스
- **avoidFor:** 단발성 작업, 가벼운 실험
- **installMode:** `safe-copy` (plugin system)
- **Confidence:** HIGH (37k stars, plugin system compatible, v10.x as of March 2026)

### Plugin: SuperClaude
- **GitHub:** `SuperClaude-Org/SuperClaude_Framework`
- **Stars:** 21.6k
- **Install:** `pipx install superclaude && superclaude install` (classic) OR `/plugin install superclaude` (v5 coming)
- **Type:** `plugin`
- **Category:** `workflow`
- **Official:** `officialStatus: "community"`
- **Difficulty:** `intermediate`
- **bestFor:** 체계적인 개발 워크플로, 30개 슬래시 커맨드, 도메인 전문 에이전트
- **avoidFor:** Claude Code 첫 설치 직후, 간단한 일회성 작업
- **installMode:** `safe-copy` (CLAUDE.md + commands injection)
- **Note:** Classic install (pipx) not a `/plugin install` yet — v5 plugin migration in progress (BETA). Install command differs from other plugins.
- **Confidence:** HIGH (21k stars, active, well-documented)

### Plugin: Peon Ping
- **GitHub:** `PeonPing/peon-ping`
- **Stars:** ~4k
- **Install:** `brew install PeonPing/tap/peon-ping` (macOS) OR `curl -fsSL https://raw.githubusercontent.com/PeonPing/peon-ping/main/install.sh | bash` (Linux/WSL)
- **Type:** `plugin` (hooks into Claude Code events)
- **Category:** `productivity`
- **Official:** `officialStatus: "community"`
- **Difficulty:** `beginner`
- **bestFor:** Claude 대기 알림, 멀티태스킹 환경, 장시간 작업 모니터링
- **avoidFor:** 조용한 환경 필요 시, 무음 선호
- **platformSupport:** `["mac", "linux"]` (Windows via WSL only)
- **installMode:** `safe-copy`
- **Confidence:** MEDIUM-HIGH (~4k stars, 100k users claimed, viral growth)

### Plugin: CCPM
- **GitHub:** `automazeio/ccpm`
- **Stars:** 6k
- **Install:** `git clone https://github.com/automazeio/ccpm && ln -s /path/to/ccpm/skill/ccpm .claude/skills/ccpm`
- **Type:** `plugin`
- **Category:** `project-management`
- **Official:** `officialStatus: "community"`
- **Difficulty:** `advanced`
- **bestFor:** GitHub Issues 기반 프로젝트 관리, 병렬 에이전트 실행, 대형 팀 프로젝트
- **avoidFor:** 소규모 개인 프로젝트, GitHub 미사용 환경
- **installMode:** `safe-copy`
- **Confidence:** MEDIUM (6k stars but install process is manual symlink, not /plugin system yet)

---

## Key Decisions for Implementation

| Decision | Rationale |
|----------|-----------|
| SuperClaude: `installMode: "safe-copy"` with note about `pipx` | Not in `/plugin install` system yet (v5 in BETA); install string is different from others; mark `difficulty: "intermediate"` |
| fetch + time: `officialStatus: "official"` | Both are official Anthropic/MCP reference implementations in `modelcontextprotocol/servers` |
| markitdown: `officialStatus: "official"` | Microsoft-maintained in their own repo with explicit MCP support |
| shadcn-mcp: use official shadcn route not Jpisnice fork | Official has 110k parent stars; install is project-scoped via pnpm dlx; more maintainable |
| magic-mcp: `requiredSecrets: ["MAGIC_API_KEY"]` | Needs 21st.dev API key (free tier available); mark accordingly |
| obsidian: `prerequisites: ["obsidian-local-rest-api"]` | Requires Obsidian desktop + REST API community plugin; must document this requirement |
| linear (existing): update to official `mcp.linear.app/mcp` endpoint | Official Linear MCP launched May 2025; SSE endpoint deprecated; update install command but keep entry |
| n8n-mcp category: `automation` (new or reuse `devops`?) | Check if `automation` category exists; if not, use closest existing: `devops` or `productivity` |

---

## Sources

- `awesomeclaude.ai/top-mcp-servers` — top MCP servers ranked by GitHub stars — MEDIUM confidence
- `github.com/hesreallyhim/awesome-claude-code` — Claude Code plugin ecosystem survey — HIGH confidence
- `github.com/thedotmack/claude-mem` — claude-mem direct repo — HIGH confidence (37.7k stars verified)
- `github.com/SuperClaude-Org/SuperClaude_Framework` — SuperClaude direct repo — HIGH confidence (21.6k stars verified)
- `github.com/czlonkowski/n8n-mcp` — n8n-mcp direct repo — HIGH confidence (15.4k stars verified)
- `github.com/21st-dev/magic-mcp` — magic-mcp direct repo — HIGH confidence (4.5k stars verified)
- `github.com/MarkusPfundstein/mcp-obsidian` — obsidian direct repo — HIGH confidence (3k stars verified)
- `github.com/mongodb-js/mongodb-mcp-server` — MongoDB official MCP — HIGH confidence (official org)
- `github.com/redis/mcp-redis` — Redis official MCP — HIGH confidence (official org, ~454 stars)
- `microsoft/markitdown` packages/markitdown-mcp — HIGH confidence (90.9k parent repo stars)
- `modelcontextprotocol/servers` (fetch, time) — HIGH confidence (official Anthropic reference)
- `ui.shadcn.com/docs/mcp` — shadcn/ui official MCP docs — HIGH confidence
- `github.com/PeonPing/peon-ping` — peon-ping direct repo — MEDIUM confidence (~4k stars)
- `github.com/automazeio/ccpm` — ccpm direct repo — MEDIUM confidence (6k stars, skill system not /plugin)
- WebSearch: fastmcp.me, mcpmarket.com, composio.dev — supplementary discovery — MEDIUM confidence

---

*Stack research for: Plugin Advisor v1.3 — DB expansion (MCP + Plugin new entries)*
*Researched: 2026-03-18*

import type { Plugin } from "./types";

type PluginOperationalFields = Pick<
  Plugin,
  | "officialStatus"
  | "verificationStatus"
  | "difficulty"
  | "prerequisites"
  | "requiredSecrets"
  | "platformSupport"
  | "installMode"
  | "maintenanceStatus"
  | "bestFor"
  | "avoidFor"
>;

type PluginSeed = Omit<
  Plugin,
  keyof PluginOperationalFields
>;

const DEFAULT_PLUGIN_FIELDS: PluginOperationalFields = {
  officialStatus: "community",
  verificationStatus: "partial",
  difficulty: "intermediate",
  prerequisites: [],
  requiredSecrets: [],
  platformSupport: ["windows", "mac", "linux"],
  installMode: "safe-copy",
  maintenanceStatus: "active",
  bestFor: [],
  avoidFor: [],
};

const PLUGIN_FIELD_OVERRIDES: Partial<
  Record<string, Partial<PluginOperationalFields>>
> = {
  omc: {
    difficulty: "advanced",
    verificationStatus: "verified",
    bestFor: ["장기 프로젝트", "멀티 에이전트 자동화", "팀 오케스트레이션"],
    avoidFor: ["Claude Code 첫 설치 직후", "가벼운 개인 실험"],
  },
  superpowers: {
    verificationStatus: "verified",
    difficulty: "beginner",
    bestFor: ["기존 코드 읽기", "빠른 생산성 향상"],
  },
  "bkit-starter": {
    verificationStatus: "verified",
    difficulty: "beginner",
    bestFor: ["Claude Code 첫 사용", "설정 가이드"],
  },
  bkit: {
    verificationStatus: "verified",
    difficulty: "intermediate",
    bestFor: ["PRD 기반 구현", "체계적인 워크플로"],
  },
  context7: {
    verificationStatus: "verified",
    difficulty: "beginner",
    bestFor: ["라이브러리 사용", "공식 문서 확인"],
  },
  repomix: {
    verificationStatus: "verified",
    difficulty: "beginner",
    bestFor: ["대형 코드베이스 이해", "온보딩"],
  },
  playwright: {
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "beginner",
    bestFor: ["웹앱 QA", "브라우저 테스트", "크로스 브라우저 E2E"],
  },
  puppeteer: {
    // puppeteer was moved from modelcontextprotocol/servers to servers-archived repo.
    // npm package @modelcontextprotocol/server-puppeteer still functional (2025.5.12).
    // No API key required — runs headless Chrome locally.
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "beginner",
    bestFor: ["스크린샷/PDF 생성", "Chrome 특화 자동화", "폼 테스트"],
    avoidFor: ["크로스 브라우저 테스트 필요 시 (Playwright 권장)"],
  },
  security: {
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "beginner",
    bestFor: ["인증/결제 앱", "보안 점검"],
  },
  firecrawl: {
    officialStatus: "official",
    verificationStatus: "verified",
    installMode: "external-setup",
    requiredSecrets: ["FIRECRAWL_API_KEY"],
    bestFor: ["웹 데이터 수집", "크롤링 자동화", "스크래핑 서비스"],
    avoidFor: ["단순 정적 페이지 조회"],
  },
  exa: {
    officialStatus: "official",
    verificationStatus: "verified",
    installMode: "external-setup",
    requiredSecrets: [],
    bestFor: ["기술 조사", "시맨틱 검색", "논문/코드 검색"],
    avoidFor: ["실시간 뉴스 검색"],
  },
  tavily: {
    officialStatus: "official",
    verificationStatus: "verified",
    installMode: "external-setup",
    requiredSecrets: ["TAVILY_API_KEY"],
    bestFor: ["AI 에이전트 검색", "RAG 시스템", "팩트 체크"],
    avoidFor: ["로컬 비즈니스 검색"],
  },
  perplexity: {
    // ppl-ai/modelcontextprotocol repo confirmed active (2026-03-12).
    // Package name changed from perplexity-mcp to @perplexity-ai/mcp-server (scoped).
    // Install uses --env flag to pass PERPLEXITY_API_KEY (confirmed from README).
    officialStatus: "official",
    verificationStatus: "verified",
    installMode: "external-setup",
    requiredSecrets: ["PERPLEXITY_API_KEY"],
    bestFor: ["기술 조사", "심층 리서치", "추론 분석"],
    avoidFor: ["API 키 없는 환경"],
  },
  "brave-search": {
    // brave-search was moved from modelcontextprotocol/servers to servers-archived repo.
    // npm package @modelcontextprotocol/server-brave-search still functional (0.6.2).
    // Official replacement is brave/brave-search-mcp-server but install command remains compatible.
    officialStatus: "official",
    verificationStatus: "verified",
    installMode: "external-setup",
    requiredSecrets: ["Brave Search API key (BRAVE_API_KEY)"],
    bestFor: ["실시간 웹 검색", "로컬 비즈니스 검색", "최신 정보 조회"],
    avoidFor: ["API 키 없는 환경"],
  },
  aws: {
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "intermediate",
    installMode: "safe-copy",
    bestFor: ["AWS 인프라 관리", "CDK 코드 생성", "AWS 문서 검색"],
    avoidFor: ["AWS 계정 없는 환경"],
  },
  atlassian: {
    // Tier 1 addition — not yet verified against repo README. Queued for v2 verification.
    verificationStatus: "partial",
    difficulty: "intermediate",
    installMode: "external-setup",
    requiredSecrets: ["Jira API Token", "Confluence API Token"],
    bestFor: ["팀 프로젝트 관리", "이슈 추적", "문서 협업"],
    avoidFor: ["개인 프로젝트", "Atlassian 미사용 팀"],
  },
  browserbase: {
    // Tier 1 addition — not yet verified against repo README. Queued for v2 verification.
    verificationStatus: "partial",
    difficulty: "intermediate",
    installMode: "external-setup",
    requiredSecrets: ["BROWSERBASE_API_KEY"],
    bestFor: ["클라우드 브라우저 테스트", "CI/CD 웹 테스트", "데이터 추출"],
    avoidFor: ["로컬 브라우저 테스트로 충분한 경우"],
  },
  stripe: {
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "intermediate",
    installMode: "external-setup",
    requiredSecrets: [],
    prerequisites: ["Stripe 계정", "OAuth 인증 (원격 MCP)"],
    bestFor: ["결제 기능 구현", "SaaS 빌링", "이커머스"],
    avoidFor: ["결제 기능 없는 프로젝트"],
  },
  neon: {
    // Tier 1 addition — not yet verified against repo README. Queued for v2 verification.
    officialStatus: "official",
    verificationStatus: "partial",
    difficulty: "intermediate",
    installMode: "external-setup",
    requiredSecrets: ["NEON_API_KEY"],
    bestFor: ["서버리스 Postgres", "Next.js+Vercel 스택", "DB 브랜칭"],
    avoidFor: ["Neon 미사용 환경"],
  },
  "desktop-commander": {
    // Tier 1 addition — not yet verified against repo README. Queued for v2 verification.
    verificationStatus: "partial",
    difficulty: "intermediate",
    bestFor: ["터미널 자동화", "프로세스 관리", "Claude Desktop 확장"],
    avoidFor: ["Claude Code CLI만 사용하는 경우 (기본 내장 기능으로 충분)"],
  },
  vercel: {
    // Vercel MCP: official remote MCP at https://mcp.vercel.com (OAuth, no API token needed).
    // No public GitHub repo — githubRepo: null is correct and intentional.
    // Claude Code install: claude mcp add --transport http vercel https://mcp.vercel.com
    // @vercel/mcp npm package does NOT exist.
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "intermediate",
    installMode: "external-setup",
    requiredSecrets: [],
    prerequisites: ["Vercel 계정", "OAuth 인증 (브라우저 로그인)"],
    bestFor: ["Next.js 배포", "프리뷰 배포", "Vercel 프로젝트 관리", "배포 로그 분석"],
    avoidFor: ["Vercel 계정 없는 환경"],
  },
  supabase: {
    // supabase: official plugin, metadata not yet verified against repo/docs
    officialStatus: "official",
    verificationStatus: "partial",
    installMode: "external-setup",
    requiredSecrets: ["Supabase project access"],
    bestFor: ["백엔드 시작", "Auth + DB 구축"],
  },
  github: {
    officialStatus: "official",
    verificationStatus: "verified",
    installMode: "external-setup",
    requiredSecrets: ["GITHUB_PERSONAL_ACCESS_TOKEN"],
    bestFor: ["오픈소스 프로젝트 관리", "팀 PR/이슈 워크플로", "GitHub 자동화"],
    avoidFor: ["GitHub 토큰 없는 환경", "로컬 Git만 필요한 경우"],
  },
  slack: {
    officialStatus: "official",
    verificationStatus: "verified",
    installMode: "external-setup",
    requiredSecrets: ["SLACK_BOT_TOKEN", "SLACK_TEAM_ID"],
    bestFor: ["팀 배포 알림 자동화", "Slack 워크스페이스 연동", "채널 메시지 자동화"],
    avoidFor: ["Slack 워크스페이스 없는 환경", "개인 프로젝트"],
  },
  sentry: {
    // getsentry/sentry-mcp repo confirmed active (2026-03-12).
    // Primary usage is remote MCP at mcp.sentry.dev (OAuth). Stdio mode uses SENTRY_ACCESS_TOKEN.
    // Claude Code plugin: claude plugin marketplace add getsentry/sentry-mcp
    // Stdio install: npx @sentry/mcp-server@latest --access-token=TOKEN
    // "자동 수정 제안" removed — Sentry MCP reads/analyzes errors, does not auto-fix code.
    officialStatus: "official",
    verificationStatus: "verified",
    installMode: "external-setup",
    requiredSecrets: ["SENTRY_ACCESS_TOKEN"],
    bestFor: ["프로덕션 에러 디버깅", "이슈 추적", "성능 모니터링"],
    avoidFor: ["Sentry 계정 없는 환경"],
  },
  notion: {
    officialStatus: "official",
    verificationStatus: "verified",
    installMode: "external-setup",
    requiredSecrets: ["NOTION_TOKEN"],
    bestFor: ["개발 문서 관리", "위키 동기화", "팀 노트"],
    avoidFor: ["실시간 데이터 처리"],
  },
  figma: {
    // figma/figma-mcp repo does NOT exist (404). Official Figma MCP is a hosted remote server.
    // Official repo: figma/mcp-server-guide (guide only — server runs at mcp.figma.com/mcp).
    // Claude Code install: claude plugin install figma@claude-plugins-official (recommended)
    //   OR: claude mcp add --transport http figma https://mcp.figma.com/mcp (manual)
    // figma-developer-mcp package is a community tool (GLips/Figma-Context-MCP), not official.
    // difficulty "advanced" justified: requires Dev/Full seat on paid Figma plan; free users
    //   get only 6 tool calls/month. OAuth auth flow required.
    officialStatus: "official",
    difficulty: "advanced",
    installMode: "external-setup",
    verificationStatus: "verified",
    requiredSecrets: [],
    prerequisites: ["Figma Dev or Full seat (Professional/Organization/Enterprise plan)", "Figma OAuth authentication via mcp.figma.com"],
    bestFor: ["디자인 → 코드 변환", "디자인 시스템 구현", "컴포넌트 코드 생성"],
    avoidFor: ["Figma 무료 플랜 (월 6회 제한)", "Figma 계정 없는 환경"],
  },
  cloudflare: {
    // cloudflare/mcp-server-cloudflare: collection of remote MCP servers with OAuth (no API token needed).
    // 15+ servers: workers-bindings, builds, observability, radar, docs, browser, logpush, ai-gateway, autorag, etc.
    // Old @cloudflare/mcp-server-cloudflare npm package (v0.2.0) is legacy local server — remote is the current approach.
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "advanced",
    installMode: "external-setup",
    requiredSecrets: [],
    prerequisites: ["Cloudflare 계정", "OAuth 인증 (브라우저 로그인)"],
    bestFor: ["Workers 개발", "엣지 컴퓨팅", "KV/R2/D1 관리", "Cloudflare 인프라 관리"],
    avoidFor: ["Cloudflare 계정 없는 환경"],
  },
  docker: {
    // docker/docker-mcp: Docker MCP Gateway (Docker CLI plugin), NOT a standalone npx server.
    // Requires Docker Desktop 4.59+ with MCP Toolkit feature enabled.
    // Connect to Claude Code via: docker mcp client connect claude-code --profile <profile-id> --global
    // @docker/mcp-server npm package does NOT exist.
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "advanced",
    installMode: "external-setup",
    prerequisites: ["Docker Desktop 4.40+ (MCP Toolkit 기능 활성화)"],
    bestFor: ["컨테이너 기반 MCP 서버 관리", "Docker 기반 개발 환경", "멀티 MCP 서버 프로파일 관리"],
    avoidFor: ["Docker Desktop 없는 환경", "간단한 단일 MCP 서버 연결"],
  },
  postgres: {
    // Moved to servers-archived; npm package @modelcontextprotocol/server-postgres v0.6.2 still functional
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "advanced",
    installMode: "manual-required",
    prerequisites: ["접속할 PostgreSQL 연결 문자열 (postgresql://user:pass@host:port/db)"],
    requiredSecrets: ["Database connection string (postgresql:// URL)"],
    bestFor: ["로컬 DB 디버깅", "SQL 검증", "스키마 탐색"],
    avoidFor: ["Claude Code 첫 사용", "쓰기 작업 필요 시 (읽기 전용)"],
  },
  filesystem: {
    // In modelcontextprotocol/servers main branch; package @modelcontextprotocol/server-filesystem v0.6.3 confirmed
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "intermediate",
    installMode: "manual-required",
    prerequisites: ["접근 허용 디렉토리 경로 (1개 이상 필수)"],
    bestFor: ["파일 자동화", "샌드박스 파일 작업", "로컬 파일 처리"],
    avoidFor: ["입문자 기본 세팅"],
  },
  // uiux: Not an MCP server — it's a PromptX/Codex prompt skill (nextlevelbuilder/ui-ux-pro-max-skill).
  // No MCP repo exists. npm "ui-ux-pro-max" not found. Verified 2026-03-16.
  uiux: {
    officialStatus: "unknown",
    verificationStatus: "unverified",
    difficulty: "advanced",
    installMode: "manual-required",
    maintenanceStatus: "unclear",
    bestFor: ["디자인 실험"],
    avoidFor: ["검증된 입문자 세트", "설치 성공률 우선 흐름"],
  },
  taskmaster: {
    verificationStatus: "verified",
    difficulty: "intermediate",
    bestFor: ["PRD 분해", "태스크 관리"],
  },
  gsd: {
    verificationStatus: "verified",
    difficulty: "intermediate",
    installMode: "safe-copy",
    bestFor: ["스펙 기반 개발", "로드맵 중심 실행", "장기 프로젝트"],
    avoidFor: ["가벼운 단발성 실험"],
  },
  fireauto: {
    verificationStatus: "verified",
    difficulty: "beginner",
    installMode: "safe-copy",
    bestFor: ["Claude Code 첫 세팅", "서비스 런칭 전 점검", "SEO/보안/UI 자동화"],
  },
  "agency-agents": {
    verificationStatus: "verified",
    difficulty: "intermediate",
    installMode: "manual-required",
    prerequisites: ["Git으로 저장소를 내려받고 ~/.claude/agents 에 복사하거나 install.sh 실행"],
    bestFor: ["역할 분리된 AI 팀", "전문가 페르소나 기반 협업"],
    avoidFor: ["원클릭 스타터 세팅", "설치 직후 가장 첫 플러그인"],
  },
  ralph: {
    // ralph-wiggum repo (haizelabs/ralph-wiggum) returned 404 as of 2026-03-11 — repo does not exist
    verificationStatus: "unverified",
    difficulty: "intermediate",
    bestFor: ["반복 구현 자동화", "PRD 기반 루프"],
    avoidFor: ["단발성 작업", "첫 세팅 직후"],
  },
  "sequential-thinking": {
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "advanced",
    bestFor: ["복잡한 추론", "아키텍처 검토", "단계별 계획 수립"],
    avoidFor: ["첫 세팅 직후 바로 쓰는 흐름"],
  },
  linear: {
    // jerhadf/linear-mcp-server: DEPRECATED — official remote MCP at mcp.linear.app/sse recommended.
    // Repo exists (345 stars, pushed 2025-05-01), npm package "linear-mcp-server" works. Verified 2026-03-16.
    verificationStatus: "verified",
    installMode: "external-setup",
    requiredSecrets: ["LINEAR_API_KEY"],
    maintenanceStatus: "stale",
    bestFor: ["이슈 관리", "팀 프로젝트 추적"],
    avoidFor: ["신규 도입 (공식 원격 MCP 권장)"],
  },
  todoist: {
    // abhiz123/todoist-mcp-server: 381 stars, pushed 2025-04-20, npm @abhiz123/todoist-mcp-server. Verified 2026-03-16.
    verificationStatus: "verified",
    installMode: "external-setup",
    requiredSecrets: ["TODOIST_API_TOKEN"],
    bestFor: ["할 일 관리", "개발 중 태스크 추적"],
    avoidFor: ["팀 프로젝트 관리 (Linear 등 권장)"],
  },
  memory: {
    // In modelcontextprotocol/servers main branch; package @modelcontextprotocol/server-memory v0.6.3 confirmed
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "intermediate",
    bestFor: ["장기 프로젝트", "세션 간 컨텍스트 유지", "반복 설명 제거"],
    avoidFor: ["단기 실험성 작업"],
  },
  git: {
    // In modelcontextprotocol/servers main branch; Python-based server (mcp-server-git), uses uvx not npx
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "intermediate",
    installMode: "manual-required",
    prerequisites: ["Git 설치 및 PATH 등록", "Python 또는 uvx (uv) 설치"],
    bestFor: ["로컬 Git 자동화", "커밋/브랜치 관리", "diff 분석"],
    avoidFor: ["GitHub API 기반 협업 (→ GitHub MCP 사용)"],
  },
};

const CORE_PLUGINS: Record<string, PluginSeed> = {
  // ─────────────────────────────────────────────
  // Orchestration
  // ─────────────────────────────────────────────
  omc: {
    id: "omc",
    name: "Oh My ClaudeCode",
    tag: "OMC",
    color: "#FF6B35",
    category: "orchestration",
    githubRepo: "Yeachan-Heo/oh-my-claudecode",
    desc: "32개 전문 에이전트, 팀 기반 멀티에이전트 오케스트레이션. 복잡한 장기 프로젝트의 핵심.",
    longDesc:
      "Oh My ClaudeCode(OMC)는 Claude Code를 팀 기반 멀티에이전트 오케스트레이션 시스템으로 확장하는 플러그인이에요. 32개의 전문 에이전트와 40개 이상의 스킬을 제공하며, Team 모드(team-plan → team-prd → team-exec → team-verify → team-fix 파이프라인)가 핵심 오케스트레이션 방식이에요. autopilot, ralph, ultrawork 등 다양한 실행 모드를 지원하고, tmux CLI를 통해 Codex · Gemini 같은 외부 AI와도 병렬로 협업할 수 있어요. 스마트 모델 라우팅으로 토큰 비용을 30~50% 절감할 수 있어요.",
    url: "https://github.com/Yeachan-Heo/oh-my-claudecode",
    install: [
      "/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode",
      "/plugin install oh-my-claudecode",
      "/omc-setup",
    ],
    features: [
      "32개 전문 에이전트",
      "Team 파이프라인 오케스트레이션",
      "Codex/Gemini tmux CLI 연동",
      "토큰 30~50% 절감 라우팅",
    ],
    conflicts: ["superpowers"],
    keywords: [
      "게임", "unity", "신규 서비스", "새 서비스", "멀티에이전트", "대규모",
      "팀", "team", "complex", "multi", "백엔드", "backend", "full stack", "풀스택",
      "saas", "플랫폼", "platform", "orchestrat", "오케스트레이션",
    ],
  },
  superpowers: {
    id: "superpowers",
    name: "Superpowers",
    tag: "SP",
    color: "#7C3AED",
    category: "orchestration",
    githubRepo: "superpoweredai/superpowers",
    desc: "기존 코드 빠른 파악 & 수정. 학습 곡선 낮고 즉시 체감.",
    longDesc:
      "Superpowers는 Claude Code의 기본 능력을 즉시 강화해주는 플러그인이에요. 기존 코드베이스를 빠르게 파악하고, 파일 탐색, 검색, 수정 작업에서 마찰을 최소화해줘요. 복잡한 설정 없이 설치 즉시 체감할 수 있는 게 가장 큰 장점이에요. 스크립트, 데이터 분석, 자동화 작업에 특히 강해요.",
    url: "https://github.com/superpoweredai/superpowers",
    install: [
      "/plugin marketplace add https://github.com/superpoweredai/superpowers",
      "/plugin install superpowers",
    ],
    features: [
      "즉시 적용",
      "파일 탐색 강화",
      "낮은 학습 곡선",
      "스크립트 최적화",
    ],
    conflicts: ["omc"],
    keywords: [
      "스크립트", "script", "자동화", "기존 코드", "리팩터", "refactor",
      "수정", "fix", "간단", "분석", "analysis", "데이터", "data", "python",
      "sql", "automation",
    ],
  },
  "agency-agents": {
    id: "agency-agents",
    name: "The Agency",
    tag: "AGCY",
    color: "#8B5CF6",
    category: "orchestration",
    githubRepo: "msitarzewski/agency-agents",
    desc: "엔지니어링, 디자인, 마케팅, PM, 테스트 등 90개+ 역할별 AI 전문가 에이전트 묶음. 팀처럼 역할을 나눠 쓰고 싶을 때 좋아요.",
    longDesc:
      "The Agency는 Claude Code에 복사해서 바로 쓸 수 있는 역할별 AI 전문가 에이전트 모음이에요. 엔지니어링(프론트/백엔드/모바일/AI/DevOps), 디자인, 유료 광고, 마케팅, 프로덕트, PM, 테스트, 지원, 공간 컴퓨팅 등 10개 이상의 부서에 걸쳐 90개 이상의 에이전트가 있어요. 각 에이전트는 고유한 전문성과 페르소나를 갖추고 있어 범용 프롬프트보다 훨씬 깊이 있는 역할 분리가 가능해요. Claude Code용 권장 설치는 에이전트 파일을 ~/.claude/agents/에 복사하는 방식이에요.",
    url: "https://github.com/msitarzewski/agency-agents",
    install: [
      "git clone https://github.com/msitarzewski/agency-agents.git",
      "cp -r agency-agents/* ~/.claude/agents/",
    ],
    features: [
      "90개+ 전문 에이전트",
      "10개 이상 부서별 역할 분리",
      "Claude Code 네이티브 지원",
      "멀티툴 변환 스크립트 제공",
    ],
    conflicts: [],
    keywords: [
      "agency", "agents", "specialist", "specialists", "frontend", "backend",
      "marketing", "project management", "pm", "design", "testing", "team",
      "persona", "workflow", "orchestrator", "multi-agent", "roster",
      "devops", "mobile", "paid media", "support",
    ],
  },

  // ─────────────────────────────────────────────
  // Workflow
  // ─────────────────────────────────────────────
  "bkit-starter": {
    id: "bkit-starter",
    name: "bkit Starter",
    tag: "BKIT-S",
    color: "#00D4AA",
    category: "workflow",
    githubRepo: "popup-studio-ai/bkit-claude-code",
    desc: "Claude Code 초보자용 프로젝트 설정 가이드. 첫 프로젝트 생성, 학습 커리큘럼, 설정 자동 생성.",
    longDesc:
      "bkit Starter는 Claude Code를 처음 쓰는 분들을 위한 온보딩 도구예요. 첫 프로젝트 만들기, 체계적인 학습 커리큘럼, 기존 프로젝트에 Claude Code 설정 자동 생성, 설정 업그레이드까지 단계별로 안내해줘요. 바이브코딩 입문자에게 딱 맞는 시작점이에요.",
    url: "https://github.com/popup-studio-ai/bkit-claude-code",
    install: [
      "/plugin marketplace add popup-studio-ai/bkit-claude-code",
      "/plugin install bkit",
    ],
    features: ["첫 프로젝트 가이드", "학습 커리큘럼", "설정 자동 생성", "설정 업그레이드"],
    conflicts: [],
    keywords: [
      "초보", "입문", "시작", "beginner", "start", "setup", "학습", "learn",
      "tutorial", "가이드", "guide", "처음", "first", "온보딩", "onboarding",
      "바이브코딩", "vibe coding",
    ],
  },
  bkit: {
    id: "bkit",
    name: "bkit",
    tag: "BKIT",
    color: "#00B892",
    category: "workflow",
    githubRepo: "popup-studio-ai/bkit-claude-code",
    desc: "PDCA 방법론 기반 구조화 워크플로. PRD → 설계 → 구현 → 검증 자동화.",
    longDesc:
      "bkit은 Claude Code에 PDCA(Plan-Do-Check-Act) 방법론을 도입해서 개발 프로세스를 체계화해줘요. PRD 분석부터 설계 문서 작성, 구현, 갭 분석, 완료 리포트까지 하나의 흐름으로 연결돼요. 단순히 코드를 생성하는 게 아니라, AI와 함께 개발 프로세스 자체를 설계하는 프레임워크예요.",
    url: "https://github.com/popup-studio-ai/bkit-claude-code",
    install: [
      "/plugin marketplace add popup-studio-ai/bkit-claude-code",
      "/plugin install bkit",
    ],
    features: ["PDCA 워크플로", "자동 문서화", "갭 분석", "완료 리포트 생성"],
    conflicts: [],
    keywords: [
      "prd", "문서", "설계", "계획", "plan", "doc", "명세", "요구사항",
      "requirement", "spec", "pdca", "기획", "아키텍처", "architecture",
      "반복", "iterate",
    ],
  },
  // NOTE: haizelabs/ralph-wiggum GitHub repo returned 404 as of 2026-03-11.
  // verificationStatus set to "unverified" in PLUGIN_FIELD_OVERRIDES.
  // Metadata below is based on original plugin description, not verified README.
  ralph: {
    id: "ralph",
    name: "Ralph Loop",
    tag: "RALPH",
    color: "#10B981",
    category: "workflow",
    githubRepo: "haizelabs/ralph-wiggum",
    desc: "자율 코딩 루프. PRD 완료까지 반복 실행 후 git 커밋 자동 처리.",
    longDesc:
      "Ralph Loop는 Claude Code가 PRD나 태스크 목록을 스스로 처리할 때까지 자율적으로 반복 실행하는 플러그인이에요. 각 반복마다 구현 → 검증 → 커밋을 자동으로 수행하고, 작업이 완료되면 깔끔한 git 히스토리를 남겨줘요. CRUD 구현, 마이그레이션, 테스트 커버리지 향상 같은 반복 작업에 특히 유용해요. 단, GitHub 저장소(haizelabs/ralph-wiggum) 접근이 확인되지 않아 설치 가능 여부를 별도로 확인해주세요.",
    url: "https://github.com/haizelabs/ralph-wiggum",
    install: [
      "/plugin marketplace add https://github.com/haizelabs/ralph-wiggum",
      "/plugin install ralph-wiggum",
    ],
    features: [
      "자율 반복 실행",
      "자동 git 커밋",
      "완료 검증",
      "PRD 기반 루프",
    ],
    conflicts: [],
    keywords: [
      "자율", "autonomous", "반복", "loop", "crud", "migration", "테스트",
      "test", "커버리지", "coverage", "자동화", "batch", "대량", "overnight",
    ],
  },
  taskmaster: {
    id: "taskmaster",
    name: "Taskmaster AI",
    tag: "TM",
    color: "#8B5CF6",
    category: "workflow",
    githubRepo: "eyaltoledano/claude-task-master",
    desc: "PRD 기반 태스크 자동 분해 & 의존성 관리. AI 에이전트 워크플로 핵심.",
    longDesc:
      "Taskmaster AI는 PRD나 요구사항 문서를 자동으로 세부 태스크로 분해하고, 의존성 그래프를 관리해주는 도구예요. 각 태스크의 우선순위와 복잡도를 AI가 판단해서 최적의 실행 순서를 제안해요. Claude Code와 연동하면 다음 작업을 자동으로 추천받고, 진행 상황을 실시간으로 추적할 수 있어요.",
    url: "https://github.com/eyaltoledano/claude-task-master",
    install: [
      "npx task-master-ai init",
      "claude mcp add taskmaster -- npx -y task-master-ai",
    ],
    features: [
      "PRD → 태스크 자동 분해",
      "의존성 그래프 관리",
      "복잡도 자동 분석",
      "진행률 추적",
    ],
    conflicts: [],
    keywords: [
      "task", "태스크", "prd", "계획", "plan", "breakdown", "분해",
      "의존성", "dependency", "프로젝트 관리", "project management",
      "우선순위", "priority", "milestone", "마일스톤",
    ],
  },
  gsd: {
    id: "gsd",
    name: "Get Shit Done",
    tag: "GSD",
    color: "#EF4444",
    category: "workflow",
    githubRepo: "gsd-build/get-shit-done",
    desc: "스펙 기반 개발과 컨텍스트 엔지니어링에 집중한 워크플로 시스템. 장기 프로젝트 품질 유지에 강해요.",
    longDesc:
      "Get Shit Done(GSD)는 Claude Code, Codex 같은 런타임에서 스펙 기반 개발을 일관되게 밀어주는 워크플로 시스템이에요. 프로젝트 초기 질문, 요구사항 정리, 로드맵, 단계별 실행과 검증을 한 흐름으로 묶어서 컨텍스트가 흐트러지는 문제를 줄여줘요. PRD, roadmap, phase 중심으로 길게 가져가는 프로젝트에 특히 잘 맞아요.",
    url: "https://github.com/gsd-build/get-shit-done",
    install: [
      "npx get-shit-done-cc@latest",
    ],
    features: [
      "스펙 기반 개발 흐름",
      "phase/roadmap 중심 실행",
      "컨텍스트 엔지니어링",
      "다중 런타임 지원",
    ],
    conflicts: [],
    keywords: [
      "spec", "spec-driven", "명세", "요구사항", "requirements", "roadmap",
      "phase", "milestone", "workflow", "planning", "plan", "context engineering",
      "context rot", "장기 프로젝트", "prd", "execute", "verify",
    ],
  },
  fireauto: {
    id: "fireauto",
    name: "fireauto",
    tag: "FA",
    color: "#F97316",
    category: "workflow",
    githubRepo: "imgompanda/fireauto",
    desc: "SEO, 보안, PRD, UI 개선 같은 반복 작업을 Claude Code 커맨드로 묶어둔 자동화 플러그인이에요.",
    longDesc:
      "fireauto는 Claude Code에서 반복적으로 쓰는 서비스 빌드/런칭 작업을 커맨드로 묶어둔 자동화 플러그인이에요. `/freainer`로 추천 MCP와 LSP, 알림 훅을 한 번에 세팅하고, `/planner`, `/researcher`, `/seo-manager`, `/security-guard`, `/designer`, `/loop` 같은 명령으로 서비스 기획부터 점검까지 이어갈 수 있어요. 특히 1인 개발자나 빠르게 서비스 실험을 돌리는 흐름에 잘 맞아요.",
    url: "https://github.com/imgompanda/fireauto",
    install: [
      "/plugin marketplace add imgompanda/fireauto",
      "/plugin install fireauto@fireauto",
    ],
    features: [
      "원클릭 초반 세팅",
      "SEO/보안 자동 점검",
      "PRD/리서치 자동화",
      "UI/UX 개선 커맨드",
    ],
    conflicts: [],
    keywords: [
      "seo", "security", "planner", "research", "researcher", "reddit",
      "designer", "daisyui", "uiux", "loop", "startup", "서비스", "런칭",
      "launch", "초보 세팅", "freainer", "lsp", "marketing",
    ],
  },
  "sequential-thinking": {
    id: "sequential-thinking",
    name: "Sequential Thinking",
    tag: "SEQ",
    color: "#0EA5E9",
    category: "workflow",
    githubRepo: "modelcontextprotocol/servers",
    desc: "복잡한 문제를 단계별로 분해해서 사고. 수정·분기·재검토가 가능한 동적 추론.",
    longDesc:
      "Sequential Thinking MCP는 복잡한 문제를 순차적 사고 단계로 분해해서 처리하는 공식 MCP 서버예요. 각 단계에서 사고를 수정하거나 이전 단계를 재검토(revision)하고, 대안적 추론 경로로 분기(branch)하는 동적 사고 흐름을 지원해요. 문제 전체 범위가 처음부터 명확하지 않아도 단계별로 범위를 조정할 수 있어요. 아키텍처 설계, 복잡한 버그 추적, 계획 수립처럼 깊은 사고와 과정 수정이 필요한 작업에 특히 강해요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking",
    install: [
      "claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking",
    ],
    features: [
      "단계별 사고 분해 및 수정",
      "대안 경로 분기(branching)",
      "동적 사고 수 조정",
      "가설 생성 및 검증",
    ],
    conflicts: [],
    keywords: [
      "사고", "thinking", "추론", "reasoning", "아키텍처", "architecture",
      "설계", "design", "디버깅", "debug", "복잡", "complex", "분석",
      "analysis", "알고리즘", "algorithm", "계획", "plan", "단계",
    ],
  },
  todoist: {
    id: "todoist",
    name: "Todoist MCP",
    tag: "TODO",
    color: "#E44332",
    category: "workflow",
    githubRepo: "abhiz123/todoist-mcp-server",
    desc: "Todoist 연동으로 자연어 태스크 관리. 생성, 검색, 수정, 완료, 삭제까지.",
    longDesc:
      "Todoist MCP는 인기 있는 할 일 관리 앱 Todoist를 Claude Code와 연동해주는 서버예요. 자연어로 태스크를 생성하고, 이름 검색으로 기존 태스크를 찾고, 우선순위/마감일/설명을 수정하고, 완료 또는 삭제할 수 있어요. 5개 도구(create, get, update, complete, delete)를 제공하며, 날짜/우선순위/프로젝트별 필터링도 지원해요. TODOIST_API_TOKEN 환경변수가 필요해요.",
    url: "https://github.com/abhiz123/todoist-mcp-server",
    install: [
      "claude mcp add todoist --env TODOIST_API_TOKEN=your_token -- npx -y @abhiz123/todoist-mcp-server",
    ],
    features: [
      "자연어 태스크 생성 (제목, 설명, 마감일, 우선순위)",
      "태스크 검색 및 필터링 (날짜, 우선순위, 프로젝트)",
      "기존 태스크 수정 (이름 검색 → 속성 업데이트)",
      "태스크 완료/삭제",
    ],
    conflicts: [],
    keywords: [
      "todo", "할일", "태스크", "task", "관리", "manage", "일정",
      "schedule", "마감", "deadline", "추적", "tracking", "생산성",
      "productivity",
    ],
  },
  linear: {
    id: "linear",
    name: "Linear MCP",
    tag: "LIN",
    color: "#5E6AD2",
    category: "workflow",
    // jerhadf/linear-mcp-server is DEPRECATED — official Linear remote MCP: https://mcp.linear.app/sse
    githubRepo: "jerhadf/linear-mcp-server",
    desc: "Linear 이슈 관리 연동. 이슈 생성, 검색, 수정, 코멘트까지 5개 도구.",
    longDesc:
      "Linear MCP는 Linear 프로젝트 관리 도구를 Claude Code에서 직접 사용할 수 있게 해주는 서버예요. 5개 도구(create_issue, update_issue, search_issues, get_user_issues, add_comment)를 제공하고, 이슈/팀/사용자 리소스도 조회할 수 있어요. LINEAR_API_KEY 환경변수가 필요해요. 참고: 이 npm 패키지(jerhadf)는 deprecated 되었으며, 공식 Linear 원격 MCP(mcp.linear.app/sse)가 권장돼요.",
    url: "https://github.com/jerhadf/linear-mcp-server",
    install: [
      "claude mcp add linear --env LINEAR_API_KEY=your_key -- npx -y linear-mcp-server",
    ],
    features: [
      "이슈 생성/수정 (제목, 설명, 우선순위, 상태)",
      "이슈 검색 및 필터링 (팀, 상태, 라벨, 담당자)",
      "사용자 할당 이슈 조회",
      "이슈 코멘트 추가 (마크다운 지원)",
    ],
    conflicts: [],
    keywords: [
      "linear", "이슈", "issue", "스프린트", "sprint", "프로젝트 관리",
      "project management", "팀", "team", "칸반", "kanban", "백로그",
      "backlog", "애자일", "agile",
    ],
  },

  // ─────────────────────────────────────────────
  // Code Quality
  // ─────────────────────────────────────────────
  repomix: {
    id: "repomix",
    name: "Repomix",
    tag: "REPO",
    color: "#6366F1",
    category: "code-quality",
    githubRepo: "yamadashy/repomix",
    desc: "전체 코드베이스를 AI 친화적 파일로 패킹. 대형 프로젝트 컨텍스트 관리.",
    longDesc:
      "Repomix는 전체 코드베이스를 하나의 AI 친화적 파일로 패킹해주는 도구예요. 대형 프로젝트나 레거시 코드를 Claude가 한 번에 이해할 수 있게 만들어줘요. 모노레포, 레거시 코드 분석, 팀 온보딩, 코드 리뷰 등 전체 컨텍스트가 필요한 작업에 필수예요.",
    url: "https://repomix.com",
    install: [
      "/plugin marketplace add repomix",
      "/plugin install repomix-mcp@repomix",
      "/plugin install repomix-commands@repomix",
    ],
    features: [
      "코드베이스 패킹",
      "컨텍스트 최적화",
      "레거시 분석",
      "모노레포 지원",
    ],
    conflicts: [],
    keywords: [
      "코드베이스", "codebase", "대형", "large", "레거시", "legacy", "전체",
      "모노레포", "monorepo", "온보딩", "onboarding", "이해", "understand",
      "review",
    ],
  },
  context7: {
    id: "context7",
    name: "Context7",
    tag: "C7",
    color: "#F59E0B",
    category: "code-quality",
    githubRepo: null,
    desc: "최신 라이브러리 공식 문서를 실시간 주입. 환각 현상 대폭 감소.",
    longDesc:
      "Context7은 Claude가 코드를 작성할 때 최신 라이브러리 공식 문서를 실시간으로 주입해주는 MCP 서버 기반 플러그인이에요. Next.js, Supabase, Prisma, FastAPI 등 주요 라이브러리의 최신 API를 정확하게 사용할 수 있어서 환각(hallucination)으로 인한 오류를 크게 줄여줘요.",
    url: "https://mcp.context7.com",
    install: [
      "/plugin marketplace add https://mcp.context7.com/mcp",
      "/plugin install context7",
    ],
    features: [
      "실시간 문서 주입",
      "환각 감소",
      "최신 API 지원",
      "MCP 기반",
    ],
    conflicts: [],
    keywords: [
      "라이브러리", "library", "api", "sdk", "next.js", "nextjs", "react",
      "django", "fastapi", "supabase", "prisma", "최신", "공식", "framework",
      "패키지",
    ],
  },
  memory: {
    id: "memory",
    name: "Memory MCP",
    tag: "MEM",
    color: "#A855F7",
    category: "code-quality",
    githubRepo: "modelcontextprotocol/servers",
    desc: "영구 메모리로 세션 간 컨텍스트 유지. 장기 프로젝트의 일관성 보장.",
    longDesc:
      "Memory MCP는 Claude Code에 영구적인 지식 그래프 기반 메모리를 제공하는 서버예요. 세션이 종료되어도 이전 대화에서 학습한 프로젝트 컨텍스트, 코딩 스타일, 비즈니스 로직을 기억해요. 장기 프로젝트에서 매번 같은 설명을 반복하지 않아도 되고, 팀원 간 지식 공유에도 활용할 수 있어요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/memory",
    install: [
      "claude mcp add memory -- npx -y @modelcontextprotocol/server-memory",
    ],
    features: [
      "엔티티·관계 생성 및 삭제",
      "관찰(observation) 추가·제거",
      "지식 그래프 전체 조회",
      "노드 검색 및 열람",
    ],
    conflicts: [],
    keywords: [
      "메모리", "memory", "컨텍스트", "context", "기억", "remember",
      "장기", "long-term", "세션", "session", "지식", "knowledge",
      "영구", "persistent", "히스토리", "history",
    ],
  },

  // ─────────────────────────────────────────────
  // Testing
  // ─────────────────────────────────────────────
  playwright: {
    id: "playwright",
    name: "Playwright",
    tag: "PW",
    color: "#059669",
    category: "testing",
    githubRepo: "microsoft/playwright-mcp",
    desc: "브라우저 자동화 & E2E 테스트. 웹앱 QA에 강력한 도구.",
    longDesc:
      "Playwright MCP는 Microsoft의 Playwright를 Claude Code와 연동해서 브라우저 자동화와 E2E 테스트를 쉽게 만들어줘요. 웹앱의 전체 사용자 시나리오를 자동으로 검증하고, 크로스 브라우저 테스트, 스크린샷 비교, 성능 측정까지 지원해요.",
    url: "https://github.com/microsoft/playwright-mcp",
    install: [
      "/plugin marketplace add https://github.com/microsoft/playwright-mcp",
      "/plugin install playwright-mcp",
    ],
    features: [
      "E2E 테스트 자동화",
      "크로스 브라우저",
      "스크린샷 비교",
      "성능 측정",
    ],
    conflicts: ["puppeteer"],
    keywords: [
      "e2e", "테스트", "test", "브라우저", "browser", "qa", "품질",
      "quality", "헤드리스", "headless", "자동화 테스트", "검증", "verify",
      "selenium",
    ],
  },
  puppeteer: {
    id: "puppeteer",
    name: "Puppeteer MCP",
    tag: "PPT",
    color: "#40B5A4",
    category: "testing",
    githubRepo: "modelcontextprotocol/servers-archived",
    desc: "Chrome 기반 브라우저 자동화. 탐색, 스크린샷, 폼 조작, JavaScript 실행 지원.",
    longDesc:
      "Puppeteer MCP는 Google의 Puppeteer를 Claude Code와 연동해서 Chrome 브라우저를 프로그래밍 방식으로 제어할 수 있게 해줘요. 페이지 탐색, 스크린샷 캡처, 요소 클릭/호버/폼 입력, JavaScript 실행 등 실제 브라우저 상호작용을 자동화해요. 콘솔 로그와 스크린샷을 MCP 리소스로 노출해 클로드가 직접 확인할 수 있어요. 크로스 브라우저가 필요하다면 Playwright를, Chrome 특화 자동화에는 Puppeteer를 선택하세요.",
    url: "https://github.com/modelcontextprotocol/servers-archived/tree/main/src/puppeteer",
    install: [
      "claude mcp add puppeteer -- npx -y @modelcontextprotocol/server-puppeteer",
    ],
    features: [
      "페이지 탐색 및 상호작용",
      "스크린샷 캡처",
      "폼 입력 및 요소 조작",
      "JavaScript 실행 & 콘솔 로그",
    ],
    conflicts: ["playwright"],
    keywords: [
      "puppeteer", "chrome", "브라우저", "browser", "스크린샷", "screenshot",
      "pdf", "테스트", "test", "자동화", "automation", "헤드리스", "headless",
      "크롬", "javascript", "폼", "form",
    ],
  },

  // ─────────────────────────────────────────────
  // Documentation
  // ─────────────────────────────────────────────
  notion: {
    id: "notion",
    name: "Notion MCP",
    tag: "NTN",
    color: "#000000",
    category: "documentation",
    githubRepo: "makenotion/notion-mcp-server",
    desc: "Notion 페이지/데이터소스 직접 조작. 문서화와 위키 관리를 코드와 연결.",
    longDesc:
      "Notion MCP는 Notion 워크스페이스를 Claude Code에서 직접 조작할 수 있게 해주는 서버예요. 페이지 생성/수정, 데이터소스(DB) 쿼리, 댓글 추가, 블록 단위 편집 등 22개 툴을 코딩 흐름 안에서 바로 사용할 수 있어요. NOTION_TOKEN 환경변수 설정이 필요해요. 개발 문서, 회의록, 기술 위키를 코드와 동기화해서 관리할 때 특히 유용해요.",
    url: "https://github.com/makenotion/notion-mcp-server",
    install: [
      "claude mcp add notion -- npx -y @notionhq/notion-mcp-server",
    ],
    features: [
      "페이지 생성/수정/조회",
      "데이터소스(DB) 쿼리 및 생성",
      "블록 단위 편집",
      "댓글/코멘트 관리",
    ],
    conflicts: [],
    keywords: [
      "notion", "노션", "문서", "document", "위키", "wiki", "페이지",
      "page", "데이터베이스", "database", "기록", "note", "협업",
      "collaboration", "지식 관리", "knowledge",
    ],
  },

  // ─────────────────────────────────────────────
  // Data
  // ─────────────────────────────────────────────
  firecrawl: {
    id: "firecrawl",
    name: "Firecrawl",
    tag: "FIRE",
    color: "#EF4444",
    category: "data",
    githubRepo: "mendableai/firecrawl-mcp-server",
    desc: "웹 스크래핑 & 데이터 추출 자동화. 크롤링 기반 서비스에 필수.",
    longDesc:
      "Firecrawl MCP는 웹 데이터 수집과 스크래핑을 자동화해주는 서버예요. 단일 페이지 스크래핑, 배치 스크래핑, 사이트 전체 크롤링, URL 맵핑, 웹 검색, AI 기반 구조화 추출, 자율 리서치 에이전트, 클라우드 브라우저 세션 등 14개 툴을 제공해요. FIRECRAWL_API_KEY 환경변수가 필요해요. 가격 모니터링, 뉴스 수집, 데이터 파이프라인 같은 크롤링 기반 서비스에 필수예요.",
    url: "https://firecrawl.dev",
    install: [
      "claude mcp add firecrawl -- npx -y firecrawl-mcp",
    ],
    features: [
      "단일/배치 페이지 스크래핑",
      "사이트 크롤링 & URL 맵핑",
      "웹 검색 & AI 구조화 추출",
      "자율 리서치 에이전트 & 브라우저 자동화",
    ],
    conflicts: [],
    keywords: [
      "크롤링", "crawl", "스크래핑", "scraping", "웹 데이터", "수집",
      "collect", "파싱", "parse", "뉴스", "news", "가격", "price", "모니터링",
      "monitoring", "추출", "extract", "firecrawl",
    ],
  },
  "brave-search": {
    id: "brave-search",
    name: "Brave Search MCP",
    tag: "BRV",
    color: "#FB542B",
    category: "data",
    githubRepo: "modelcontextprotocol/servers-archived",
    desc: "Brave 검색 API 연동. 웹 검색과 로컬 비즈니스 검색을 동시 지원.",
    longDesc:
      "Brave Search MCP는 Brave의 프라이버시 중심 검색 엔진을 Claude Code에서 사용할 수 있게 해주는 서버예요. 웹 검색(`brave_web_search`)과 로컬 비즈니스 검색(`brave_local_search`) 두 가지 모드를 제공해요. 로컬 검색 결과가 없을 경우 자동으로 웹 검색으로 폴백해요. 페이지네이션, 신선도 필터, 안전 검색 등 다양한 필터링 옵션도 제공해요. Brave Search API 키가 필요해요. (무료 플랜: 월 2,000 쿼리)",
    url: "https://github.com/modelcontextprotocol/servers-archived/tree/main/src/brave-search",
    install: [
      "claude mcp add brave-search -- npx -y @modelcontextprotocol/server-brave-search",
    ],
    features: [
      "웹 검색 (페이지네이션/신선도 필터)",
      "로컬 비즈니스 검색",
      "자동 폴백 (로컬→웹)",
      "프라이버시 중심 검색",
    ],
    conflicts: ["tavily"],
    keywords: [
      "검색", "search", "웹", "web", "실시간", "realtime", "최신",
      "latest", "정보", "information", "brave", "트렌드", "trend",
      "리서치", "research", "로컬", "local", "비즈니스", "business",
    ],
  },
  exa: {
    id: "exa",
    name: "Exa MCP",
    tag: "EXA",
    color: "#4F46E5",
    category: "data",
    githubRepo: "exa-labs/exa-mcp-server",
    desc: "AI 특화 시맨틱 검색. 웹, 코드, 기업 리서치를 의미 기반으로 검색.",
    longDesc:
      "Exa MCP는 AI 특화 시맨틱 검색 엔진을 Claude Code와 연동해주는 원격 서버예요. 웹 검색(web_search_exa), 코드 컨텍스트 검색(get_code_context_exa), 기업 리서치(company_research_exa) 3가지 툴을 기본 제공해요. 키워드 매칭이 아닌 의미 기반 검색으로 기술 블로그, 논문, GitHub 코드, API 문서를 효과적으로 찾아줘요. API 키 없이도 기본 기능 사용 가능해요.",
    url: "https://github.com/exa-labs/exa-mcp-server",
    install: [
      "claude mcp add --transport http exa https://mcp.exa.ai/mcp",
    ],
    features: [
      "웹 시맨틱 검색",
      "코드/문서 컨텍스트 검색",
      "기업 리서치",
      "논문/개인 사이트 검색 (고급)",
    ],
    conflicts: [],
    keywords: [
      "검색", "search", "시맨틱", "semantic", "ai 검색", "논문", "paper",
      "블로그", "blog", "리서치", "research", "정보 수집", "인사이트",
      "insight", "코드 검색", "기업 조사",
    ],
  },
  tavily: {
    id: "tavily",
    name: "Tavily MCP",
    tag: "TAV",
    color: "#0D9488",
    category: "data",
    githubRepo: "tavily-ai/tavily-mcp",
    desc: "AI 에이전트용 검색 API. 웹 검색, 추출, 맵핑, 크롤링을 제공.",
    longDesc:
      "Tavily MCP는 AI 에이전트에 최적화된 검색 API를 Claude Code와 연동해주는 원격 서버예요. 웹 검색(tavily-search), 웹 페이지 추출(tavily-extract), 사이트 맵핑(tavily-map), 사이트 크롤링(tavily-crawl) 4가지 툴을 제공해요. TAVILY_API_KEY 환경변수가 필요해요. RAG 시스템 구축, 팩트 체크, 경쟁사 분석 등에 활용할 수 있어요.",
    url: "https://github.com/tavily-ai/tavily-mcp",
    install: [
      "claude mcp add --transport http tavily https://mcp.tavily.com/mcp/?tavilyApiKey=<YOUR_API_KEY>",
    ],
    features: [
      "웹 검색 (자동 요약 포함)",
      "웹 페이지 콘텐츠 추출",
      "사이트 URL 맵핑",
      "사이트 크롤링",
    ],
    conflicts: ["brave-search"],
    keywords: [
      "검색", "search", "요약", "summary", "rag", "팩트 체크", "fact",
      "웹", "web", "리서치", "research", "실시간", "realtime", "정보",
      "information", "추출", "extract", "크롤링", "crawl",
    ],
  },
  perplexity: {
    id: "perplexity",
    name: "Perplexity MCP",
    tag: "PPLX",
    color: "#22B8CF",
    category: "data",
    githubRepo: "ppl-ai/modelcontextprotocol",
    desc: "AI 리서치 엔진 연동. 웹 검색·심층 리서치·추론 4가지 툴로 정확한 기술 조사 지원.",
    longDesc:
      "Perplexity MCP는 AI 기반 리서치 엔진 Perplexity를 Claude Code에서 사용할 수 있게 해주는 서버예요. 4가지 툴을 제공해요: 웹 검색(perplexity_search), 대화형 질문(perplexity_ask), 심층 리서치(perplexity_research), 고급 추론(perplexity_reason). 새로운 라이브러리 조사, 기술 비교 분석, 복잡한 문제 추론에 특히 유용해요. PERPLEXITY_API_KEY 환경변수가 필요해요.",
    url: "https://github.com/ppl-ai/modelcontextprotocol",
    install: [
      'claude mcp add perplexity --env PERPLEXITY_API_KEY="your_key_here" -- npx -y @perplexity-ai/mcp-server',
    ],
    features: [
      "웹 검색 (perplexity_search)",
      "대화형 AI 질문 (perplexity_ask)",
      "심층 리서치 (perplexity_research)",
      "고급 추론 분석 (perplexity_reason)",
    ],
    conflicts: [],
    keywords: [
      "perplexity", "리서치", "research", "조사", "investigate", "비교",
      "compare", "최신 정보", "latest", "소스", "source", "인용",
      "citation", "기술 조사", "추론", "reasoning", "심층",
    ],
  },
  postgres: {
    id: "postgres",
    name: "PostgreSQL MCP",
    tag: "PG",
    color: "#336791",
    category: "data",
    githubRepo: "modelcontextprotocol/servers-archived",
    desc: "PostgreSQL DB 읽기 전용 연결. 스키마 조회와 SQL 쿼리 실행.",
    longDesc:
      "PostgreSQL MCP는 PostgreSQL 데이터베이스에 읽기 전용으로 접근할 수 있게 해주는 서버예요. query 툴로 모든 SQL을 READ ONLY 트랜잭션 안에서 안전하게 실행하고, 테이블별 스키마 정보(컬럼명·타입)를 MCP 리소스로 자동 노출해요. 마이그레이션 작성 전 스키마 확인, 쿼리 최적화, 데이터 분석에 유용해요. 쓰기 작업은 지원하지 않아요.",
    url: "https://github.com/modelcontextprotocol/servers-archived/tree/main/src/postgres",
    install: [
      "claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres postgresql://localhost/mydb",
    ],
    features: [
      "읽기 전용 SQL 쿼리 실행",
      "테이블 스키마 자동 조회",
      "MCP 리소스로 스키마 노출",
      "READ ONLY 트랜잭션 보장",
    ],
    conflicts: [],
    keywords: [
      "postgres", "postgresql", "데이터베이스", "database", "db", "sql",
      "쿼리", "query", "스키마", "schema", "마이그레이션", "migration",
      "테이블", "table", "rdb",
    ],
  },

  // ─────────────────────────────────────────────
  // Security
  // ─────────────────────────────────────────────
  security: {
    id: "security",
    name: "Security Guidance",
    tag: "SEC",
    color: "#DC2626",
    category: "security",
    githubRepo: null,
    desc: "보안 취약점 실시간 감지. SQL인젝션, XSS, 인증 이슈 자동 경고.",
    longDesc:
      "Security Guidance는 Claude Code가 코드를 작성할 때 보안 취약점을 실시간으로 감지해주는 공식 플러그인이에요. SQL 인젝션, XSS, CSRF, 인증 우회, 민감 정보 노출 등 OWASP Top 10 기준의 주요 취약점을 자동으로 경고해줘요. 인증, 결제, 개인정보를 다루는 서비스에서 특히 중요해요.",
    url: "https://github.com/anthropics/claude-plugins-official",
    install: [
      "/plugin install security-guidance@claude-plugin-directory",
    ],
    features: [
      "OWASP Top 10 감지",
      "실시간 경고",
      "인증 검토",
      "공식 Anthropic 플러그인",
    ],
    conflicts: [],
    keywords: [
      "보안", "security", "인증", "auth", "로그인", "login", "취약점",
      "vulnerability", "sql injection", "xss", "결제", "payment", "금융",
      "finance", "개인정보", "privacy", "암호화", "encrypt",
    ],
  },
  sentry: {
    id: "sentry",
    name: "Sentry MCP",
    tag: "SNTY",
    color: "#362D59",
    category: "security",
    githubRepo: "getsentry/sentry-mcp",
    desc: "Sentry 에러 트래킹 연동. 이슈·이벤트·릴리스·프로젝트 조회와 AI 기반 에러 분석.",
    longDesc:
      "Sentry MCP는 에러 트래킹 플랫폼 Sentry를 Claude Code와 연동해주는 서버예요. 프로덕션 에러를 실시간으로 확인하고, 스택 트레이스를 분석하고, 근본 원인을 파악할 수 있어요. 이슈 상세 조회, 이벤트 첨부파일, 릴리스·팀·프로젝트·DSN 관리 등 다양한 툴을 제공해요. AI 기반 Seer 분석으로 에러 원인을 자동 진단할 수 있어요 (LLM 제공자 설정 필요). 기본 사용은 mcp.sentry.dev 원격 서버(OAuth)로 연결하거나, stdio 모드는 SENTRY_ACCESS_TOKEN이 필요해요.",
    url: "https://github.com/getsentry/sentry-mcp",
    install: [
      "claude plugin marketplace add getsentry/sentry-mcp",
      "claude plugin install sentry-mcp@sentry-mcp",
    ],
    features: [
      "이슈 상세 조회 및 검색",
      "이벤트·스택 트레이스 분석",
      "릴리스·프로젝트·팀 관리",
      "AI 기반 에러 진단 (Seer)",
    ],
    conflicts: [],
    keywords: [
      "sentry", "에러", "error", "버그", "bug", "트래킹", "tracking",
      "모니터링", "monitoring", "프로덕션", "production", "스택 트레이스",
      "stacktrace", "크래시", "crash", "이슈", "issue", "릴리스", "release",
    ],
  },

  // ─────────────────────────────────────────────
  // Integration
  // ─────────────────────────────────────────────
  github: {
    id: "github",
    name: "GitHub MCP",
    tag: "GH",
    color: "#24292E",
    category: "integration",
    githubRepo: "modelcontextprotocol/servers-archived",
    desc: "GitHub API 완전 연동. 파일/리포/이슈/PR/브랜치/검색 26개 툴 제공.",
    longDesc:
      "GitHub MCP는 GitHub API를 Claude Code에서 직접 사용할 수 있게 해주는 공식 서버예요. 파일 생성/수정/조회, 리포지토리 생성/포크, 이슈 생성/수정/댓글, PR 생성/리뷰/병합, 브랜치 관리, 코드/이슈/사용자 검색, 커밋 조회 등 26개 툴을 제공해요. GITHUB_PERSONAL_ACCESS_TOKEN 환경 변수가 필요해요. 참고: 이 서버는 현재 modelcontextprotocol/servers-archived에 있으며, 후속 개발은 github/github-mcp-server로 이전됐어요.",
    url: "https://github.com/modelcontextprotocol/servers-archived/tree/main/src/github",
    install: [
      "claude mcp add github -- npx -y @modelcontextprotocol/server-github",
    ],
    features: [
      "파일/디렉토리 생성·수정·조회",
      "이슈 생성·수정·댓글",
      "PR 생성·리뷰·병합",
      "코드·이슈·사용자 검색",
      "브랜치·리포 관리",
      "커밋 로그 조회",
    ],
    conflicts: [],
    keywords: [
      "github", "깃허브", "pr", "pull request", "이슈", "issue", "코드 리뷰",
      "code review", "오픈소스", "open source", "리포", "repo", "브랜치",
      "branch", "git", "머지", "merge", "포크", "fork",
    ],
  },
  slack: {
    id: "slack",
    name: "Slack MCP",
    tag: "SLK",
    color: "#4A154B",
    category: "integration",
    githubRepo: "modelcontextprotocol/servers-archived",
    desc: "Slack 채널/메시지 연동. 메시지 전송·조회, 스레드, 리액션, 사용자 프로필 8개 툴.",
    longDesc:
      "Slack MCP는 Slack 워크스페이스를 Claude Code에서 직접 사용할 수 있게 해주는 공식 서버예요. 채널 목록 조회, 메시지 전송, 스레드 답글, 이모지 리액션, 채널 히스토리 조회, 스레드 답글 조회, 사용자 목록·프로필 조회 등 8개 툴을 제공해요. SLACK_BOT_TOKEN(xoxb-로 시작)과 SLACK_TEAM_ID 두 가지 환경 변수가 필요해요. 배포 알림, 에러 리포트, 코드 리뷰 요청을 Slack으로 자동 전송하는 데 적합해요.",
    url: "https://github.com/modelcontextprotocol/servers-archived/tree/main/src/slack",
    install: [
      "claude mcp add slack -- npx -y @modelcontextprotocol/server-slack",
    ],
    features: [
      "채널 메시지 전송·히스토리 조회",
      "스레드 답글 읽기/쓰기",
      "이모지 리액션 추가",
      "사용자 목록·프로필 조회",
    ],
    conflicts: [],
    keywords: [
      "slack", "슬랙", "메시지", "message", "채널", "channel", "알림",
      "notification", "팀", "team", "소통", "communication", "협업",
      "collaboration", "스레드", "thread", "배포 알림", "deploy notification",
    ],
  },
  filesystem: {
    id: "filesystem",
    name: "Filesystem MCP",
    tag: "FS",
    color: "#78716C",
    category: "integration",
    githubRepo: "modelcontextprotocol/servers",
    desc: "허용된 디렉토리 내 파일 읽기·쓰기·편집·검색. 샌드박스 보안 모델.",
    longDesc:
      "Filesystem MCP는 지정된 디렉토리 내에서만 동작하는 샌드박스 방식으로 파일 시스템을 안전하게 접근하게 해주는 서버예요. 파일 읽기(텍스트·미디어·다중), 쓰기, 편집(패턴 매칭 기반 부분 수정), 디렉토리 생성·탐색·트리 조회, 파일 이동·검색 등 풍부한 파일 작업을 지원해요. MCP Roots 프로토콜로 런타임 중에도 허용 디렉토리를 동적으로 변경할 수 있어요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    install: [
      "claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/allowed/dir",
    ],
    features: [
      "파일 읽기/쓰기/편집",
      "디렉토리 탐색 및 트리 조회",
      "파일 검색 및 이동",
      "샌드박스 접근 제어 (MCP Roots 지원)",
    ],
    conflicts: [],
    keywords: [
      "파일", "file", "디렉토리", "directory", "폴더", "folder", "읽기",
      "read", "쓰기", "write", "파일 시스템", "filesystem", "로컬",
      "local", "경로", "path", "편집", "edit", "검색", "search",
    ],
  },
  git: {
    id: "git",
    name: "Git MCP",
    tag: "GIT",
    color: "#F05032",
    category: "integration",
    githubRepo: "modelcontextprotocol/servers",
    desc: "로컬 Git 저장소 직접 조작. 커밋, 브랜치, diff, 로그, 스테이징 자동화.",
    longDesc:
      "Git MCP는 Git 저장소를 Claude Code에서 프로그래밍 방식으로 조작할 수 있게 해주는 Python 기반 서버예요. git_status, git_diff(스테이지/미스테이지), git_commit, git_add, git_reset, git_log, git_create_branch, git_checkout, git_show, git_branch 등 12개 툴을 제공해요. GitHub MCP와 달리 로컬 저장소를 직접 다루기 때문에 오프라인에서도 작동해요. Python/uvx 환경이 필요해요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/git",
    install: [
      "claude mcp add git -- uvx mcp-server-git --repository /path/to/repo",
    ],
    features: [
      "커밋/스테이징/리셋",
      "브랜치 생성 및 체크아웃",
      "diff 분석 (스테이지/미스테이지)",
      "로그 검색 (날짜 필터 지원)",
    ],
    conflicts: [],
    keywords: [
      "git", "깃", "커밋", "commit", "브랜치", "branch", "diff",
      "merge", "로그", "log", "버전 관리", "version control", "리베이스",
      "rebase", "스테이징", "staging",
    ],
  },
  supabase: {
    id: "supabase",
    name: "Supabase MCP",
    tag: "SB",
    color: "#3ECF8E",
    category: "integration",
    githubRepo: null,
    desc: "Supabase BaaS 완전 연동. DB, Auth, Storage, Edge Functions 관리.",
    longDesc:
      "Supabase MCP는 오픈소스 BaaS(Backend as a Service) 플랫폼 Supabase를 Claude Code와 완전히 연동해주는 서버예요. 데이터베이스 마이그레이션, 인증 설정, 스토리지 관리, Edge Functions 배포까지 모든 Supabase 기능을 코딩 흐름 안에서 직접 처리할 수 있어요. 풀스택 앱 개발의 백엔드를 빠르게 구축해요.",
    url: "https://supabase.com/docs/guides/ai/mcp",
    install: [
      "claude mcp add supabase -- npx -y @supabase/mcp-server",
    ],
    features: [
      "DB 마이그레이션",
      "인증 시스템 관리",
      "스토리지 연동",
      "Edge Functions 배포",
    ],
    conflicts: [],
    keywords: [
      "supabase", "수파베이스", "baas", "backend", "백엔드", "인증",
      "auth", "데이터베이스", "database", "스토리지", "storage",
      "서버리스", "serverless", "풀스택", "full stack",
    ],
  },
  figma: {
    id: "figma",
    name: "Figma MCP",
    tag: "FIG",
    color: "#F24E1E",
    category: "integration",
    // figma/figma-mcp does not exist. Official guide repo is figma/mcp-server-guide.
    // The actual MCP server is hosted remotely at mcp.figma.com/mcp (not open-sourced).
    githubRepo: "figma/mcp-server-guide",
    desc: "Figma 공식 원격 MCP. 디자인 컨텍스트 추출, 디자인 → 코드 변환, 변수/스타일 토큰 읽기.",
    longDesc:
      "Figma MCP는 Figma가 공식 운영하는 원격 MCP 서버(mcp.figma.com)예요. Claude Code 플러그인으로 한 줄 설치하거나 HTTP 전송으로 수동 연결할 수 있어요. 제공 툴: get_design_context(디자인 → React+Tailwind 변환), get_variable_defs(컬러·스페이싱 토큰 추출), get_metadata(레이어 구조), get_screenshot(시각적 참조), generate_diagram(Mermaid 다이어그램). 무료 플랜은 월 6회 제한이 있어요. Dev/Full 시트 보유자는 Figma REST API와 동일한 속도 제한이 적용돼요.",
    url: "https://github.com/figma/mcp-server-guide",
    install: [
      "claude plugin install figma@claude-plugins-official",
      "claude mcp add --transport http figma https://mcp.figma.com/mcp",
    ],
    features: [
      "디자인 → 코드 변환 (get_design_context)",
      "변수·스타일 토큰 추출 (get_variable_defs)",
      "레이어 메타데이터 조회 (get_metadata)",
      "스크린샷 캡처 (get_screenshot)",
      "FigJam 다이어그램 (get_figjam / generate_diagram)",
    ],
    conflicts: [],
    keywords: [
      "figma", "피그마", "디자인", "design", "ui", "목업", "mockup",
      "프로토타입", "prototype", "핸드오프", "handoff", "컴포넌트",
      "component", "스타일", "style", "토큰", "token", "디자인 시스템",
    ],
  },

  // ─────────────────────────────────────────────
  // UI/UX
  // ─────────────────────────────────────────────
  // uiux: No public MCP server repo found. 'yourusername/ui-ux-pro-max' was a placeholder URL.
  // GitHub search (2026-03-16): 87 repos matching "ui-ux-pro-max" are PromptX/Codex prompt skills
  // (e.g., nextlevelbuilder/ui-ux-pro-max-skill), NOT MCP servers. npm "ui-ux-pro-max" does not exist.
  uiux: {
    id: "uiux",
    name: "UI/UX Pro Max",
    tag: "UI",
    color: "#EC4899",
    category: "ui-ux",
    githubRepo: null,
    desc: "디자인 시스템, 컴포넌트, 접근성. 프론트엔드 퀄리티를 끌어올림.",
    longDesc:
      "UI/UX Pro Max는 프론트엔드 개발에 특화된 AI 스킬이에요. 디자인 시스템 설계, 컴포넌트 구조화, 접근성(a11y) 검토까지 지원해요. React, Vue, Svelte 등 주요 프레임워크와 Tailwind, shadcn/ui 같은 스타일 시스템에 대한 깊은 이해를 제공해요. 참고: MCP 서버가 아닌 프롬프트 기반 스킬이며, 공식 MCP 저장소가 존재하지 않아요.",
    url: "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill",
    install: [
      "# MCP 서버가 아닌 프롬프트 스킬 — 아래 CLI로 설치",
      "npx uipro-cli init",
    ],
    features: [
      "디자인 시스템 생성 (161개 추론 규칙)",
      "67가지 UI 스타일 지원",
      "접근성(a11y) 검토",
      "컴포넌트 패턴 및 Tailwind/shadcn 지원",
    ],
    conflicts: [],
    keywords: [
      "ui", "ux", "프론트", "frontend", "react", "vue", "svelte", "디자인",
      "design", "컴포넌트", "component", "landing", "랜딩", "웹앱", "webapp",
      "tailwind", "shadcn", "모바일", "mobile",
    ],
  },

  // ─────────────────────────────────────────────
  // DevOps
  // ─────────────────────────────────────────────
  docker: {
    id: "docker",
    name: "Docker MCP",
    tag: "DOCK",
    color: "#2496ED",
    category: "devops",
    githubRepo: "docker/docker-mcp",
    desc: "Docker MCP Gateway. 컨테이너화된 MCP 서버를 프로파일로 관리하고 Claude Code에 연결.",
    longDesc:
      "Docker MCP Gateway는 Docker Desktop의 MCP Toolkit을 통해 MCP 서버를 Docker 컨테이너로 실행하고 관리하는 CLI 플러그인이에요. 프로파일 단위로 여러 MCP 서버를 묶어 Claude Code에 한 번에 연결할 수 있고, OAuth 인증 흐름과 시크릿 관리, 동적 툴 디스커버리, 모니터링을 지원해요. Docker Desktop 4.40+ (MCP Toolkit 활성화)가 필요하며, `docker mcp client connect claude-code --profile <profile-id> --global` 명령으로 연결해요.",
    url: "https://github.com/docker/docker-mcp",
    install: [
      "# Docker Desktop 4.40+ 및 MCP Toolkit 활성화 필요",
      "docker mcp catalog pull mcp/docker-mcp-catalog",
      "docker mcp profile create --name dev-tools --server catalog://mcp/docker-mcp-catalog/github",
      "docker mcp client connect claude-code --profile dev-tools --global",
    ],
    features: [
      "컨테이너 기반 MCP 서버 실행 (격리 환경)",
      "프로파일로 멀티 MCP 서버 관리",
      "OAuth 및 시크릿 관리",
      "동적 툴 디스커버리",
      "빌트인 모니터링 및 트레이싱",
    ],
    conflicts: [],
    keywords: [
      "docker", "도커", "컨테이너", "container", "이미지", "image",
      "compose", "쿠버네티스", "kubernetes", "k8s", "마이크로서비스",
      "microservice", "devops", "배포", "deploy",
    ],
  },
  vercel: {
    id: "vercel",
    name: "Vercel MCP",
    tag: "VCL",
    color: "#000000",
    category: "devops",
    // No public GitHub repo — Vercel MCP is a hosted remote server at mcp.vercel.com.
    // @vercel/mcp npm package does NOT exist. githubRepo: null is correct.
    githubRepo: null,
    desc: "Vercel 공식 원격 MCP. 프로젝트 관리, 배포 로그, 문서 검색을 OAuth로 연결.",
    longDesc:
      "Vercel MCP는 Vercel이 공식 호스팅하는 원격 MCP 서버(mcp.vercel.com)예요. OAuth 인증 방식으로 API 키가 필요 없어요. Claude Code에서 `claude mcp add --transport http vercel https://mcp.vercel.com` 명령으로 추가하고, `/mcp`로 인증 후 사용해요. Vercel 문서 검색, 프로젝트 목록 조회, 배포 관리, 배포 로그 분석 등을 지원해요. 공개 GitHub repo가 없으며 vercel.com/docs/agent-resources/vercel-mcp에서 공식 문서를 확인할 수 있어요.",
    url: "https://vercel.com/docs/agent-resources/vercel-mcp",
    install: [
      "claude mcp add --transport http vercel https://mcp.vercel.com",
      "# Claude Code 내에서 /mcp 실행 후 OAuth 로그인",
    ],
    features: [
      "Vercel 문서 검색",
      "프로젝트 목록 조회 및 관리",
      "배포 현황 조회 및 관리",
      "배포 로그 분석",
    ],
    conflicts: [],
    keywords: [
      "vercel", "배포", "deploy", "호스팅", "hosting", "next.js", "nextjs",
      "프리뷰", "preview", "도메인", "domain", "서버리스", "serverless",
      "프론트엔드", "frontend",
    ],
  },
  aws: {
    id: "aws",
    name: "AWS MCP",
    tag: "AWS",
    color: "#FF9900",
    category: "devops",
    githubRepo: "awslabs/mcp",
    desc: "AWS 공식 MCP 서버 모음. S3, Lambda, CDK, EKS, CloudFormation 등 13+ 서비스 지원.",
    longDesc:
      "AWS MCP는 Amazon Labs가 공식 관리하는 MCP 서버 모노레포예요. AWS CDK(인프라 코드), AWS Documentation(문서 검색), Lambda, ECS, EKS, CloudFormation, S3, Bedrock, Cost Explorer, CloudWatch 등 13개 이상의 전문 서버를 제공해요. 각 서버를 필요에 따라 개별 설치할 수 있어요. AWS 인프라를 코드로 관리하거나 문서를 검색할 때 특히 유용해요.",
    url: "https://github.com/awslabs/mcp",
    install: [
      "# AWS CDK 서버 (인프라 관리)",
      "claude mcp add awslabs-cdk -- npx -y @anthropic-ai/awslabs-cdk-mcp-server",
      "# AWS Documentation 서버 (문서 검색)",
      "claude mcp add awslabs-docs -- npx -y @anthropic-ai/awslabs-documentation-mcp-server",
    ],
    features: [
      "AWS CDK 인프라 코드 생성/관리",
      "AWS 공식 문서 검색",
      "Lambda/ECS/EKS 서비스 관리",
      "CloudFormation 스택 조회",
      "Cost Explorer 비용 분석",
    ],
    conflicts: [],
    keywords: [
      "aws", "아마존", "amazon", "s3", "lambda", "ec2", "ecs", "eks",
      "cloudformation", "cdk", "인프라", "infrastructure", "클라우드",
      "cloud", "서버", "server", "배포", "deploy", "devops",
    ],
  },
  atlassian: {
    id: "atlassian",
    name: "Atlassian MCP",
    tag: "JIRA",
    color: "#0052CC",
    category: "workflow",
    githubRepo: "sooperset/mcp-atlassian",
    desc: "Jira + Confluence 통합 MCP. JQL 검색, 이슈/스프린트 관리, 위키 페이지 조회/편집.",
    longDesc:
      "Atlassian MCP는 Jira와 Confluence를 Claude Code에서 직접 사용할 수 있게 해주는 MCP 서버예요. 72개 이상의 도구를 제공하며, Jira에서 JQL 검색, 이슈 생성/수정, 스프린트 관리를 하고, Confluence에서 페이지 검색/생성/편집을 할 수 있어요. Cloud와 Server/Data Center 모두 지원해요. 팀 프로젝트 관리와 문서화를 Claude Code 안에서 한번에 처리할 때 유용해요.",
    url: "https://github.com/sooperset/mcp-atlassian",
    install: [
      "claude mcp add atlassian -- uvx mcp-atlassian --jira-url https://your-domain.atlassian.net --jira-email your@email.com --jira-token YOUR_API_TOKEN --confluence-url https://your-domain.atlassian.net/wiki --confluence-email your@email.com --confluence-token YOUR_API_TOKEN",
    ],
    features: [
      "Jira JQL 검색 및 이슈 관리",
      "스프린트/보드 조회 및 관리",
      "Confluence 페이지 검색/생성/편집",
      "Cloud + Server/Data Center 지원",
    ],
    conflicts: [],
    keywords: [
      "jira", "지라", "confluence", "컨플루언스", "atlassian", "아틀라시안",
      "이슈", "issue", "스프린트", "sprint", "티켓", "ticket", "보드",
      "board", "위키", "wiki", "프로젝트 관리", "project management",
      "애자일", "agile", "스크럼", "scrum", "칸반", "kanban",
    ],
  },
  browserbase: {
    id: "browserbase",
    name: "Browserbase MCP",
    tag: "BB",
    color: "#FF6B35",
    category: "testing",
    githubRepo: "browserbase/mcp-server-browserbase",
    desc: "클라우드 브라우저 자동화. Stagehand 기반으로 웹 탐색, 스크린샷, 데이터 추출 지원.",
    longDesc:
      "Browserbase MCP는 클라우드 호스팅 브라우저를 통해 웹 자동화를 제공하는 MCP 서버예요. Stagehand AI 프레임워크 기반으로 페이지 탐색, 스크린샷 캡처, 데이터 추출, 폼 입력을 지원해요. 로컬 브라우저 없이도 브라우저 테스트를 할 수 있어서 CI/CD 환경이나 서버에서 특히 유용해요. Playwright/Puppeteer와 달리 관리형 클라우드 브라우저를 사용해요.",
    url: "https://github.com/browserbase/mcp-server-browserbase",
    install: [
      "claude mcp add browserbase -- npx -y @browserbasehq/mcp-server-browserbase",
    ],
    features: [
      "클라우드 브라우저 세션 관리",
      "AI 기반 웹 페이지 탐색 (Stagehand)",
      "스크린샷 캡처 및 데이터 추출",
      "로컬 브라우저 설치 불필요",
    ],
    conflicts: [],
    keywords: [
      "browser", "브라우저", "자동화", "automation", "스크린샷", "screenshot",
      "크롤링", "crawling", "스크래핑", "scraping", "테스트", "test",
      "e2e", "클라우드", "cloud", "headless",
    ],
  },
  stripe: {
    id: "stripe",
    name: "Stripe MCP",
    tag: "PAY",
    color: "#635BFF",
    category: "integration",
    githubRepo: "stripe/agent-toolkit",
    desc: "Stripe 공식 MCP. 결제, 구독, 고객, 환불 관리 및 문서 검색.",
    longDesc:
      "Stripe MCP는 Stripe이 공식 제공하는 MCP 서버예요. 결제 처리, 고객 관리, 구독 생성/관리, 환불 처리, 인보이스 관리, Stripe 문서 검색을 Claude Code에서 직접 수행할 수 있어요. OAuth 기반 원격 MCP(mcp.stripe.com)와 로컬 설치 모두 지원해요. SaaS나 이커머스 프로젝트에서 결제 기능을 구현할 때 필수적이에요.",
    url: "https://github.com/stripe/agent-toolkit",
    install: [
      "# 원격 MCP (OAuth, API 키 불필요)",
      "claude mcp add --transport http stripe https://mcp.stripe.com",
      "# 로컬 설치 (API 키 필요)",
      "claude mcp add stripe -- npx -y @stripe/mcp --tools=all --api-key=YOUR_STRIPE_SECRET_KEY",
    ],
    features: [
      "결제 및 구독 관리",
      "고객/인보이스 조회",
      "환불 처리",
      "Stripe 문서 검색",
    ],
    conflicts: [],
    keywords: [
      "stripe", "스트라이프", "결제", "payment", "구독", "subscription",
      "인보이스", "invoice", "환불", "refund", "이커머스", "ecommerce",
      "saas", "billing", "빌링", "카드", "card",
    ],
  },
  neon: {
    id: "neon",
    name: "Neon MCP",
    tag: "NEON",
    color: "#00E599",
    category: "data",
    githubRepo: "neondatabase/mcp-server-neon",
    desc: "Neon 서버리스 Postgres MCP. 브랜치 관리, 마이그레이션 실행, SQL 쿼리 지원.",
    longDesc:
      "Neon MCP는 서버리스 Postgres 플랫폼인 Neon의 공식 MCP 서버예요. 데이터베이스 브랜치 생성/관리, SQL 마이그레이션 실행, 스키마 조회, 쿼리 실행을 Claude Code에서 직접 수행할 수 있어요. Neon의 핵심 기능인 브랜칭(Git처럼 DB를 브랜치로 관리)을 활용하면 개발/스테이징 환경을 빠르게 만들 수 있어요. Next.js + Vercel 스택과 특히 잘 맞아요.",
    url: "https://github.com/neondatabase/mcp-server-neon",
    install: [
      "claude mcp add neon -- npx -y neon-mcp-server --apiKey YOUR_NEON_API_KEY",
    ],
    features: [
      "서버리스 Postgres 데이터베이스 관리",
      "브랜치 생성/삭제 (Git-like DB 관리)",
      "SQL 마이그레이션 실행",
      "스키마 조회 및 쿼리 실행",
    ],
    conflicts: [],
    keywords: [
      "neon", "네온", "postgres", "postgresql", "서버리스", "serverless",
      "데이터베이스", "database", "db", "브랜치", "branch", "마이그레이션",
      "migration", "sql", "쿼리", "query",
    ],
  },
  "desktop-commander": {
    id: "desktop-commander",
    name: "Desktop Commander",
    tag: "CMD",
    color: "#4A9EFF",
    category: "devops",
    githubRepo: "wonderwhy-er/DesktopCommanderMCP",
    desc: "터미널 제어, diff 편집, 파일 검색, 인메모리 코드 실행을 제공하는 데스크톱 MCP.",
    longDesc:
      "Desktop Commander는 Claude에게 터미널과 파일시스템 전체 제어를 제공하는 MCP 서버예요. 장기 실행 프로세스 관리, diff 기반 파일 편집, 파일/디렉토리 검색, Python/Node.js 인메모리 코드 실행을 지원해요. Claude Desktop 사용자에게 특히 유용하며, 로컬 개발 환경에서 빌드/테스트/배포 프로세스를 직접 관리할 때 강력해요.",
    url: "https://github.com/wonderwhy-er/DesktopCommanderMCP",
    install: [
      "claude mcp add desktop-commander -- npx -y @anthropic-ai/desktop-commander-mcp",
    ],
    features: [
      "터미널 명령 실행 및 프로세스 관리",
      "diff 기반 정밀 파일 편집",
      "파일/디렉토리 검색",
      "Python/Node.js 인메모리 실행",
    ],
    conflicts: ["filesystem"],
    keywords: [
      "터미널", "terminal", "커맨드", "command", "프로세스", "process",
      "파일", "file", "디렉토리", "directory", "실행", "execute",
      "데스크톱", "desktop", "시스템", "system",
    ],
  },
  cloudflare: {
    id: "cloudflare",
    name: "Cloudflare MCP",
    tag: "CF",
    color: "#F38020",
    category: "devops",
    githubRepo: "cloudflare/mcp-server-cloudflare",
    desc: "Cloudflare 원격 MCP 서버 모음. Workers, KV, R2, D1, 관찰성, Radar 등 15개+ 서버.",
    longDesc:
      "Cloudflare MCP는 Cloudflare가 공식 운영하는 원격 MCP 서버 모음이에요. OAuth 인증 방식으로 API 키가 필요 없어요. workers-bindings(KV/R2/D1/Workers/Hyperdrive), workers-builds, observability(로그/애널리틱스), radar(인터넷 트래픽 인사이트), docs, browser-rendering, logpush, ai-gateway, autorag, audit-logs, dns-analytics, DEX, CASB, GraphQL 등 15개+ 전문 서버를 제공해요. mcp-remote를 통해 연결하며, Claude Code에서 원격 MCP URL로 추가해요.",
    url: "https://github.com/cloudflare/mcp-server-cloudflare",
    install: [
      "# Workers Bindings 서버 (KV/R2/D1/Workers 관리)",
      "claude mcp add --transport http cloudflare-bindings https://bindings.mcp.cloudflare.com/mcp",
      "# Observability 서버 (로그/애널리틱스)",
      "claude mcp add --transport http cloudflare-observability https://observability.mcp.cloudflare.com/mcp",
    ],
    features: [
      "Workers 배포 및 코드 조회",
      "KV/R2/D1/Hyperdrive 관리",
      "로그 및 애널리틱스 관찰성",
      "Radar 인터넷 트래픽 인사이트",
      "브라우저 렌더링 및 스크린샷",
    ],
    conflicts: [],
    keywords: [
      "cloudflare", "클라우드플레어", "workers", "엣지", "edge", "cdn",
      "kv", "r2", "d1", "서버리스", "serverless", "글로벌", "global",
      "캐시", "cache",
    ],
  },
};

export const PLUGINS: Record<string, Plugin> = Object.fromEntries(
  Object.entries(CORE_PLUGINS).map(([id, plugin]) => [
    id,
    {
      ...DEFAULT_PLUGIN_FIELDS,
      ...PLUGIN_FIELD_OVERRIDES[id],
      ...plugin,
    },
  ])
) as Record<string, Plugin>;


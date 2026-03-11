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
    verificationStatus: "partial",
    bestFor: ["장기 프로젝트", "멀티 에이전트 자동화"],
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
    bestFor: ["웹앱 QA", "브라우저 테스트"],
  },
  security: {
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "beginner",
    bestFor: ["인증/결제 앱", "보안 점검"],
  },
  firecrawl: {
    officialStatus: "official",
    installMode: "external-setup",
    requiredSecrets: ["Firecrawl API key"],
    bestFor: ["웹 데이터 수집", "크롤링 자동화"],
  },
  exa: {
    officialStatus: "official",
    installMode: "external-setup",
    requiredSecrets: ["Exa API key"],
    bestFor: ["기술 조사", "시맨틱 검색"],
  },
  tavily: {
    officialStatus: "official",
    installMode: "external-setup",
    requiredSecrets: ["Tavily API key"],
  },
  perplexity: {
    officialStatus: "official",
    installMode: "external-setup",
    requiredSecrets: ["Perplexity API key"],
  },
  "brave-search": {
    officialStatus: "official",
    installMode: "external-setup",
    requiredSecrets: ["Brave Search API key"],
  },
  vercel: {
    officialStatus: "official",
    installMode: "external-setup",
    requiredSecrets: ["Vercel account access"],
    bestFor: ["Next.js 배포", "프리뷰 배포"],
  },
  supabase: {
    officialStatus: "official",
    installMode: "external-setup",
    requiredSecrets: ["Supabase project access"],
    bestFor: ["백엔드 시작", "Auth + DB 구축"],
  },
  github: {
    officialStatus: "official",
    installMode: "external-setup",
    requiredSecrets: ["GitHub token"],
  },
  slack: {
    officialStatus: "official",
    installMode: "external-setup",
    requiredSecrets: ["Slack workspace token"],
  },
  sentry: {
    officialStatus: "official",
    installMode: "external-setup",
    requiredSecrets: ["Sentry auth token"],
  },
  notion: {
    officialStatus: "official",
    installMode: "external-setup",
    requiredSecrets: ["Notion integration token"],
  },
  figma: {
    officialStatus: "official",
    difficulty: "advanced",
    installMode: "external-setup",
    verificationStatus: "partial",
    requiredSecrets: ["Figma API key"],
  },
  cloudflare: {
    officialStatus: "official",
    difficulty: "advanced",
    installMode: "external-setup",
    requiredSecrets: ["Cloudflare API token"],
  },
  docker: {
    officialStatus: "official",
    difficulty: "advanced",
    installMode: "external-setup",
    prerequisites: ["Docker Desktop 또는 Docker Engine"],
  },
  postgres: {
    difficulty: "advanced",
    installMode: "manual-required",
    prerequisites: ["접속할 PostgreSQL 연결 문자열"],
    requiredSecrets: ["Database connection string"],
    bestFor: ["로컬 DB 디버깅", "SQL 검증"],
    avoidFor: ["Claude Code 첫 사용"],
  },
  filesystem: {
    difficulty: "advanced",
    installMode: "manual-required",
    prerequisites: ["접근 허용 디렉토리 경로"],
    bestFor: ["파일 자동화", "샌드박스 작업"],
    avoidFor: ["입문자 기본 세팅"],
  },
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
    verificationStatus: "partial",
    difficulty: "intermediate",
    installMode: "manual-required",
    prerequisites: ["Git으로 저장소를 내려받고 ~/.claude/agents 에 복사하거나 install.sh 실행"],
    bestFor: ["역할 분리된 AI 팀", "전문가 페르소나 기반 협업"],
    avoidFor: ["원클릭 스타터 세팅", "설치 직후 가장 첫 플러그인"],
  },
  "sequential-thinking": {
    difficulty: "advanced",
    bestFor: ["복잡한 추론", "아키텍처 검토"],
    avoidFor: ["첫 세팅 직후 바로 쓰는 흐름"],
  },
  linear: {
    installMode: "external-setup",
    requiredSecrets: ["Linear API access"],
  },
  todoist: {
    installMode: "external-setup",
    requiredSecrets: ["Todoist API token"],
  },
  memory: {
    difficulty: "intermediate",
    bestFor: ["장기 프로젝트", "세션 간 컨텍스트 유지"],
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
    desc: "32개 전문 에이전트, 멀티에이전트 오케스트레이션. 복잡한 장기 프로젝트의 핵심.",
    longDesc:
      "Oh My ClaudeCode(OMC)는 Claude Code를 멀티에이전트 오케스트레이션 시스템으로 확장하는 플러그인이에요. 32개의 전문 에이전트와 40개 이상의 스킬을 제공하며, 복잡한 작업을 자동으로 병렬 분산 처리해요. autopilot, ralph, ultrawork 등 다양한 실행 모드를 지원하고, Codex · Gemini 같은 외부 AI와도 연동할 수 있어요.",
    url: "https://github.com/Yeachan-Heo/oh-my-claudecode",
    install: [
      "/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode",
      "/plugin install oh-my-claudecode",
      "/oh-my-claudecode:omc-setup",
    ],
    features: [
      "32개 전문 에이전트",
      "자율 실행 모드",
      "Codex/Gemini 연동",
      "토큰 최적화 라우팅",
    ],
    conflicts: ["superpowers"],
    keywords: [
      "게임", "unity", "신규 서비스", "새 서비스", "멀티에이전트", "대규모",
      "팀", "complex", "multi", "백엔드", "backend", "full stack", "풀스택",
      "saas", "플랫폼", "platform", "orchestrat",
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
    desc: "프론트엔드, 백엔드, 마케팅, PM 등 역할별 AI 전문가 에이전트 묶음. 팀처럼 역할을 나눠 쓰고 싶을 때 좋아요.",
    longDesc:
      "The Agency는 Claude Code에서 참고하거나 설치해서 쓸 수 있는 역할별 AI 전문가 에이전트 모음이에요. 프론트엔드, 백엔드, 디자인, 마케팅, 프로젝트 관리, 테스트, 지원 등 여러 분야의 에이전트가 정리돼 있어서, 하나의 범용 프롬프트보다 역할을 분리해 작업하고 싶은 팀이나 고급 사용자에게 잘 맞아요. 다만 플러그인 마켓 한 줄 설치보다는 파일 복사나 스크립트 실행이 필요해서 수동 설정 성격이 강해요.",
    url: "https://github.com/msitarzewski/agency-agents",
    install: [
      "git clone https://github.com/msitarzewski/agency-agents.git",
      "cd agency-agents",
      "./scripts/install.sh --tool claude-code",
    ],
    features: [
      "61개+ 전문 에이전트",
      "역할별 페르소나",
      "멀티툴 설치 스크립트",
      "마케팅/PM/디자인까지 확장",
    ],
    conflicts: [],
    keywords: [
      "agency", "agents", "specialist", "specialists", "frontend", "backend",
      "marketing", "project management", "pm", "design", "testing", "team",
      "persona", "workflow", "orchestrator", "multi-agent", "roster",
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
  ralph: {
    id: "ralph",
    name: "Ralph Loop",
    tag: "RALPH",
    color: "#10B981",
    category: "workflow",
    githubRepo: "haizelabs/ralph-wiggum",
    desc: "자율 코딩 루프. PRD 완료까지 반복 실행 후 git 커밋 자동 처리.",
    longDesc:
      "Ralph Loop는 Claude Code가 PRD나 태스크 목록을 스스로 처리할 때까지 자율적으로 반복 실행하는 플러그인이에요. 각 반복마다 구현 → 검증 → 커밋을 자동으로 수행하고, 작업이 완료되면 깔끔한 git 히스토리를 남겨줘요. CRUD 구현, 마이그레이션, 테스트 커버리지 향상 같은 반복 작업에 특히 유용해요.",
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
    desc: "복잡한 문제를 단계별로 분해해서 사고. 아키텍처 설계와 디버깅에 강력.",
    longDesc:
      "Sequential Thinking MCP는 복잡한 문제를 순차적 사고 단계로 분해해서 처리하는 서버예요. 각 단계에서 가설을 세우고, 검증하고, 수정하는 과정을 체계적으로 진행해요. 아키텍처 설계, 복잡한 버그 추적, 알고리즘 최적화 같은 깊은 사고가 필요한 작업에서 Claude의 추론 품질을 크게 향상시켜요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking",
    install: [
      "claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking",
    ],
    features: [
      "단계별 사고 분해",
      "가설-검증 루프",
      "아키텍처 설계 지원",
      "복잡한 디버깅",
    ],
    conflicts: [],
    keywords: [
      "사고", "thinking", "추론", "reasoning", "아키텍처", "architecture",
      "설계", "design", "디버깅", "debug", "복잡", "complex", "분석",
      "analysis", "알고리즘", "algorithm",
    ],
  },
  todoist: {
    id: "todoist",
    name: "Todoist MCP",
    tag: "TODO",
    color: "#E44332",
    category: "workflow",
    githubRepo: "abhiz123/todoist-mcp-server",
    desc: "Todoist 연동으로 개발 태스크를 실시간 관리. 할 일 추적의 정석.",
    longDesc:
      "Todoist MCP는 인기 있는 할 일 관리 앱 Todoist를 Claude Code와 연동해주는 서버예요. 개발 중 발견한 TODO 항목을 바로 Todoist에 추가하고, 프로젝트별로 분류하고, 마감일과 우선순위를 설정할 수 있어요. 코딩하면서 태스크 관리를 동시에 하고 싶을 때 편리해요.",
    url: "https://github.com/abhiz123/todoist-mcp-server",
    install: [
      "claude mcp add todoist -- npx -y todoist-mcp-server",
    ],
    features: [
      "태스크 자동 생성",
      "프로젝트별 분류",
      "우선순위 관리",
      "마감일 설정",
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
    githubRepo: "jerhadf/linear-mcp-server",
    desc: "Linear 이슈 관리 연동. 이슈 생성, 상태 변경, 스프린트 관리 자동화.",
    longDesc:
      "Linear MCP는 Linear 프로젝트 관리 도구를 Claude Code에서 직접 사용할 수 있게 해주는 서버예요. 코딩 중 이슈를 생성하고, 상태를 업데이트하고, 스프린트를 관리할 수 있어요. 팀 프로젝트에서 개발과 프로젝트 관리를 하나의 흐름으로 연결해서 컨텍스트 전환을 줄여줘요.",
    url: "https://github.com/jerhadf/linear-mcp-server",
    install: [
      "claude mcp add linear -- npx -y linear-mcp-server",
    ],
    features: [
      "이슈 생성/관리",
      "스프린트 관리",
      "상태 자동 업데이트",
      "팀 워크플로 연동",
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
      "지식 그래프 저장",
      "세션 간 컨텍스트 유지",
      "자동 엔티티 추출",
      "관계 기반 검색",
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
    githubRepo: "modelcontextprotocol/servers",
    desc: "Chrome 기반 브라우저 자동화. 스크린샷, PDF 생성, 폼 테스트에 특화.",
    longDesc:
      "Puppeteer MCP는 Google의 Puppeteer를 Claude Code와 연동해서 Chrome 브라우저를 프로그래밍 방식으로 제어할 수 있게 해줘요. 웹 페이지 스크린샷 캡처, PDF 생성, 폼 자동 입력, 네트워크 요청 가로채기 등을 지원해요. Chrome DevTools Protocol을 직접 활용하기 때문에 Chrome에 특화된 기능을 더 깊게 사용할 수 있어요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer",
    install: [
      "claude mcp add puppeteer -- npx -y @modelcontextprotocol/server-puppeteer",
    ],
    features: [
      "Chrome 브라우저 제어",
      "스크린샷/PDF 생성",
      "네트워크 인터셉트",
      "콘솔 로그 모니터링",
    ],
    conflicts: ["playwright"],
    keywords: [
      "puppeteer", "chrome", "브라우저", "browser", "스크린샷", "screenshot",
      "pdf", "테스트", "test", "자동화", "automation", "헤드리스", "headless",
      "크롬",
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
    desc: "Notion 페이지/DB 직접 조작. 문서화와 위키 관리를 코드와 연결.",
    longDesc:
      "Notion MCP는 Notion 워크스페이스를 Claude Code에서 직접 조작할 수 있게 해주는 서버예요. 페이지 생성/수정, 데이터베이스 쿼리, 댓글 추가 등을 코딩 흐름 안에서 바로 할 수 있어요. 개발 문서, 회의록, 기술 위키를 코드와 동기화해서 관리할 때 특히 유용해요.",
    url: "https://github.com/makenotion/notion-mcp-server",
    install: [
      "claude mcp add notion -- npx -y @notionhq/notion-mcp-server",
    ],
    features: [
      "페이지 CRUD",
      "데이터베이스 쿼리",
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
      "Firecrawl은 웹 데이터 수집과 스크래핑을 자동화해주는 플러그인이에요. 단순 HTML 파싱부터 JavaScript 렌더링이 필요한 동적 페이지까지 처리할 수 있어요. 가격 모니터링, 뉴스 수집, 데이터 파이프라인 구축 같은 크롤링 기반 서비스 개발에 필수예요.",
    url: "https://firecrawl.dev",
    install: [
      "/plugin marketplace add firecrawl",
      "/plugin install firecrawl@firecrawl-plugins",
    ],
    features: [
      "동적 페이지 크롤링",
      "데이터 추출",
      "파이프라인 구축",
      "스케줄링",
    ],
    conflicts: [],
    keywords: [
      "크롤링", "crawl", "스크래핑", "scraping", "웹 데이터", "수집",
      "collect", "파싱", "parse", "뉴스", "news", "가격", "price", "모니터링",
      "monitoring",
    ],
  },
  "brave-search": {
    id: "brave-search",
    name: "Brave Search MCP",
    tag: "BRV",
    color: "#FB542B",
    category: "data",
    githubRepo: "modelcontextprotocol/servers",
    desc: "Brave 검색 엔진 연동. 실시간 웹 검색으로 최신 정보 접근.",
    longDesc:
      "Brave Search MCP는 Brave의 프라이버시 중심 검색 엔진을 Claude Code에서 사용할 수 있게 해주는 서버예요. 웹 검색과 로컬 검색 두 가지 모드를 제공하고, 실시간으로 최신 정보를 가져올 수 있어요. API 문서, 에러 메시지 검색, 최신 기술 트렌드 파악에 유용해요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search",
    install: [
      "claude mcp add brave-search -- npx -y @modelcontextprotocol/server-brave-search",
    ],
    features: [
      "실시간 웹 검색",
      "로컬 검색 지원",
      "프라이버시 중심",
      "풍부한 검색 결과",
    ],
    conflicts: ["tavily"],
    keywords: [
      "검색", "search", "웹", "web", "실시간", "realtime", "최신",
      "latest", "정보", "information", "brave", "트렌드", "trend",
      "리서치", "research",
    ],
  },
  exa: {
    id: "exa",
    name: "Exa MCP",
    tag: "EXA",
    color: "#4F46E5",
    category: "data",
    githubRepo: "exa-labs/exa-mcp-server",
    desc: "AI 특화 시맨틱 검색. 의미 기반으로 가장 관련 높은 정보를 찾아줌.",
    longDesc:
      "Exa MCP는 AI 특화 시맨틱 검색 엔진을 Claude Code와 연동해주는 서버예요. 키워드 매칭이 아닌 의미 기반 검색이라 자연어 질문에 대해 가장 관련 높은 결과를 반환해요. 기술 블로그, 논문, 코드 예제, API 문서 등을 효과적으로 찾아서 개발 속도를 높여줘요.",
    url: "https://github.com/exa-labs/exa-mcp-server",
    install: [
      "claude mcp add exa -- npx -y exa-mcp-server",
    ],
    features: [
      "시맨틱 검색",
      "자연어 쿼리",
      "콘텐츠 하이라이트",
      "카테고리 필터",
    ],
    conflicts: [],
    keywords: [
      "검색", "search", "시맨틱", "semantic", "ai 검색", "논문", "paper",
      "블로그", "blog", "리서치", "research", "정보 수집", "인사이트",
      "insight",
    ],
  },
  tavily: {
    id: "tavily",
    name: "Tavily MCP",
    tag: "TAV",
    color: "#0D9488",
    category: "data",
    githubRepo: "tavily-ai/tavily-mcp",
    desc: "AI 에이전트용 검색 API. 실시간 웹 검색과 요약을 동시에 제공.",
    longDesc:
      "Tavily MCP는 AI 에이전트에 최적화된 검색 API를 Claude Code와 연동해주는 서버예요. 일반 검색과 달리 검색 결과를 자동으로 요약해서 반환하고, 소스 URL과 신뢰도를 함께 제공해요. RAG 시스템 구축, 팩트 체크, 경쟁사 분석 등에 활용할 수 있어요.",
    url: "https://github.com/tavily-ai/tavily-mcp",
    install: [
      "claude mcp add tavily -- npx -y tavily-mcp@latest",
    ],
    features: [
      "검색 + 자동 요약",
      "소스 신뢰도 평가",
      "심층 검색 모드",
      "AI 에이전트 최적화",
    ],
    conflicts: ["brave-search"],
    keywords: [
      "검색", "search", "요약", "summary", "rag", "팩트 체크", "fact",
      "웹", "web", "리서치", "research", "실시간", "realtime", "정보",
      "information",
    ],
  },
  perplexity: {
    id: "perplexity",
    name: "Perplexity MCP",
    tag: "PPLX",
    color: "#22B8CF",
    category: "data",
    githubRepo: "ppl-ai/modelcontextprotocol",
    desc: "AI 리서치 엔진 연동. 소스 기반 답변으로 정확한 기술 조사 지원.",
    longDesc:
      "Perplexity MCP는 AI 기반 리서치 엔진 Perplexity를 Claude Code에서 사용할 수 있게 해주는 서버예요. 기술 질문에 대해 소스를 인용하면서 답변해주고, 최신 정보를 실시간으로 반영해요. 새로운 라이브러리 조사, 기술 비교 분석, 베스트 프랙티스 탐색에 특히 유용해요.",
    url: "https://github.com/ppl-ai/modelcontextprotocol",
    install: [
      "claude mcp add perplexity -- npx -y perplexity-mcp@latest",
    ],
    features: [
      "소스 기반 답변",
      "실시간 정보 반영",
      "기술 비교 분석",
      "인용 링크 제공",
    ],
    conflicts: [],
    keywords: [
      "perplexity", "리서치", "research", "조사", "investigate", "비교",
      "compare", "최신 정보", "latest", "소스", "source", "인용",
      "citation", "기술 조사",
    ],
  },
  postgres: {
    id: "postgres",
    name: "PostgreSQL MCP",
    tag: "PG",
    color: "#336791",
    category: "data",
    githubRepo: "modelcontextprotocol/servers",
    desc: "PostgreSQL DB 직접 연결. 스키마 조회, 쿼리 실행, 데이터 분석.",
    longDesc:
      "PostgreSQL MCP는 PostgreSQL 데이터베이스를 Claude Code에서 직접 조작할 수 있게 해주는 서버예요. 스키마 조회, SQL 쿼리 실행, 데이터 분석을 코딩 흐름 안에서 바로 할 수 있어요. 마이그레이션 작성, 쿼리 최적화, 데이터 모델링에 특히 유용하고, 읽기 전용 모드로 안전하게 사용할 수 있어요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
    install: [
      "claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres postgresql://localhost:5432/mydb",
    ],
    features: [
      "스키마 자동 조회",
      "SQL 쿼리 실행",
      "읽기 전용 모드",
      "다중 DB 연결",
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
    desc: "Sentry 에러 트래킹 연동. 실시간 에러 분석과 디버깅 자동화.",
    longDesc:
      "Sentry MCP는 에러 트래킹 플랫폼 Sentry를 Claude Code와 연동해주는 서버예요. 프로덕션 에러를 실시간으로 확인하고, 스택 트레이스를 분석하고, 근본 원인을 파악할 수 있어요. 에러 패턴을 자동으로 분류하고, 관련 코드를 바로 찾아서 수정 방안을 제안해줘요.",
    url: "https://github.com/getsentry/sentry-mcp",
    install: [
      "claude mcp add sentry -- npx -y @sentry/mcp-server",
    ],
    features: [
      "실시간 에러 조회",
      "스택 트레이스 분석",
      "에러 패턴 분류",
      "자동 수정 제안",
    ],
    conflicts: [],
    keywords: [
      "sentry", "에러", "error", "버그", "bug", "트래킹", "tracking",
      "모니터링", "monitoring", "프로덕션", "production", "스택 트레이스",
      "stacktrace", "크래시", "crash",
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
    githubRepo: "modelcontextprotocol/servers",
    desc: "GitHub API 완전 연동. PR, 이슈, 코드 리뷰, 리포 관리 자동화.",
    longDesc:
      "GitHub MCP는 GitHub의 전체 API를 Claude Code에서 사용할 수 있게 해주는 서버예요. PR 생성/리뷰, 이슈 관리, 파일 검색, 브랜치 관리, 릴리스 생성 등 GitHub의 모든 기능을 코딩 흐름 안에서 직접 처리할 수 있어요. 오픈소스 프로젝트 관리나 팀 개발 워크플로에 필수예요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
    install: [
      "claude mcp add github -- npx -y @modelcontextprotocol/server-github",
    ],
    features: [
      "PR 생성/리뷰",
      "이슈 관리",
      "코드 검색",
      "브랜치/릴리스 관리",
    ],
    conflicts: [],
    keywords: [
      "github", "깃허브", "pr", "pull request", "이슈", "issue", "코드 리뷰",
      "code review", "오픈소스", "open source", "리포", "repo", "브랜치",
      "branch", "git",
    ],
  },
  slack: {
    id: "slack",
    name: "Slack MCP",
    tag: "SLK",
    color: "#4A154B",
    category: "integration",
    githubRepo: "modelcontextprotocol/servers",
    desc: "Slack 채널/메시지 연동. 알림 전송, 채널 검색, 팀 소통 자동화.",
    longDesc:
      "Slack MCP는 Slack 워크스페이스를 Claude Code에서 직접 사용할 수 있게 해주는 서버예요. 채널 메시지 읽기/쓰기, 스레드 관리, 사용자 검색, 파일 공유 등을 지원해요. 배포 알림, 에러 리포트, 코드 리뷰 요청을 자동으로 Slack에 전송할 수 있어서 팀 커뮤니케이션을 개발 프로세스에 통합해요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack",
    install: [
      "claude mcp add slack -- npx -y @modelcontextprotocol/server-slack",
    ],
    features: [
      "채널 메시지 관리",
      "스레드 읽기/쓰기",
      "사용자 검색",
      "배포 알림 자동화",
    ],
    conflicts: [],
    keywords: [
      "slack", "슬랙", "메시지", "message", "채널", "channel", "알림",
      "notification", "팀", "team", "소통", "communication", "협업",
      "collaboration",
    ],
  },
  filesystem: {
    id: "filesystem",
    name: "Filesystem MCP",
    tag: "FS",
    color: "#78716C",
    category: "integration",
    githubRepo: "modelcontextprotocol/servers",
    desc: "안전한 파일 시스템 접근. 디렉토리 탐색, 파일 읽기/쓰기, 검색.",
    longDesc:
      "Filesystem MCP는 파일 시스템을 안전하게 접근할 수 있게 해주는 서버예요. 지정된 디렉토리 내에서만 작동하는 샌드박스 방식이라 보안이 보장돼요. 파일 읽기/쓰기, 디렉토리 생성, 파일 검색, 메타데이터 조회 등을 지원해요. 로컬 파일 처리가 많은 자동화 작업에 유용해요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
    install: [
      "claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/allowed/dir",
    ],
    features: [
      "샌드박스 파일 접근",
      "디렉토리 탐색",
      "파일 검색",
      "메타데이터 조회",
    ],
    conflicts: [],
    keywords: [
      "파일", "file", "디렉토리", "directory", "폴더", "folder", "읽기",
      "read", "쓰기", "write", "파일 시스템", "filesystem", "로컬",
      "local", "경로", "path",
    ],
  },
  git: {
    id: "git",
    name: "Git MCP",
    tag: "GIT",
    color: "#F05032",
    category: "integration",
    githubRepo: "modelcontextprotocol/servers",
    desc: "Git 저장소 직접 조작. 커밋, 브랜치, diff, 로그 관리 자동화.",
    longDesc:
      "Git MCP는 Git 저장소를 Claude Code에서 프로그래밍 방식으로 조작할 수 있게 해주는 서버예요. 커밋 생성, 브랜치 관리, diff 조회, 로그 검색 등 Git의 핵심 기능을 모두 지원해요. GitHub MCP와 달리 로컬 Git 저장소를 직접 다루기 때문에 오프라인에서도 작동하고, 복잡한 Git 작업 자동화에 적합해요.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/git",
    install: [
      "claude mcp add git -- npx -y @modelcontextprotocol/server-git",
    ],
    features: [
      "로컬 Git 조작",
      "커밋/브랜치 관리",
      "diff 분석",
      "로그 검색",
    ],
    conflicts: [],
    keywords: [
      "git", "깃", "커밋", "commit", "브랜치", "branch", "diff",
      "merge", "로그", "log", "버전 관리", "version control", "리베이스",
      "rebase",
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
    githubRepo: "figma/figma-mcp",
    desc: "Figma 디자인 데이터 직접 접근. 디자인 → 코드 변환 자동화.",
    longDesc:
      "Figma MCP는 Figma의 디자인 데이터를 Claude Code에서 직접 접근할 수 있게 해주는 서버예요. 디자인 파일의 레이아웃, 색상, 타이포그래피, 컴포넌트 구조를 읽어서 정확한 코드로 변환해줘요. 디자이너와 개발자 간의 핸드오프를 자동화하고, 디자인 시스템 일관성을 유지하는 데 필수예요.",
    url: "https://github.com/figma/figma-mcp",
    install: [
      "claude mcp add figma -- npx -y figma-developer-mcp --figma-api-key=YOUR_KEY",
    ],
    features: [
      "디자인 데이터 읽기",
      "디자인 → 코드 변환",
      "스타일 토큰 추출",
      "컴포넌트 구조 분석",
    ],
    conflicts: [],
    keywords: [
      "figma", "피그마", "디자인", "design", "ui", "목업", "mockup",
      "프로토타입", "prototype", "핸드오프", "handoff", "컴포넌트",
      "component", "스타일", "style",
    ],
  },

  // ─────────────────────────────────────────────
  // UI/UX
  // ─────────────────────────────────────────────
  uiux: {
    id: "uiux",
    name: "UI/UX Pro Max",
    tag: "UI",
    color: "#EC4899",
    category: "ui-ux",
    githubRepo: null,
    desc: "디자인 시스템, 컴포넌트, 접근성. 프론트엔드 퀄리티를 끌어올림.",
    longDesc:
      "UI/UX Pro Max는 프론트엔드 개발에 특화된 플러그인이에요. 디자인 시스템 설계, 컴포넌트 구조화, 접근성(a11y) 검토까지 지원해요. React, Vue, Svelte 등 주요 프레임워크와 Tailwind, shadcn/ui 같은 스타일 시스템에 대한 깊은 이해를 제공해요. UI 퀄리티와 사용자 경험을 빠르게 끌어올려야 할 때 필수예요.",
    url: "https://github.com/yourusername/ui-ux-pro-max",
    install: [
      "/plugin marketplace add https://github.com/yourusername/ui-ux-pro-max",
      "/plugin install ui-ux-pro-max",
    ],
    features: [
      "디자인 시스템",
      "접근성 검토",
      "컴포넌트 패턴",
      "Tailwind/shadcn 지원",
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
    desc: "Docker 컨테이너 관리. 빌드, 실행, 로그 조회를 IDE에서 직접.",
    longDesc:
      "Docker MCP는 Docker 컨테이너를 Claude Code에서 직접 관리할 수 있게 해주는 서버예요. 이미지 빌드, 컨테이너 실행/중지, 로그 조회, docker-compose 관리 등을 코딩 흐름 안에서 처리할 수 있어요. 개발 환경 설정, 마이크로서비스 테스트, CI/CD 파이프라인 디버깅에 특히 유용해요.",
    url: "https://github.com/docker/docker-mcp",
    install: [
      "claude mcp add docker -- npx -y @docker/mcp-server",
    ],
    features: [
      "컨테이너 관리",
      "이미지 빌드",
      "로그 실시간 조회",
      "Docker Compose 지원",
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
    githubRepo: null,
    desc: "Vercel 배포 자동화. 프로젝트 관리, 환경변수, 도메인 설정.",
    longDesc:
      "Vercel MCP는 Vercel 배포 플랫폼을 Claude Code와 연동해주는 서버예요. 프로젝트 배포, 환경 변수 관리, 도메인 설정, 배포 로그 조회 등을 코딩 흐름 안에서 직접 처리할 수 있어요. Next.js, SvelteKit 같은 프레임워크의 배포를 자동화하고, 프리뷰 배포로 PR별 테스트 환경을 만들 수 있어요.",
    url: "https://vercel.com/docs/mcp",
    install: [
      "claude mcp add vercel -- npx -y @vercel/mcp",
    ],
    features: [
      "원클릭 배포",
      "환경 변수 관리",
      "프리뷰 배포",
      "배포 로그 조회",
    ],
    conflicts: [],
    keywords: [
      "vercel", "배포", "deploy", "호스팅", "hosting", "next.js", "nextjs",
      "프리뷰", "preview", "도메인", "domain", "서버리스", "serverless",
      "프론트엔드", "frontend",
    ],
  },
  cloudflare: {
    id: "cloudflare",
    name: "Cloudflare MCP",
    tag: "CF",
    color: "#F38020",
    category: "devops",
    githubRepo: "cloudflare/mcp-server-cloudflare",
    desc: "Cloudflare Workers, KV, R2, D1 관리. 엣지 컴퓨팅 개발 필수.",
    longDesc:
      "Cloudflare MCP는 Cloudflare의 엣지 플랫폼을 Claude Code에서 직접 관리할 수 있게 해주는 서버예요. Workers 배포, KV 스토리지, R2 오브젝트 스토리지, D1 SQLite 데이터베이스 등 Cloudflare의 전체 스택을 다룰 수 있어요. 엣지에서 실행되는 고성능 글로벌 서비스를 빠르게 구축할 때 필수예요.",
    url: "https://github.com/cloudflare/mcp-server-cloudflare",
    install: [
      "claude mcp add cloudflare -- npx -y @cloudflare/mcp-server-cloudflare",
    ],
    features: [
      "Workers 배포",
      "KV/R2/D1 관리",
      "엣지 컴퓨팅",
      "글로벌 CDN 설정",
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


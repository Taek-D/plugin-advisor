import type { Plugin } from "./types";

export const PLUGINS: Record<string, Plugin> = {
  omc: {
    id: "omc",
    name: "Oh My ClaudeCode",
    tag: "OMC",
    color: "#FF6B35",
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
  bkit: {
    id: "bkit",
    name: "bkit",
    tag: "BKIT",
    color: "#00D4AA",
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
  superpowers: {
    id: "superpowers",
    name: "Superpowers",
    tag: "SP",
    color: "#7C3AED",
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
  uiux: {
    id: "uiux",
    name: "UI/UX Pro Max",
    tag: "UI",
    color: "#EC4899",
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
  context7: {
    id: "context7",
    name: "Context7",
    tag: "C7",
    color: "#F59E0B",
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
  ralph: {
    id: "ralph",
    name: "Ralph Loop",
    tag: "RALPH",
    color: "#10B981",
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
  repomix: {
    id: "repomix",
    name: "Repomix",
    tag: "REPO",
    color: "#6366F1",
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
  firecrawl: {
    id: "firecrawl",
    name: "Firecrawl",
    tag: "FIRE",
    color: "#EF4444",
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
  playwright: {
    id: "playwright",
    name: "Playwright",
    tag: "PW",
    color: "#059669",
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
    conflicts: [],
    keywords: [
      "e2e", "테스트", "test", "브라우저", "browser", "qa", "품질",
      "quality", "헤드리스", "headless", "자동화 테스트", "검증", "verify",
      "selenium",
    ],
  },
  security: {
    id: "security",
    name: "Security Guidance",
    tag: "SEC",
    color: "#DC2626",
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
};

export const REASONS: Record<string, string> = {
  omc: "복잡한 멀티에이전트 작업이 감지됐어요. 32개 전문 에이전트가 병렬 처리해서 개발 속도를 높여줘요.",
  bkit: "PRD나 설계 기반 개발이 필요한 프로젝트예요. PDCA 워크플로로 계획부터 검증까지 체계적으로 관리해줘요.",
  superpowers:
    "스크립트나 자동화 작업이 포함돼 있어요. 기존 코드를 빠르게 파악하고 수정하는 데 최적화돼 있어요.",
  uiux: "프론트엔드 UI 개발이 핵심인 프로젝트예요. 컴포넌트 퀄리티와 디자인 일관성을 높여줘요.",
  context7:
    "외부 라이브러리나 API를 많이 쓰는 구조예요. 최신 공식 문서를 실시간 주입해서 환각 오류를 줄여줘요.",
  ralph:
    "반복적인 구현 작업이 많은 프로젝트예요. PRD 완료까지 자동 루프로 처리하고 git 히스토리도 깔끔하게 유지해줘요.",
  repomix:
    "대형 코드베이스나 레거시 분석이 필요해요. 전체 코드를 AI 친화적으로 패킹해서 컨텍스트 이해를 높여줘요.",
  firecrawl:
    "웹 데이터 수집이 핵심 기능이에요. 스크래핑 자동화를 간단하게 구현할 수 있어요.",
  playwright:
    "E2E 테스트나 브라우저 자동화가 필요한 프로젝트예요. 웹앱 품질 검증을 자동화해줘요.",
  security:
    "인증, 결제, 개인정보 처리가 포함돼 있어요. 보안 취약점을 실시간 감지해서 안전한 코드를 유지해줘요.",
};

export type FirstRunTip = {
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  command?: string;
};

export type PackTips = {
  tryPrompt: string;
  tryPromptEn: string;
  tips: FirstRunTip[];
};

export const PACK_FIRST_RUN: Record<string, PackTips> = {
  "beginner-essential": {
    tryPrompt: "\"간단한 할 일 관리 웹앱을 만들어줘\"",
    tryPromptEn: "\"Build me a simple todo web app\"",
    tips: [
      {
        title: "Claude Code에 프로젝트 설명하기",
        titleEn: "Describe your project to Claude Code",
        desc: "만들고 싶은 것을 자연어로 설명하면 Claude가 코드를 작성해요.",
        descEn: "Describe what you want to build in natural language and Claude writes the code.",
      },
      {
        title: "bkit Starter로 학습 시작",
        titleEn: "Start learning with bkit Starter",
        desc: "/bkit-starter:learn-claude-code 로 체계적인 학습 커리큘럼을 시작하세요.",
        descEn: "Run /bkit-starter:learn-claude-code to start a structured learning curriculum.",
        command: "/bkit-starter:learn-claude-code",
      },
      {
        title: "Context7로 정확한 코드 작성",
        titleEn: "Write accurate code with Context7",
        desc: "use context7 이라고 말하면 최신 라이브러리 문서를 참조해서 코드를 작성해요.",
        descEn: "Say 'use context7' and Claude will reference latest library docs for accurate code.",
        command: "use context7",
      },
    ],
  },
  "webapp-starter": {
    tryPrompt: "\"Next.js로 블로그 사이트를 만들어줘\"",
    tryPromptEn: "\"Build a blog site with Next.js\"",
    tips: [
      {
        title: "UI 디자인부터 시작",
        titleEn: "Start with UI design",
        desc: "/ui-ux-pro-max 으로 전문적인 디자인 시스템을 자동 생성하세요.",
        descEn: "Use /ui-ux-pro-max to auto-generate a professional design system.",
        command: "/ui-ux-pro-max",
      },
      {
        title: "E2E 테스트 자동화",
        titleEn: "Automate E2E testing",
        desc: "Playwright로 브라우저 테스트를 자동으로 작성하고 실행해요.",
        descEn: "Playwright automatically writes and runs browser tests.",
      },
      {
        title: "Vercel로 바로 배포",
        titleEn: "Deploy instantly with Vercel",
        desc: "코드 작성이 끝나면 Vercel MCP로 원클릭 배포하세요.",
        descEn: "Once coding is done, deploy with one click using Vercel MCP.",
      },
    ],
  },
  "data-research": {
    tryPrompt: "\"경쟁사 웹사이트를 크롤링해서 가격 정보를 수집해줘\"",
    tryPromptEn: "\"Crawl competitor websites and collect pricing data\"",
    tips: [
      {
        title: "Firecrawl로 데이터 수집",
        titleEn: "Collect data with Firecrawl",
        desc: "웹 페이지 URL을 주면 자동으로 데이터를 추출해요.",
        descEn: "Give a web page URL and it automatically extracts data.",
      },
      {
        title: "시맨틱 검색으로 정보 탐색",
        titleEn: "Explore with semantic search",
        desc: "Exa 검색으로 키워드가 아닌 의미 기반 검색을 활용하세요.",
        descEn: "Use Exa search for meaning-based search, not just keywords.",
      },
      {
        title: "코드베이스 분석",
        titleEn: "Analyze codebases",
        desc: "Repomix로 대형 프로젝트를 한 번에 분석할 수 있어요.",
        descEn: "Use Repomix to analyze large projects at once.",
      },
    ],
  },
  "api-backend": {
    tryPrompt: "\"사용자 인증이 포함된 REST API를 만들어줘\"",
    tryPromptEn: "\"Build a REST API with user authentication\"",
    tips: [
      {
        title: "Supabase로 빠른 백엔드 구축",
        titleEn: "Build backend fast with Supabase",
        desc: "DB 스키마, 인증, API를 Supabase MCP로 한 번에 설정하세요.",
        descEn: "Set up DB schema, auth, and API all at once with Supabase MCP.",
      },
      {
        title: "보안 취약점 자동 감지",
        titleEn: "Auto-detect security vulnerabilities",
        desc: "Security Guidance가 코드 작성 중 실시간으로 보안 이슈를 경고해요.",
        descEn: "Security Guidance warns about security issues in real-time while coding.",
      },
      {
        title: "에러 모니터링 설정",
        titleEn: "Set up error monitoring",
        desc: "Sentry MCP로 프로덕션 에러를 실시간으로 추적하세요.",
        descEn: "Track production errors in real-time with Sentry MCP.",
      },
    ],
  },
  productivity: {
    tryPrompt: "\"이 PRD를 분석해서 태스크로 분해해줘\"",
    tryPromptEn: "\"Analyze this PRD and break it into tasks\"",
    tips: [
      {
        title: "Taskmaster로 작업 관리",
        titleEn: "Manage tasks with Taskmaster",
        desc: "PRD를 입력하면 자동으로 세부 태스크와 의존성을 관리해줘요.",
        descEn: "Input a PRD and it auto-manages subtasks and dependencies.",
      },
      {
        title: "Notion과 문서 동기화",
        titleEn: "Sync docs with Notion",
        desc: "개발 문서와 회의록을 Notion에 자동으로 기록해요.",
        descEn: "Automatically record dev docs and meeting notes in Notion.",
      },
      {
        title: "Slack 알림 자동화",
        titleEn: "Automate Slack notifications",
        desc: "배포 완료, 에러 발생 시 Slack으로 자동 알림을 보내세요.",
        descEn: "Send automatic Slack notifications for deploys and errors.",
      },
    ],
  },
  "fullstack-pro": {
    tryPrompt: "\"풀스택 SaaS 대시보드를 만들어줘\"",
    tryPromptEn: "\"Build a fullstack SaaS dashboard\"",
    tips: [
      {
        title: "OMC 멀티에이전트 활용",
        titleEn: "Leverage OMC multi-agent",
        desc: "/autopilot 으로 전체 프로젝트를 자율적으로 구축할 수 있어요.",
        descEn: "Use /autopilot to autonomously build the entire project.",
        command: "/autopilot",
      },
      {
        title: "프론트엔드 + 백엔드 동시 개발",
        titleEn: "Develop frontend + backend simultaneously",
        desc: "UI/UX Pro Max로 프론트, Supabase로 백엔드를 동시에 구축하세요.",
        descEn: "Build frontend with UI/UX Pro Max and backend with Supabase simultaneously.",
      },
      {
        title: "배포 전 보안 검토",
        titleEn: "Security review before deploy",
        desc: "Security Guidance + Playwright E2E 테스트로 품질을 보증하세요.",
        descEn: "Ensure quality with Security Guidance + Playwright E2E tests.",
      },
    ],
  },
};

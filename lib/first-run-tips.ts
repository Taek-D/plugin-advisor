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
    tryPrompt: "\"Claude Code 초보자인데, Next.js로 아주 작은 메모 앱부터 같이 만들어줘\"",
    tryPromptEn: "\"I'm new to Claude Code. Help me build a tiny notes app with Next.js step by step.\"",
    tips: [
      {
        title: "작게 시작하기",
        titleEn: "Start small",
        desc: "처음에는 CRUD나 작은 랜딩 페이지처럼 범위가 좁은 작업으로 성공 경험을 만드는 게 좋아요.",
        descEn: "For your first run, start with a tiny CRUD app or landing page to get a quick win.",
      },
      {
        title: "bkit Starter로 기본 흐름 익히기",
        titleEn: "Learn the workflow with bkit Starter",
        desc: "/bkit-starter:learn-claude-code 로 기본 명령과 작업 흐름을 익히세요.",
        descEn: "Use /bkit-starter:learn-claude-code to learn the core commands and workflow.",
        command: "/bkit-starter:learn-claude-code",
      },
      {
        title: "Context7로 공식 문서 확인하기",
        titleEn: "Use Context7 for official docs",
        desc: "라이브러리 버전이 헷갈릴 때는 use context7 을 붙여 정확한 예시를 요청하세요.",
        descEn: "When library versions are confusing, ask Claude to use context7 for accurate examples.",
        command: "use context7",
      },
    ],
  },
  "webapp-starter": {
    tryPrompt: "\"Next.js로 아주 단순한 서비스 소개 페이지를 만들고 Playwright 테스트까지 추가해줘\"",
    tryPromptEn: "\"Build a simple service landing page with Next.js and add Playwright tests.\"",
    tips: [
      {
        title: "공식 문서 기반으로 시작",
        titleEn: "Start from official docs",
        desc: "Next.js, React, Vercel처럼 자주 바뀌는 도구는 Context7를 먼저 켜두는 게 안전해요.",
        descEn: "For fast-moving tools like Next.js, React, and Vercel, keep Context7 on from the start.",
        command: "use context7",
      },
      {
        title: "브라우저 테스트를 초반에 붙이기",
        titleEn: "Add browser tests early",
        desc: "폼 제출, 기본 네비게이션, 모바일 레이아웃처럼 실패가 잦은 흐름부터 Playwright로 검증하세요.",
        descEn: "Use Playwright early for fragile flows like forms, navigation, and mobile layout.",
      },
      {
        title: "배포는 마지막에 연결",
        titleEn: "Connect deployment last",
        desc: "Vercel은 계정 연결이 필요하니 로컬에서 앱 흐름을 먼저 확인한 뒤 붙이는 게 좋아요.",
        descEn: "Vercel needs account setup, so validate the local flow first and connect deployment afterward.",
      },
    ],
  },
  "data-research": {
    tryPrompt: "\"경쟁사 웹사이트에서 가격 정보를 수집하고 요약 리포트까지 만들어줘\"",
    tryPromptEn: "\"Collect pricing info from competitor websites and create a short summary report.\"",
    tips: [
      {
        title: "Firecrawl로 데이터 수집",
        titleEn: "Collect data with Firecrawl",
        desc: "크롤링은 API 키가 필요하니, 먼저 테스트 대상 사이트와 수집 범위를 좁게 잡으세요.",
        descEn: "Crawling usually needs an API key, so start with a small target list and a narrow scope.",
      },
      {
        title: "시맨틱 검색으로 정보 탐색",
        titleEn: "Explore with semantic search",
        desc: "Exa는 기사/문서 조사에 강하고, Firecrawl은 실제 페이지 구조 수집에 강합니다.",
        descEn: "Exa is strong for research, while Firecrawl is better for extracting page structure.",
      },
      {
        title: "코드베이스 분석",
        titleEn: "Analyze codebases",
        desc: "수집 파이프라인을 수정할 때는 Repomix로 기존 프로젝트 전체 흐름을 빠르게 파악하세요.",
        descEn: "When updating a pipeline, use Repomix to understand the existing project structure quickly.",
      },
    ],
  },
  "backend-start": {
    tryPrompt: "\"사용자 인증이 포함된 간단한 REST API를 만들고 보안 체크도 같이 해줘\"",
    tryPromptEn: "\"Build a simple REST API with user auth and run security checks too.\"",
    tips: [
      {
        title: "Supabase로 빠른 백엔드 구축",
        titleEn: "Build backend fast with Supabase",
        desc: "Supabase는 계정 연결이 먼저 필요해요. 연결 전에는 인증 흐름과 스키마 요구사항부터 정리하세요.",
        descEn: "Supabase needs account setup first. Before that, define your auth flow and schema requirements.",
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
};

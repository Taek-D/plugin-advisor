export type StarterGuide = {
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  category: string;
  categoryEn: string;
  sections: Array<{
    heading: string;
    headingEn: string;
    body: string[];
    bodyEn: string[];
  }>;
};

export const STARTER_GUIDES: StarterGuide[] = [
  {
    slug: "claude-code-first-setup-checklist",
    title: "Claude Code 첫 세팅 체크리스트",
    titleEn: "Claude Code first setup checklist",
    summary: "처음 설치할 때 무엇부터 확인해야 하는지, 어떤 플러그인을 보수적으로 시작해야 하는지 정리한 가이드입니다.",
    summaryEn: "A practical checklist for your first Claude Code setup and a safe order to install starter plugins.",
    category: "초보자 첫 세팅",
    categoryEn: "First setup",
    sections: [
      {
        heading: "처음부터 많은 플러그인을 넣지 마세요",
        headingEn: "Do not start with too many plugins",
        body: [
          "처음 세팅에서는 2~3개 검증된 플러그인으로도 충분합니다.",
          "한 번에 너무 많이 깔면 어디서 문제가 생겼는지 역추적하기 어렵습니다.",
        ],
        bodyEn: [
          "For a first setup, 2-3 verified plugins are enough.",
          "A large starter stack makes failures much harder to debug.",
        ],
      },
      {
        heading: "공식 문서 확인용 플러그인을 먼저 두세요",
        headingEn: "Start with a docs-first plugin",
        body: [
          "Context7 같은 문서 보강 계열은 설치 난이도가 낮고 체감이 빠릅니다.",
          "빠르게 움직이는 프레임워크를 쓸수록 초반에 도움이 큽니다.",
        ],
        bodyEn: [
          "Docs-oriented tools like Context7 are low-risk and immediately useful.",
          "They are especially helpful when your framework changes quickly.",
        ],
      },
    ],
  },
  {
    slug: "windows-mcp-npx-setup-fixes",
    title: "Windows에서 MCP 설치가 자주 막히는 이유",
    titleEn: "Why MCP setup often breaks on Windows",
    summary: "Windows 환경에서 자주 나오는 명령 실행 문제와 점검 포인트를 정리했습니다.",
    summaryEn: "A short guide to the common command execution issues you see when setting up MCP servers on Windows.",
    category: "Windows/MCP 설치 이슈",
    categoryEn: "Windows setup issues",
    sections: [
      {
        heading: "명령 실행 방식부터 의심하세요",
        headingEn: "Check the command execution method first",
        body: [
          "Windows에서는 npx 기반 MCP 서버가 그대로 붙지 않는 경우가 있습니다.",
          "명령 자체보다 셸 래핑 방식이나 환경 변수 누락이 문제인 경우가 많습니다.",
        ],
        bodyEn: [
          "On Windows, npx-based MCP servers can fail even when the command looks correct.",
          "The real issue is often shell wrapping or missing environment variables.",
        ],
      },
      {
        heading: "API 키보다 연결 문자열이 먼저 문제일 수 있습니다",
        headingEn: "The problem may be the command shape, not the API key",
        body: [
          "오류 메시지가 모호할 때는 키보다 명령 실행 자체가 잘못된 경우가 많습니다.",
          "그래서 초보자용 흐름에서는 수동 확인이 필요한 플러그인을 기본 세트에서 분리하는 게 안전합니다.",
        ],
        bodyEn: [
          "When the error message is vague, the command shape may be wrong before the API key is.",
          "That is why beginner flows should separate manually reviewed plugins from copy-safe ones.",
        ],
      },
    ],
  },
  {
    slug: "webapp-starter-stack",
    title: "React/Next.js 웹앱용 스타터 세트",
    titleEn: "Starter stack for React and Next.js web apps",
    summary: "웹앱을 시작할 때 추천하는 3가지 기본 축을 정리했습니다.",
    summaryEn: "A simple three-part starter stack for React and Next.js projects.",
    category: "웹앱 조합",
    categoryEn: "Web app setup",
    sections: [
      {
        heading: "문서, 테스트, 배포를 먼저 고정하세요",
        headingEn: "Lock in docs, testing, and deployment first",
        body: [
          "웹앱은 Context7, Playwright, Vercel 조합만으로도 초반 안정성이 많이 올라갑니다.",
          "UI 디자인 툴보다 먼저 앱 구조와 브라우저 검증 흐름을 잡는 편이 안전합니다.",
        ],
        bodyEn: [
          "A docs + testing + deployment stack is often enough to stabilize the early web app workflow.",
          "It is safer to lock in the app structure and browser checks before adding design-heavy tools.",
        ],
      },
    ],
  },
  {
    slug: "backend-starter-stack",
    title: "백엔드 API 시작 조합",
    titleEn: "Starter combo for backend APIs",
    summary: "백엔드 API를 만들 때 문서, 보안, BaaS를 우선하는 이유를 정리했습니다.",
    summaryEn: "Why a backend starter stack should prioritize docs, security, and BaaS setup first.",
    category: "백엔드 조합",
    categoryEn: "Backend setup",
    sections: [
      {
        heading: "DB 로컬 연결보다 요구사항 정리가 먼저입니다",
        headingEn: "Requirements come before local DB attachment",
        body: [
          "처음부터 Postgres 연결 문자열을 직접 붙이는 흐름은 초보자에게 진입 장벽이 높습니다.",
          "문서 참조, 보안 경고, BaaS 연결처럼 성공 확률이 높은 흐름부터 여는 것이 낫습니다.",
        ],
        bodyEn: [
          "Directly wiring local Postgres too early raises the difficulty for beginners.",
          "It is safer to start with docs, security checks, and a managed backend path.",
        ],
      },
    ],
  },
  {
    slug: "claude-code-cost-and-ops-mistakes",
    title: "Claude Code 비용/운영에서 자주 하는 실수",
    titleEn: "Common Claude Code cost and operations mistakes",
    summary: "과금 방식, 계정 연결, 운영 상의 사소하지만 치명적인 실수를 정리했습니다.",
    summaryEn: "A guide to the small but costly mistakes people make around billing, account setup, and operations.",
    category: "비용/운영",
    categoryEn: "Cost and ops",
    sections: [
      {
        heading: "설치보다 운영 비용을 놓치기 쉽습니다",
        headingEn: "People miss the ongoing cost, not just the setup",
        body: [
          "플러그인 자체보다 API 키와 외부 계정 연결이 비용 구조를 바꾸는 경우가 많습니다.",
          "그래서 추천 단계에서 필요한 계정과 키를 먼저 드러내야 합니다.",
        ],
        bodyEn: [
          "The real cost often comes from external accounts and API keys, not the plugin install itself.",
          "That is why recommendations should surface prerequisites early.",
        ],
      },
    ],
  },
  {
    slug: "starter-security-mistakes",
    title: "초기 세팅에서 보안 관련으로 흔히 놓치는 것",
    titleEn: "Security mistakes people make in starter setups",
    summary: "보안 플러그인을 늦게 붙이거나 계정 권한을 과하게 여는 실수를 막기 위한 정리입니다.",
    summaryEn: "A short guide to security mistakes that show up in early setup decisions.",
    category: "보안 실수 방지",
    categoryEn: "Security",
    sections: [
      {
        heading: "권한이 필요한 도구는 더 보수적으로 다뤄야 합니다",
        headingEn: "Tools that need credentials should be introduced more carefully",
        body: [
          "GitHub, Slack, Supabase, Figma 같은 연동형 플러그인은 계정 권한 범위를 먼저 확인해야 합니다.",
          "처음부터 모든 연동을 켜기보다, 실제 필요가 생기는 순간에 붙이는 편이 안전합니다.",
        ],
        bodyEn: [
          "Tools like GitHub, Slack, Supabase, and Figma need credential scope checks before setup.",
          "It is safer to connect them only when the workflow actually needs them.",
        ],
      },
    ],
  },
];

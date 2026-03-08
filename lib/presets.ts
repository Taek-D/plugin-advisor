export type PresetPack = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  pluginIds: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
};

export const PRESET_PACKS: PresetPack[] = [
  {
    id: "beginner-essential",
    name: "입문자 필수 3종",
    nameEn: "Beginner Essentials",
    description: "Claude Code를 처음 쓴다면 이것부터. 멀티 에이전트, 프로젝트 설정, 최신 문서 참조까지.",
    descriptionEn: "Start here if you're new to Claude Code. Multi-agent orchestration, project setup, and up-to-date docs.",
    icon: "Rocket",
    pluginIds: ["omc", "bkit-starter", "context7"],
    difficulty: "beginner",
  },
  {
    id: "webapp-starter",
    name: "웹앱 스타터",
    nameEn: "Web App Starter",
    description: "React/Next.js 웹앱을 만들 때 필요한 조합. UI 디자인부터 테스트, 배포까지.",
    descriptionEn: "Everything you need for React/Next.js web apps. From UI design to testing and deployment.",
    icon: "Globe",
    pluginIds: ["omc", "context7", "uiux", "playwright", "vercel"],
    difficulty: "beginner",
  },
  {
    id: "data-research",
    name: "데이터 수집 & 분석",
    nameEn: "Data & Research",
    description: "웹 크롤링, 검색, 코드베이스 분석. 데이터를 모으고 정리하는 데 특화.",
    descriptionEn: "Web crawling, search, and codebase analysis. Specialized for gathering and organizing data.",
    icon: "Search",
    pluginIds: ["firecrawl", "exa", "repomix", "omc"],
    difficulty: "intermediate",
  },
  {
    id: "api-backend",
    name: "API 서버 개발",
    nameEn: "API & Backend",
    description: "백엔드 API 개발에 필요한 DB, 인증, 보안, 모니터링 조합.",
    descriptionEn: "Database, auth, security, and monitoring for backend API development.",
    icon: "Server",
    pluginIds: ["omc", "supabase", "postgres", "security", "sentry"],
    difficulty: "intermediate",
  },
  {
    id: "productivity",
    name: "생산성 극대화",
    nameEn: "Productivity Max",
    description: "작업 관리, 노션 연동, 슬랙 알림까지. 혼자서도 팀처럼 일하기.",
    descriptionEn: "Task management, Notion sync, Slack notifications. Work like a team, even solo.",
    icon: "Zap",
    pluginIds: ["omc", "taskmaster", "notion", "slack", "github"],
    difficulty: "intermediate",
  },
  {
    id: "fullstack-pro",
    name: "풀스택 올인원",
    nameEn: "Fullstack All-in-One",
    description: "프론트부터 백엔드, 배포, 테스트까지. 숙련자를 위한 완전체 조합.",
    descriptionEn: "Frontend to backend, deployment, and testing. The complete stack for experienced developers.",
    icon: "Layers",
    pluginIds: ["omc", "context7", "supabase", "vercel", "playwright", "uiux", "security"],
    difficulty: "advanced",
  },
];

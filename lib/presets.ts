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
    name: "입문자 기본 세트",
    nameEn: "Beginner Essentials",
    description: "처음 세팅할 때 실패 확률이 낮은 기본 조합. 학습, 문서 참조, 빠른 생산성 향상에 집중합니다.",
    descriptionEn: "A low-risk starter combo for your first setup. Focused on onboarding, docs, and quick wins.",
    icon: "Rocket",
    pluginIds: ["bkit-starter", "context7", "superpowers"],
    difficulty: "beginner",
  },
  {
    id: "webapp-starter",
    name: "웹앱 시작 세트",
    nameEn: "Web App Starter",
    description: "React/Next.js 웹앱을 빠르게 시작하는 조합. 공식 문서, 테스트, 배포 흐름을 기본으로 둡니다.",
    descriptionEn: "A starter combo for React/Next.js apps with docs, testing, and deployment built in.",
    icon: "Globe",
    pluginIds: ["context7", "playwright", "vercel"],
    difficulty: "beginner",
  },
  {
    id: "data-research",
    name: "데이터 수집 시작 세트",
    nameEn: "Data & Research",
    description: "웹 수집과 리서치를 빠르게 시작하는 조합. 크롤링, 시맨틱 검색, 코드베이스 분석을 묶었습니다.",
    descriptionEn: "Start collecting and researching data with crawling, semantic search, and codebase analysis.",
    icon: "Search",
    pluginIds: ["firecrawl", "exa", "repomix"],
    difficulty: "intermediate",
  },
  {
    id: "backend-start",
    name: "백엔드 시작 세트",
    nameEn: "API & Backend",
    description: "백엔드 API를 시작할 때 필요한 기본 조합. 문서, 보안, BaaS 연동을 우선합니다.",
    descriptionEn: "A backend starter combo centered on docs, security, and BaaS integration.",
    icon: "Server",
    pluginIds: ["context7", "security", "supabase"],
    difficulty: "intermediate",
  },
];

import type { PluginCategory } from "./types";

type CategoryMeta = {
  slug: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  seoTitle: string;
};

export const CATEGORY_META: Record<PluginCategory, CategoryMeta> = {
  orchestration: {
    slug: "orchestration",
    label: "오케스트레이션",
    labelEn: "Orchestration",
    description:
      "Claude Code 워크플로를 조율하고 멀티 에이전트 파이프라인을 관리하는 플러그인입니다. 복잡한 작업을 자동으로 분배하고 조합합니다.",
    descriptionEn:
      "Plugins that coordinate Claude Code workflows and manage multi-agent pipelines. Automatically distribute and combine complex tasks.",
    seoTitle: "Orchestration Plugins for Claude Code",
  },
  workflow: {
    slug: "workflow",
    label: "워크플로",
    labelEn: "Workflow",
    description:
      "개발 워크플로를 자동화하고 작업 관리, 계획 수립, 반복 작업 처리를 돕는 플러그인입니다.",
    descriptionEn:
      "Plugins that automate development workflows, task management, planning, and repetitive operations.",
    seoTitle: "Workflow Plugins for Claude Code",
  },
  "code-quality": {
    slug: "code-quality",
    label: "코드 품질",
    labelEn: "Code Quality",
    description:
      "코드 리뷰, 린팅, 리팩토링, 타입 검사를 도와 코드 품질을 높이는 플러그인입니다.",
    descriptionEn:
      "Plugins that improve code quality through code review, linting, refactoring, and type checking.",
    seoTitle: "Code Quality Plugins for Claude Code",
  },
  testing: {
    slug: "testing",
    label: "테스팅",
    labelEn: "Testing",
    description:
      "테스트 작성, 실행, 커버리지 분석, TDD 워크플로를 지원하는 플러그인입니다.",
    descriptionEn:
      "Plugins that support test writing, execution, coverage analysis, and TDD workflows.",
    seoTitle: "Testing Plugins for Claude Code",
  },
  documentation: {
    slug: "documentation",
    label: "문서화",
    labelEn: "Documentation",
    description:
      "API 문서, README, 코드 주석, 기술 문서 생성을 돕는 플러그인입니다.",
    descriptionEn:
      "Plugins that help generate API docs, README files, code comments, and technical documentation.",
    seoTitle: "Documentation Plugins for Claude Code",
  },
  data: {
    slug: "data",
    label: "데이터",
    labelEn: "Data",
    description:
      "데이터베이스 연결, 쿼리 실행, 데이터 분석, 웹 검색을 지원하는 플러그인입니다.",
    descriptionEn:
      "Plugins that support database connections, query execution, data analysis, and web search.",
    seoTitle: "Data & Database Plugins for Claude Code",
  },
  security: {
    slug: "security",
    label: "보안",
    labelEn: "Security",
    description:
      "보안 취약점 스캔, 의존성 감사, 시크릿 관리를 돕는 플러그인입니다.",
    descriptionEn:
      "Plugins that help with security vulnerability scanning, dependency auditing, and secret management.",
    seoTitle: "Security Plugins for Claude Code",
  },
  integration: {
    slug: "integration",
    label: "통합",
    labelEn: "Integration",
    description:
      "GitHub, Slack, Notion, Linear 등 외부 서비스와 Claude Code를 연결하는 플러그인입니다.",
    descriptionEn:
      "Plugins that connect Claude Code with external services like GitHub, Slack, Notion, and Linear.",
    seoTitle: "Integration Plugins for Claude Code",
  },
  "ui-ux": {
    slug: "ui-ux",
    label: "UI/UX",
    labelEn: "UI/UX",
    description:
      "프론트엔드 디자인, UI 컴포넌트 생성, 디자인 시스템 관리를 돕는 플러그인입니다.",
    descriptionEn:
      "Plugins that help with frontend design, UI component generation, and design system management.",
    seoTitle: "UI/UX Plugins for Claude Code",
  },
  devops: {
    slug: "devops",
    label: "DevOps",
    labelEn: "DevOps",
    description:
      "CI/CD, 배포, 모니터링, 인프라 관리를 지원하는 플러그인입니다.",
    descriptionEn:
      "Plugins that support CI/CD, deployment, monitoring, and infrastructure management.",
    seoTitle: "DevOps Plugins for Claude Code",
  },
};

export const ALL_CATEGORY_SLUGS = Object.keys(CATEGORY_META) as PluginCategory[];

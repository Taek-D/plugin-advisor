# Plugin Advisor

## What This Is

Claude Code 플러그인 추천 + 조합 분석 웹 서비스. 프로젝트 분석(/advisor)으로 맞춤 플러그인 추천, 조합 분석(/optimizer)으로 현재 설치된 플러그인 점수화 + 보완/대체 추천. 42개 검증된 플러그인 DB, 한/영 다국어 지원, 어드민 패널 포함.

## Core Value

사용자의 프로젝트에 맞는 검증된 Claude Code 플러그인 조합을 정확하게 추천하는 것.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ 텍스트/파일/GitHub URL 3가지 입력 모드 — v0
- ✓ 키워드 기반 추천 엔진 (스코어링, 프리셋 팩) — v0
- ✓ AI(Claude) 분석 모드 — v0
- ✓ 42개 플러그인 DB (메타데이터, 키워드, 설치 명령) — v0+v1.0
- ✓ 충돌 감지 및 경고 — v0
- ✓ 설치 스크립트 생성 + 복사 — v0
- ✓ 어드민 패널 (로그인, 플러그인 CRUD, 제안 리뷰) — v0
- ✓ 사용자 플러그인 제안 기능 — v0
- ✓ 한/영 다국어 지원 (i18n) — v0
- ✓ 보안 헤더, CSP, 레이트 리밋 — v0
- ✓ Vercel 배포 — v0
- ✓ 42개 플러그인 메타데이터 검증 (GitHub README 기반) — v1.0
- ✓ 전체 verificationStatus 감사 (35 verified, 5 partial, 2 unverified) — v1.0
- ✓ 42/42 영문 번역 동기화 — v1.0
- ✓ /optimizer 페이지: 플러그인 조합 분석 및 최적화 제안 — v1.1
- ✓ 입력 방식: `claude mcp list` 결과 붙여넣기 + 직접 타이핑(자동완성) — v1.1
- ✓ 조합 점수: 충돌 감점, 커버리지 기반 점수화 (규칙 기반 0-100) — v1.1
- ✓ 충돌 경고: 현재 조합의 충돌 플러그인 쌍 감지 및 표시 — v1.1
- ✓ 보완 추천: 빠진 플러그인 제안 (설치된 것 제외) — v1.1
- ✓ 대체 추천: deprecated/unverified 플러그인의 더 나은 대안 제시 — v1.1
- ✓ AI 분석 모드: Coming Soon 표시 (비활성) — v1.1

### Active

<!-- Current scope. Building toward these. -->

(다음 마일스톤에서 정의)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- 실제 설치 테스트 — 메타데이터 검증만 완료, 런타임 테스트는 별도 마일스톤
- uiux 플러그인 MCP 서버화 — 프롬프트 스킬이므로 MCP 서버 구현은 범위 밖
- AI 조합 분석 구현 — v1.1에서는 규칙 기반만, AI 모드는 Coming Soon 표시
- settings.json 업로드 파싱 — v1.1에서는 텍스트/직접입력만
- 시너지 가점 — v1.1에서는 감점 모델만, 시너지는 추후 고려

## Context

- 14,116 LOC TypeScript (Next.js 14 + shadcn/ui)
- 42개 플러그인: 35 verified, 5 partial, 2 unverified
- 104개 테스트 (Vitest): 42 scoring + 15 parser + 47 기존
- v1.0: 플러그인 메타데이터 검증 완료 (GitHub README 기반)
- v1.1: /optimizer 페이지 — MCP list 파싱, 자동완성, 조합 점수, 보완/대체 추천, progressive disclosure UI
- 플러그인 데이터: `lib/plugins.ts` (CORE_PLUGINS + PLUGIN_FIELD_OVERRIDES)
- 영문 번역: `lib/i18n/plugins-en.ts` (pluginDescEn + reasonsEn)

## Constraints

- **Tech stack**: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **Data format**: `lib/plugins.ts` 정적 DB (Supabase는 제안/관리용)
- **배포**: Vercel

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| partial/unverified만 우선 검증 | 리소스 집중, verified 10개는 이미 확인됨 | ✓ Good — 26개 집중 검증 완료 |
| GitHub repo + 문서 기반 검증 | 실제 설치 테스트 없이 메타데이터 정확성 우선 | ✓ Good — 대량 오류 발견 및 수정 |
| ralph → unverified | haizelabs/ralph-wiggum repo 404 (2026-03-11) | ✓ Good — 사실 기반 상태 반영 |
| uiux → unverified | MCP 서버 아님 (PromptX/Codex 프롬프트 스킬) | ✓ Good — 정확한 분류 |
| remote HTTP MCP 패턴 채택 | exa, tavily, figma 등 원격 서버 이전 트렌드 반영 | ✓ Good — 최신 설치 방법 반영 |
| linear deprecated 표시 | jerhadf/linear-mcp-server → mcp.linear.app/sse 이전 | ✓ Good — 사용자에게 공식 대안 안내 |
| /optimizer 별도 페이지 | 기존 /advisor와 목적이 다름 (프로젝트 분석 vs 조합 분석) | ✓ Good — 명확한 UX 분리 |
| AI 모드 Coming Soon | 규칙 기반 우선 구현, AI는 추후 활성화 | ✓ Good — 규칙 기반만으로 충분한 가치 제공 |
| 100점 감점 모델 | 100 - conflicts*20 - redundancies*7 - uncovered*7 | ✓ Good — 직관적 스케일 |
| 순수 클라이언트사이드 분석 | 42개 DB가 이미 정적 임포트, API route 불필요 | ✓ Good — 서버 의존성 제로 |
| CSS max-height 접기/펼치기 | framer-motion/radix-ui 없이 순수 CSS transition | ✓ Good — 번들 크기 최소화 |

---
*Last updated: 2026-03-18 after v1.1 milestone completion*

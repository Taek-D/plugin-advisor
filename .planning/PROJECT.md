# Plugin Advisor

## What This Is

Claude Code 플러그인 추천 + 조합 분석 웹 서비스. 프로젝트 분석(/advisor)으로 맞춤 플러그인 추천, 조합 분석(/optimizer)으로 현재 설치된 MCP 서버/Plugin 점수화 + 타입별 보완/대체 추천. 39개 MCP + 12개 Plugin = 51개 검증 DB, tailored 추천 이유 문자열, 한/영 다국어 지원, 어드민 패널 포함.

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
- ✓ MCP 서버 6개 추가 (fetch, time, markitdown, magic-mcp, n8n-mcp, shadcn-mcp) — v1.3
- ✓ Plugin 3개 추가 (claude-mem, superclaude, frontend-design) — v1.3
- ✓ 51개 항목 install/i18n 소스 수준 검증, 테스트 임계값 갱신 — v1.3
- ✓ 9개 신규 항목 tailored Korean reason 문자열 + orphaned export 정리 — v1.3
- ✓ /optimizer 페이지: 플러그인 조합 분석 및 최적화 제안 — v1.1
- ✓ 입력 방식: `claude mcp list` 결과 붙여넣기 + 직접 타이핑(자동완성) — v1.1
- ✓ 조합 점수: 충돌 감점, 커버리지 기반 점수화 (규칙 기반 0-100) — v1.1
- ✓ 충돌 경고: 현재 조합의 충돌 플러그인 쌍 감지 및 표시 — v1.1
- ✓ 보완 추천: 빠진 플러그인 제안 (설치된 것 제외) — v1.1
- ✓ 대체 추천: deprecated/unverified 플러그인의 더 나은 대안 제시 — v1.1
- ✓ AI 분석 모드: Coming Soon 표시 (비활성) — v1.1
- ✓ Plugin 타입 시스템: DB에 type 'mcp' | 'plugin' 필드 추가 — v1.2
- ✓ Plugin DB 9개 구축 (omc, superpowers, bkit-starter, bkit, taskmaster, gsd, fireauto, agency-agents, ralph) — v1.2
- ✓ /plugins 페이지에서 MCP | Plugin 탭 분리 — v1.2
- ✓ /optimizer에서 typeScope 기반 MCP/Plugin 보완 추천 분리 — v1.2
- ✓ /optimizer 파서/힌트: claude plugin list 포맷 안내 — v1.2
- ✓ 자동완성/칩에 MCP/Plugin 타입 뱃지 표시 — v1.2
- ✓ i18n 업데이트 (탭, 타입 관련 번역) — v1.2

### Active

<!-- Current scope. Building toward these. -->

- [ ] 인기 MCP 서버 5-10개 추가 (GitHub 스타 기준 선별)
- [ ] 인기 Plugin 5-10개 추가 (GitHub 스타 기준 선별)
- [ ] 신규 항목 GitHub README 기반 메타데이터 완전 검증
- [ ] 신규 항목 한/영 번역 동기화
- [ ] 총 DB 60-65개 달성

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- 실제 설치 테스트 — 메타데이터 검증만 완료, 런타임 테스트는 별도 마일스톤
- uiux 플러그인 MCP 서버화 — 프롬프트 스킬이므로 MCP 서버 구현은 범위 밖
- AI 조합 분석 구현 — 규칙 기반만, AI 모드는 Coming Soon 표시
- settings.json 업로드 파싱 — 텍스트/직접입력만
- 시너지 가점 — 감점 모델만, 시너지는 추후 고려
- 크로스 타입 충돌 감지 (MCP↔Plugin 충돌 쌍) — 현재 동일 타입 내 충돌만

## Context

- 14,700+ LOC TypeScript (Next.js 14 + shadcn/ui)
- 39개 MCP 서버 + 12개 Plugin = 51개 항목 DB
- 125개 테스트 (Vitest): 50 scoring + 15 parser + 6 plugins + 54 기타
- v1.0: 플러그인 메타데이터 검증 완료 (GitHub README 기반)
- v1.1: /optimizer 페이지 — MCP list 파싱, 자동완성, 조합 점수, 보완/대체 추천
- v1.2: MCP + Plugin 타입 분리 — typeScope scoring, /plugins 탭 UI, 타입 뱃지
- v1.3: DB 42→51 확장 (MCP 6 + Plugin 3), tailored reason 문자열, dead export 정리
- 플러그인 데이터: `lib/plugins.ts` (CORE_PLUGINS + PLUGIN_FIELD_OVERRIDES + DEFAULT_PLUGIN_FIELDS)
- 추천 이유: `lib/plugin-reasons.ts` (REASONS 객체, Korean tailored strings)
- 영문 번역: `lib/i18n/plugins-en.ts` (pluginDescEn — sole export)

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
| ItemType = "mcp" \| "plugin" | Plugin 타입 구분 필요, 'PluginType'과 혼동 방지 | ✓ Good — 명확한 네이밍 |
| DEFAULT_PLUGIN_FIELDS로 type 주입 | CORE_PLUGINS 수정 없이 42개 자동 분류 | ✓ Good — 무수정 마이그레이션 |
| PLUGIN_FIELD_OVERRIDES에서만 재분류 | PluginSeed에 type 필드 없음 (타입 안전) | ✓ Good — 관심사 분리 |
| typeScope 기본값 'both' | 기존 호출자 무수정 하위 호환 | ✓ Good — 회귀 제로 |
| MCP/Plugin 탭 라벨 i18n 미적용 | 고유명사로 취급, "All"만 번역 | ✓ Good — 글로벌 일관성 |
| 카테고리 탭 전환 시 리셋 안 함 | AND 합성 필터, locked decision | ✓ Good — 파워 유저 선호 |
| reasonsEn 삭제 (보존 대신) | zero consumers, 영문 reason flow 미구현 | ✓ Good — dead code 제거 우선, 필요 시 재추가 |
| REASONS 스타일: Korean 1-2문장 + 요. 종결 | 기존 35개 엔트리 일관성 유지 | ✓ Good — 신규 9개도 동일 패턴 |

---
*Last updated: 2026-03-19 after v1.3 milestone completion*

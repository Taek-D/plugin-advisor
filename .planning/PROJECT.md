# Plugin Advisor

## What This Is

Claude Code 플러그인 조합을 추천해주는 웹 서비스. 텍스트/파일/GitHub URL 입력 → 키워드 또는 AI 분석 → 플러그인 추천 + 설치 스크립트 생성. 한/영 다국어 지원, 어드민 패널 포함.

## Core Value

사용자의 프로젝트에 맞는 검증된 Claude Code 플러그인 조합을 정확하게 추천하는 것.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ 텍스트/파일/GitHub URL 3가지 입력 모드 — v0
- ✓ 키워드 기반 추천 엔진 (스코어링, 프리셋 팩) — v0
- ✓ AI(Claude) 분석 모드 — v0
- ✓ 36개 플러그인 DB (메타데이터, 키워드, 설치 명령) — v0
- ✓ 충돌 감지 및 경고 — v0
- ✓ 설치 스크립트 생성 + 복사 — v0
- ✓ 어드민 패널 (로그인, 플러그인 CRUD, 제안 리뷰) — v0
- ✓ 사용자 플러그인 제안 기능 — v0
- ✓ 한/영 다국어 지원 (i18n) — v0
- ✓ 보안 헤더, CSP, 레이트 리밋 — v0
- ✓ Vercel 배포 — v0

### Active

<!-- Current scope. Building toward these. -->

- [ ] partial/unverified 26개 플러그인 메타데이터 검증
- [ ] 검증 결과에 따라 verificationStatus 업데이트

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- verified 10개 플러그인 재검증 — 이미 검증 완료
- 새 플러그인 추가 — 기존 플러그인 검증 우선
- UI/UX 개선 — 이번 마일스톤 범위 아님

## Context

- 36개 플러그인 중 verified 10개, partial 25개(기본값 21 + 명시 4), unverified 1개
- 각 플러그인은 `githubRepo` 필드에 GitHub 레포 URL 보유 (null인 경우 있음)
- 검증 항목: desc, longDesc, features, keywords, install 명령어, conflicts, verificationStatus
- 플러그인 데이터: `lib/plugins.ts` (정적 DB)
- 영문 번역: `lib/i18n/plugins-en.ts`

## Constraints

- **Tech stack**: 기존 Next.js 14 + TypeScript 유지
- **Data source**: GitHub repo README, 공식 문서 기반 검증
- **Update target**: `lib/plugins.ts` 직접 수정

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| partial/unverified만 우선 검증 | 리소스 집중, verified는 이미 확인됨 | — Pending |
| GitHub repo + 문서 기반 검증 | 실제 설치 테스트 없이 메타데이터 정확성 우선 | — Pending |

---
*Last updated: 2026-03-11 after initial project setup*

# Claude Code Plugin Advisor — CLAUDE.md

Claude Code 플러그인 추천 웹 서비스. 텍스트/파일/GitHub URL 입력 → 키워드 또는 AI 분석 → 플러그인 추천 + 설치 스크립트 생성.

---

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **DB**: Supabase (플러그인 제안, 관리자 기능)
- **AI**: Anthropic API (AI 분석 모드, 선택적)
- **배포**: Vercel
- **테스트**: Vitest

---

## 환경변수 (.env.local)

| 변수 | 필수 | 설명 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | O | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | O | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | O | Supabase service role key (서버 전용) |
| `ADMIN_REVIEW_PASSWORD` | O | 관리자 로그인 비밀번호 |
| `ADMIN_SESSION_SECRET` | O | 세션 서명 시크릿 (랜덤 문자열) |
| `GITHUB_TOKEN` | - | GitHub API rate limit 완화용 |
| `ANTHROPIC_API_KEY` | - | AI 분석 모드 활성화용 |
| `LEAD_WEBHOOK_URL` | - | 셋업 문의 웹훅 URL |

---

## 주요 모듈

### 추천 엔진 (lib/recommend.ts)
- 키워드 매칭 + AI 분석 (AnalysisMode: "keyword" | "ai")
- 스코어 기반 상위 추천, 충돌 감지, 보완 플러그인 제안

### 플러그인 DB (lib/plugins.ts)
- 33+ 플러그인 데이터 (데이터 파일이므로 200줄 제한 예외)
- Supabase 연동으로 관리자 CRUD 가능

### 주요 페이지
- `/` — 랜딩 페이지
- `/advisor` — 추천 앱 (입력 → 분석 → 결과)
- `/plugins` — 플러그인 카탈로그, `/plugins/[id]` — 상세
- `/guides` — 가이드 목록, `/guides/[slug]` — 가이드 상세
- `/services` — 셋업 리뷰/컨설팅
- `/admin/*` — 관리자 (로그인, 플러그인 관리, 제안 리뷰)

### API Routes
- `/api/github` — GitHub README fetch (CORS 우회, main→master 폴백)
- `/api/analyze` — AI 분석 (Anthropic API)
- `/api/plugin-suggestions` — 사용자 플러그인 제안 (rate limited)
- `/api/lead` — 셋업 문의 웹훅 전달
- `/api/versions` — GitHub 최신 버전 조회
- `/api/admin/*` — 관리자 인증, 플러그인/제안 CRUD

### 부가 기능
- **i18n**: `lib/i18n/` (ko, en) — 한국어 기본, 영어 지원
- **Analytics**: `lib/analytics.ts` — localStorage 기반 이벤트 추적
- **Favorites/History**: `lib/favorites.ts`, `lib/history.ts` — localStorage 영속화
- **Presets**: `lib/presets.ts` — 프리셋 팩 (초보자용 등)
- **Rate Limiting**: `lib/rate-limit.ts` — IP 기반 API 제한

---

## 개발 워크플로

### 패키지 관리
- **항상 `pnpm` 사용** (npm, yarn 사용 금지)

### 개발 순서
1. 변경 사항 작성
2. 타입체크: `pnpm typecheck`
3. 린트: `pnpm lint`
4. 빌드: `pnpm build`
5. 테스트: `pnpm test`
6. 개발 서버: `pnpm dev`

---

## 코딩 컨벤션

- `type` 선호, `interface` 자제
- `enum` 사용 금지 → 문자열 리터럴 유니온 사용
- `any` 타입 사용 금지
- 컴포넌트는 `export default function ComponentName()` 형식
- 서버 컴포넌트 기본, 클라이언트 필요 시 `'use client'` 명시
- 스타일은 Tailwind 유틸리티 클래스 사용 (동적 플러그인 색상 등 런타임 값은 인라인 style 허용)
- `console.log` 디버깅용으로만, 커밋 전 제거

---

## 개발 원칙

- 컴포넌트 단위로 분리, 하나의 파일이 200줄 넘지 않게 (데이터 파일 `plugins.ts` 예외)
- 플러그인 DB는 별도 파일로 관리 (추후 확장 고려)
- GitHub fetch는 반드시 Next.js API route (서버사이드)로 구현
- 한국어 UI 기본, i18n으로 영어 지원
- `.env` 파일은 절대 커밋하지 않기

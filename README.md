# Plugin Advisor

프로젝트 설명을 넣으면 Claude Code 플러그인·MCP 서버 조합을 추천하고, 이미 설치한 조합은 점수와 충돌 경고로 점검해 주는 웹 서비스입니다.

- 라이브: https://plugin-advisor.vercel.app
- 개인 프로젝트입니다.

## 왜 만들었나

Claude Code 플러그인과 MCP 서버는 빠르게 늘어나는데, 내 프로젝트에 무엇이 맞고 무엇끼리 같이 쓰면 안 되는지 정리된 곳이 없었습니다. 이것저것 설치했다가 명령이 충돌해 전부 지우고 다시 시작하는 일을 직접 겪은 것이 출발점입니다. 그래서 "많이 추천하기"보다 "처음 설치해도 실패할 가능성이 낮은 소수 조합을 근거와 함께 추천하기"를 목표로 잡았습니다. 초기 기획은 [docs/PRD.md](docs/PRD.md)에 있습니다.

## 무엇을 하는가

- **프로젝트 기반 추천** (`/advisor`): 텍스트, `.md`·`.txt` 파일, GitHub 저장소 URL(README 자동 조회) 중 하나를 입력하면 플러그인을 최대 5개 추천합니다. 추천마다 이유와 일치한 키워드를 보여 주고, 입력이 모호하면 신뢰도를 낮게 표시합니다.
- **설치 준비**: 사전 체크리스트, 그대로 복사해 실행할 수 있는 명령, 계정 연결이나 수동 설정이 필요한 항목을 구분해 보여 줍니다. 이번 추천에서 뺀 플러그인과 그 이유도 함께 표시합니다.
- **조합 분석** (`/optimizer`): `claude mcp list` 또는 `claude plugin list` 출력을 붙여넣거나 자동완성으로 입력하면 0~100점 점수, 충돌 쌍, 기능이 겹치는 그룹, 10개 카테고리 커버리지, 보완·대체 후보를 계산합니다.
- **카탈로그** (`/plugins`): 51개 항목(MCP 서버 39, Plugin 12)을 유형 탭, 카테고리, 검색으로 탐색합니다. 항목별 상세 페이지에서 설치 명령, 선행 조건, 필요한 키 종류, GitHub 최신 릴리스 버전을 확인합니다.
- **가이드** (`/guides`, `/compare`): 첫 세팅 체크리스트, Windows 설치 문제 해결 등 스타터 가이드 6편과 세팅 방식 비교 페이지.
- **제안·피드백 수집과 관리자 검토**: 누구나 새 플러그인을 제안하고 피드백을 남길 수 있습니다. 관리자는 로그인 후 제안을 대기·추가 확인·통과·반영 안 함으로 분류하고 피드백을 열람합니다.
- **기타**: 한국어/영어 전환, 분석 히스토리와 즐겨찾기(브라우저 localStorage), 페이지별 OG 이미지 생성.

## 구조

```text
브라우저 (React 클라이언트 컴포넌트)
 ├─ /advisor    입력 ─→ lib/recommend.ts ─→ 추천, 체크리스트, 설치 스크립트 (lib/setup.ts)
 ├─ /optimizer  입력 ─→ lib/parse-mcp-list.ts ─→ lib/scoring.ts + lib/conflicts.ts
 ├─ /plugins, /guides, /compare   정적 데이터 (lib/plugins.ts, lib/guides.ts)
 └─ localStorage   분석 히스토리, 즐겨찾기, 언어 설정

Next.js Route Handlers (app/api)
 ├─ github, versions                          ─→ GitHub API (README 조회, 최신 릴리스 1시간 메모리 캐시)
 ├─ plugin-suggestions, feedback, newsletter  ─→ Supabase (service role, 서버 전용)
 ├─ admin/*   서명된 세션 쿠키 검증 후 처리   ─→ Supabase
 └─ analyze (AI 분석, 비활성), lead (준비 중, 503 고정)
```

추천과 조합 분석은 서버나 DB를 거치지 않고 브라우저에서 계산합니다. 서버는 외부 API 호출(GitHub)과 쓰기 작업(제안, 피드백, 뉴스레터, 관리자 기능)만 맡습니다. 플러그인 데이터는 `lib/plugins.ts`에 타입이 붙은 상수로 두었고, 카탈로그·추천·점수 계산·사이트맵·OG 이미지가 모두 이 한 파일을 읽습니다.

## 설계 결정

### 1. 추천은 API 호출 없이 규칙으로 계산한다

`hooks/useAnalysis.ts`가 `lib/recommend.ts`의 `recommend()`를 직접 호출합니다. 초기 기획에서 "API 호출 없이 즉시 분석"을 요건으로 두었습니다([docs/PRD.md](docs/PRD.md)). 순수 함수라서 같은 입력에는 같은 결과가 나오고, 결과에 일치한 키워드가 포함되므로 추천 근거를 화면에 그대로 표시할 수 있습니다.

### 2. 키워드 일치 수만으로 순위를 정하지 않는다

순위 점수는 `키워드 일치 수 × 3 + 프리셋 포함 2 + 신뢰 점수 + 의도 가산`입니다(`lib/recommend.ts`). 신뢰 점수는 플러그인 메타데이터에서 나옵니다. 검증됨 +4 / 미검증 −4, 그대로 복사 가능 +3 / 수동 설정 필요 −3, 입문 난이도 +3 / 고급 −2(입문자 입력이면 −5) 같은 식입니다. 입력에 "처음", "beginner" 같은 입문 신호가 있으면 수동 설정이 필요한 플러그인과 고급이면서 미검증인 플러그인은 추천에서 빼고, 뺀 이유를 따로 보여 줍니다.

워크플로형 플러그인 3개(gsd, fireauto, agency-agents)는 키워드가 일치해도 전용 신호가 기준 이상 있을 때만 후보가 됩니다. "일반적인 CRUD 요청에는 추천하지 않는다" 같은 기대 동작을 `lib/__tests__/recommend.test.ts`에 추천되어야 하는 입력과 추천되면 안 되는 입력으로 나눠 고정했습니다.

### 3. 조합 점수는 감점만 하는 모델이다

`lib/scoring.ts`의 점수는 `100 − 충돌 쌍 × 20 − 중복 그룹 × 7 − 비어 있는 카테고리 × 7`이고 0~100으로 자릅니다. 가점은 없습니다. 감점에 쓰인 세 목록(충돌, 중복, 커버리지)이 결과 객체에 그대로 담겨 화면의 경고와 커버리지 표가 되므로, 사용자는 점수가 왜 깎였는지 화면에서 확인할 수 있습니다. 보완·대체 후보는 `typeScope` 인자로 MCP 서버와 Plugin을 구분해 같은 유형 안에서 고릅니다.

### 4. 한 번에 복사할 명령과 직접 고쳐야 하는 설정을 나눈다

모든 항목에 `installMode`(`safe-copy` / `external-setup` / `manual-required`)가 있습니다. 일괄 복사 스크립트에는 `safe-copy` 항목만 넣고(`lib/setup.ts`의 `getSafeCopyPlugins`), 나머지는 선행 조건과 필요한 키 종류를 체크리스트로 따로 안내합니다. 경로나 키를 바꿔 넣어야 하는 명령을 그대로 붙여넣으면 설치가 실패하기 때문입니다. 현재 51개 중 24개가 `safe-copy`, 21개가 `external-setup`, 6개가 `manual-required`입니다.

### 5. 관리자 인증과 DB 접근은 서버에만 둔다

- 관리자 세션은 만료 시각을 담은 페이로드를 HMAC-SHA256으로 서명한 토큰입니다. httpOnly, SameSite=Strict 쿠키로 24시간 유지하고, 서명 비교에는 `timingSafeEqual`을 씁니다. Node `crypto`만 쓰는 `lib/admin-session-core.ts`와 Next.js API(쿠키, 리다이렉트)를 쓰는 `lib/admin-session.ts`를 나눠서 토큰 로직을 단위 테스트로 검증합니다.
- Supabase 클라이언트는 `server-only`로 표시한 `lib/supabase-admin.ts`에서만 만들고, 브라우저는 Supabase에 직접 접속하지 않습니다. 모든 테이블에 RLS를 켜 두었고, 서버 코드는 service role로 접근합니다(`supabase/migrations/`).
- Supabase 설정이 없으면 관련 API만 503을 반환합니다(`SupabaseNotConfiguredError`). 추천과 조합 분석은 DB를 쓰지 않으므로 영향을 받지 않습니다.

## 검증

2026-10-13 로컬에서 직접 실행한 결과입니다.

| 항목 | 명령 | 결과 |
|---|---|---|
| 단위 테스트 | `pnpm test` (Vitest) | 13개 파일, 151건 통과 |
| 타입 검사 | `pnpm exec tsc --noEmit` | 오류 0건 |
| 린트 | `pnpm lint` | 경고·오류 0건 |

테스트 구성(건수): 조합 점수 50, `claude mcp list` 파서 22, 추천 엔진 17, 충돌·중복 규칙 17, 뉴스레터 API 7, 피드백 API 6, 플러그인 데이터 정합성 6, 분석 이벤트 전달 5, 제안 입력 검증 5, 관리자 세션 4, 설치 준비 4, 공유 4, Umami 스크립트·CSP 헤더 4.

테스트는 `lib/`의 순수 로직과 API 라우트 2개(Supabase는 모의 객체)를 대상으로 합니다. 컴포넌트 테스트와 E2E 테스트는 없고, CI 설정도 저장소에 없습니다. 위 명령은 수동으로 실행합니다.

## 기술 스택

| 구분 | 내용 (`package.json` 기준, 괄호는 설치된 버전) |
|---|---|
| 프레임워크 | Next.js `^14.2.0` App Router (14.2.35), React `^18.3.0` (18.3.1) |
| 언어 | TypeScript `^5.0.0` (5.9.3) |
| 스타일 | Tailwind CSS `^3.4.0` (3.4.19), shadcn/ui 형식 컴포넌트(`components/ui`), lucide-react |
| 데이터 | Supabase PostgreSQL, `@supabase/supabase-js` `^2.98.0` |
| 테스트·린트 | Vitest `^4.0.18`, ESLint `^8.0.0` + eslint-config-next |
| 방문 분석 | Umami (선택, 설정했을 때만 스크립트 로드) |
| 배포 | Vercel |
| 패키지 관리 | pnpm |

`@anthropic-ai/sdk` `^0.78.0`도 의존성에 있지만 AI 분석 기능이 비활성이라 현재 화면에서는 호출하지 않습니다.

## 로컬 실행

```bash
pnpm install
cp .env.local.example .env.local   # 필요한 값만 채웁니다
pnpm dev                           # http://localhost:3002

pnpm test        # 단위 테스트
pnpm lint
pnpm typecheck   # next build(compile 모드) + tsc --noEmit
pnpm build
```

Supabase를 쓰려면 `supabase/migrations/`의 SQL 5개를 날짜순으로 적용합니다.

### 환경 변수

값은 `.env.local`에만 둡니다. 이름은 `.env.local.example`에 있습니다.

| 이름 | 용도 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | 제안, 피드백, 뉴스레터, 관리자 기능. 없으면 해당 API가 503을 반환합니다. |
| `ADMIN_REVIEW_PASSWORD`, `ADMIN_SESSION_SECRET` | 관리자 로그인과 세션 서명 |
| `GITHUB_TOKEN` (선택) | GitHub API 호출 한도 완화 |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_PROXY_URL` (선택) | Umami 방문 분석 |
| `ANTHROPIC_API_KEY` (선택) | AI 분석용. 현재 화면에서 비활성 |

`.env.local.example`에 있는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`와 `LEAD_WEBHOOK_URL`은 현재 코드에서 읽지 않습니다.

## 알려진 제한

- **AI 분석은 비활성입니다.** `/api/analyze` 라우트는 있지만 화면에서 켜는 플래그가 꺼져 있고(`hooks/useAnalysis.ts`), 모든 추천은 규칙 기반입니다.
- **세팅 지원 서비스(`/services`)는 준비 중입니다.** 안내 페이지만 있고 `/api/lead`는 항상 503을 반환합니다.
- **관리자 화면의 플러그인 추가·숨김은 공개 화면에 반영되지 않습니다.** 변경 내용은 Supabase `custom_plugins` 테이블에 저장되지만, 카탈로그·추천·조합 분석은 `lib/plugins.ts`의 정적 데이터만 읽습니다. 실제 반영은 코드 수정과 재배포로 합니다.
- **추천은 부분 문자열 일치입니다.** 문맥을 이해하지 않으므로 `ui`, `db`, `api`처럼 짧은 키워드는 의도와 다르게 일치할 수 있습니다.
- **충돌·중복 규칙과 플러그인 메타데이터는 수작업 목록입니다.** 충돌 쌍 3개, 중복 그룹 3개이며, 검증 상태(검증 44, 부분 5, 미검증 2)도 사람이 기록한 값이라 플러그인이 바뀌어도 자동으로 갱신되지 않습니다.
- **조합 점수는 커버리지 비중이 큽니다.** 10개 카테고리를 기준으로 감점하므로 플러그인을 적게 쓰는 조합은 충돌이 없어도 점수가 낮게 나옵니다(1개만 입력하면 37점).
- **`feedback` 테이블 마이그레이션이 코드와 맞지 않습니다.** 코드는 `type` 컬럼을 쓰는데 저장소의 SQL에는 없습니다. 새 DB에 적용할 때는 컬럼을 추가해야 합니다.
- **히스토리와 즐겨찾기는 브라우저 localStorage에만 저장됩니다.** 기기 간 동기화가 없고, 히스토리는 최근 50건까지만 유지합니다.
- **요청 제한이 인메모리입니다.** 서버리스 인스턴스 간에 공유되지 않아 정확하지 않습니다. 트래픽이 늘면 외부 저장소 기반으로 바꿔야 합니다.
- **CSRF 토큰이 없습니다.** 관리자 API는 SameSite=Strict 쿠키에 의존합니다.

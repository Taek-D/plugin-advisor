# Plugin Advisor

Claude Code 플러그인 추천 + 조합 분석 웹서비스.

PRD, README, GitHub URL 등을 입력하면 키워드 분석 또는 AI 분석을 통해 적합한 플러그인 조합을 추천하고, 설치 스크립트를 생성합니다. 이미 설치된 플러그인 조합을 분석하여 점수화, 충돌 경고, 보완/대체 추천도 제공합니다.

## 배포 URL

https://plugin-advisor.vercel.app

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API (선택)
- **배포**: Vercel
- **패키지 관리**: pnpm

## 주요 기능

### 플러그인 추천 (`/advisor`)

- **텍스트 입력**: 프로젝트 설명, PRD, README 텍스트를 붙여넣으면 키워드 기반으로 플러그인 추천
- **파일 업로드**: 마크다운 파일 업로드 지원
- **GitHub URL**: GitHub 저장소 URL 입력 시 README를 자동으로 가져와 분석
- **키워드 분석**: 각 플러그인의 키워드 배열과 입력 텍스트를 매칭하여 스코어 계산, 상위 5개 플러그인 추천
- **프리셋 팩**: 4개의 미리 정의된 스타터 팩 (입문자 기본, 웹앱 시작, 데이터 수집, 백엔드 시작)
- **설치 스크립트 생성**: 추천된 플러그인의 설치 명령어를 한 번에 복사
- **충돌 감지**: 선택된 플러그인 간 충돌을 실시간으로 감지하여 경고
- **사전 체크리스트**: 설치 전 확인해야 할 사항 표시
- **비추천 플러그인 안내**: 초보자에게 위험할 수 있는 플러그인을 별도로 안내

### 플러그인 조합 분석 (`/optimizer`)

- **MCP list 붙여넣기**: `claude mcp list` 결과를 붙여넣으면 설치된 플러그인을 자동 인식 (2가지 포맷 지원, alias 정규화)
- **직접 타이핑**: 42개 DB 기반 자동완성으로 플러그인 검색 및 추가 (ARIA combobox, 키보드 네비게이션)
- **조합 점수**: 100점 감점 모델 — 충돌(-20), 중복(-7), 미커버 카테고리(-7) 감점
- **충돌/중복 경고**: 충돌하는 플러그인 쌍과 기능이 겹치는 그룹 감지
- **커버리지 분석**: 10개 카테고리 중 현재 조합이 커버하는 영역을 시각화
- **보완 추천**: 빠진 카테고리의 플러그인을 자동 제안 (이미 설치된 것 제외)
- **대체 추천**: deprecated/unverified 플러그인의 더 나은 대안 제시
- **Progressive disclosure**: 점수와 충돌 경고는 바로 표시, 보완/대체 추천은 접기/펼치기

### 플러그인 목록 (`/plugins`)

- 42개 등록 플러그인 카드형 목록
- 카테고리 필터링 (orchestration, workflow, code-quality, testing, documentation, data, security, integration, ui-ux, devops)
- 텍스트 검색
- 각 플러그인 상세 페이지 (`/plugins/[id]`)

### 스타터 가이드 (`/guides`)

- Claude Code 첫 세팅 체크리스트
- Windows MCP/npx 설치 문제 해결
- 웹앱 스타터 스택
- 백엔드 스타터 스택
- Claude Code 비용 및 운영 실수
- 스타터 보안 실수

### 관리자 기능 (`/admin`)

- **로그인**: HMAC 기반 세션 인증 (비밀번호 로그인, 24시간 TTL)
- **플러그인 제안 검토** (`/admin/suggestions`): 사용자가 제안한 플러그인을 검토 (대기/추가확인/통과/반영안함)
- **플러그인 관리** (`/admin/plugins`): 커스텀 플러그인 추가, 코어 플러그인 숨기기/복원
- 제안 검토 통과 → 플러그인 추가 페이지로 자동 연결

### 플러그인 제안

- 플러그인 목록 페이지 하단에서 누구나 새 플러그인을 제안 가능
- 저장소 URL, 제안 이유, 이름, 연락처 입력
- 제안은 Supabase에 저장되며 관리자 검토 후 반영

### 다국어 지원

- 한국어 (기본) / English 전환
- 네비게이션 바에서 언어 전환 가능

### 기타

- 분석 히스토리 (localStorage)
- 즐겨찾기 (localStorage)
- 플러그인 버전 정보 (GitHub Releases API)
- 다크 테마 (#080810 배경)
- 접근성: 전역 focus-visible ring, 폼 라벨(sr-only), 44px 이상 터치 타겟
- 비동기 콘텐츠 skeleton loader (버전 정보 등)

## 준비 중인 기능

- **AI 분석**: Anthropic Claude API를 통한 AI 기반 플러그인 분석 — API 연동 코드는 있으나 현재 비활성화 상태
- **세팅 지원 서비스** (`/services`): 1:1 세팅 점검, 프로젝트 맞춤 추천, 팀 온보딩 문서 — 페이지는 있으나 실제 서비스는 아직 운영하지 않음
- **리드 캡처 웹훅**: `.env.local.example`에 `LEAD_WEBHOOK_URL`이 선언되어 있으나 플러그인 제안과는 연결되지 않은 상태

## 알려진 제한사항

- **Rate Limiter가 인메모리**: 서버리스 환경에서 인스턴스 간 공유되지 않아 정확하지 않음. 트래픽이 늘면 Upstash Redis 등으로 교체 필요
- **Analytics가 localStorage 전용**: 서버 측 수집 없음
- **CSRF 토큰 없음**: 관리자 API에 `SameSite=strict` 쿠키로만 방어

## 환경변수

```env
# 필수 — Supabase (플러그인 제안, 커스텀 플러그인 저장)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# 필수 — 관리자 인증
ADMIN_REVIEW_PASSWORD=<관리자-비밀번호>
ADMIN_SESSION_SECRET=<32자-이상-랜덤-문자열>

# 선택 — AI 분석 (현재 비활성화, 준비 중)
ANTHROPIC_API_KEY=<anthropic-api-key>

# 선택 — GitHub API rate limit 완화
GITHUB_TOKEN=<github-personal-access-token>

# 선택 — 리드 캡처 웹훅 (준비 중)
LEAD_WEBHOOK_URL=<webhook-url>
```

## 로컬 개발

```bash
# 의존성 설치
pnpm install

# 개발 서버 (포트 3002)
pnpm dev

# 타입 체크
pnpm typecheck

# 린트
pnpm lint

# 프로덕션 빌드
pnpm build
```

## 프로젝트 구조

```
app/
├── page.tsx                    # 랜딩 페이지
├── advisor/page.tsx            # 플러그인 추천 (메인 기능)
├── optimizer/page.tsx          # 플러그인 조합 분석
├── plugins/page.tsx            # 플러그인 목록
├── plugins/[id]/page.tsx       # 플러그인 상세
├── guides/page.tsx             # 스타터 가이드 목록
├── guides/[slug]/page.tsx      # 가이드 상세
├── services/page.tsx           # 세팅 지원 (준비 중)
├── admin/login/page.tsx        # 관리자 로그인
├── admin/suggestions/page.tsx  # 제안 검토
├── admin/plugins/page.tsx      # 플러그인 관리
└── api/
    ├── analyze/route.ts        # AI 분석 API
    ├── github/route.ts         # GitHub README fetch
    ├── versions/route.ts       # 플러그인 버전 조회
    ├── lead/route.ts           # 리드 캡처
    ├── plugin-suggestions/     # 플러그인 제안 API
    └── admin/                  # 관리자 API (로그인, 플러그인, 제안)

components/                     # React 컴포넌트 (OptimizerApp, ResultsPanel, ScoreGauge 등)
lib/                            # 핵심 로직 (플러그인 DB, 추천 엔진, 조합 점수, 인증 등)
supabase/migrations/            # Supabase 마이그레이션 SQL
```

## 라이선스

비공개 프로젝트

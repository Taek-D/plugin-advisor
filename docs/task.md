# Task List — Claude Code Plugin Advisor

PRD 기반 태스크 목록. 진행 상황을 여기서 추적합니다.

---

## P0 — MVP 필수

### 입력
- [x] 텍스트 직접 입력으로 프로젝트 설명
- [x] 파일 업로드 (.md, .txt)
- [x] 파일 드래그앤드롭 지원
- [x] GitHub URL로 README 자동 불러오기 (서버사이드 API route)

### 추천 엔진
- [x] 키워드 기반 플러그인 추천 (10개 플러그인 DB)
- [x] 스코어 상위 4개 추천
- [x] OMC + Superpowers 동시 매칭 시 충돌 방지 로직
- [x] 매칭 키워드 없을 때 기본 추천 (bkit, context7)

### 결과 UI
- [x] 추천 이유 표시
- [x] 매칭 키워드 하이라이트
- [x] 충돌 경고 (OMC <-> Superpowers)
- [x] 플러그인 상세 모달 (설명, 기능, GitHub 링크)
- [x] 설치 스크립트 생성 & 클립보드 복사
- [x] 체크박스로 원하는 것만 선택

### 타입 & 구조
- [x] TypeScript 타입 정의 (lib/types.ts)
- [x] 컴포넌트 분리 (InputPanel, PluginCard, PluginModal, InstallScript, ConflictWarning)
- [x] 플러그인 DB 별도 파일 관리 (lib/plugins.ts)

### 배포 & 반응형
- [x] 반응형 레이아웃 모바일 최적화
- [x] Vercel 배포 설정 & 첫 배포 → https://plugin-advisor.vercel.app

---

## P1 — 배포 후 추가

- [x] 플러그인 DB 확장 (10개 -> 30개, 10개 카테고리, githubRepo 필드 추가)
- [x] 분석 히스토리 저장 (localStorage, async API, 자동 저장/복원/삭제)
- [x] 플러그인 조합 즐겨찾기 (localStorage, InstallScript에 저장 버튼, 패널에서 스크립트 복사)
- [x] 커뮤니티 추천 조합 공유 (Supabase + GitHub OAuth, 갤러리/공유폼/인증 구현)
- [x] 플러그인 최신 버전 알림 (GitHub API + Next.js revalidate 캐싱, 카드/모달/상세에 표시)
- [x] /plugins 전체 플러그인 목록 페이지 (검색 + 카테고리 필터 + 반응형 그리드)
- [x] /plugins/[id] 플러그인 상세 페이지 (SSG 32페이지, 설치가이드, 관련 플러그인)

### P1 추가 구현 사항
- [x] Nav 컴포넌트 추출 (layout.tsx에서 공유, 라우트별 활성 표시)
- [x] useAnalysis 훅 추출 (PluginAdvisorApp 200줄 이하 유지)
- [x] 충돌 감지 일반화 (CONFLICT_PAIRS 배열 기반 동적 감지)
- [x] Supabase SSR 클라이언트 (읽기전용 RSC + 뮤터블 Route Handler)
- [x] 인증 미들웨어 (세션 자동 갱신, env 미설정 시 graceful 통과)
- [x] SQL 마이그레이션 파일 (shared_combos + RLS 정책)

---

## P2 — 장기

- [ ] AI 기반 분석 (Claude API 옵션)
- [ ] 플러그인 리뷰 & 평점
- [ ] 다국어 지원 (EN/KO)

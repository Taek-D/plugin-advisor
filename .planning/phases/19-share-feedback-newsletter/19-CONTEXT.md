# Phase 19: Share + Feedback + Newsletter - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

결과 공유 버튼, 피드백 위젯, 뉴스레터 구독 폼 + i18n. /advisor와 /optimizer 결과 페이지에 공유 기능, 사이트 전역 피드백 수집 위젯, 랜딩 페이지에 뉴스레터 구독 폼을 추가한다.

</domain>

<decisions>
## Implementation Decisions

### 공유 기능
- /advisor 추천 결과 + /optimizer 조합 분석 결과 두 페이지에 공유 버튼 배치
- 기본은 URL 복사 버튼, 모바일에서 Web Share API 지원 시 네이티브 공유 시트 활성화
- 공유 콘텐츠는 현재 페이지 URL만 (OG 이미지가 이미 있으므로 SNS 프리뷰 자동 생성)
- 성공 피드백은 인라인 상태 전환 (Copy→Check 아이콘 + '복사됨' 텍스트) — 기존 클립보드 복사 패턴과 일관성 유지
- Toast UI 도입하지 않음 (zero new npm packages 원칙)

### 피드백 위젯
- 플로팅 버튼 + 슬라이드업 드로어 방식 — 화면 구석에 피드백 버튼, 클릭 시 드로어로 폼 표시
- 폼 구조: 타입 선택(버그/기능제안/기타) + 자유 텍스트 메시지
- Supabase feedback 테이블에 저장 (Phase 17에서 이미 생성됨)
- 완전 익명 — 로그인/이메일 없이 메시지만 수집, 진입 장벽 최소화
- 레이트 리밋 적용 (기존 rate-limit.ts 패턴 활용)

### 뉴스레터 구독
- 랜딩 페이지 푸터 바로 위에 구독 섹션 배치
- 이메일 필드만 수집 — 진입 장벽 최소화
- Supabase newsletter 테이블에 저장 (Phase 17에서 이미 생성됨)
- 이메일 인증(double opt-in) 없이 저장 — confirmed=false 기본값, 인증은 v2에서 처리
- 중복 구독 시도 시 성공처럼 보여줌 — 이메일 존재 여부 노출 방지 (보안)

### Claude's Discretion
- 플로팅 피드백 버튼의 정확한 위치/아이콘/애니메이션
- 드로어 슬라이드업 구현 방식 (CSS transition vs shadcn Sheet)
- 뉴스레터 섹션의 카피/일러스트 스타일
- 공유 버튼의 정확한 배치 위치 (결과 상단 vs 하단)
- API route 구조 (feedback/newsletter 각각 or 통합)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/card.tsx`, `button.tsx`, `input.tsx`, `textarea.tsx`, `dialog.tsx`: shadcn 컴포넌트
- `lib/analytics.ts` + `trackEvent`: localStorage + Umami 이중 추적 — 공유/피드백/구독 이벤트 추적에 활용
- `lib/rate-limit.ts`: IP 기반 API 레이트 리밋 — 피드백/뉴스레터 API에 재사용
- `lib/i18n/` + `useI18n`: 한/영 다국어 훅 — 모든 UI 텍스트에 적용
- `components/UmamiScript.tsx`: Umami 스크립트 로딩 패턴

### Established Patterns
- `navigator.clipboard.writeText` + Copy→Check 아이콘 전환: 7개 컴포넌트에서 사용 중
- Supabase 서버 사이드 연동: `lib/supabase-admin.ts` (service role key)
- API route 패턴: `app/api/plugin-suggestions/route.ts` (POST + rate limit + Supabase insert)
- 클라이언트 컴포넌트: `'use client'` + lucide-react 아이콘 + Tailwind 유틸리티

### Integration Points
- `/advisor` 결과: `components/ResultsPanel.tsx` — 공유 버튼 추가 지점
- `/optimizer` 결과: `components/OptimizerApp.tsx` — 공유 버튼 추가 지점
- 랜딩 페이지: `app/page.tsx` — 뉴스레터 섹션 추가 지점 (푸터 위)
- 레이아웃: `app/layout.tsx` — 피드백 플로팅 버튼 전역 배치 지점
- Supabase: feedback + newsletter 테이블 (Phase 17에서 생성 완료)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 19-share-feedback-newsletter*
*Context gathered: 2026-03-30*

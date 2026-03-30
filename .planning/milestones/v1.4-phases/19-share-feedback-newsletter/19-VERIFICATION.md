---
phase: 19-share-feedback-newsletter
verified: 2026-03-30T16:00:00Z
status: human_needed
score: 5/5 success criteria verified
re_verification: true
previous_status: gaps_found
previous_score: 8/12 must-haves verified (1/5 success criteria fully verified)
gaps_closed:
  - "X/LinkedIn 직접 공유 링크 없음 — ShareResultButton에 twitter.com/intent/tweet + linkedin.com/sharing 링크 추가됨 (Plan 19-04)"
  - "별점(Star Rating) UI 없음 — FeedbackWidget에 1-5 별점 UI + rating 상태 + API 전송 추가됨 (Plan 19-05)"
  - "/guides 페이지에 NewsletterForm 없음 — app/guides/page.tsx 및 app/guides/[slug]/GuideDetailClient.tsx 모두 통합됨 (Plan 19-04)"
  - "Supabase 타입 미생성 (@ts-expect-error) — lib/supabase-types.ts 생성, supabase-admin.ts에 createClient<Database> 적용, 두 API 라우트에서 @ts-expect-error 제거됨 (Plan 19-05)"
gaps_remaining: []
regressions: []
human_verification:
  - test: "FeedbackWidget 플로팅 버튼 + 드로어 + 별점 동작 확인"
    expected: "우하단에 '피드백' pill 버튼이 표시되고, 클릭 시 슬라이드업 드로어가 나타나며, 타입 선택 + 1-5 별점 클릭(선택적) + 메시지 입력 후 '보내기' 클릭 시 '소중한 의견 감사합니다!' 표시 후 1.5초 뒤 자동으로 닫힌다"
    why_human: "CSS translate-y/opacity transition + 별점 hover 색상(text-yellow-500) + DOM 위치 + 자동 닫기 타이밍은 프로그래밍 방식으로 검증 불가"
  - test: "데스크톱에서 X/LinkedIn 공유 버튼 동작 확인"
    expected: "Advisor 또는 Optimizer 결과 화면에서 X 버튼 클릭 시 twitter.com/intent/tweet 새 탭 열림. LinkedIn 버튼 클릭 시 linkedin.com/sharing 새 탭 열림"
    why_human: "window.open() 새 탭 동작 + 실제 브라우저 환경 필요"
  - test: "모바일에서 Web Share API 동작 확인"
    expected: "iOS Safari 또는 Android Chrome에서 공유 버튼 클릭 시 네이티브 공유 시트가 표시된다"
    why_human: "navigator.share는 실제 모바일 HTTPS 환경이 필요"
  - test: "/guides 및 /guides/[slug]에서 뉴스레터 폼 표시 확인"
    expected: "/guides 목록 페이지와 임의의 가이드 상세 페이지 하단에 뉴스레터 구독 섹션이 표시된다"
    why_human: "렌더링 레이아웃과 섹션 위치는 실제 브라우저 확인 필요"
  - test: "관리자 피드백 목록(/admin/feedback)에서 별점 표시 확인"
    expected: "rating이 있는 피드백에 ★★★☆☆ 형식의 별 표시가 나타난다"
    why_human: "requireAdminSession + 실제 Supabase 데이터 조회 + 별점 렌더링은 실제 환경 필요"
---

# Phase 19: Share + Feedback + Newsletter Verification Report

**Phase Goal:** 사용자가 추천/분석 결과를 SNS로 공유하고, 사이트에서 피드백을 제출하고, 뉴스레터를 구독할 수 있다
**Verified:** 2026-03-30T16:00:00Z
**Status:** human_needed (모든 자동화 검증 통과, 5개 항목 인간 검증 필요)
**Re-verification:** Yes — after gap closure (Plans 19-04, 19-05)

---

## Re-verification Summary

| Gap | Previous Status | Current Status | Evidence |
|-----|-----------------|----------------|----------|
| X/LinkedIn 직접 공유 링크 | FAILED | CLOSED | ShareResultButton.tsx lines 24, 30: twitter.com/intent/tweet + linkedin.com/sharing |
| 별점(Star Rating) UI | FAILED | CLOSED | FeedbackWidget.tsx lines 18-19, 134-154: rating/hoverRating state + star buttons |
| /guides NewsletterForm | FAILED | CLOSED | app/guides/page.tsx line 8, 50-52; GuideDetailClient.tsx line 12, 62-64 |
| Supabase @ts-expect-error | FAILED | CLOSED | lib/supabase-types.ts 생성; supabase-admin.ts line 4, 6, 29: createClient<Database>; 두 API 라우트에서 @ts-expect-error 없음 |

---

## Goal Achievement

### Observable Truths (ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| SC1 | Optimizer 결과 화면에서 공유 버튼을 누르면 X, LinkedIn으로 조합 점수/요약이 공유된다 | VERIFIED | ShareResultButton.tsx lines 23-33: handleShareX + handleShareLinkedin. OptimizerApp 통합 유지 |
| SC2 | Advisor 결과 화면에서 공유 버튼을 누르면 추천 결과 요약이 공유된다 | VERIFIED | PluginAdvisorApp.tsx step==="result" 조건에서 ShareResultButton 렌더링 (이전 검증에서 확인됨, 회귀 없음) |
| SC3 | 모바일에서 Web Share API가 동작하고, 데스크톱에서는 클립보드 복사 + 소셜 링크 폴백이 동작한다 | VERIFIED | share-utils.ts: Web Share API + clipboard. ShareResultButton lines 50-55: X/LinkedIn ghost 버튼이 소셜 링크 폴백 역할 |
| SC4 | 사이트 하단 우측의 피드백 위젯에서 별점 + 메시지를 제출하면 Supabase에 저장되고, 관리자가 확인할 수 있다 | VERIFIED | FeedbackWidget.tsx lines 18-19, 134-154, 50-51: rating state + star UI + API 전송. feedback/route.ts lines 30-34, 54: rating 파싱 + insert. admin/feedback/page.tsx lines 102-106: 별점 표시 |
| SC5 | 랜딩 페이지와 /guides에서 이메일 구독 폼으로 뉴스레터를 구독하면 Supabase에 저장되고 중복이 처리된다 | VERIFIED | app/page.tsx: NewsletterForm 통합 (이전 확인). app/guides/page.tsx lines 8, 49-52: NewsletterForm. GuideDetailClient.tsx lines 12, 61-64: NewsletterForm |

**Score:** 5/5 ROADMAP success criteria fully verified

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/supabase-types.ts` | Database type: feedback + newsletter_subscribers 테이블 | VERIFIED | 67줄. feedback(Row/Insert/Update/Relationships) + newsletter_subscribers(Row/Insert/Update/Relationships) |
| `lib/supabase-admin.ts` | createClient<Database> 제네릭 사용 | VERIFIED | line 4: import type { Database }; line 6: SupabaseClient<Database>; line 29: createClient<Database> |
| `components/ShareResultButton.tsx` | X/LinkedIn 공유 링크 포함 | VERIFIED | 58줄. handleShareX (line 23-27): twitter.com/intent/tweet. handleShareLinkedin (line 29-33): linkedin.com/sharing. 두 ghost 버튼 렌더링 (lines 50-55) |
| `components/FeedbackWidget.tsx` | 별점 UI + rating 전송 | VERIFIED | 187줄. rating/hoverRating state (lines 18-19). 별점 UI (lines 134-154). API body에 rating 포함 (lines 46-51). handleClose에서 reset (lines 33-34) |
| `app/api/feedback/route.ts` | @ts-expect-error 없음 + rating 필드 수용 | VERIFIED | 72줄. @ts-expect-error 없음 (grep 확인). rating 파싱 (lines 30-34). insert에 rating 포함 (line 54) |
| `app/api/newsletter/route.ts` | @ts-expect-error 없음 | VERIFIED | 55줄. @ts-expect-error 없음 (grep 확인). upsert 정상 동작 |
| `app/guides/page.tsx` | NewsletterForm 렌더링 | VERIFIED | line 8: import NewsletterForm. lines 49-52: `<section>` 래퍼 + `<NewsletterForm />` |
| `app/guides/[slug]/GuideDetailClient.tsx` | NewsletterForm 렌더링 | VERIFIED | line 12: import NewsletterForm. lines 61-64: `<section>` 래퍼 + `<NewsletterForm />` |
| `app/admin/feedback/page.tsx` | 별점 표시 | VERIFIED | lines 102-106: `{item.rating && <span>★.repeat(item.rating)☆.repeat(5-item.rating)</span>}` |
| `lib/i18n/types.ts` | shareOnX, shareOnLinkedin, ratingLabel 추가 | VERIFIED | line 221: shareOnX: string; line 222: shareOnLinkedin: string; line 231: ratingLabel: string |
| `lib/i18n/ko.ts` | 한국어 번역 키 | VERIFIED | line 220: shareOnX: "X에 공유"; line 221: shareOnLinkedin: "LinkedIn에 공유"; line 229: ratingLabel: "만족도" |
| `lib/i18n/en.ts` | 영어 번역 키 | VERIFIED | line 221: shareOnX: "Share on X"; line 222: shareOnLinkedin: "Share on LinkedIn"; line 230: ratingLabel: "Satisfaction" |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `components/ShareResultButton.tsx` | `twitter.com/intent/tweet` | window.open in handleShareX | WIRED | line 24: URL 생성 + line 25: window.open |
| `components/ShareResultButton.tsx` | `linkedin.com/sharing` | window.open in handleShareLinkedin | WIRED | line 30: URL 생성 + line 31: window.open |
| `app/guides/page.tsx` | `components/NewsletterForm.tsx` | JSX import and render | WIRED | line 8: import; lines 50-52: `<NewsletterForm />` in section |
| `app/guides/[slug]/GuideDetailClient.tsx` | `components/NewsletterForm.tsx` | JSX import and render | WIRED | line 12: import; lines 62-64: `<NewsletterForm />` in section |
| `components/FeedbackWidget.tsx` | `app/api/feedback/route.ts` | fetch POST with rating field | WIRED | lines 43-52: fetch("/api/feedback") body 포함 rating |
| `app/api/feedback/route.ts` | `lib/supabase-types.ts` | createClient<Database> via supabase-admin | WIRED | supabase-admin.ts line 4 import + line 29 createClient<Database>; feedback/route.ts line 50: supabase.from("feedback") 타입 안전하게 동작 |
| `app/api/newsletter/route.ts` | `lib/supabase-types.ts` | createClient<Database> via supabase-admin | WIRED | 동일. newsletter_subscribers 타입 정의됨 |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| SHAR-01 | 19-02, 19-04 | Optimizer 결과 화면에서 조합 점수/요약을 공유할 수 있다 | SATISFIED | OptimizerApp에 ShareResultButton 통합 유지. X/LinkedIn 링크 추가 |
| SHAR-02 | 19-02, 19-05 | Advisor 결과 화면에서 추천 결과를 공유할 수 있다 | SATISFIED | PluginAdvisorApp에 ShareResultButton 통합 유지 |
| SHAR-03 | 19-01, 19-02, 19-04 | 모바일 Web Share API, 데스크톱 클립보드 복사 + 소셜 링크 폴백 | SATISFIED | share-utils.ts Web Share API + clipboard. ShareResultButton X/LinkedIn 버튼이 소셜 링크 폴백 |
| FDBK-01 | 19-03, 19-05 | 사이트에서 피드백 위젯을 통해 의견을 제출할 수 있다 | SATISFIED | FeedbackWidget: 별점 + 타입 + 메시지 + POST 제출 |
| FDBK-02 | 19-03, 19-05 | 피드백이 Supabase에 저장되고 rate limit이 적용된다 | SATISFIED | /api/feedback: 5회/시간 rate limit + Supabase insert(rating 포함). @ts-expect-error 없음 |
| FDBK-03 | 19-03 | 관리자가 피드백을 확인할 수 있다 | SATISFIED | /admin/feedback: requireAdminSession + select + 별점 표시 |
| NEWS-01 | 19-03, 19-04 | 사용자가 이메일 구독 폼으로 뉴스레터를 구독할 수 있다 | SATISFIED | NewsletterForm: 랜딩 + /guides + /guides/[slug] 모두 통합 |
| NEWS-02 | 19-03, 19-05 | 구독 정보가 Supabase에 저장되고 중복/rate limit이 적용된다 | SATISFIED | /api/newsletter: 3회/시간 rate limit + upsert ignoreDuplicates. @ts-expect-error 없음 |

**Requirements coverage: 8/8 (SHAR-01, SHAR-02, SHAR-03, FDBK-01, FDBK-02, FDBK-03, NEWS-01, NEWS-02) — all SATISFIED**

---

## Anti-Patterns Found

이전 검증에서 발견된 `@ts-expect-error` 패턴 2건이 모두 해결되었습니다.

현재 새로운 anti-pattern 없음. Plan 19-04, 19-05에서 추가된 파일 모두 정상 구현 확인.

---

## Human Verification Required

### 1. FeedbackWidget 별점 + 드로어 동작

**Test:** 임의의 페이지(예: /)를 열고 우하단의 '피드백' pill 버튼을 클릭. 드로어가 열리면 별 중 하나를 클릭하여 별점 선택 후 메시지 입력, '보내기' 클릭
**Expected:** 별 hover 시 text-yellow-500 색상 전환, 클릭 시 선택 별 이하가 노란색으로 유지. 제출 후 "소중한 의견 감사합니다!" 표시 후 1.5초 뒤 자동으로 닫힌다
**Why human:** CSS color transition + hover 상태 + 자동 닫기 타이밍은 grep으로 검증 불가

### 2. 데스크톱에서 X/LinkedIn 공유 버튼

**Test:** 데스크톱 브라우저에서 /advisor 또는 /optimizer 결과 화면으로 이동. "X에 공유" 버튼과 "LinkedIn에 공유" 버튼을 각각 클릭
**Expected:** X 버튼 클릭 시 twitter.com/intent/tweet 새 탭 열림 (현재 URL + 제목 포함). LinkedIn 버튼 클릭 시 linkedin.com/sharing 새 탭 열림
**Why human:** window.open() 새 탭 동작 + 실제 브라우저 환경 필요

### 3. 모바일에서 Web Share API

**Test:** iOS Safari 또는 Android Chrome에서 /advisor 결과 화면의 기본 공유 버튼 클릭
**Expected:** 네이티브 공유 시트가 표시된다 (X/LinkedIn 버튼은 Web Share API와 별개로 항상 표시)
**Why human:** navigator.share는 실제 모바일 HTTPS 환경이 필요

### 4. /guides 및 /guides/[slug] 뉴스레터 폼 표시

**Test:** /guides 목록 페이지 하단 스크롤. 임의 가이드 상세 페이지(/guides/[slug]) 하단 스크롤
**Expected:** 두 페이지 모두 가이드 콘텐츠 하단에 뉴스레터 구독 섹션이 표시된다
**Why human:** 실제 페이지 렌더링 + 레이아웃 위치 확인 필요

### 5. 관리자 피드백 목록 별점 표시

**Test:** /admin/login에서 관리자 로그인 후 /admin/feedback 접근. 별점을 포함한 피드백 제출 후 확인
**Expected:** rating이 있는 항목에 ★★★☆☆ 형식 별 표시가 type 배지 옆에 나타난다
**Why human:** requireAdminSession + 실제 Supabase 데이터 조회 + 별점 렌더링 확인 필요

---

## Gaps Summary

**모든 4개 gap이 해결되었습니다.**

- **Gap 1 (X/LinkedIn 링크):** `components/ShareResultButton.tsx`에 `handleShareX`(twitter.com/intent/tweet)와 `handleShareLinkedin`(linkedin.com/sharing) 핸들러 및 ghost 버튼이 추가됨. i18n에 `shareOnX`/`shareOnLinkedin` 키 추가됨.
- **Gap 2 (별점 UI):** `components/FeedbackWidget.tsx`에 `rating`/`hoverRating` state와 1-5 별점 버튼 UI 추가됨. `app/api/feedback/route.ts`가 `rating` 필드를 파싱·저장하도록 업데이트됨. 관리자 페이지에서 별점 표시됨.
- **Gap 3 (/guides NewsletterForm):** `app/guides/page.tsx`와 `app/guides/[slug]/GuideDetailClient.tsx` 모두에 `NewsletterForm` import 및 section 렌더링 추가됨. ROADMAP SC#5 완전 충족.
- **Gap 4 (Supabase 타입):** `lib/supabase-types.ts` 생성(feedback + newsletter_subscribers 테이블 수동 타입). `lib/supabase-admin.ts`가 `createClient<Database>` 사용. 두 API 라우트에서 `@ts-expect-error` 완전 제거됨.

**회귀 없음:** 이전 검증에서 통과한 18개 plan must-haves는 모두 유지됨.

---

_Verified: 2026-03-30T16:00:00Z_
_Verifier: Claude (gsd-verifier) — re-verification after Plans 19-04 and 19-05_

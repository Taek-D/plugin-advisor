# UI Improve — 적용 내역

## Round 1 (이전 세션)

### CRITICAL (3/3 적용)
- C-01: SetupReadiness ARIA 속성 추가
- C-02: PluginSearch 카테고리 필터 `aria-pressed` 추가
- C-03: PresetPacks Card → native `<button>` 변환

### MAJOR (7/7 적용)
- M-01: 타이포그래피 스케일 정규화
- M-02: `warning` 색상 CSS 변수화
- M-03: 카테고리 스크롤 그래디언트 힌트
- M-04: OnboardingFlow 스텝 전환 `animate-fade-in`
- M-05: PluginModal 중복 Escape/scroll 처리 제거
- M-06: ScoreGauge `prefers-reduced-motion` 반영
- M-07: plugins 페이지 i18n 적용

### MINOR (6/6 적용)
- m-01: globals.css body 배경 CSS 변수화
- m-02: PluginGridCard focus-visible 스타일
- m-03: InstallScript/SetupReadiness cn() 패턴 통일
- m-04: 사이드바 매직넘버 → rem 토큰
- m-05: PluginCard 체크마크 시멘틱 색상
- m-06: Footer 보강

---

## Round 2 (현재 세션)

### CRITICAL (4/4 적용)

#### C2-01. CoverageGrid 하드코딩 hex 컬러 → CSS 변수
- `components/CoverageGrid.tsx` — `#22c55e` → `hsl(var(--primary))`, `#3b82f6` → `hsl(217 91% 60%)`, `#eab308` → `hsl(var(--warning))`

#### C2-02. CoverageGrid 접근성 — opacity + role/keyboard
- `components/CoverageGrid.tsx` — 미커버 카테고리 `opacity-30` → `opacity-50` (대비비 향상)
- 클릭 가능 div에 `role="button"`, `tabIndex={0}`, `onKeyDown` 추가
- `aria-label` 추가

#### C2-03. Pretendard font-display 제어
- `app/layout.tsx` — CDN link에 `rel="preload"` 추가
- `<style>` 태그로 `font-display: swap` 오버라이드 삽입

#### C2-04. CoverageGrid opacity 대비비 (C2-02에 포함)

### MAJOR (15/15 적용)

#### M2-01. 역전 반응형 `text-sm sm:text-xs` 수정
- `components/OnboardingFlow.tsx:179` — `text-sm sm:text-xs` → `text-xs sm:text-sm`
- `components/InstallScript.tsx:164` — `text-sm sm:text-xs` → `text-xs sm:text-sm`

#### M2-02. PluginDetail 10px 폰트 → 11px
- `components/PluginDetail.tsx` — `text-[0.625rem]` → `text-[0.6875rem]` (4개소)

#### M2-03. OnboardingFlow 스텝 인디케이터 aria
- `components/OnboardingFlow.tsx` — `<div>` → `<nav><ol><li>` 시맨틱 마크업
- `aria-current="step"` 추가, `aria-hidden` 장식 요소 처리
- `aria-label="온보딩 단계"` nav 라벨

#### M2-04. `transition-all` → 구체적 속성 (6개 파일)
- `ComplementSection.tsx` → `transition-[max-height,opacity]`
- `ReplacementSection.tsx` → `transition-[max-height,opacity]`
- `CoverageGrid.tsx` → `transition-[width]`
- `PluginCard.tsx` → `transition-[border-color,box-shadow]`
- `PluginGridCard.tsx` → `transition-[transform,border-color,box-shadow]`
- `PresetPacks.tsx` → `transition-[transform,border-color]`

#### M2-05. 아코디언 열림/닫힘 애니메이션
- `components/OnboardingFlow.tsx` — 트러블슈팅 섹션 + 개별 답변에 `animate-fade-in` 추가

#### M2-06. 탭 전환 콘텐츠 애니메이션
- `components/PluginAdvisorApp.tsx` — history/favorites 패널에 `animate-fade-in` wrapper 추가

#### M2-07. body radial-gradient 모바일 최적화
- `app/globals.css` — `@media (max-width: 640px)` 에서 gradient 1개로 간소화

#### M2-08. backdrop-filter 모바일 blur 감소
- `app/globals.css` — surface-panel: `blur(18px)` → `blur(10px)`, surface-panel-soft: `blur(16px)` → `blur(8px)` (모바일)

#### M2-09. surface-panel rgba → CSS 변수
- `app/globals.css` — `rgba(22,29,45,...)` → `hsl(var(--card) / ...)`
- border: `rgba(255,255,255,0.08)` → `hsl(var(--border) / 0.5)`

#### M2-10~15. `bg-white/5`, `border-white/10` → 시맨틱 토큰
- CSS 변수 `--overlay-subtle`, `--overlay-border` 추가
- Tailwind 토큰 `overlay-subtle`, `overlay-border` 등록
- 20개 파일에서 일괄 치환 완료

### MINOR (14/14 적용)

#### m2-01. ScoreGauge SVG inline rgba → CSS 변수
- `components/ScoreGauge.tsx` — `stroke="rgba(255,255,255,0.08)"` → `stroke="hsl(var(--overlay-border))"`

#### m2-02. `bg-primary/8` → 표준 문법
- `components/PluginAdvisorApp.tsx` — `bg-primary/8` → `bg-primary/[0.08]`

#### m2-03. PluginGridCard active/pressed 피드백
- `components/PluginGridCard.tsx` — `active:translate-y-0 active:shadow-md` 추가

#### m2-04. PresetPacks active 상태
- `components/PresetPacks.tsx` — `active:translate-y-0` 추가

#### m2-05. PluginGridCard aria-label 보강
- `components/PluginGridCard.tsx` — Link에 `aria-label={plugin.name — plugin.tag}` 추가

#### m2-06. section-kicker rgba → CSS 변수
- `app/globals.css` — `rgba(34,197,94,...)` → `hsl(var(--primary) / ...)`

#### m2-07. 컨테이너 폭 일관화
- `app/plugins/page.tsx` — `max-w-[960px]` → `max-w-6xl`
- `app/services/page.tsx` — `max-w-5xl` → `max-w-6xl`

#### m2-08~14. heading/spacing 일관성
- 기존 코드에서 heading 크기와 spacing은 페이지별 디자인 의도에 따른 것으로, 강제 통일보다 현재 패턴을 문서화하여 향후 참조

---

## Round 3: Phase 4~7 (현재 세션)

### Phase 4 -- taste-skill (M4/D3/V6)
- `components/ui/button.tsx` -- `active:scale-[0.98]` tactile feedback + `duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]` 표준 easing
- `components/Nav.tsx` -- nav link `duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]`
- `tailwind.config.ts` -- `fade-in` animation easing 표준화 (0.3s ease -> 0.25s cubic-bezier)

### Phase 5 -- impeccable chain (critique->arrange->typeset->animate->harden->polish)
- **critique**: `app/page.tsx`, `components/PluginAdvisorApp.tsx` -- hero gradient `rgba(34,197,94,...)` -> `hsl(var(--primary)/0.18)`
- **arrange**: spacing 시스템 이미 일관적 -- 추가 변경 불필요
- **typeset**: 폰트 조합(Space Grotesk + Pretendard + JetBrains Mono) 의도적이고 일관적 -- 추가 변경 불필요
- **animate**: M=4 기준 현재 모션 수준 적절 -- 추가 변경 불필요
- **harden**: `components/PluginGridCard.tsx` -- desc에 `line-clamp-3` 추가 (긴 텍스트 대응)
- **polish**: 남은 하드코딩 rgba 1개(검정 그림자)는 테마 독립적 -- 허용

### Phase 6 -- vercel/web-design-guidelines (5개 자동 수정, 3개 플래그)
- `app/layout.tsx` -- `color-scheme: dark` on `<html>`
- `app/layout.tsx` -- `<meta name="theme-color">` 추가
- `app/page.tsx` -- hero h1에 `text-pretty` (widow 방지)
- `components/ScoreGauge.tsx` -- 숫자에 `tabular-nums`
- `app/globals.css` -- `touch-action: manipulation` + `-webkit-tap-highlight-color: transparent`
- **FLAG F-1**: 장식 아이콘 `aria-hidden` -- 수십 개소, 텍스트 동반이라 실사용 영향 낮음
- **FLAG F-2**: input `autoComplete` -- 로그인/회원가입 폼 없어 영향 낮음
- **FLAG F-3**: URL 상태 동기화 -- PluginGrid만 URL 반영, 나머지 탭은 ephemeral

### Phase 7 -- FIGMA-EXPORT.md
- `FIGMA-EXPORT.md` 생성 -- 디자인 토큰, 타이포, 화면 목록, 컴포넌트 인벤토리, taste-skill 다이얼

---

## 검증 결과

- TypeScript: pass
- ESLint: pass (0 errors, 0 warnings)
- Production build: pass

---

## 검증 결과

- TypeScript: ✅ 통과
- ESLint: ✅ 에러/경고 없음
- 프로덕션 빌드: ✅ 성공

# Codex Plugin Advisor — AGENTS.md

## 프로젝트 개요

Codex 플러그인 조합을 추천해주는 웹 서비스.
PRD / README / GitHub URL 입력 → 키워드 분석 → 플러그인 추천 + 설치 스크립트 생성.

**현재 상태**: 프로토타입 완성 (React 단일 컴포넌트) → Next.js 웹 서비스로 이전 중

---

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **배포**: Vercel
- **분석 방식**: 키워드 기반 (API 호출 없음)

---

## 디렉토리 구조 (목표)

```
plugin-advisor/
├── app/
│   ├── page.tsx              # 메인 SPA (입력 → 결과)
│   ├── api/
│   │   └── github/route.ts   # GitHub README fetch (CORS 우회)
│   └── layout.tsx
├── components/
│   ├── InputPanel.tsx         # 텍스트/파일/GitHub 입력
│   ├── PluginCard.tsx         # 추천 플러그인 카드
│   ├── PluginModal.tsx        # 상세 모달
│   ├── InstallScript.tsx      # 설치 스크립트 + 복사
│   └── ConflictWarning.tsx    # 충돌 경고
├── lib/
│   ├── plugins.ts             # 플러그인 DB (10개)
│   ├── recommend.ts           # 키워드 매칭 엔진
│   └── conflicts.ts           # 충돌 규칙
├── docs/
│   ├── PRD.md
│   └── WIREFRAME.md
└── prototype/
    └── plugin-recommender.jsx # 완성된 프로토타입 (참고용)
```

---

## 핵심 로직

### 추천 엔진 (lib/recommend.ts)
- 각 플러그인마다 키워드 배열 보유
- 입력 텍스트에서 매칭되는 키워드 수 → 스코어 계산
- 스코어 상위 4개 추천
- OMC + Superpowers 동시 매칭 시 Superpowers 스코어 -1 (충돌 방지)

### 플러그인 DB (lib/plugins.ts)
현재 10개: OMC, bkit, Superpowers, UI/UX Pro Max, Context7, Ralph Loop, Repomix, Firecrawl, Playwright, Security Guidance

### GitHub fetch (app/api/github/route.ts)
- 서버사이드 API route로 CORS 우회
- main → master 브랜치 순서로 시도
- README.md 텍스트 반환

---

## 구현 시 주의사항

1. **프로토타입 참고**: `prototype/plugin-recommender.jsx`에 완성된 로직 있음. 그대로 포팅하되 TypeScript로 변환
2. **GitHub fetch**: 반드시 Next.js API route (서버사이드)로 구현. 클라이언트 직접 fetch는 CORS 에러
3. **키워드 매칭**: 대소문자 무시, 부분 일치 허용
4. **충돌 감지**: 선택된 플러그인 목록 변경 시 실시간 체크
5. **디자인**: 프로토타입의 다크 테마 (#080810 배경) 유지. JetBrains Mono + Syne 폰트

---

## 완료된 것 (프로토타입)

- [x] 텍스트/파일/GitHub 3가지 입력
- [x] 키워드 기반 추천 엔진
- [x] 10개 플러그인 DB
- [x] 충돌 경고 (OMC ↔ Superpowers)
- [x] 플러그인 상세 모달
- [x] 키워드 하이라이트
- [x] 설치 스크립트 생성 + 복사
- [x] 체크박스 선택

## 미완성 (Next.js 이전 시 구현)

- [ ] GitHub fetch → API route로 이전 (CORS 해결)
- [ ] TypeScript 타입 정의
- [ ] 반응형 레이아웃 (모바일)
- [ ] Vercel 배포 설정

---

## 개발 워크플로

### 패키지 관리
- **항상 `pnpm` 사용** (npm, yarn 사용 금지)

### 개발 순서
1. 변경 사항 작성
2. 타입체크: `pnpm typecheck`
3. 린트: `pnpm lint`
4. 빌드: `pnpm build`
5. 개발 서버: `pnpm dev`

### 코딩 컨벤션
- `type` 선호, `interface` 자제
- `enum` 사용 금지 → 문자열 리터럴 유니온 사용
- 컴포넌트는 `export default function ComponentName()` 형식
- 서버 컴포넌트 기본, 클라이언트 필요 시 `'use client'` 명시
- 스타일은 Tailwind 유틸리티 클래스 사용 (인라인 style 지양)

---

## 개발 원칙

- 컴포넌트 단위로 분리, 하나의 파일이 200줄 넘지 않게
- 플러그인 DB는 별도 파일로 관리 (추후 확장 고려)
- API 호출 최소화 (GitHub fetch만 서버사이드)
- 한국어 UI 기본
- `any` 타입 사용 금지
- `console.log` 디버깅용으로만, 커밋 전 제거

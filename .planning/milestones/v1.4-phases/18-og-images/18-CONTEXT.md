# Phase 18: OG Images - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

소셜 미디어에서 사이트 링크 공유 시 페이지별 맞춤 OG 이미지가 표시된다. 기본 OG, 주요 페이지 정적 OG, 플러그인/가이드 동적 OG를 포함. next/og 빌트인 ImageResponse를 사용하며 추가 패키지 설치 없음.

</domain>

<decisions>
## Implementation Decisions

### 비주얼 스타일
- 다크 배경 (사이트의 dark theme과 일치)
- 상단/하단 액센트 컬러 바로 시각적 구분감 추가
- 폰트: Space Grotesk (사이트 헤드라인 폰트와 동일, Google Fonts에서 fetch)
- 하단에 pluginadvisor.cc URL 표시

### 플러그인 동적 OG (/plugins/[id])
- 표시 정보: plugin.name + plugin.tag + [MCP/Plugin 타입 배지] + [category 배지]
- 액센트 바 색상: Plugin.color 필드 활용 (플러그인별 고유 색상)
- 언어: 영어만 사용 (tag, category, type 모두 영어 필드)
- 기존 generateMetadata + generateStaticParams 활용

### 가이드 동적 OG (/guides/[slug])
- 표시 정보: guide.title + guide.summary (truncated)
- 액센트 바 색상: 고정 브랜드 색상 (가이드에는 개별 color 없음)
- 기존 generateMetadata + generateStaticParams 활용

### 정적 OG (주요 페이지)
- / (랜딩): 메인 브랜드 OG
- /advisor: "Find your plugins" 컨셉 OG
- /plugins: "Plugin Catalog" 컨셉 OG
- /guides: "Starter Guides" 컨셉 OG
- /services 및 기타: 기본 브랜드 OG 사용

### Claude's Discretion
- Twitter 카드 타입 선택 (summary_large_image vs summary, 페이지별 판단)
- 가이드 OG 한국어 텍스트 렌더링 전략 (시스템 폰트 폴백 vs 영어 필드 우선)
- 정확한 색상 값 (다크 배경 색상, 기본 브랜드 액센트 색상)
- OG 이미지 레이아웃 세부 사항 (패딩, 텍스트 크기, 배지 스타일)
- 기본 OG와 정적 OG의 구체적 tagline 문구

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/plugins/[id]/page.tsx`: generateMetadata + generateStaticParams 이미 구현 — openGraph 확장만 필요
- `app/guides/[slug]/page.tsx`: generateMetadata + generateStaticParams 이미 구현 — openGraph 확장만 필요
- `lib/types.ts`: Plugin 타입에 name, tag, color, category, type(ItemType) 필드 존재
- `lib/plugins.ts`: PLUGINS 객체로 전체 플러그인 데이터 접근 가능
- `lib/guides.ts`: STARTER_GUIDES 배열로 가이드 데이터 접근 가능
- Space Grotesk + JetBrains Mono: `app/layout.tsx`에서 Google Fonts 로드 중

### Established Patterns
- Metadata: `export function generateMetadata()` 패턴 (plugins, guides 페이지)
- 서버 컴포넌트 기본, 클라이언트 필요 시 `'use client'`
- Tailwind 다크 테마: `colorScheme: "dark"`, `bg-background text-foreground`

### Integration Points
- `app/layout.tsx`: 루트 metadata에 기본 openGraph/twitter 메타데이터 추가
- `app/plugins/[id]/page.tsx`: generateMetadata 반환값에 openGraph 추가
- `app/guides/[slug]/page.tsx`: generateMetadata 반환값에 openGraph 추가
- 주요 페이지 라우트: `/advisor/page.tsx`, `/plugins/page.tsx` (목록), `/guides/page.tsx` (목록)

</code_context>

<specifics>
## Specific Ideas

- 플러그인 OG에서 Plugin.color를 액센트 바에 적용하여 각 플러그인이 고유한 소셜 카드를 가짐
- 가이드는 브랜드 통일감을 위해 고정 색상, 플러그인은 다양성을 위해 개별 색상
- 전체적인 톤: 미니멀, 텍스트 중심, 아이콘/이모지 없음

</specifics>

<deferred>
## Deferred Ideas

- OGIM-04: /advisor, /optimizer 결과에 대한 동적 OG 이미지 (URL 파라미터 기반) — v2 요구사항
- 한국어 전용 OG 폰트 (Noto Sans KR subset) — Out of Scope으로 결정됨

</deferred>

---

*Phase: 18-og-images*
*Context gathered: 2026-03-30*

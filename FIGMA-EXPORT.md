# Figma Export Guide

## Option A -- Standard Mode

1. [Stitch](https://stitch.withgoogle.com) 열기
2. 아래 프롬프트를 붙여넣어 화면 재생성
3. "Copy to Figma" 버튼 클릭 -> Figma에서 Ctrl+V

## Option B -- HTML-to-Design

1. 개발 서버 실행: `pnpm dev`
2. 브라우저에서 각 페이지 스크린샷 또는 HTML 저장
3. Figma -> Plugins -> [html.to.design](https://www.figma.com/community/plugin/1159123024924461424)
4. HTML 파일 또는 URL 입력

## Design Tokens

프로젝트의 디자인 토큰은 `app/globals.css` :root 블록에 정의되어 있습니다.
Figma Variables로 매핑할 때 아래 값을 참조하세요.

| Token | HSL Value | 용도 |
|-------|-----------|------|
| --background | 222.2 47.4% 11.2% | 페이지 배경 |
| --foreground | 210 40% 98% | 기본 텍스트 |
| --card | 217.2 32.6% 17.5% | 카드/패널 배경 |
| --primary | 142.1 76.2% 36.3% | 주요 액센트 (녹색) |
| --destructive | 0 84.2% 60.2% | 에러/파괴 액션 |
| --warning | 38 92% 50% | 경고 (앰버) |
| --muted-foreground | 215 20.2% 65.1% | 보조 텍스트 |
| --ai-accent | 262 83% 74% | AI 기능 강조 (퍼플) |
| --radius | 0.5rem | 기본 border-radius |

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Heading | Space Grotesk | 700 (Bold) | 2xl--6xl |
| Body | Pretendard Variable | 400 (Regular) | sm--base |
| Mono | JetBrains Mono | 400 | xs--sm |

## Key Screens

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero + feature cards + 3-step flow |
| Advisor | `/advisor` | Preset packs + manual diagnosis input |
| Advisor Result | `/advisor` (result state) | Plugin cards + checklist + install script |
| Plugin Catalog | `/plugins` | Filterable grid (MCP/Plugin tabs) |
| Plugin Detail | `/plugins/[id]` | Single plugin info + install commands |
| Optimizer | `/optimizer` | Score gauge + coverage grid + complements |
| Services | `/services` | Coming-soon service packages |
| Guides | `/guides` | Starter guide list |

## Component Inventory

### Layout
- `Nav` -- Sticky top bar with pill navigation
- `surface-panel` / `surface-panel-soft` -- Glassmorphic card surfaces
- `section-kicker` -- Small pill badge for section labels

### UI Primitives (shadcn/ui)
- `Button` (default, outline, ghost, destructive, xs/sm/lg)
- `Card`
- `Badge` (default, outline)
- `Input` / `Textarea`
- `Dialog` (Radix-based modal)
- `TabsList` / `TabsTrigger`

### Domain Components
- `PluginCard` -- Selectable plugin with checkbox, badges, reason
- `PluginGridCard` -- Catalog grid card with hover lift
- `PresetPacks` -- 2x2 grid of starter pack cards
- `OnboardingFlow` -- 3-step wizard (overview -> install -> done)
- `SetupReadiness` -- Preflight checklist with checkbox items
- `InstallScript` -- Copy-safe command block
- `ScoreGauge` -- SVG circular gauge with animated arc
- `CoverageGrid` -- 5x2 category coverage icons
- `LeadCaptureCard` -- Coming-soon CTA card

## taste-skill Dial Values

```
MOTION_INTENSITY = 4   (SaaS, minimal)
DESIGN_VARIANCE  = 3   (predictable layout)
VISUAL_DENSITY   = 6   (daily app density)
```

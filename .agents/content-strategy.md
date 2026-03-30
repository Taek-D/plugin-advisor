# Content Strategy: Plugin Advisor

*작성일: 2026-03-30*
*기반: product-marketing-context.md, customer-research-report.md, positioning-ideas.md, gtm-strategy.md*

---

## 1. Content Pillars (4개)

### Pillar A: Claude Code 세팅 가이드 (Searchable)
**연결:** 핵심 제품 가치 — "세팅 실패 방지"
**타겟 검색:** "claude code 설정", "claude code mcp 설치", "claude code 플러그인 추천"
**기존 콘텐츠:** 6개 스타터 가이드 (/guides)

### Pillar B: 플러그인 조합 & 분석 (Searchable + Shareable)
**연결:** 차별화 기능 — 조합 점수, 충돌 감지, 보완 추천
**타겟 검색:** "claude code best plugins", "mcp server list", "claude code plugin conflicts"
**기존 콘텐츠:** /plugins 카탈로그 (51개), /optimizer

### Pillar C: 개념 정리 & 튜토리얼 (Searchable)
**연결:** 고객 조사 Theme 6 — "Skills vs MCP vs Plugins 개념 혼란"
**타겟 검색:** "mcp란", "claude code plugin vs mcp", "claude code skills"
**기존 콘텐츠:** 없음 (콘텐츠 갭)

### Pillar D: 실전 사례 & 인사이트 (Shareable)
**연결:** 고객 조사 Theme 3/4 — 토큰 낭비, 비개발자 유입
**타겟:** X/GeekNews/Velog 공유용
**기존 콘텐츠:** 없음 (콘텐츠 갭)

---

## 2. Priority Topics (20개, 우선순위순)

### Tier 1 — 즉시 제작 (검색 기반, 높은 전환)

| # | 토픽 | 유형 | Pillar | 검색/공유 | Buyer Stage | 근거 |
|---|------|------|--------|-----------|-------------|------|
| 1 | Claude Code 플러그인 추천 2026 (종합 가이드) | Hub | A | Searchable | Awareness | Theme 1 "뭘 깔아야 할지 모르겠다" |
| 2 | Claude Code MCP 서버 설치 완전 가이드 | Tutorial | A | Searchable | Implementation | Theme 2 기술적 장벽 |
| 3 | Claude Code 플러그인 조합 진단하는 법 | Use-case | B | Searchable | Consideration | /optimizer 제품 연결 |
| 4 | MCP vs Plugin vs Skill — 차이점 정리 | Explainer | C | Searchable | Awareness | Theme 6 개념 혼란 |
| 5 | Claude Code 첫 세팅 5분 완료 (프리셋 팩) | Tutorial | A | Both | Implementation | 프리셋 팩 → 제품 전환 |

### Tier 2 — 1~2주 내 (검색+공유 혼합)

| # | 토픽 | 유형 | Pillar | 검색/공유 | Buyer Stage | 근거 |
|---|------|------|--------|-----------|-------------|------|
| 6 | Claude Code 토큰 절약하는 플러그인 조합 | Data-driven | B | Both | Consideration | Theme 3 토큰 낭비 |
| 7 | Windows에서 Claude Code MCP 설치 트러블슈팅 | Tutorial | A | Searchable | Implementation | Windows 검색 수요 |
| 8 | Claude Code 프리셋 팩 비교: 입문자 vs 웹앱 vs 백엔드 | Comparison | B | Searchable | Consideration | 프리셋 선택 지원 |
| 9 | 비개발자를 위한 Claude Code 시작 가이드 | Tutorial | A | Shareable | Awareness | Theme 4 비개발자 유입 |
| 10 | Claude Code 플러그인 충돌 피하는 법 | Explainer | B | Searchable | Decision | 충돌 감지 차별화 |

### Tier 3 — 월간 제작 (권위 구축)

| # | 토픽 | 유형 | Pillar | 검색/공유 | Buyer Stage | 근거 |
|---|------|------|--------|-----------|-------------|------|
| 11 | CLAUDE.md 작성 가이드 (템플릿 포함) | Template | C | Both | Implementation | Theme 5 공유 수요 |
| 12 | Claude Code vs Cursor vs Copilot 플러그인 비교 | Comparison | C | Searchable | Awareness | "vs" 검색 |
| 13 | Claude Code 보안: 안전한 MCP 서버 선택법 | Explainer | C | Searchable | Decision | Theme 7 보안 우려 |
| 14 | 프로젝트 유형별 최적 플러그인 조합 | Use-case | B | Both | Consideration | 세그먼트별 맞춤 |
| 15 | Claude Code 플러그인 생태계 현황 2026 | Data-driven | D | Shareable | Awareness | 데이터 스토리 |

### Tier 4 — 분기별 (Shareable, 권위)

| # | 토픽 | 유형 | Pillar | 검색/공유 | 근거 |
|---|------|------|--------|-----------|------|
| 16 | "9,000개 MCP 서버 중 쓸 만한 건 50개" 데이터 분석 | Data-driven | D | Shareable | production-ready 인용 |
| 17 | 팀 플러그인 표준화 사례 (팀 온보딩) | Case Study | D | Shareable | 테크 리드 타겟 |
| 18 | Claude Code 플러그인 만들기 (기여 가이드) | Tutorial | C | Searchable | 커뮤니티 UGC 루프 |
| 19 | 월간 플러그인 트렌드 리포트 | Data-driven | D | Shareable | 반복 방문 유도 |
| 20 | ChatGPT에서 Claude Code로 이동 가이드 | Tutorial | A | Searchable | 이주자 온보딩 |

---

## 3. Topic Cluster Map

```
Plugin Advisor Content
├── Pillar A: 세팅 가이드
│   ├── [Hub] Claude Code 플러그인 추천 2026
│   ├── MCP 서버 설치 완전 가이드
│   ├── 첫 세팅 5분 완료 (프리셋 팩)
│   ├── Windows MCP 트러블슈팅
│   ├── 비개발자 시작 가이드
│   └── ChatGPT → Claude Code 이동 가이드
│
├── Pillar B: 조합 & 분석
│   ├── [Hub] 플러그인 조합 진단하는 법
│   ├── 토큰 절약 플러그인 조합
│   ├── 프리셋 팩 비교
│   ├── 충돌 피하는 법
│   └── 프로젝트별 최적 조합
│
├── Pillar C: 개념 & 튜토리얼
│   ├── [Hub] MCP vs Plugin vs Skill
│   ├── CLAUDE.md 작성 가이드
│   ├── Claude Code vs Cursor vs Copilot
│   ├── 안전한 MCP 서버 선택법
│   └── 플러그인 만들기 가이드
│
└── Pillar D: 인사이트 & 데이터
    ├── 생태계 현황 2026
    ├── "9,000개 중 50개" 데이터 분석
    ├── 팀 표준화 사례
    └── 월간 트렌드 리포트
```

---

## 4. 콘텐츠 포맷 & 채널 매핑

| 포맷 | 채널 | 빈도 | 비고 |
|------|------|------|------|
| /guides 페이지 (한국어) | 사이트 내 SEO | Tier 1 즉시 | 기존 6개 + 신규 가이드 |
| Velog 시리즈 | 검색 + 커뮤니티 | 주 1회 | GTM Tier 1, 사이트 유입 |
| GeekNews 소개 | 초기 인지도 | 1회 (런칭 시) | 도구 소개 + 데모 |
| X(Twitter) 스레드 | 바이럴 | 주 2-3회 | 인사이트, 데모 GIF |
| r/ClaudeAI 포스트 | 글로벌 시드 | 월 2회 | 영문, 도구 소개 |

---

## 5. 90일 실행 캘린더

### Month 1 (기반)
- Week 1-2: Hub 콘텐츠 2개 (#1 플러그인 추천 종합, #4 MCP vs Plugin)
- Week 3: 제품 연결 콘텐츠 (#3 조합 진단법, #5 프리셋 팩)
- Week 4: GeekNews 런칭 포스트 + X 스레드 시작

### Month 2 (확장)
- Week 5-6: Tier 2 콘텐츠 (#6 토큰 절약, #7 Windows, #9 비개발자)
- Week 7-8: Velog 시리즈 연재, r/ClaudeAI 첫 포스트

### Month 3 (권위)
- Week 9-10: Tier 3 시작 (#11 CLAUDE.md, #12 비교)
- Week 11-12: 데이터 콘텐츠 (#15 생태계 현황), 성과 분석

---

## 6. 콘텐츠-제품 연결

| 콘텐츠 | CTA | 연결 페이지 |
|--------|-----|-------------|
| 플러그인 추천 가이드 | "내 프로젝트에 맞는 추천 받기" | /advisor |
| 조합 진단 관련 | "내 조합 점수 확인하기" | /optimizer |
| 프리셋 팩 관련 | "프리셋으로 바로 시작하기" | /advisor |
| 설치 가이드 | "설치 스크립트 생성하기" | /plugins/[id] |
| 팀/서비스 관련 | "세팅 점검 신청하기" | /services |

---

## 7. 키워드 타겟 (검색 의도별)

### Awareness
- "claude code 플러그인 추천" / "best claude code plugins"
- "mcp 서버란" / "what is mcp server"
- "claude code 시작하기" / "claude code getting started"

### Consideration
- "claude code 플러그인 비교" / "claude code plugin comparison"
- "claude code vs cursor plugins"
- "claude code 조합 분석" / "claude code plugin combo"

### Decision
- "claude code 플러그인 충돌" / "claude code plugin conflicts"
- "claude code 보안 설정" / "claude code security setup"
- "claude code 세팅 서비스"

### Implementation
- "claude code mcp 설치 방법" / "how to install mcp server"
- "claude code 프리셋" / "claude code preset pack"
- "CLAUDE.md 작성법" / "how to write CLAUDE.md"

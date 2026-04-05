# GTM Strategy: Plugin Advisor

*작성일: 2026-03-29*
*비치헤드: 한국 Claude Code 사용자*
*기반: beachhead-segment.md, positioning-ideas.md, value-proposition.md, customer-research-report.md*

---

## 1. 전략 요약

**목표:** 한국 Claude Code 사용자 커뮤니티에서 "플러그인 세팅 = Plugin Advisor"로 인지되는 것
**기간:** 90일 (2026 Q2)
**모델:** Product-Led Growth (무료 도구 → 커뮤니티 확산 → 유료 서비스 전환)
**예산:** $0 (콘텐츠 + 커뮤니티 중심, 유료 광고 없음)

---

## 2. 마케팅 채널

### Tier 1: 핵심 채널 (집중)

| 채널 | 역할 | 왜 이 채널인가 |
|------|------|---------------|
| **GeekNews** | 초기 인지도 폭발 | 한국 개발자 최대 뉴스 피드. 좋은 도구 소개 글은 수백~수천 조회 |
| **Velog** | SEO + 장기 유입 | 한국 개발자 블로그 플랫폼. "Claude Code 세팅" 검색 시 상위 노출 |
| **X(Twitter) 한국 개발자** | 바이럴 + 대화 | AI/개발 도구 논의가 가장 활발한 채널. 짧은 데모 영상 효과적 |

### Tier 2: 보조 채널

| 채널 | 역할 | 왜 이 채널인가 |
|------|------|---------------|
| **r/ClaudeAI** | 글로벌 초기 시드 | 42만+ 구독자, 영어 콘텐츠로 글로벌 인지도 동시 확보 |
| **PyTorch 한국 커뮤니티** | 니치 커뮤니티 침투 | AI/ML 개발자 밀집, Team Attention 플러그인 논의 활발 |
| **카카오 오픈채팅/디스코드** | 직접 대화 | Claude Code 한국 사용자 그룹이 있다면 직접 참여 |

### Tier 3: 미래 채널 (Month 3+)

| 채널 | 역할 | 시점 |
|------|------|------|
| **Dev.to / Medium** | 글로벌 확장 | 한국 PMF 검증 후 |
| **YouTube** | 데모 영상 | 사용 사례 축적 후 |
| **LinkedIn** | B2B/팀 타겟 | 유료 서비스 출시 시 |

---

## 3. 메시징

### Core Message (핵심 메시지)
> "Claude Code에 어떤 플러그인을 설치해야 할지 모르겠다면 — 5분 안에 검증된 조합을 추천받으세요."

### 채널별 메시징

**GeekNews 소개 글:**
> "Claude Code 플러그인 추천 + 조합 분석 도구를 만들었습니다. 프리셋 팩으로 5분 첫 세팅, `claude mcp list` 붙여넣기로 조합 진단. 한국어 기본 지원. 무료입니다."

**Velog 시리즈 제목:**
1. "Claude Code 첫 세팅, 5분 안에 끝내는 방법"
2. "당신의 Claude Code 플러그인 조합 점수는 몇 점?"
3. "Claude Code 플러그인 충돌 감지 — 이 조합은 피하세요"

**X(Twitter) 포스팅 패턴:**
- 데모 GIF (15초) + 한 줄 설명
- "claude mcp list 붙여넣기 → 점수 + 충돌 + 추천 한 번에"
- 사용자 피드백 리트윗 + 코멘트

**Reddit (r/ClaudeAI) 소개:**
> "Built a free tool for Claude Code plugin diagnosis. Paste your `claude mcp list` output → get a combo score, conflict warnings, and complementary plugin recommendations. Supports Korean + English."

### 세그먼트별 메시지 변형

| 세그먼트 | 핵심 메시지 | CTA |
|----------|-----------|-----|
| 초보자 | "9,000+개 중 뭘 깔아야 할지 모르겠다면, 프리셋 팩으로 시작하세요" | 세팅 진단 시작 |
| 중급자 | "당신의 플러그인 조합 점수는? 충돌과 빈틈을 확인하세요" | 조합 분석 시작 |
| 팀 리더 | "팀 전원이 같은 세팅으로 시작하게 만드세요" | 서비스 문의 |

---

## 4. 성공 지표 (KPIs)

### 인지도 (Awareness)

| 지표 | 목표 (90일) | 측정 방법 |
|------|------------|----------|
| GeekNews 소개 글 조회수 | 1,000+ | GeekNews 통계 |
| Velog 시리즈 총 조회수 | 3,000+ | Velog 통계 |
| X 노출수 | 10,000+ | X Analytics |

### 활성화 (Activation)

| 지표 | 목표 (90일) | 측정 방법 |
|------|------------|----------|
| 월간 사이트 방문자 | 500+ | Vercel Analytics |
| Advisor 사용 (진단 시작) | 200+ | localStorage 이벤트 |
| Optimizer 사용 (조합 분석) | 100+ | localStorage 이벤트 |

### 참여 (Engagement)

| 지표 | 목표 (90일) | 측정 방법 |
|------|------------|----------|
| 플러그인 제안 건수 | 10+ | Supabase |
| 즐겨찾기 사용자 | 50+ | (서버 분석 추가 필요) |
| 재방문율 | 20%+ | Vercel Analytics |

### 레퍼런스 (Reference)

| 지표 | 목표 (90일) | 측정 방법 |
|------|------------|----------|
| 사용자 후기/언급 | 5+ | 수동 추적 |
| 외부 링크 (백링크) | 3+ | Search Console |
| 플러그인 제안 커뮤니티 기여 | 5+ | Supabase |

---

## 5. 런칭 플랜 (90일)

### Pre-Launch: Week 0 (준비)
- [ ] 서버 측 Analytics 추가 (현재 localStorage만 존재)
- [ ] 사이트 내 피드백 폼 추가
- [ ] OG 이미지 / 소셜 공유 카드 최적화
- [ ] GeekNews/Velog/X 계정 준비

### Phase A: Launch (Week 1-2)

**Week 1: GeekNews 런칭**
- [ ] GeekNews에 소개 글 게시
- [ ] X에 런칭 트윗 (데모 GIF 포함)
- [ ] r/ClaudeAI에 영어 소개 글

**Week 2: 피드백 수집**
- [ ] GeekNews/Reddit 댓글 모니터링 + 응답
- [ ] 초기 사용자 피드백 기반 즉시 수정
- [ ] 첫 사용자 후기 요청

### Phase B: Content (Week 3-6)

**Week 3-4: Velog 시리즈**
- [ ] 글 1: "Claude Code 첫 세팅, 5분 안에 끝내는 방법"
- [ ] 글 2: "당신의 플러그인 조합 점수는?"
- [ ] 글 3: "이 플러그인 조합은 피하세요 — 충돌 감지"

**Week 5-6: 바이럴 콘텐츠**
- [ ] "조합 점수 공유" 기능 or 스크린샷 유도
- [ ] X에서 Claude Code 관련 대화에 자연스럽게 참여
- [ ] PyTorch 한국 커뮤니티에 소개

### Phase C: Growth (Week 7-12)

**Week 7-8: 커뮤니티 확장**
- [ ] 카카오 오픈채팅/디스코드 Claude Code 그룹 참여
- [ ] 사용자 인터뷰 3건 진행
- [ ] 한국 AI 밋업 발표 (온라인)

**Week 9-10: 레퍼런스 확보**
- [ ] 사용자 후기 5건 수집 + 사이트 게시
- [ ] 기업 도입 사례 1건 확보 시도
- [ ] SEO 성과 체크 + 콘텐츠 최적화

**Week 11-12: 확장 준비**
- [ ] 글로벌 확장용 영어 콘텐츠 준비
- [ ] 유료 서비스 Beta 기획
- [ ] 90일 성과 리뷰 + Q3 계획

---

## 6. 리스크 & 대응

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| GeekNews에서 반응 저조 | 중 | 중 | Velog SEO로 장기 유입 확보, X 바이럴에 집중 |
| Anthropic이 유사 기능 강화 | 중 | 높음 | 충돌 감지/조합 점수/한국어 등 차별점 강화 |
| 서버 분석 부재로 데이터 부족 | 높음 | 중 | Week 0에 Analytics 우선 추가 |
| 사용자 피드백 수집 어려움 | 중 | 중 | 사이트 내 피드백 폼 + 직접 아웃리치 |
| 한국 시장 규모 한계 | 낮음 | 중 | Month 3부터 글로벌 확장 병행 |

---

## 7. 즉시 실행 가능한 Actions (Top 5)

1. **서버 측 Analytics 추가** — 현재 localStorage만 있어 성과 측정 불가 (기술 작업)
2. **OG 이미지 최적화** — 소셜 공유 시 첫인상 결정 (기술 작업)
3. **GeekNews 소개 글 초안** — 런칭 트리거 (콘텐츠 작업)
4. **Velog 시리즈 글 1 초안** — SEO 기반 장기 유입 (콘텐츠 작업)
5. **사이트 내 피드백 폼** — 사용자 목소리 수집 채널 (기술 작업)

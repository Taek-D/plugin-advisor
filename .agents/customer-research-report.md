# Customer Research Report: Plugin Advisor

*조사일: 2026-03-29*
*소스: Reddit 5개 서브레딧(~280 게시물), 웹 16개 소스 (GitHub Issues, HN, 블로그, 한국 커뮤니티)*

---

## Executive Summary

Claude Code 플러그인 생태계가 9,000+개로 폭발적 성장한 가운데, 사용자들은 **선택의 마비**, **설정의 복잡성**, **토큰 낭비**라는 세 가지 핵심 고통을 겪고 있다. Plugin Advisor가 해결하는 "어떤 플러그인을 써야 하는가"는 Reddit과 웹 전반에서 **가장 빈번하게 등장하는 질문**이다.

---

## Top Themes (빈도 x 강도 순)

### Theme 1: "뭘 깔아야 할지 모르겠다" (선택의 마비)
**빈도:** 매우 높음 (Reddit 5+건, 웹 6+건)
**강도:** 높음
**신뢰도:** High

**대표 인용:**
- "I'd like to hear what best practices/tips you might have for additional MCP tools, agent files..." — r/LocalLLaMA
- "maybe 50-100 are truly production-ready" (9,000+ 중) — aitoolanalysis.com
- "almost impossible to tell what 'working' actually means until you've run one on something real" — buildtolaunch Substack

**시사점:** Plugin Advisor의 핵심 가치 제안과 정확히 일치. 마케팅 헤드라인의 출발점.

---

### Theme 2: MCP 설정의 기술적 장벽
**빈도:** 매우 높음 (GitHub 48개 댓글 스레드, 다수 블로그)
**강도:** 매우 높음
**신뢰도:** High

**대표 인용:**
- "wasted hours trying to get gitea MCP working with claude-code" — GitHub #1611
- "MCP 설치 및 연동 방법이 쉽진 않았다" — IMWEB 기술 블로그
- "If you make a typo, you often have to start the whole process over" — scottspence.com

**시사점:** 설치 스크립트 생성 + 체크리스트가 실질적 가치를 갖는 근거.

---

### Theme 3: 토큰/컨텍스트 윈도우 낭비
**빈도:** 높음 (Reddit 3+건, 웹 4+건)
**강도:** 높음
**신뢰도:** High

**대표 인용:**
- "Losing 6,000 tokens per session to uninvited duplicates is a material impact on my ability to work" — GitHub #39686
- "Supabase MCP uses 8k for its search_docs tool alone" — HN
- "can use 55,000+ tokens before any conversation starts" — morphllm.com

**시사점:** "토큰 효율 조합 추천"은 강력한 차별화 포인트. 추천 시 토큰 비용 표시 고려.

---

### Theme 4: 비개발자/초보자 대량 유입
**빈도:** 높음 (Reddit score 1,638~3,238)
**강도:** 매우 높음 (감정적 열정)
**신뢰도:** High

**대표 인용:**
- "I'm a physician in my late 50s... Claude code is fantastic" — r/ClaudeAI (score 1,638)
- "i'm not a dev but i've built so many small tools for my job" — r/ClaudeAI
- "Most of us don't fully understand tokens yet" — r/ClaudeAI (score 1,805)

**시사점:** 초보자 프리셋 팩의 중요성 재확인. "ChatGPT 이주자" 온보딩 플로우 추가 고려.

---

### Theme 5: CLAUDE.md/설정 파일 공유 수요
**빈도:** 중간 (Reddit 3+건)
**강도:** 높음
**신뢰도:** Medium

**대표 인용:**
- "Any chance you're willing to share your CLAUDE.md file?" — r/ClaudeAI (반복 등장)
- "In my CLAUDE.md I have the instructions for how CC can call codex headless" — r/ClaudeAI

**시사점:** 플러그인 추천을 넘어 "CLAUDE.md 템플릿 생성"까지 확장하면 차별화.

---

### Theme 6: Skills vs MCP vs Plugins 개념 혼란
**빈도:** 중간 (HN, 블로그 다수)
**강도:** 중간
**신뢰도:** High

**대표 인용:**
- "A Plugin can contain Skills. A Skill can use MCP tools. Slash Commands were merged into Skills." — morphllm.com
- "MCPs are overhyped... About 95% of the MCP servers out there are useless." — HN

**시사점:** Plugin Advisor가 개념 정리 + 안내 역할도 수행해야 함. 가이드 콘텐츠 기회.

---

### Theme 7: 보안 우려
**빈도:** 중간 (Reddit 2건, GitHub 1건, HN 1건)
**강도:** 높음
**신뢰도:** Medium

**대표 인용:**
- "you're one bad prompt away from a DELETE FROM users without a WHERE clause" — r/ClaudeDev
- 플러그인 마켓플레이스가 Chrome에서 위험 사이트 경고 — HN

**시사점:** "안전한 설정 우선" 포지셔닝의 타당성 확인. 보안 MCP 카테고리 추가.

---

## 경쟁 환경 업데이트

| 대안 | 특징 | Plugin Advisor 차별점 |
|------|------|----------------------|
| **Claude Code Setup 플러그인 (Anthropic 공식)** | 코드베이스 분석 → 자동 추천, 읽기 전용 | 설치 스크립트, 충돌 감지, 조합 점수, 보완/대체 추천 |
| McPick | MCP 서버 TUI 관리 도구 | 추천이 아닌 관리 도구, 선택 기준 미제공 |
| MCP-tidy | 미사용 MCP 정리 | 정리만 가능, 추천 기능 없음 |
| awesome-claude-code | 큐레이션 목록 | 프로젝트 맞춤 추천/분석 없음 |

---

## 트리거 이벤트 (사용자가 도구를 찾는 순간)

1. **Claude Code 첫 설치 직후** — "뭘 깔아야 하지?"
2. **ChatGPT에서 이주** — 생태계 전환 시 안내 필요
3. **MCP 오류 직면** — 설정 문제 해결 후 "더 나은 방법" 탐색
4. **프로젝트 전환** — 새 프로젝트에 맞는 조합 탐색
5. **토큰 한도 도달** — 비용 최적화 니즈
6. **팀 도입** — 표준 설정 필요

---

## 리서치 갭 (추가 조사 필요)

- Plugin Advisor 실제 사용자 인터뷰 (아직 없음)
- 한국 Claude Code 사용자 규모 추정
- 가격 민감도 (유료 서비스 전환 시)
- 경쟁사 "Claude Code Setup" 플러그인 상세 기능 비교

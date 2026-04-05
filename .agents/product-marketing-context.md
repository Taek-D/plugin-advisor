# Product Marketing Context

*Last updated: 2026-03-29*

## Product Overview
**One-liner:** Claude Code 플러그인 추천 + 조합 분석 웹서비스
**What it does:** PRD, README, GitHub URL 등을 입력하면 키워드/AI 분석으로 적합한 플러그인을 추천하고, 이미 설치된 조합을 점수화하여 충돌 경고, 보완/대체 추천까지 제공한다. 검증된 플러그인과 설치 전 체크리스트를 기준으로 첫 세팅 실패 확률을 줄이는 것이 핵심.
**Product category:** Developer tool / Setup assistant
**Product type:** 무료 웹 도구 → 프리미엄/SaaS 전환 계획 있음
**Business model:** 현재 무료 (Freemium 전환 예정). 유료 서비스 준비 중: 1:1 세팅 점검, 프로젝트 맞춤 추천, 팀 온보딩 문서.

## Target Audience
**Target companies:** Claude Code를 쓰거나 도입을 검토하는 개인 개발자, 스타트업, 소규모 개발팀
**Decision-makers:** 개발자 본인 (개인), 테크 리드/CTO (팀)
**Primary use case:** Claude Code 첫 세팅 시 어떤 플러그인을 깔아야 할지 모를 때, 플러그인으로 Claude Code를 더 잘 활용하고 싶을 때, 이미 깐 조합이 괜찮은지 확인할 때
**Jobs to be done:**
- Claude Code 첫 세팅에서 "뭘 먼저 깔아야 하지?"라는 질문에 답 얻기
- 이미 설치한 플러그인 조합이 괜찮은지 점수와 함께 확인하기
- 충돌/중복 플러그인 발견하고 더 나은 대안 찾기
**Use cases:**
- Claude Code 처음 설치한 개발자가 프리셋 팩으로 빠르게 시작
- 프로젝트 README를 붙여넣고 맞춤 플러그인 추천 받기
- `claude mcp list` 결과를 붙여넣어 현재 조합 진단
- 팀에서 공통 플러그인 스택을 정할 때 참고 자료로 활용

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| 입문 개발자 | 빠르고 안전한 첫 세팅 | 플러그인이 너무 많아서 뭘 깔아야 할지 모름 | 검증된 2~3개로 바로 시작 |
| Claude Code 사용자 | 플러그인으로 활용도 높이기 | 어떤 플러그인이 내 워크플로에 맞는지 모름 | 프로젝트 맞춤 추천 + 조합 진단 |
| 현업 개발자 | 내 조합이 최적인지 확인 | 충돌/중복을 직접 파악하기 어려움 | 점수화 + 충돌 경고 + 보완 추천 |
| 테크 리드 | 팀 표준 스택 결정 | 팀원마다 다른 플러그인 사용 | 검증된 조합 + 온보딩 문서 기반 |

## Problems & Pain Points
**Core problem:** Claude Code 플러그인 생태계가 빠르게 성장하면서(51개+), 어떤 플러그인을 조합해야 안전하고 효과적인지 판단하기 어렵다.
**Why alternatives fall short:**
- 공식 문서는 개별 플러그인 설명만 있고, "내 상황에 뭘 깔아야 하는지"는 안 알려줌
- 커뮤니티 추천은 파편적이고, 충돌/중복을 고려하지 않음
- "일단 다 깔아보자"는 접근은 첫날부터 꼬이게 만듦
**What it costs them:** 첫 세팅에 반나절~하루 낭비, 충돌로 인한 디버깅, 잘못된 조합으로 인한 불안정한 개발 환경
**Emotional tension:** "다들 쓴다는 플러그인을 깔았는데 왜 안 되지?", "이 조합이 맞는 건지 확신이 없다"

## Competitive Landscape
**Direct:** Claude Code Setup 플러그인 (Anthropic 공식) — 코드베이스 분석 후 자동 추천하지만, 읽기 전용이며 설치 스크립트/충돌 감지/조합 점수/보완 추천은 없음
**Secondary:** awesome-claude-code 리포, McPick (MCP TUI 관리), MCP-tidy (미사용 정리), 커뮤니티 블로그 — 추천/분석이 아닌 관리 도구이거나 큐레이션 목록
**Indirect:** 직접 시행착오로 조합 결정, 동료에게 물어보기, .claude.json 수동 편집 — 시간이 걸리고 체계적이지 않음

## Differentiation
**Key differentiators:**
- 51개 플러그인 DB 기반 조합 분석 (충돌/중복/커버리지)
- 100점 감점 모델 스코어링 (충돌 -20, 중복 -7, 미커버 -7)
- 설치 전 체크리스트 + 비추천 플러그인 안내
- 프리셋 팩으로 5분 안에 첫 세팅 완료
- `claude mcp list` 결과를 그대로 붙여넣기만 하면 진단
**How we do it differently:** "플러그인 수보다 세팅 성공을 우선한다" — 많이 추천하는 게 아니라, 검증된 소수를 안전하게 설치하는 것에 집중
**Why that's better:** 첫날부터 꼬이지 않고 바로 생산적으로 쓸 수 있음
**Why customers choose us:** 직접 하나하나 조사할 시간이 없고, 남들이 추천하는 게 내 상황에 맞는지 확신이 없을 때

## Objections

| Objection | Response |
|-----------|----------|
| "그냥 커뮤니티 추천 따라하면 되지 않나?" | 커뮤니티 추천은 특정 상황 기준이라 내 프로젝트와 안 맞을 수 있고, 충돌을 고려하지 않음 |
| "플러그인이 자주 바뀌는데 DB가 최신인가?" | 51개 플러그인 DB를 지속 업데이트하고, 사용자 제안 기능으로 새 플러그인도 빠르게 반영 |
| "무료인데 품질이 괜찮나?" | 검증된 세팅 우선 원칙으로 위험한 조합은 걸러내고, 설치 전 체크리스트까지 제공 |

**Anti-persona:** Claude Code를 이미 숙련되게 사용하며 자신만의 최적 조합을 알고 있는 시니어 개발자. 또는 플러그인 없이 vanilla Claude Code만 쓰려는 사용자.

## Switching Dynamics
**Push:** "플러그인 추천 글을 따라했는데 설치가 안 된다", "뭘 깔아야 할지 몰라서 시간만 낭비했다"
**Pull:** "입력만 하면 맞춤 추천 + 설치 스크립트", "내 조합을 점수로 확인할 수 있다"
**Habit:** "일단 검색해서 나오는 거 깔아보는 습관", "커뮤니티에서 추천하는 거 그대로 복사"
**Anxiety:** "이 추천을 믿어도 되나?", "DB가 최신 상태인가?"

## Customer Language
**How they describe the problem:**
- "Claude Code 플러그인이 너무 많은데 뭘 깔아야 할지 모르겠어요"
- "MCP 서버 세팅하다가 반나절 날렸어요"
- "남들 세팅 따라했는데 충돌이 나요"
- "초보자인데 어디서부터 시작해야 하나요?"
**How they describe us:**
- "플러그인 추천해주는 사이트"
- "Claude Code 세팅 도우미"
- "내 플러그인 조합 점수 알려주는 곳"
**Words to use:** 세팅, 추천, 진단, 조합, 스타터, 체크리스트, 검증된, 안전한
**Words to avoid:** 완벽한, 최고의, 필수, 반드시 (과장 표현), 쉬운 (주관적)
**Glossary:**
| Term | Meaning |
|------|---------|
| MCP | Model Context Protocol — Claude Code의 플러그인 연결 프로토콜 |
| Plugin | Claude Code의 확장 기능 (MCP 서버 또는 비 MCP 플러그인) |
| 프리셋 팩 | 미리 검증된 플러그인 조합 세트 |
| 조합 점수 | 100점 감점 모델로 현재 플러그인 조합의 건강도를 수치화 |

## Brand Voice
**Tone:** 실용적, 솔직한, 사용자 친화적, 보수적 (과장하지 않음)
**Style:** 직접적, 기술적이되 초보자도 이해할 수 있게, 친근하면서도 신뢰감 있게
**Personality:** 사용자 친화적인, 신뢰할 수 있는, 도움이 되는, 겸손한 ("플러그인 수보다 세팅 성공을 우선합니다")

## Proof Points
**Metrics:**
- 51개 플러그인 DB (39 MCP + 12 Plugin)
- 10개 카테고리 커버리지 분석
- 4개 프리셋 팩 (입문자, 웹앱, 데이터, 백엔드)
- 6개 스타터 가이드
**Customers:** (아직 공개 사례 없음 — 수집 필요)
**Testimonials:** (아직 없음 — 수집 필요)
**Value themes:**
| Theme | Proof |
|-------|-------|
| 세팅 실패 방지 | 설치 전 체크리스트, 비추천 플러그인 안내, 충돌 감지 |
| 시간 절약 | 프리셋 팩 5분 세팅, 원클릭 설치 스크립트 |
| 조합 최적화 | 100점 감점 모델, 보완/대체 추천, 커버리지 분석 |

## Goals
**Business goal:** Claude Code 사용자 커뮤니티에서 "플러그인 세팅 = Plugin Advisor"로 인지되는 것
**Conversion action:** 세팅 진단 시작 (advisor 또는 optimizer 사용), 가이드 읽기, 플러그인 제안
**Current metrics:** (아직 서버 측 분석 없음 — localStorage 기반 이벤트만 존재)

# Email Sequence — Plugin Advisor Newsletter

*Generated: 2026-04-05*

---

## Sequence Overview

```
Sequence Name: Newsletter Welcome
Trigger: Newsletter form submission (Supabase subscribers table)
Goal: Activate subscriber → use Plugin Advisor → share with peers
Length: 5 emails over 14 days
Exit Conditions: Unsubscribe or use advisor/optimizer (tracked via UTM)
Tool Recommendation: Resend (developer-friendly, free tier 3K/month)
```

---

## Email 1: Welcome + Quick Win

```
Send: Immediately after signup
Subject: Claude Code 플러그인, 어디서부터 시작하면 될까요
Preview: 51개 중 딱 맞는 조합을 찾는 가장 빠른 방법

---

안녕하세요,

Plugin Advisor 뉴스레터에 가입해주셔서 감사합니다.

Claude Code 플러그인이 51개나 되다 보니, "뭘 먼저 깔아야 하지?"가 
대부분의 첫 질문입니다.

가장 빠른 시작 방법:
→ pluginadvisor.cc/advisor 에서 프로젝트 설명을 입력하세요.
검증된 플러그인 2-3개 + 설치 명령어를 바로 받을 수 있습니다.

5분이면 됩니다.

— Plugin Advisor 팀

CTA: [내 프로젝트에 맞는 플러그인 찾기] → pluginadvisor.cc/advisor?utm_source=email&utm_medium=welcome&utm_campaign=e1
```

---

## Email 2: 핵심 기능 소개

```
Send: Day 2
Subject: 이미 플러그인을 설치했다면, 이걸 확인해보세요
Preview: 내 조합 점수가 몇 점인지 30초 만에 알 수 있습니다

---

안녕하세요,

이미 Claude Code 플러그인을 몇 개 설치하셨나요?

터미널에서 `claude mcp list`를 실행하고,
그 결과를 pluginadvisor.cc/optimizer 에 붙여넣어 보세요.

0-100점으로 현재 조합의 건강도를 확인할 수 있습니다:
- 충돌하는 플러그인 쌍이 있는지
- 빠뜨린 카테고리가 있는지
- 더 나은 대안이 있는 deprecated 플러그인이 있는지

대부분의 조합이 60-70점대입니다.
90점 이상이면 아주 잘 세팅된 겁니다.

CTA: [내 조합 점수 확인하기] → pluginadvisor.cc/optimizer?utm_source=email&utm_medium=welcome&utm_campaign=e2
```

---

## Email 3: 교육 콘텐츠 (가이드 연결)

```
Send: Day 5
Subject: Claude Code 첫 세팅에서 가장 많이 하는 실수
Preview: 이 3가지만 피해도 반나절을 아낄 수 있습니다

---

안녕하세요,

Claude Code 커뮤니티에서 가장 자주 보이는 세팅 실수 3가지:

1. 한꺼번에 10개 이상 설치
→ 어떤 플러그인이 문제인지 찾기 어려워집니다.
→ 2-3개로 시작하고, 하나씩 추가하세요.

2. deprecated 플러그인 설치
→ linear-mcp-server 대신 mcp.linear.app/sse를 쓰세요.
→ 검증 상태를 pluginadvisor.cc/plugins 에서 확인할 수 있습니다.

3. 사전 준비물 확인 안 하기
→ GitHub token, Supabase URL 같은 준비물이 없으면 설치가 실패합니다.
→ 첫 세팅 체크리스트를 참고하세요.

CTA: [첫 세팅 체크리스트 보기] → pluginadvisor.cc/guides/claude-code-first-setup-checklist?utm_source=email&utm_medium=welcome&utm_campaign=e3
```

---

## Email 4: 신뢰 구축 (비하인드 스토리)

```
Send: Day 9
Subject: 51개 플러그인을 하나하나 검증한 이유
Preview: 커뮤니티 가이드의 설치 명령어 중 일부가 틀렸습니다

---

안녕하세요,

Plugin Advisor를 만들면서 가장 시간이 많이 걸린 건 
51개 플러그인을 GitHub README 기준으로 하나하나 검증하는 일이었습니다.

검증하면서 발견한 것들:
- 5개 플러그인의 설치 명령어가 커뮤니티 가이드에서 틀렸음
- 3개가 deprecated 상태인데 아직 추천되고 있었음
- 2개는 placeholder 경로가 들어있어서 그대로 복사하면 실패

"검증된 세팅 우선"이 단순한 슬로건이 아니라,
실제로 데이터를 확인한 결과에서 나온 원칙입니다.

모든 플러그인의 검증 상태를 확인할 수 있습니다:
pluginadvisor.cc/plugins

CTA: [51개 플러그인 카탈로그 보기] → pluginadvisor.cc/plugins?utm_source=email&utm_medium=welcome&utm_campaign=e4
```

---

## Email 5: 공유 요청 + 재방문 유도

```
Send: Day 14
Subject: Claude Code 세팅으로 고생하는 동료가 있다면
Preview: 이 링크 하나면 반나절을 아껴줄 수 있습니다

---

안녕하세요,

지난 2주간 뉴스레터를 읽어주셔서 감사합니다.

혹시 주변에 Claude Code 세팅으로 고생하는 동료가 있다면,
이 링크를 공유해주세요:

pluginadvisor.cc

- 프로젝트 맞춤 플러그인 추천
- 현재 조합 점수 확인
- 6개 스타터 가이드

무료이고, 가입 없이 바로 사용할 수 있습니다.

앞으로도 Claude Code 플러그인 생태계 업데이트,
새로운 플러그인 추가, 세팅 팁을 보내드리겠습니다.

— Plugin Advisor 팀

CTA: [Plugin Advisor 공유하기] → pluginadvisor.cc?utm_source=email&utm_medium=welcome&utm_campaign=e5_share
```

---

## Metrics Plan

| Metric | Target | Benchmark |
|--------|--------|-----------|
| Open rate | 40%+ | Dev newsletters avg 35-45% |
| Click rate | 8%+ | Dev tools avg 5-10% |
| Unsubscribe rate | <1% per email | Industry avg 0.5% |
| Advisor/Optimizer usage | 20%+ of subscribers | — |

---

## Implementation Notes

1. **Email tool**: Resend 추천 (3K/month 무료, Next.js 친화적)
2. **Trigger**: Supabase `subscribers` 테이블 insert → webhook → Resend API
3. **UTM tracking**: 모든 CTA에 utm_source=email 포함하여 Umami에서 추적
4. **Unsubscribe**: 각 이메일에 one-click unsubscribe 링크 필수 (CAN-SPAM)
5. **Language**: 한국어 기본 (가입 시 locale 저장하여 영어 버전도 가능)

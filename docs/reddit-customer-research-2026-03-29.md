# Reddit 고객 리서치 보고서: Claude Code 플러그인/MCP/설정 관련 논의

**조사일:** 2026-03-29
**조사 범위:** r/ClaudeAI, r/ClaudeDev, r/ChatGPTCoding, r/LocalLLaMA, r/webdev
**조사 방법:** Reddit MCP 도구를 통한 hot/new/top 게시물 및 댓글 수집

---

## 요약 (Executive Summary)

Reddit에서 Claude Code 플러그인, MCP 설정, 구성 관련 논의를 광범위하게 조사한 결과, **Plugin Advisor 서비스의 핵심 타겟 고객층과 그들의 고통점(pain points)이 명확하게 드러났다.** 주요 발견:

1. **MCP/플러그인 설정의 복잡성**은 여전히 진입장벽으로 작용
2. **"에이전트 관리자"로의 역할 전환** 중인 개발자들이 도구 추천에 대한 수요 폭증
3. **초보자와 비개발자의 유입**이 급격히 증가하며 "어떤 플러그인을 써야 하는지" 질문 급증
4. **멀티 에이전트 워크플로우** 관련 플러그인/스킬 생태계에 대한 관심 고조
5. **보안과 안전성** (특히 DB 접근, .env 관리)에 대한 MCP 도구 수요 존재

---

## 1. 발견된 게시물/댓글 상세 분석

### Finding #1: MCP 보안 도구에 대한 절실한 수요

**출처:** r/ClaudeDev, 2026-03-21
**게시물:** "SQLGuard MCP -- a query firewall between Claude and your database. Setup in 2 minutes."
**작성자:** u/Individual-Smell6888

**원문 인용:**
> "If you use Claude Code with database access, you're one bad prompt away from a `DELETE FROM users` without a WHERE clause. The problem isn't Claude being malicious. It's that MCP database tools execute whatever SQL Claude generates, with no interception layer."

**맥락:** Claude Code의 MCP 도구가 생성한 SQL을 무차별 실행하는 위험성을 지적하며, 실제 GitHub 이슈 사례(prisma migrate reset --force, DROP TABLE 등)를 인용.

**감정:** 경고/건설적
**테마:** Pain (MCP 보안 위험), Trigger (DB 접근 시 안전장치 부재)
**고객 프로필:** 중급-고급 개발자, MCP 서버 직접 구성 가능한 수준, 프로덕션 DB 접근 경험

**인사이트:** MCP 서버 설정 시 보안 관련 플러그인 추천이 필수적임. Plugin Advisor에서 "안전한 DB 접근"이라는 유즈케이스를 위한 추천 카테고리 필요.

---

### Finding #2: "어떤 MCP 도구를 써야 하는지" 직접적인 질문

**출처:** r/LocalLLaMA, 2026-03-29
**게시물:** "New to Roo Code, looking for tips: agent files, MCP tools, etc"
**작성자:** u/youcloudsofdoom

**원문 인용:**
> "I'd like to hear what best practices/tips you might have for additional MCP tools, agent files, changes to system prompts, skills, etc. in Roo? Right now my Roo setup is 'stock', and I'm sure I'm missing out on useful skills and plugins that would improve the capacity and efficiency of the agent."

**맥락:** 로컬 모델(Qwen 3.5 35B)로 에이전트 코딩을 시작한 사용자가 MCP 도구, 스킬, 플러그인 추천을 직접적으로 요청.

**감정:** 긍정적/탐색적
**테마:** Trigger (새로운 도구 시작 후 확장 욕구), Pain (어떤 플러그인이 좋은지 모름)
**고객 프로필:** 초중급 개발자, 로컬 LLM 사용자, Python/웹 프로젝트

**인사이트:** **Plugin Advisor의 정확한 타겟 고객.** "기본 설정에서 시작해서 어떤 플러그인을 추가해야 할지 모르겠다"는 정확히 우리 서비스가 해결하는 문제.

---

### Finding #3: Claude Code 설정/학습에 대한 인지 부족

**출처:** r/ClaudeAI, 2026-03-01 (score: 3,238)
**게시물:** "Anthropic has opened up its entire educational curriculum for free"
**작성자:** u/Strong_Roll9764

**원문 인용:**
> "a few months ago I spent hours tinkering with Claude Code through the terminal, trial and error. I wish there had been a resource like this back then"

**댓글 중 주목할 인용:**
> u/Extension_Royal_3375: "I always thought it was silly to see those sub stacks and YouTubers talking about how to use AI. When I can just click on Anthropic's site and have access to all the documentation I need."

> u/KeyStunning6117: "Just finished the MCP Mastery course. Game-changer for prompt engineering. Quick wins I implemented immediately: Multi-step reasoning chains, Context chunking for long docs, Agentic workflows (sub-agents)"

**감정:** 긍정적/놀라움 (무료 교육 존재를 몰랐음)
**테마:** Pain (설정 시행착오로 시간 낭비), Outcome (체계적 학습 후 생산성 향상)
**고객 프로필:** 혼합 - 초보자부터 중급까지, 자체 학습 중

**인사이트:** 많은 사용자가 Claude Code 관련 리소스 존재 자체를 모름. Plugin Advisor가 "발견(discovery)" 도구로서의 가치가 있음.

---

### Finding #4: 멀티 에이전트 워크플로우와 플러그인 생태계 수요

**출처:** r/ClaudeAI, 2026-03-29 (score: 379)
**게시물:** "Anthropic shares how to make Claude code better with a harness"
**작성자:** u/lawnguyen123

**핵심 댓글 인용:**

> u/BingpotStudio (score: 24): "Costs a lot in tokens, but building a full workflow skill that has sub agents doing singular tasks each with their own specific job is much more effective. Pseudo Code writers, test writers, code writers, contract definer, code reviewers, compliance reviewer against spec etc. I've got around 12 specific jobs and the big bugs just disappeared."

> u/Reaper5289 (score: 14): "IMO an agent harness is much more than just the simple agentic loop. It's the automatic context compaction/handoff, sandbox environment, plugin ecosystem, hooks, observability, dynamic model-routing, browser integration, filesystem integration, mcp/a2a protocol support, etc."

> u/brianjenkins94 (score: 148): "I'm real skeptical of the shovel-peddler telling me the way to fix my shovel problem is to get my shovel a bunch of tinier shovels."

**감정:** 혼재 (회의적 vs. 실용적 긍정)
**테마:** Pain (토큰 소모, 복잡한 설정), Alternative (멀티 에이전트 vs. 단일 에이전트), Language ("harness", "plugin ecosystem", "hooks")
**고객 프로필:** 고급 개발자, Claude Code 파워유저, 멀티 에이전트 구성 경험자

**인사이트:** "plugin ecosystem", "hooks", "MCP protocol" 등의 키워드가 고급 사용자층에서 자연스럽게 사용됨. Plugin Advisor가 이 수준의 사용자도 커버해야 함.

---

### Finding #5: 비개발자의 Claude Code 진입과 도구 추천 수요

**출처:** r/ClaudeAI, 2026-03-25 (score: 1,638)
**게시물:** "WTAF?" (의사가 Claude Code로 하드웨어 프로젝트 수행)
**작성자:** u/jrpg8255

**원문 인용:**
> "I'm a physician in my late 50s. MD, PhD, triple boarded. Also coding since the late 70s, starting in assembly... I've been using Claude code for the past week or so. It's fantastic. Currently I'm sniffing codes for the 2x400 CD sony jukeboxes... For me this is like switching from 8088 assembly to compiled C."

**댓글 중 주목할 인용:**
> u/LumpyWelds (score: 317): "As a programmer, I've waited all my life to work with electronics and it never happened... this is the first time I feel I might finally get a leg up since Agents can be the mentor I never had."

> u/throwaway11llII: "went from not knowing a thing about Arduinos to a product soon going into production for first large order in 8 months. I couldn't have done it without Claude."

> u/PennyLawrence946: "i'm not a dev but i've built so many small tools for my job recently that i never would have even attempted before."

**감정:** 매우 긍정적/열정적
**테마:** Trigger (비개발자가 개발 시작), Outcome (이전에 불가능했던 프로젝트 완성)
**고객 프로필:** 비개발자, 취미 개발자, 도메인 전문가(의사, 엔지니어 등)

**인사이트:** 비개발자 유입이 급증하며 "어떻게 시작하고, 무엇을 설치해야 하는지" 안내 수요가 매우 높음. Plugin Advisor의 "초보자 프리셋" 기능이 핵심 가치.

---

### Finding #6: Claude Code 파워유저의 도구 생태계 공유

**출처:** r/ClaudeAI, 2026-03-06 (score: 2,021)
**게시물:** "I Haven't Written a Line of Code in Six Months"
**작성자:** u/Cultural-Ad3996

**원문 인용:**
> "I build open-source tools around Claude Code -- a director app that manages multiple sessions, almost 30 tools for things Claude can't do natively (PDF, Excel, email, browser automation), pre-built skills that work like SOPs. All free."

**댓글 중 주목할 인용:**

> u/shamen_uk (score: 32): "In my CLAUDE.md I have the instructions for how CC can call codex headless so it's always part of the team. I find the ensemble for planning and reviewing is invaluable."

> u/Shadow__the__Edgehog (score: 18): "Any chance you're willing to share your CLAUDE.md file?"

> u/StickyDeltaStrike (score: 14): "I think a lot of people don't know how to use Claude in CLI mode"

> u/No_Medium205 (score: 23): "Most people on enterprises uses Microsoft shitty copilot so they will never see it coming until one day they try Claude and learns to configure it to their workflow."

**감정:** 열정적/공유적
**테마:** Pain (Claude Code의 네이티브 기능 부족), Alternative (자체 도구 구축), Language ("director app", "tools", "skills", "CLAUDE.md")
**고객 프로필:** 시니어 개발자(30+ 년 경력), 오픈소스 기여자, 멀티 에이전트 파워유저

**인사이트:** CLAUDE.md 공유 요청이 반복적으로 등장. Plugin Advisor가 "최적의 CLAUDE.md 설정"까지 추천할 수 있으면 차별화 포인트.

---

### Finding #7: 토큰 비용과 사용량 제한에 대한 불만

**출처:** r/ClaudeAI, 2026-03-27 (score: 1,008)
**게시물:** "Update on Session Limits" (공식 Anthropic 게시물)

**원문 인용 (Anthropic):**
> "~7% of users will hit session limits they wouldn't have before, particularly in pro tiers."

**출처:** r/ClaudeAI, 2026-03-19 (score: 1,805)
**게시물:** "Dear Anthropic: the ChatGPT refugees are here. Here's why they'll leave again."
**작성자:** u/ArtimisOne

**원문 인용:**
> "Most of us don't fully understand tokens yet... Pro at $20 isn't built for people who use Claude the way I use Claude. Max at $100 is a real solution but it's an $80 cliff with nothing in between."

**감정:** 좌절/건설적
**테마:** Pain (사용량 제한, 가격 격차), Trigger (ChatGPT에서 이주)
**고객 프로필:** 파워유저, ChatGPT 이주자, 대화형 사용자

**인사이트:** 토큰 효율적인 플러그인/설정 추천이 가치 있음. "토큰 절약형 워크플로우" 추천 카테고리 고려.

---

### Finding #8: "AI Psychosis" -- Claude Code 중독과 번아웃

**출처:** r/ClaudeAI, 2026-03-22 (score: 1,579)
**게시물:** "Karpathy says he hasn't written a line of code since December and is in 'perpetual AI psychosis.'"

**핵심 댓글 인용:**

> u/forward-pathways (score: 557): "I feel an internal pressure to keep going, now, while it's somewhat easy to access these tools... My brain hurts. My eyes hurt. I actually hate it. I want my normal life back."

> u/Stickybunfun (score: 148): "AI use has turned into the steroid argument in pro sports - if you aren't doing them and everybody else is, you aren't competitive."

> u/ParamedicAble225 (score: 79): "Can not stop orchestrating Claude code. Went from 1 sessions to like 3-4 at a time... Brain is constantly fried"

> u/DarkSkyKnight (score: 75): "I have to wrangle Claude Code all the time, correct its mistakes, tell it to not make ridiculous simplifications... It's tedious and in a way more unfun than coding it myself. But it's certainly much faster."

> u/shesaysImdone: "Lack of persistent memory across sessions and finite context doesn't give me the feeling of invisibility it gives others. I'm always monitoring the context usage bar."

**감정:** 혼재 (중독적 열정 vs. 심각한 피로)
**테마:** Pain (번아웃, 컨텍스트 관리 피로), Trigger (경쟁 압박), Outcome (생산성 향상 but 비용)
**고객 프로필:** 풀타임 Claude Code 사용자, 다중 세션 운영자

**인사이트:** 컨텍스트 관리, 메모리, 세션 관리 관련 플러그인 수요 높음. "워크플로우 최적화" 카테고리가 중요.

---

### Finding #9: Cowork/Skills/Projects 관련 혼란과 안내 수요

**출처:** r/ClaudeAI, 2026-03-09 (score: 1,610)
**게시물:** "Hands down the best guide to Claude Cowork"

**댓글 중 주목할 인용:**

> u/i4bimmer (score: 3): "This is missing the most amazing feature Anthropic has created: skills. You create skills. In the project, tell Claude to always load the skills you need. The skills reference sub-skills (reference files). Really powerful stuff."

> u/HCagn: "Same here - but with projects + MCP to atlassian and I'm all set."

> u/BlackjackDuck: "Disabled by default (at least for my Pro account). I was floored when I explored config last night and found it was available, but off. Explained a lot."

**감정:** 탐색적/좌절 혼재
**테마:** Pain (기능 발견의 어려움, 기본 비활성화), Trigger (가이드를 통한 발견)
**고객 프로필:** 중급 사용자, Cowork/Skills 기능 탐색 중

**인사이트:** 많은 Claude 기능이 "숨겨진" 상태. Plugin Advisor의 "발견" 역할이 핵심 가치.

---

### Finding #10: 컨텍스트 토큰 최적화 도구 수요

**출처:** r/ClaudeDev, 2025-06 (score: 4)
**게시물:** "Built an open-source universal AI context optimizer - 76% token reduction across all AI coding tools"
**작성자:** u/Southern-Steak7428

**원문 인용:**
> "Like many developers using AI coding tools, I was facing $500+ monthly bills due to context explosion. Tools like Cline, GitHub Copilot, and others keep accumulating context until you hit token limits or massive costs."

**감정:** 건설적/문제 해결
**테마:** Pain ($500+ 월 비용, 토큰 폭발), Alternative (자체 최적화 도구)
**고객 프로필:** 비용 민감 개발자, 다중 AI 도구 사용자

**인사이트:** 토큰 비용 절감 관련 도구가 실질적 수요 존재.

---

## 2. 테마별 종합 분석

### 2.1 주요 고통점 (Pain Points)

| 순위 | 고통점 | 빈도 | 심각도 |
|------|--------|------|--------|
| 1 | **"어떤 플러그인/도구를 써야 할지 모르겠다"** | 매우 높음 | 높음 |
| 2 | **MCP 설정의 복잡성** | 높음 | 높음 |
| 3 | **토큰 사용량/비용 관리** | 매우 높음 | 중간 |
| 4 | **컨텍스트 유실/메모리 부재** | 높음 | 높음 |
| 5 | **보안 위험 (DB, .env 등)** | 중간 | 매우 높음 |
| 6 | **기능 발견의 어려움** (숨겨진 설정) | 높음 | 중간 |
| 7 | **멀티 에이전트 조율의 어려움** | 중간 | 높음 |

### 2.2 트리거 이벤트 (구매/검색 트리거)

1. **ChatGPT에서 Claude로 이주** -- "ChatGPT refugees" 대량 유입 (2026-03월 프로모션 영향)
2. **Claude Code 첫 사용** -- CLI 모드 발견 후 "이걸 더 잘 쓰고 싶다"
3. **프로젝트 복잡도 증가** -- 단일 세션에서 멀티 에이전트로 전환 필요
4. **Anthropic Academy 발견** -- 학습 후 "실전 도구"를 찾기 시작
5. **비용 한도 도달** -- 최적화 도구 탐색 시작

### 2.3 고객 세그먼트

| 세그먼트 | 특성 | Plugin Advisor 관련성 | 예상 규모 |
|----------|------|----------------------|----------|
| **A. 비개발자/초보자** | 의사, 디자이너, PM 등. 코딩 경험 없거나 적음 | **매우 높음** -- 프리셋 팩 핵심 타겟 | 급증 중 |
| **B. ChatGPT 이주자** | 토큰 개념 없음, Pro $20 한도 빠르게 도달 | **높음** -- 기본 설정 가이드 필요 | 대규모 |
| **C. 중급 개발자** | Claude Code 사용 중, 확장 방법 모색 | **높음** -- MCP/플러그인 추천 핵심 | 중간 |
| **D. 시니어 파워유저** | 멀티 에이전트, 자체 도구 구축 | **중간** -- 고급 추천/보완 플러그인 | 소수 but 영향력 높음 |
| **E. 기업 사용자** | Copilot에서 전환 고려 중 | **잠재적** -- 기업용 설정 추천 | 성장 중 |

### 2.4 자주 사용되는 언어/키워드

- "MCP server", "MCP tools", "mcp.json"
- "CLAUDE.md", "skills", "hooks"
- "plugin ecosystem", "harness"
- "multi-agent", "sub-agents", "orchestration"
- "context window", "token limits", "compaction"
- "workflow", "director app"
- "vibe coding", "agent herding"
- "drunk PhD students" (Claude Code 에이전트 비유)

---

## 3. Plugin Advisor 서비스에 대한 시사점

### 3.1 즉시 적용 가능한 인사이트

1. **"발견" 가치 강조:** 대부분의 사용자가 존재하는 도구/기능을 모름. "당신의 프로젝트에 맞는 MCP 서버를 찾아드립니다"가 핵심 메시지.

2. **초보자 프리셋의 중요성:** "ChatGPT 이주자" 및 "비개발자" 세그먼트가 급증. 기존 프리셋 팩 기능을 더 강조.

3. **보안 카테고리 추가:** SQLGuard 같은 보안 MCP 도구에 대한 수요 존재. "안전한 설정" 추천 경로 추가.

4. **토큰 최적화 관점:** "이 플러그인을 쓰면 토큰을 X% 절약할 수 있습니다" 같은 정보 추가 시 차별화.

5. **CLAUDE.md 설정 추천:** 단순 플러그인 추천을 넘어 "최적 CLAUDE.md 구성"까지 제공하면 매우 큰 가치.

### 3.2 마케팅/포지셔닝 제안

- **헤드라인:** "Claude Code에 어떤 플러그인을 설치해야 할지 모르겠다면" -- 이것이 가장 공감되는 고통점
- **서브헤드:** "프로젝트를 분석하고, 최적의 MCP 서버와 플러그인을 추천해드립니다"
- **타겟 서브레딧:** r/ClaudeAI (42만+ 구독자), r/ChatGPTCoding (활발한 Claude Code 논의)
- **콘텐츠 전략:** "Claude Code 초보자를 위한 필수 플러그인 5개" 같은 가이드 게시물

### 3.3 제품 개선 제안

1. **"ChatGPT 이주자" 온보딩 플로우** 추가
2. **보안 MCP 서버 카테고리** (SQLGuard, envgit 등) DB에 추가
3. **"토큰 절약형 설정"** 추천 태그 추가
4. **CLAUDE.md 템플릿 생성기** 기능 검토
5. **멀티 에이전트 워크플로우용 플러그인 번들** 추천

---

## 4. 원본 데이터 출처

| # | 서브레딧 | 게시물 ID | 제목 | Score | 날짜 |
|---|---------|----------|------|-------|------|
| 1 | r/ClaudeDev | 1rzdu5g | SQLGuard MCP -- query firewall | 1 | 2026-03-21 |
| 2 | r/LocalLLaMA | 1s6n5ow | New to Roo Code, looking for tips: MCP tools | 2 | 2026-03-29 |
| 3 | r/ClaudeAI | 1rh92yp | Anthropic educational curriculum | 3,238 | 2026-03-01 |
| 4 | r/ClaudeAI | 1s6jouf | Anthropic harness design | 379 | 2026-03-29 |
| 5 | r/ClaudeAI | 1s30ilh | WTAF? (physician using Claude Code) | 1,638 | 2026-03-25 |
| 6 | r/ClaudeAI | 1rlw1yw | Haven't Written Code in Six Months | 2,021 | 2026-03-06 |
| 7 | r/ClaudeAI | 1s4idaq | Update on Session Limits (official) | 1,008 | 2026-03-27 |
| 8 | r/ClaudeAI | 1rxle6k | ChatGPT refugees are here | 1,805 | 2026-03-19 |
| 9 | r/ClaudeAI | 1s08r1c | AI psychosis / Karpathy | 1,579 | 2026-03-22 |
| 10 | r/ClaudeAI | 1rp1m7k | Best guide to Claude Cowork | 1,610 | 2026-03-09 |
| 11 | r/ClaudeDev | 1l885by | Context optimizer - 76% token reduction | 4 | 2025-06-11 |
| 12 | r/ClaudeDev | 1rjizbq | CLI to stop .env leaks (envgit) | 1 | 2026-03-03 |
| 13 | r/ClaudeDev | 1s3mk79 | TUI for multiple Claude Code agents | 1 | 2026-03-26 |
| 14 | r/ClaudeAI | 1rzyqqt | 3 instructions to reduce hallucination | 2,285 | 2026-03-22 |
| 15 | r/webdev | 1s6mtt7 | AI sucked fun out of programming | 239 | 2026-03-29 |

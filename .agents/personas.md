# Research-Based Personas: Plugin Advisor

*리서치 기반 페르소나 (2026-03-29)*
*소스: Reddit 280+ 게시물, 웹 16개 소스*

---

## Persona 1: 초보 진입자 (The First-Timer)

**Profile**
- Title range: 주니어 개발자, 비개발자 (의사, PM, 디자이너 등)
- Company size: 개인 또는 소규모 팀
- 경험: Claude Code 1주일 미만, MCP 개념 처음 접함
- Reports to: 본인 (사이드 프로젝트) 또는 테크 리드

**Primary Job to Be Done**
Claude Code를 처음 설치한 뒤, 빠르게 생산적으로 쓸 수 있는 최소한의 안전한 세팅을 완성하고 싶다.

**Trigger Events**
- Claude Code를 처음 설치하고 "다음에 뭘 해야 하지?" 느끼는 순간
- ChatGPT에서 Claude로 이주한 직후
- 유튜브/블로그에서 "Claude Code 필수 플러그인" 글을 보고 시도

**Top Pains**
1. "플러그인이 9,000개 넘는데 뭘 깔아야 할지 모르겠다"
2. "MCP가 뭔지, Skills랑 뭐가 다른지 모르겠다"
3. "남들 따라 깔았는데 timeout 에러가 나서 반나절 날렸다"

**Desired Outcomes**
- 5분 안에 검증된 플러그인 2~3개를 설치하고 바로 써보기
- "이 조합이면 일단 안전하다"는 확신 얻기
- 다음에 뭘 추가하면 좋은지 방향 알기

**Objections and Fears**
- "이 추천이 정말 최신 정보인지 모르겠다"
- "잘못 깔면 더 꼬이지 않을까?"
- "무료인데 믿어도 되나?"

**Alternatives They Consider**
- awesome-claude-code 리스트 훑어보기
- YouTube 튜토리얼 따라하기
- 그냥 아무것도 안 깔고 vanilla로 쓰기

**Key Vocabulary**
- "뭘 깔아야 하는지", "초보자 추천", "필수 플러그인"
- "MCP가 뭔가요?", "설치가 안 돼요"
- "I wish there had been a resource like this"
- "Right now my setup is 'stock'"

**How to Reach Them**
- Channels: r/ClaudeAI, 한국 개발 커뮤니티, YouTube 검색
- Content: "Claude Code 첫 세팅 5분 가이드", "초보자 필수 플러그인 3개"
- Trust signals: Anthropic 공식 문서와의 연결, 실제 설치 성공 사례

---

## Persona 2: 중급 실험가 (The Experimenter)

**Profile**
- Title range: 미드레벨~시니어 개발자
- Company size: 스타트업~중견기업
- 경험: Claude Code 1~6개월 사용, MCP 5개 이상 설치해봄
- Reports to: 테크 리드 또는 본인

**Primary Job to Be Done**
이미 여러 플러그인을 시도해봤지만, 현재 조합이 최적인지 확인하고 불필요한 것을 정리하고 싶다.

**Trigger Events**
- 토큰 한도에 자주 도달하거나 응답 품질이 떨어질 때
- 새 프로젝트를 시작하며 "이 프로젝트에 맞는 조합은?" 궁금할 때
- MCP 서버가 쌓여서 뭐가 뭔지 모를 때

**Top Pains**
1. "사용하지 않는 MCP 서버가 축적되어 토큰을 낭비하고 있다"
2. "이 플러그인들이 서로 충돌하는지 아닌지 모르겠다"
3. "컨텍스트 윈도우 시작 전에 이미 55,000 토큰을 쓰고 있다"

**Desired Outcomes**
- 현재 조합의 "건강도 점수"를 숫자로 확인
- 충돌/중복 플러그인 발견 및 정리
- 빠진 카테고리에 맞는 보완 플러그인 추천

**Objections and Fears**
- "DB가 9,000개를 다 커버하나?" (51개면 충분한가?)
- "내 특수한 스택에 맞는 추천을 해줄 수 있나?"

**Alternatives They Consider**
- MCP-tidy로 미사용 서버 정리
- 직접 `.claude.json` 편집
- 커뮤니티에서 다른 사람의 설정 복사

**Key Vocabulary**
- "조합 분석", "충돌 감지", "토큰 절약"
- "mcp.json accumulated servers I'd forgotten about"
- "loading multiple MCP-heavy plugins noticeably degrades output quality"
- "plugin fatigue"

**How to Reach Them**
- Channels: r/ClaudeDev, Hacker News, Dev.to, 기술 블로그
- Content: "당신의 MCP 조합 점수는?", "토큰 절약 플러그인 조합"
- Trust signals: 100점 감점 모델의 투명한 스코어링 기준

---

## Persona 3: 팀 리더 / DevOps (The Standardizer)

**Profile**
- Title range: 테크 리드, CTO, DevOps 엔지니어
- Company size: 10~100명 개발팀
- 경험: Claude Code 숙련, 팀 도입 책임자
- Reports to: VP Engineering 또는 CTO

**Primary Job to Be Done**
팀 전체가 일관되고 안전한 Claude Code 설정을 사용하도록 표준을 정하고, 온보딩 프로세스를 만들고 싶다.

**Trigger Events**
- 팀원마다 다른 플러그인 사용으로 인한 혼란
- 보안 사고 (DB 삭제, .env 노출 등) 발생 또는 우려
- Claude Code 팀 라이선스 도입 검토 시

**Top Pains**
1. "팀원마다 다른 MCP 설정이라 문제 재현이 안 된다"
2. "누가 위험한 플러그인을 깔았는지 모른다"
3. "온보딩할 때마다 설정 가이드를 처음부터 설명해야 한다"

**Desired Outcomes**
- 팀 승인 플러그인 목록 + 설치 스크립트
- AGENTS.md + 온보딩 체크리스트 문서
- 위험 플러그인 경고 시스템

**Objections and Fears**
- "우리 팀 스택(Java/Python/Go 등)에 맞는 추천인가?"
- "엔터프라이즈 수준의 보안 기준을 충족하나?"

**Alternatives They Consider**
- 내부 위키에 직접 가이드 작성
- Anthropic 공식 "Claude Code Setup" 플러그인 사용
- 팀원 각자 알아서 설정하게 두기

**Key Vocabulary**
- "팀 표준", "승인된 플러그인", "온보딩"
- "한 번에 모든 것을 자동화하려 하지 말 것"
- "team-approved plugin stack"

**How to Reach Them**
- Channels: LinkedIn, 기업 기술 블로그 (IMWEB, 하이퍼리즘 등), 밋업
- Content: "팀을 위한 Claude Code 플러그인 표준화 가이드"
- Trust signals: 실제 기업 도입 사례 (IMWEB DevOps팀 등)

---

## Persona 4: 한국 개발자 (The Korean Developer)

**Profile**
- Title range: 다양 (주니어~시니어)
- Company size: 다양
- 경험: 다양하지만 한국어 리소스 부족으로 어려움
- Language: 한국어 우선, 영어 문서 참조 가능하지만 불편

**Primary Job to Be Done**
한국어로 편하게 Claude Code 플러그인을 탐색하고, 한국 생태계(카카오, Toss 등)에 맞는 설정을 완성하고 싶다.

**Trigger Events**
- Claude Code 한국어 가이드 검색 시 자료 부족
- 한국 특화 MCP (카카오톡, Toss 등) 발견 시
- 영어 문서 해석에 지쳐서 한국어 도구 탐색

**Top Pains**
1. "한국어 플러그인 추천 자료가 거의 없다"
2. "영어 문서만 보고 따라하다 설정 오류가 났다"
3. "한국 서비스 연동 플러그인이 있는지 모르겠다"

**Desired Outcomes**
- 한국어 UI에서 프로젝트에 맞는 추천 받기
- Windows/Mac 환경별 설치 가이드 (한국어)
- 한국 개발 생태계에 맞는 플러그인 정보

**Key Vocabulary**
- "플러그인 추천", "MCP 설정", "세팅 가이드"
- "Windows에서 안 돼요", "npx 에러"

**How to Reach Them**
- Channels: PyTorch 한국 커뮤니티, Velog, GeekNews, 카카오/네이버 개발자 블로그
- Content: "Claude Code 한국 개발자를 위한 세팅 가이드"
- Trust signals: 한국어 기본 지원, 한국 기업 사례

---

## Anti-Personas (타겟이 아닌 사용자)

1. **자체 도구 빌더**: 이미 30+ 도구를 직접 만들어 쓰는 시니어 파워유저 (추천보다 자기 판단 선호)
2. **MCP 회의론자**: "95%가 쓸모없다"며 Skills만 고집하는 사용자 (MCP 추천 자체를 거부)
3. **Vanilla 사용자**: 플러그인 없이 기본 Claude Code만 쓰려는 사용자

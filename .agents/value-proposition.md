# Value Proposition: Plugin Advisor

*작성일: 2026-03-29*
*기반: product-marketing-context.md, customer-research-report.md, personas.md*

---

## Value Proposition #1: 초보 진입자 (The First-Timer)

### For 초보 진입자:

1. **Who**: Claude Code를 처음 설치한 개발자 또는 비개발자. MCP/플러그인 개념이 낯설고, 9,000+개 플러그인 중 뭘 깔아야 할지 모르는 사용자.

2. **Why**: Claude Code를 빠르게 생산적으로 쓸 수 있는 안전한 첫 세팅을 완성하고 싶다. 시행착오 없이 "검증된 시작점"을 원한다.

3. **What Before**:
   - 9,000+개 플러그인 목록 앞에서 선택의 마비
   - YouTube/블로그 추천을 따라했지만 timeout 에러로 반나절 낭비
   - MCP, Skills, Plugins 개념 차이를 모르고 혼란
   - "I wish there had been a resource like this back then"

4. **How**:
   - 4개 프리셋 팩(입문자, 웹앱, 데이터, 백엔드)으로 5분 안에 첫 세팅
   - 설치 전 체크리스트로 실패 원인 사전 차단
   - 비추천 플러그인 안내로 위험 회피
   - 원클릭 설치 스크립트 복사

5. **What After**:
   - 첫날부터 검증된 2~3개 플러그인으로 바로 생산적 작업
   - "이 조합이면 안전하다"는 확신
   - 다음에 뭘 추가하면 좋은지 방향 파악

6. **Alternatives**:
   - **awesome-claude-code 리스트** — 큐레이션이지만 "내 상황에 뭘 깔아야 하는지" 안 알려줌
   - **YouTube 튜토리얼** — 특정 상황 기준, 충돌 고려 없음
   - **Claude Code Setup 플러그인 (Anthropic)** — 읽기 전용 추천만, 설치 스크립트/체크리스트 없음
   - **아무것도 안 깔기** — Claude Code의 잠재력 활용 불가

### Value Proposition Statement
> For Claude Code를 처음 시작하는 사용자 who 어떤 플러그인을 깔아야 할지 모르는, Plugin Advisor는 세팅 진단 도구 that 검증된 프리셋 팩과 체크리스트로 5분 안에 안전한 첫 세팅을 완성시켜 준다. Unlike 커뮤니티 추천 글이나 공식 Setup 플러그인, we 설치 스크립트 생성, 충돌 감지, 비추천 플러그인 안내까지 한 번에 제공한다.

---

## Value Proposition #2: 중급 실험가 (The Experimenter)

### For 중급 실험가:

1. **Who**: Claude Code를 1~6개월 사용한 개발자. MCP 서버 5개 이상 설치해봤지만, 현재 조합이 최적인지 확신이 없는 사용자.

2. **Why**: 현재 플러그인 조합의 건강도를 확인하고, 불필요한 것을 정리하고, 빠진 영역을 채우고 싶다. 토큰 낭비를 줄이고 싶다.

3. **What Before**:
   - 사용하지 않는 MCP 서버가 `.claude.json`에 축적
   - "컨텍스트 윈도우 시작 전에 이미 55,000 토큰 소모"
   - 플러그인 간 충돌/중복 여부를 직접 파악할 방법 없음
   - "loading multiple MCP-heavy plugins noticeably degrades output quality"

4. **How**:
   - `claude mcp list` 결과 붙여넣기만으로 현재 조합 진단
   - 100점 감점 모델 스코어링 (충돌 -20, 중복 -7, 미커버 -7)
   - 10개 카테고리 커버리지 시각화
   - 보완/대체 플러그인 자동 추천

5. **What After**:
   - 현재 조합의 "건강도 점수"를 숫자로 확인
   - 충돌/중복 플러그인 발견 및 정리
   - 빠진 카테고리에 맞는 보완 플러그인으로 조합 완성
   - 토큰 효율 개선

6. **Alternatives**:
   - **MCP-tidy** — 미사용 서버 정리만 가능, 추천/분석 없음
   - **McPick** — TUI 관리 도구, 조합 최적화 없음
   - **직접 .claude.json 편집** — 충돌/중복 판단 기준 없음
   - **Claude Code Setup 플러그인** — 추천만, 기존 조합 분석/점수화 없음

### Value Proposition Statement
> For 여러 MCP 서버를 시도해본 개발자 who 현재 조합이 최적인지 확신이 없는, Plugin Advisor는 조합 분석 도구 that `claude mcp list`를 붙여넣기만 하면 점수, 충돌, 보완 추천을 한 번에 보여준다. Unlike MCP-tidy나 직접 편집, we 100점 감점 모델로 조합 건강도를 수치화하고 대안까지 제시한다.

---

## Value Proposition #3: 팀 리더 (The Standardizer)

### For 팀 리더:

1. **Who**: 개발팀에 Claude Code 도입을 책임지는 테크 리드, CTO, DevOps. 팀 전체의 일관된 설정이 필요한 사람.

2. **Why**: 팀원 전체가 안전하고 일관된 Claude Code 설정을 사용하도록 표준을 정하고, 신규 팀원 온보딩을 간소화하고 싶다.

3. **What Before**:
   - 팀원마다 다른 MCP 설정 → 문제 재현 불가
   - "초기에 모든 Slack 메시지를 자동 전송해서 팀원들 혼란"
   - 위험한 플러그인(DB 삭제 가능) 관리 부재
   - 온보딩할 때마다 설정을 처음부터 설명

4. **How**:
   - 프로젝트 유형별 추천 조합으로 팀 기준 설정
   - 충돌 감지로 위험한 조합 사전 차단
   - 설치 스크립트로 팀 전원 동일 세팅 배포
   - 카테고리 커버리지로 빠진 영역 확인

5. **What After**:
   - 팀 승인 플러그인 목록 + 원클릭 설치 스크립트
   - 신규 팀원이 5분 만에 팀 표준 설정 완료
   - 위험/비추천 플러그인 사전 필터링

6. **Alternatives**:
   - **내부 위키에 직접 문서화** — 유지보수 부담, 플러그인 업데이트 반영 어려움
   - **각자 알아서 설정** — 불일치, 보안 위험
   - **Anthropic Setup 플러그인** — 개인용, 팀 표준화 기능 없음

### Value Proposition Statement
> For 팀에 Claude Code를 도입하는 리더 who 일관된 설정 표준이 필요한, Plugin Advisor는 팀 세팅 가이드 that 검증된 조합 추천, 충돌 감지, 설치 스크립트를 통해 팀 전원의 동일 세팅을 보장한다. Unlike 내부 위키나 개인별 설정, we 51개 DB 기반으로 지속 업데이트되는 추천을 제공한다.

---

## Value Proposition #4: 한국 개발자 (The Korean Developer)

### For 한국 개발자:

1. **Who**: 한국어를 주 언어로 사용하는 개발자. 영어 문서에 의존해야 하는 불편함을 겪고 있으며, 한국 생태계(카카오, Toss 등) 연동에 관심 있는 사용자.

2. **Why**: 한국어로 편하게 Claude Code 플러그인을 탐색하고, 내 프로젝트에 맞는 설정을 완성하고 싶다.

3. **What Before**:
   - 한국어 플러그인 추천 자료가 거의 없음
   - 영어 문서 해석 중 설정 오류 발생
   - 한국 특화 MCP (카카오톡, Toss 등) 존재 여부 파악 어려움
   - Windows/npx 환경 문제 해결 가이드 부족

4. **How**:
   - 한국어 기본 UI로 플러그인 탐색/추천
   - 한국어 설치 가이드 + Windows MCP/npx 문제 해결 가이드
   - 51개 플러그인 한국어 설명 + 카테고리 필터링

5. **What After**:
   - 언어 장벽 없이 프로젝트에 맞는 추천
   - Windows 환경 문제 사전 해결
   - 한국 개발 생태계에 맞는 정보 접근

6. **Alternatives**:
   - **영어 원문 문서** — 해석 비용, 오류 가능성
   - **한국 블로그 산발적 글** — 체계적이지 않음, 충돌/조합 분석 없음
   - **PyTorch 한국 커뮤니티** — 특정 도메인 한정

### Value Proposition Statement
> For 한국어로 Claude Code를 쓰는 개발자 who 플러그인 추천/가이드의 언어 장벽을 겪는, Plugin Advisor는 한국어 세팅 가이드 that 한국어 UI와 가이드로 플러그인 탐색부터 설치까지 모국어로 해결해준다. Unlike 영어 문서나 산발적 블로그 글, we 체계적 추천 + 조합 분석을 한국어로 제공하는 유일한 도구다.

---

## Reusable Value Proposition Statements

### Marketing (홈페이지, 광고, SNS)
> "Claude Code에 어떤 플러그인을 설치해야 할지 모르겠다면 — 프로젝트를 분석하고, 검증된 조합을 추천하고, 설치 스크립트까지 만들어 드립니다."

### Sales (서비스 페이지, 리드 캡처)
> "9,000+개 플러그인 중 내 프로젝트에 맞는 조합을 5분 만에 찾으세요. 충돌 감지, 토큰 효율 분석, 설치 체크리스트까지."

### Onboarding (앱 내 첫 화면)
> "프리셋 팩을 고르거나, 프로젝트를 설명하면 맞춤 추천을 드려요. 복사 전에 체크리스트부터 확인하세요."

### Community (Reddit, 커뮤니티 댓글)
> "Claude Code 플러그인 조합 진단 무료 도구 만들었어요. claude mcp list 붙여넣으면 점수, 충돌, 보완 추천 한 번에 나옵니다."

### Korean Market (한국 커뮤니티)
> "Claude Code 세팅, 영어 문서 없이도 됩니다. 한국어로 추천받고, 한국어 가이드로 설치하세요."

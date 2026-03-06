# Task List — Claude Code Plugin Advisor

PRD 기반 태스크 목록. 진행 상황을 여기서 추적합니다.

---

## P0 — MVP 필수

### 입력
- [x] 텍스트 직접 입력으로 프로젝트 설명
- [x] 파일 업로드 (.md, .txt)
- [x] 파일 드래그앤드롭 지원
- [x] GitHub URL로 README 자동 불러오기 (서버사이드 API route)

### 추천 엔진
- [x] 키워드 기반 플러그인 추천 (10개 플러그인 DB)
- [x] 스코어 상위 4개 추천
- [x] OMC + Superpowers 동시 매칭 시 충돌 방지 로직
- [x] 매칭 키워드 없을 때 기본 추천 (bkit, context7)

### 결과 UI
- [x] 추천 이유 표시
- [x] 매칭 키워드 하이라이트
- [x] 충돌 경고 (OMC <-> Superpowers)
- [x] 플러그인 상세 모달 (설명, 기능, GitHub 링크)
- [x] 설치 스크립트 생성 & 클립보드 복사
- [x] 체크박스로 원하는 것만 선택

### 타입 & 구조
- [x] TypeScript 타입 정의 (lib/types.ts)
- [x] 컴포넌트 분리 (InputPanel, PluginCard, PluginModal, InstallScript, ConflictWarning)
- [x] 플러그인 DB 별도 파일 관리 (lib/plugins.ts)

### 배포 & 반응형
- [ ] 반응형 레이아웃 모바일 최적화
- [ ] Vercel 배포 설정 & 첫 배포

---

## P1 — 배포 후 추가

- [ ] 플러그인 DB 확장 (현재 10개 -> 30개+)
- [ ] 분석 히스토리 저장 (localStorage)
- [ ] 플러그인 조합 즐겨찾기
- [ ] 커뮤니티 추천 조합 공유
- [ ] 플러그인 최신 버전 알림
- [ ] /plugins 전체 플러그인 목록 페이지
- [ ] /plugins/[id] 플러그인 상세 페이지

---

## P2 — 장기

- [ ] AI 기반 분석 (Claude API 옵션)
- [ ] 플러그인 리뷰 & 평점
- [ ] 다국어 지원 (EN/KO)

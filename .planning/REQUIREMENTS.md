# Requirements: Plugin Advisor

**Defined:** 2026-03-18
**Core Value:** 사용자의 프로젝트에 맞는 검증된 Claude Code 플러그인 조합을 정확하게 추천하는 것.

## v1.2 Requirements

Requirements for milestone v1.2 — MCP + Plugin 통합.

### 타입 시스템 (Type System)

- [x] **TYPE-01**: Plugin 타입에 type 필드('mcp' | 'plugin')가 추가되고, 기존 42개 항목은 자동으로 'mcp'로 분류된다
- [x] **TYPE-02**: parseMcpList의 pseudo-plugin factory가 실제 Plugin 타입과 일치하도록 수정된다

### 데이터 (Plugin DB)

- [x] **DATA-01**: 주요 Plugin 10-15개가 DB에 추가되고, type: 'plugin'으로 분류된다
- [x] **DATA-02**: 각 Plugin 항목의 install 명령어, category, keywords, features가 검증된 상태로 등록된다
- [x] **DATA-03**: Plugin 항목의 한/영 번역이 동기화된다

### 점수화 (Scoring)

- [x] **SCORE-01**: scorePlugins에 typeScope 파라미터가 추가되어 MCP/Plugin별 보완 추천이 분리된다
- [x] **SCORE-02**: 보완 추천에서 MCP 분석 시 Plugin 타입이 추천되지 않고, Plugin 분석 시 MCP 타입이 추천되지 않는다
- [x] **SCORE-03**: 커버리지 분석이 typeScope 내에서만 계산된다

### UI (카탈로그 + 옵티마이저)

- [ ] **UI-01**: /plugins 페이지에서 MCP | Plugin 탭으로 분리되어 표시된다
- [ ] **UI-02**: 탭 선택 상태가 URL query param으로 유지되어 뒤로가기 시 보존된다
- [ ] **UI-03**: /optimizer paste hint와 sample data가 `claude mcp list` + `claude plugin list` 둘 다 안내한다
- [ ] **UI-04**: 자동완성 드롭다운에서 MCP/Plugin 타입 뱃지가 표시된다

### i18n

- [ ] **I18N-01**: 탭 라벨, 타입 뱃지 등 신규 UI 텍스트가 한/영 모두 지원된다
- [x] **I18N-02**: 신규 Plugin 10-15개의 desc/longDesc 영문 번역이 등록된다

## Future Requirements

Deferred to future release.

- **SCORE-04**: 크로스 타입 충돌 감지 (MCP↔Plugin 충돌 쌍)
- **UI-05**: /optimizer에서 MCP + Plugin 결과를 탭으로 분리 표시
- **DATA-04**: Plugin DB 확장 (30개 이상)
- **AI-01**: AI 기반 조합 분석 모드 활성화

## Out of Scope

| Feature | Reason |
|---------|--------|
| Plugin 실제 설치 테스트 | 메타데이터 검증만, 런타임 테스트는 별도 마일스톤 |
| AI 조합 분석 구현 | 규칙 기반만, AI는 추후 |
| settings.json 파싱 | 텍스트/직접입력만 |
| Plugin marketplace 연동 | 정적 DB 유지, API 연동은 추후 |
| 시너지 가점 | 감점 모델만 유지 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TYPE-01 | Phase 8 | Complete (2026-03-18) |
| TYPE-02 | Phase 8 | Complete (2026-03-18) |
| DATA-01 | Phase 9 | Complete |
| DATA-02 | Phase 9 | Complete |
| DATA-03 | Phase 9 | Complete |
| SCORE-01 | Phase 10 | Complete |
| SCORE-02 | Phase 10 | Complete |
| SCORE-03 | Phase 10 | Complete |
| UI-01 | Phase 11 | Pending |
| UI-02 | Phase 11 | Pending |
| UI-03 | Phase 12 | Pending |
| UI-04 | Phase 12 | Pending |
| I18N-01 | Phase 12 | Pending |
| I18N-02 | Phase 9 | Complete |

**Coverage:**
- v1.2 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-18*

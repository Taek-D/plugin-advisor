# Requirements: Plugin Advisor

**Defined:** 2026-03-18
**Core Value:** 사용자의 프로젝트에 맞는 검증된 Claude Code 플러그인 조합을 정확하게 추천하는 것.

## v1.3 Requirements

Requirements for milestone v1.3 — DB 확장 (MCP + Plugin).

### MCP 서버 (6개)

- [x] **MCP-01**: fetch MCP 서버가 검증된 메타데이터(install, features, keywords, category)로 DB에 등록된다
- [x] **MCP-02**: time MCP 서버가 검증된 메타데이터로 DB에 등록된다
- [x] **MCP-03**: markitdown MCP 서버가 검증된 메타데이터로 DB에 등록된다
- [ ] **MCP-04**: magic-mcp 서버가 검증된 메타데이터로 DB에 등록된다
- [ ] **MCP-05**: n8n-mcp 서버가 검증된 메타데이터로 DB에 등록된다
- [ ] **MCP-06**: shadcn-mcp 서버가 검증된 메타데이터로 DB에 등록된다

### Plugin (3개)

- [ ] **PLG-01**: claude-mem Plugin이 검증된 메타데이터로 DB에 등록되고 type: 'plugin'으로 분류된다
- [ ] **PLG-02**: superclaude Plugin이 검증된 메타데이터로 DB에 등록되고 type: 'plugin'으로 분류된다
- [ ] **PLG-03**: frontend-design Plugin이 검증된 메타데이터로 DB에 등록되고 type: 'plugin'으로 분류된다

### 검증 (Verification)

- [ ] **VER-01**: 신규 9개 항목의 install 명령어가 공식 GitHub README와 일치한다
- [ ] **VER-02**: 신규 9개 항목의 한국어 desc/longDesc와 영문 번역이 동기화된다
- [ ] **VER-03**: plugins.test.ts 카운트 임계값이 60개로 업데이트되고 타입 분포 테스트가 갱신된다
- [ ] **VER-04**: pnpm typecheck, lint, build, test가 모두 통과한다

## Future Requirements

Deferred to future release.

- **MCP-07~**: mongodb, obsidian, redis 등 DB/인프라 MCP 서버 추가
- **PLG-04~**: feature-dev, pr-review-toolkit, commit-commands 등 공식 마켓플레이스 Plugin 추가
- **DATA-04**: Plugin DB 확장 (30개 이상)
- **SCORE-04**: 크로스 타입 충돌 감지 (MCP↔Plugin 충돌 쌍)

## Out of Scope

| Feature | Reason |
|---------|--------|
| 아카이브된 서버 추가 (gdrive, google-maps, azure) | 공식 아카이브됨, 사용 불가 |
| 새 PluginCategory 추가 | 기존 10개 카테고리로 충분 |
| UI/기능 변경 | v1.3은 순수 데이터 마일스톤 |
| 신규 npm 의존성 추가 | 데이터 추가만, 패키지 불필요 |
| scoring.ts 수정 | 새 항목은 자동으로 점수 엔진에 참여 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MCP-01 | Phase 13 | Complete |
| MCP-02 | Phase 13 | Complete |
| MCP-03 | Phase 13 | Complete |
| MCP-04 | Phase 13 | Pending |
| MCP-05 | Phase 13 | Pending |
| MCP-06 | Phase 13 | Pending |
| PLG-01 | Phase 14 | Pending |
| PLG-02 | Phase 14 | Pending |
| PLG-03 | Phase 14 | Pending |
| VER-01 | Phase 15 | Pending |
| VER-02 | Phase 15 | Pending |
| VER-03 | Phase 15 | Pending |
| VER-04 | Phase 15 | Pending |

**Coverage:**
- v1.3 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

---
*Requirements defined: 2026-03-18*

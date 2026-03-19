# Requirements: Plugin Advisor

**Defined:** 2026-03-18
**Core Value:** 사용자의 프로젝트에 맞는 검증된 Claude Code 플러그인 조합을 정확하게 추천하는 것.

## v1.3 Requirements

Requirements for milestone v1.3 — DB 확장 (MCP + Plugin).

### MCP 서버 (6개)

- [x] **MCP-01**: fetch MCP 서버가 검증된 메타데이터(install, features, keywords, category)로 DB에 등록된다
- [x] **MCP-02**: time MCP 서버가 검증된 메타데이터로 DB에 등록된다
- [x] **MCP-03**: markitdown MCP 서버가 검증된 메타데이터로 DB에 등록된다
- [x] **MCP-04**: magic-mcp 서버가 검증된 메타데이터로 DB에 등록된다
- [x] **MCP-05**: n8n-mcp 서버가 검증된 메타데이터로 DB에 등록된다
- [x] **MCP-06**: shadcn-mcp 서버가 검증된 메타데이터로 DB에 등록된다

### Plugin (3개)

- [x] **PLG-01**: claude-mem Plugin이 검증된 메타데이터로 DB에 등록되고 type: 'plugin'으로 분류된다
- [x] **PLG-02**: superclaude Plugin이 검증된 메타데이터로 DB에 등록되고 type: 'plugin'으로 분류된다
- [x] **PLG-03**: frontend-design Plugin이 검증된 메타데이터로 DB에 등록되고 type: 'plugin'으로 분류된다

### 검증 (Verification)

- [x] **VER-01**: 신규 9개 항목의 install 명령어가 공식 GitHub README와 일치한다
- [x] **VER-02**: 신규 9개 항목의 한국어 desc/longDesc와 영문 번역이 동기화된다
- [x] **VER-03**: plugins.test.ts 카운트 임계값이 51개로 업데이트되고 타입 분포 테스트가 갱신된다
- [x] **VER-04**: pnpm typecheck, lint, build, test가 모두 통과한다

### 추천 이유 (Reason Strings) — Gap Closure

- [ ] **RSN-01**: 신규 9개 항목(fetch, time, markitdown, magic-mcp, n8n-mcp, shadcn-mcp, claude-mem, superclaude, frontend-design)의 Korean reason 문자열이 lib/plugin-reasons.ts REASONS 객체에 존재한다
- [ ] **RSN-02**: lib/i18n/plugins-en.ts의 reasonsEn export가 orphaned 상태가 아니다 (consumer 연결 또는 제거)

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
| MCP-04 | Phase 13 | Complete |
| MCP-05 | Phase 13 | Complete |
| MCP-06 | Phase 13 | Complete |
| PLG-01 | Phase 14 | Complete |
| PLG-02 | Phase 14 | Complete |
| PLG-03 | Phase 14 | Complete |
| VER-01 | Phase 15 | Complete |
| VER-02 | Phase 15 | Complete |
| VER-03 | Phase 15 | Complete |
| VER-04 | Phase 15 | Complete |

| RSN-01 | Phase 16 | Pending |
| RSN-02 | Phase 16 | Pending |

**Coverage:**
- v1.3 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-03-18*

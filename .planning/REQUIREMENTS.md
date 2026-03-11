# Requirements: Plugin Advisor

**Defined:** 2026-03-11
**Core Value:** 사용자의 프로젝트에 맞는 검증된 Claude Code 플러그인 조합을 정확하게 추천하는 것.

## v1.0 Requirements

Requirements for milestone v1.0 — 플러그인 메타데이터 검증.

### 검증 프로세스

- [ ] **VERIFY-01**: 각 플러그인의 GitHub repo 존재 여부 및 활성 상태 확인
- [ ] **VERIFY-02**: README 기반으로 desc, longDesc 정확성 검토 및 수정
- [ ] **VERIFY-03**: features 목록이 실제 기능과 일치하는지 검토 및 수정
- [ ] **VERIFY-04**: keywords가 실제 용도를 반영하는지 검토 및 수정
- [ ] **VERIFY-05**: install 명령어가 공식 문서와 일치하는지 확인 및 수정
- [ ] **VERIFY-06**: conflicts 규칙이 실제로 유효한지 검토

### 상태 업데이트

- [ ] **UPDATE-01**: 검증 결과에 따라 각 플러그인의 verificationStatus 업데이트
- [ ] **UPDATE-02**: 영문 번역(`lib/i18n/plugins-en.ts`) 동기화

## v2 Requirements

Deferred to future release.

- **TEST-01**: 검증된 플러그인 설치 명령어 실제 실행 테스트
- **EXPAND-01**: 새 플러그인 추가 및 DB 확장

## Out of Scope

| Feature | Reason |
|---------|--------|
| verified 10개 재검증 | 이미 검증 완료 |
| 실제 설치 테스트 | 이번 마일스톤은 메타데이터 검증만 |
| UI/UX 변경 | 이번 마일스톤 범위 아님 |
| 추천 알고리즘 수정 | 검증 결과 반영 후 별도 마일스톤 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| VERIFY-01 | — | Pending |
| VERIFY-02 | — | Pending |
| VERIFY-03 | — | Pending |
| VERIFY-04 | — | Pending |
| VERIFY-05 | — | Pending |
| VERIFY-06 | — | Pending |
| UPDATE-01 | — | Pending |
| UPDATE-02 | — | Pending |

**Coverage:**
- v1.0 requirements: 8 total
- Mapped to phases: 0
- Unmapped: 8 ⚠️

---
*Requirements defined: 2026-03-11*
*Last updated: 2026-03-11 after initial definition*

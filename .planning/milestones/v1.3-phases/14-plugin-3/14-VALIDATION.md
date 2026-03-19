---
phase: 14
slug: plugin-3
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 14 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm test -- plugins` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck && pnpm test -- plugins`
- **After every plan wave:** Run `pnpm typecheck && pnpm lint && pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green (`pnpm typecheck && pnpm lint && pnpm build && pnpm test`)
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 14-01-01 | 01 | 1 | PLG-01, PLG-02, PLG-03 | unit + type | `pnpm typecheck && pnpm test -- plugins` | ✅ lib/__tests__/plugins.test.ts | ⬜ pending |
| 14-01-02 | 01 | 1 | PLG-01, PLG-02, PLG-03 | unit | `pnpm test -- plugins` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

PLUGIN_TYPE_IDS array in plugins.test.ts needs update (9 → 12 entries) but this is part of task execution, not Wave 0 setup.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| /plugins Plugin 탭에서 3개 항목 표시 | PLG-01~03 | UI 렌더링 확인 | 1. dev 서버 실행 2. /plugins 접속 3. Plugin 탭 선택 4. claude-mem, superclaude, frontend-design 확인 |
| /optimizer Plugin 보완 추천 노출 | PLG-01~03 | E2E 시나리오 | 1. /optimizer 접속 2. MCP만 입력 3. Plugin 보완 추천에 신규 항목 확인 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

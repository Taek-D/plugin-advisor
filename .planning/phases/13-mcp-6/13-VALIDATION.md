---
phase: 13
slug: mcp-6
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm test -- plugins` |
| **Full suite command** | `pnpm test` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck && pnpm test -- plugins`
- **After every plan wave:** Run `pnpm typecheck && pnpm lint && pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green (`pnpm typecheck && pnpm lint && pnpm build && pnpm test`)
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 1 | MCP-01 | unit | `pnpm test -- plugins` | ✅ lib/__tests__/plugins.test.ts | ⬜ pending |
| 13-01-02 | 01 | 1 | MCP-02 | unit | `pnpm test -- plugins` | ✅ | ⬜ pending |
| 13-01-03 | 01 | 1 | MCP-03 | unit | `pnpm test -- plugins` | ✅ | ⬜ pending |
| 13-01-04 | 01 | 1 | MCP-04 | unit | `pnpm test -- plugins` | ✅ | ⬜ pending |
| 13-01-05 | 01 | 1 | MCP-05 | unit | `pnpm test -- plugins` | ✅ | ⬜ pending |
| 13-01-06 | 01 | 1 | MCP-06 | unit | `pnpm test -- plugins` | ✅ | ⬜ pending |
| 13-01-07 | 01 | 1 | MCP-01~06 | typecheck | `pnpm typecheck` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| install 명령이 공식 README verbatim과 일치 | MCP-01~06 | 외부 소스 비교 필요 | RESEARCH.md의 Verified Install Commands 섹션과 코드 내 install 배열 대조 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

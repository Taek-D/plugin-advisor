---
phase: 12
slug: optimizer-ui-i18n
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-18
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `pnpm typecheck` |
| **Full suite command** | `pnpm test && pnpm build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck`
- **After every plan wave:** Run `pnpm test && pnpm build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 12-01-01 | 01 | 1 | I18N-01 | type check | `pnpm typecheck` | ✅ | ⬜ pending |
| 12-01-02 | 01 | 1 | UI-03 | type check + smoke | `pnpm typecheck` | ✅ | ⬜ pending |
| 12-01-03 | 01 | 1 | UI-04 | type check + visual | `pnpm typecheck` | ✅ | ⬜ pending |
| 12-01-04 | 01 | 1 | UI-03, UI-04, I18N-01 | build | `pnpm build` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

- Vitest test suite already installed and configured
- `pnpm typecheck` validates i18n type safety (Translations type enforces key parity)
- `pnpm build` validates full Next.js compilation including i18n imports
- `pnpm test` runs existing parse-mcp-list tests that cover format handling

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sample data loads 5 plugins (3 MCP + 2 Plugin) | UI-03 | User interaction required | `pnpm dev` → /optimizer → click "샘플 데이터로 시작" → verify 5 chips appear |
| MCP badge (blue) renders in autocomplete | UI-04 | Visual verification | `pnpm dev` → /optimizer → "직접 입력" tab → type "context7" → verify blue [MCP] badge |
| Plugin badge (purple) renders in autocomplete | UI-04 | Visual verification | `pnpm dev` → /optimizer → "직접 입력" tab → type "superpowers" → verify purple [Plugin] badge |
| Chips show type badges | UI-04 | Visual verification | Add plugins → verify MCP/Plugin badges on chips |
| English locale shows updated strings | I18N-01 | Locale switch required | Switch to English → verify paste hint mentions both commands |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

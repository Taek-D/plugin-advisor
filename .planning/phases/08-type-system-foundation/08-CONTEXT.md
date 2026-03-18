# Phase 8: Type System Foundation - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Plugin 타입에 type 필드('mcp' | 'plugin')를 추가하고, 기존 42개 항목을 자동으로 'mcp'로 분류하며, parseMcpList의 pseudo-plugin factory를 실제 Plugin 타입과 일치하도록 수정한다. 기존 항목의 재분류(omc 등)는 Phase 9에서 처리.

</domain>

<decisions>
## Implementation Decisions

### 타입 명칭
- UI 표시명: "MCP" / "Plugin"
- 내부 값: `'mcp' | 'plugin'` (타입명 `ItemType` 또는 `PluginType`)
- CLI 용어와 일치: `claude mcp list` → mcp, `claude plugin list` → plugin

### 분류 규칙
- install 명령어 기반 분류:
  - `claude mcp add` / `npx` / `uvx` = `'mcp'`
  - `claude plugin add` / `git clone ~/.claude/` = `'plugin'`
- Phase 8에서는 기존 42개 전부 `'mcp'` 유지 (재분류는 Phase 9)

### Claude's Discretion
- type 필드를 PluginOperationalFields에 추가할지 Plugin에 직접 추가할지
- pseudo-plugin factory 수정 방식 (type 필드 추가 vs factory 제거 후 실제 Plugin[] 전달)
- 타입 유니온 이름 (ItemType, PluginType 등)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PluginOperationalFields` + `DEFAULT_PLUGIN_FIELDS` 패턴: type 필드를 여기에 추가하면 42개 기존 항목에 자동 기본값 적용
- `PLUGIN_FIELD_OVERRIDES`: 특정 항목만 type을 override 가능 (Phase 9에서 사용)

### Established Patterns
- Plugin 타입은 `lib/types.ts`에서 정의, 문자열 리터럴 유니온 사용 (enum 금지)
- 운영 필드는 `PluginOperationalFields`로 분리, `DEFAULT_PLUGIN_FIELDS`로 기본값 제공
- `PluginSeed = Omit<Plugin, keyof PluginOperationalFields>` — seed에는 운영 필드 불포함

### Integration Points
- `lib/parse-mcp-list.ts:93-111`: pseudo-plugin factory가 Plugin 객체를 인라인 생성 — type 필드 추가 필요
- `lib/scoring.ts`: Plugin.type을 직접 사용하지 않지만 Phase 10에서 typeScope 추가 시 의존
- `lib/plugins.ts:22-33`: DEFAULT_PLUGIN_FIELDS에 type: 'mcp' 추가 위치

</code_context>

<specifics>
## Specific Ideas

No specific requirements — standard type system extension following existing patterns.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-type-system-foundation*
*Context gathered: 2026-03-18*

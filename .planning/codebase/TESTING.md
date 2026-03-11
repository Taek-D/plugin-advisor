# Testing Patterns

**Analysis Date:** 2026-03-11

## Test Framework

**Runner:**
- Vitest 4.0.18
- Config: `vitest.config.ts`
- Environment: Node.js (`test: { environment: "node" }`)

**Assertion Library:**
- Vitest built-in expect API (no separate library)

**Run Commands:**
```bash
pnpm test              # Run all tests
pnpm test --watch     # Watch mode (if supported)
pnpm test --coverage  # Coverage report (if configured)
```

## Test File Organization

**Location:**
- Tests colocated with source: `lib/__tests__/` directory
- Pattern: `lib/__tests__/[feature].test.ts` mirrors `lib/[feature].ts`

**Naming:**
- Suffix: `.test.ts` (e.g., `recommend.test.ts`, `conflicts.test.ts`)

**Structure:**
```
lib/__tests__/
├── recommend.test.ts       # Tests for lib/recommend.ts
├── conflicts.test.ts       # Tests for lib/conflicts.ts
├── setup.test.ts           # Tests for lib/setup.ts
├── admin-session.test.ts   # Tests for lib/admin-session.ts
└── plugin-suggestions.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, expect, it } from "vitest";
import { recommend } from "../recommend";

describe("recommend()", () => {
  it("returns the beginner starter pack for beginner-like input", () => {
    const result = recommend("Claude Code 초보인데 처음 세팅을 도와줘");
    expect(result.recommendedPackId).toBe("beginner-essential");
    expect(result.recommendations.length).toBeGreaterThanOrEqual(2);
  });
});
```

**Patterns:**
- Suite per exported function: `describe("functionName()", () => { ... })`
- One assertion per test (preferred, not enforced)
- Descriptive test names: `"returns the beginner starter pack for beginner-like input"`
- Arrange-Act-Assert (implicit, no setup/teardown observed)

**Setup/Teardown:**
- Not used in current tests
- No fixtures or test utilities observed

## Mocking

**Framework:** Not detected (Vitest native mocking not used)

**Patterns:**
- No mocking observed in test suite
- Tests call pure functions directly: `recommend(input)`, `getConflicts(ids)`
- No async mocking or spy patterns

**What to Mock:**
- API calls would be candidates if tested (not currently in test suite)
- External dependencies (not present in unit tests)

**What NOT to Mock:**
- Pure functions like `recommend()`, `getConflicts()`
- Plugin database lookups
- Conflict/redundancy checks

## Fixtures and Factories

**Test Data:**
- Inline test strings directly in test cases
- Example from `recommend.test.ts`:
```typescript
const result = recommend("Claude Code 초보인데 처음 세팅을 도와줘");
```

**Location:**
- No separate fixture files
- Test data hardcoded in test cases

## Coverage

**Requirements:** None enforced

**View Coverage:**
- No coverage command configured
- To add: `"coverage": "vitest run --coverage"` to `package.json`

## Test Types

**Unit Tests:**
- Core focus of test suite
- Test functions: `recommend()`, `getConflicts()`, `getRedundancies()`
- Scope: Pure function logic, no database/API calls

**Integration Tests:**
- Not implemented

**E2E Tests:**
- Not implemented

## Common Patterns

**Keyword Matching Tests (recommend.test.ts):**
```typescript
it("returns the beginner starter pack for beginner-like input", () => {
  const result = recommend("Claude Code 초보인데 처음 세팅을 도와줘");
  expect(result.recommendedPackId).toBe("beginner-essential");
  expect(result.recommendations.length).toBeGreaterThanOrEqual(2);
  expect(result.recommendations.map((item) => item.pluginId)).toContain("bkit-starter");
});
```

**Conflict Detection (conflicts.test.ts):**
```typescript
it("detects omc + superpowers conflict", () => {
  const result = getConflicts(["omc", "superpowers"]);
  expect(result.length).toBe(1);
  expect(result[0].ids).toContain("omc");
  expect(result[0].ids).toContain("superpowers");
  expect(typeof result[0].msg).toBe("string");
});
```

**Exhaustive Pair Testing (conflicts.test.ts):**
```typescript
it("conflict result ids match the CONFLICT_PAIRS definition", () => {
  for (const pair of CONFLICT_PAIRS) {
    const [a, b] = pair.ids;
    const result = getConflicts([a, b]);
    expect(result.length).toBe(1);
    expect(result[0].ids).toContain(a);
    expect(result[0].ids).toContain(b);
  }
});
```

**Admin Session Token Tests (admin-session.test.ts):**
```typescript
it("creates a token that verifies before expiration", () => {
  const secret = "super-secret";
  const now = Date.UTC(2026, 2, 9, 0, 0, 0);
  const token = createAdminSessionToken(secret, now);

  expect(verifyAdminSessionToken(token, secret, now + 1000)).toBe(true);
});
```

## Test Coverage Summary

**Tested Modules:**
- `lib/recommend.ts` - 15 test cases covering pack selection, plugin filtering, beginner safety
- `lib/conflicts.ts` - 11 test cases covering conflict/redundancy detection
- `lib/admin-session-core.ts` - 4 test cases covering token generation/verification
- `lib/setup.ts` - 1+ test cases (file not fully read)
- `lib/plugin-suggestions.ts` - 1+ test cases (file not fully read)

**Untested Modules:**
- Components (no component tests)
- API routes (no integration tests)
- Hooks (`useAnalysis`, etc.)
- UI components (`InputPanel`, `PluginCard`, etc.)

---

*Testing analysis: 2026-03-11*

# Deferred Items

## Pre-existing TypeScript Errors (out of scope for 19-02)

Discovered during 19-02 typecheck. Confirmed pre-existing before any 19-02 changes.

### 1. app/api/feedback/route.ts — Supabase type mismatch
- Error: `TS2769` — `.insert({ page, message, type })` argument not assignable to `never`
- Cause: Supabase generated types don't include `feedback` table yet (migration pending)
- Fix: Run Supabase type generation after feedback table migration is applied

### 2. app/api/newsletter/route.ts — Supabase type mismatch
- Error: `TS2769` — `.insert({ email, source, confirmed })` argument not assignable to `never`
- Cause: Supabase generated types don't include `newsletter_subscribers` table yet
- Fix: Run Supabase type generation after newsletter table migration is applied

### 3. lib/__tests__/newsletter-route.test.ts — Missing module
- Error: `TS2307` — Cannot find module `@/app/api/newsletter/route`
- Cause: newsletter route file may not exist yet or path mismatch
- Fix: Verify route file exists and test import path is correct

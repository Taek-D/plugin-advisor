# Phase 19: Share + Feedback + Newsletter - Research

**Researched:** 2026-03-30
**Domain:** Web Share API, clipboard patterns, floating widget UI, Supabase insert patterns, i18n extension, analytics event extension
**Confidence:** HIGH

## Summary

Phase 19 adds three user-facing engagement features: share buttons on result pages, a global floating feedback widget, and a newsletter subscription form on the landing page. All three write to Supabase tables already created in Phase 17 (`feedback`, `newsletter_subscribers`). The API route pattern is fully established by `app/api/plugin-suggestions/route.ts` — copy that structure for both `/api/feedback` and `/api/newsletter`.

The share feature uses a two-path approach: `navigator.share()` on mobile where the Web Share API is available, falling back to `navigator.clipboard.writeText()` + inline Copy→Check state on desktop. This is a zero-new-package implementation using browser natives. The feedback widget is a floating button fixed to the bottom-right corner that toggles a slide-up panel using CSS transform/transition — no shadcn Sheet needed given the project already has the inline state pattern. The newsletter form is a simple email input inline on the landing page, placed above the footer section.

The i18n extension adds three new top-level keys (`share`, `feedback`, `newsletter`) to both `lib/i18n/ko.ts` and `lib/i18n/en.ts`, and their types to `lib/i18n/types.ts`. The analytics extension adds five new `EventName` literals to `lib/analytics.ts`. These two files are the shared foundation touched first in plan 19-01.

**Primary recommendation:** Build in three plans: (1) i18n + analytics types foundation, (2) ShareResultButton component + share-utils + integration into ResultsPanel and OptimizerApp, (3) FeedbackWidget + /api/feedback + NewsletterForm + /api/newsletter + admin feedback page + page integrations.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- /advisor 추천 결과 + /optimizer 조합 분석 결과 두 페이지에 공유 버튼 배치
- 기본은 URL 복사 버튼, 모바일에서 Web Share API 지원 시 네이티브 공유 시트 활성화
- 공유 콘텐츠는 현재 페이지 URL만 (OG 이미지가 이미 있으므로 SNS 프리뷰 자동 생성)
- 성공 피드백은 인라인 상태 전환 (Copy→Check 아이콘 + '복사됨' 텍스트) — 기존 클립보드 복사 패턴과 일관성 유지
- Toast UI 도입하지 않음 (zero new npm packages 원칙)
- 플로팅 버튼 + 슬라이드업 드로어 방식 — 화면 구석에 피드백 버튼, 클릭 시 드로어로 폼 표시
- 폼 구조: 타입 선택(버그/기능제안/기타) + 자유 텍스트 메시지
- Supabase feedback 테이블에 저장 (Phase 17에서 이미 생성됨)
- 완전 익명 — 로그인/이메일 없이 메시지만 수집, 진입 장벽 최소화
- 레이트 리밋 적용 (기존 rate-limit.ts 패턴 활용)
- 랜딩 페이지 푸터 바로 위에 구독 섹션 배치
- 이메일 필드만 수집 — 진입 장벽 최소화
- Supabase newsletter 테이블에 저장 (Phase 17에서 이미 생성됨)
- 이메일 인증(double opt-in) 없이 저장 — confirmed=false 기본값, 인증은 v2에서 처리
- 중복 구독 시도 시 성공처럼 보여줌 — 이메일 존재 여부 노출 방지 (보안)

### Claude's Discretion
- 플로팅 피드백 버튼의 정확한 위치/아이콘/애니메이션
- 드로어 슬라이드업 구현 방식 (CSS transition vs shadcn Sheet)
- 뉴스레터 섹션의 카피/일러스트 스타일
- 공유 버튼의 정확한 배치 위치 (결과 상단 vs 하단)
- API route 구조 (feedback/newsletter 각각 or 통합)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SHAR-01 | Optimizer 결과 화면에서 조합 점수/요약을 X, LinkedIn으로 공유할 수 있다 | `navigator.share()` or clipboard copy of current URL; OG image already provides rich preview on SNS |
| SHAR-02 | Advisor 결과 화면에서 추천 결과를 공유할 수 있다 | Same ShareResultButton component reused in PluginAdvisorApp/ResultsSection; current page URL as share content |
| SHAR-03 | 모바일에서 Web Share API, 데스크톱에서 클립보드 복사 폴백이 동작한다 | `'share' in navigator` feature-detect at call time; `navigator.share({url})` mobile path, `navigator.clipboard.writeText(url)` desktop fallback |
| FDBK-01 | 사이트에서 피드백 위젯을 통해 의견을 제출할 수 있다 | Floating button + slide-up panel; type select + textarea + submit; `'use client'` component in layout.tsx |
| FDBK-02 | 피드백이 Supabase에 저장되고 rate limit이 적용된다 | `/api/feedback` POST route using `checkRateLimit` + `getSupabaseAdminClient().from("feedback").insert()` — table exists from Phase 17 |
| FDBK-03 | 관리자가 피드백을 확인할 수 있다 | New `/admin/feedback` page following same pattern as `/admin/suggestions` page (server component, force-dynamic, requireAdminSession) |
| NEWS-01 | 사용자가 이메일 구독 폼으로 뉴스레터를 구독할 수 있다 | `NewsletterForm` client component with email input + inline success/error state; added above footer in `app/page.tsx` |
| NEWS-02 | 구독 정보가 Supabase에 저장되고 중복/rate limit이 적용된다 | `/api/newsletter` POST route; Supabase upsert with `onConflict: "email"` to silently handle duplicates; `checkRateLimit` applied; table exists from Phase 17 |
</phase_requirements>

---

## Standard Stack

### Core
| API / Pattern | Source | Purpose | Why Standard |
|---------------|--------|---------|--------------|
| `navigator.share()` | Browser native | Mobile native share sheet | Web Share API Level 1, supported in all modern mobile browsers; zero package cost |
| `navigator.clipboard.writeText()` | Browser native | Desktop URL copy fallback | Already used in 7 components in this codebase |
| `'share' in navigator` | Browser native | Feature-detect Web Share API | Standard runtime detection; must be called at invocation time (not render time) due to SSR |
| `getSupabaseAdminClient()` | `lib/supabase-admin.ts` | Server-side Supabase writes | Already established; service role key bypasses RLS for writes |
| `checkRateLimit()` | `lib/rate-limit.ts` | IP-based rate limiting on API routes | Already used in plugin-suggestions route |
| `trackEvent()` | `lib/analytics.ts` | Track share/feedback/newsletter events | localStorage + Umami dual tracking already wired |

### Supporting
| Component | Source | Purpose | When to Use |
|-----------|--------|---------|-------------|
| `Button`, `Textarea`, `Input` | `components/ui/` (shadcn) | Form elements | All UI — no new packages |
| `Copy`, `Check`, `Share2`, `MessageSquare` | `lucide-react` (already installed) | Share/feedback icons | Available without install |
| CSS `translate-y` transition | Tailwind | Slide-up drawer animation | Simpler than shadcn Sheet; sufficient for floating panel |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS translate transition for drawer | shadcn Sheet | Sheet would work but adds no value over CSS transition for a single-purpose widget; CSS is lighter |
| Silent duplicate handling (upsert) | Return 409 error | Returning error reveals email existence — upsert is the privacy-correct approach |
| Separate `/api/feedback` + `/api/newsletter` routes | Single combined route | Separate routes are cleaner, match existing per-feature pattern, easier to rate-limit independently |

**Installation:** No new packages. Everything uses browser APIs, existing shadcn/ui, lucide-react, and project lib utilities.

---

## Architecture Patterns

### Recommended Project Structure

New files for Phase 19:

```
lib/
├── share-utils.ts              # shareResult(url) — navigator.share / clipboard fallback
lib/i18n/
├── ko.ts                       # +share, +feedback, +newsletter keys
├── en.ts                       # +share, +feedback, +newsletter keys
├── types.ts                    # +share, +feedback, +newsletter type sections
lib/__tests__/
├── share-utils.test.ts         # unit tests for shareResult()
├── feedback-route.test.ts      # unit tests for /api/feedback
├── newsletter-route.test.ts    # unit tests for /api/newsletter
components/
├── ShareResultButton.tsx       # 'use client' — share button with copy fallback
├── FeedbackWidget.tsx          # 'use client' — floating button + slide-up panel
├── NewsletterForm.tsx          # 'use client' — email input + submit + inline state
app/api/
├── feedback/route.ts           # POST handler
├── newsletter/route.ts         # POST handler
app/admin/
├── feedback/page.tsx           # server component — admin feedback list
```

Integration touch points (existing files):
```
components/PluginAdvisorApp.tsx    # add <ShareResultButton> when step === "result"
components/OptimizerApp.tsx        # add <ShareResultButton> when analysisState === "done"
app/layout.tsx                     # add <FeedbackWidget> before </I18nProvider>
app/page.tsx                       # add <NewsletterForm> above footer section
```

### Pattern 1: Share Utility (lib/share-utils.ts)

**What:** A pure function that returns a result object, enabling testability without mocking browser globals in component code.

**When to use:** Called from ShareResultButton's click handler.

```typescript
// lib/share-utils.ts
export type ShareOutcome = "native" | "clipboard" | "error";

export async function shareResult(url: string, title?: string): Promise<ShareOutcome> {
  try {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      await navigator.share({ url, title });
      return "native";
    }
    await navigator.clipboard.writeText(url);
    return "clipboard";
  } catch {
    // User dismissed native share or clipboard blocked
    return "error";
  }
}
```

**Key point:** `'share' in navigator` check must be inside the async function, not at module load time — SSR will have no `navigator`. The function is called client-side only (inside event handler of a `'use client'` component).

### Pattern 2: ShareResultButton Component

**What:** Client component that calls `shareResult()` and transitions Copy→Check state for clipboard path.

```typescript
// components/ShareResultButton.tsx
"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shareResult } from "@/lib/share-utils";
import { trackEvent } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";

export default function ShareResultButton({ url }: { url: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const outcome = await shareResult(url, t.share.title);
    trackEvent("result_share", { outcome });
    if (outcome === "clipboard") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      {copied
        ? <><Check className="h-3.5 w-3.5 mr-1.5" />{t.share.copied}</>
        : <><Share2 className="h-3.5 w-3.5 mr-1.5" />{t.share.button}</>
      }
    </Button>
  );
}
```

**Getting the current URL client-side:** Use `window.location.href` inside the click handler. Do NOT use `useSearchParams` or URL props passed from server — this is a client-only interaction.

### Pattern 3: FeedbackWidget (floating + slide-up)

**What:** Fixed-position floating button at `bottom-4 right-4 sm:bottom-6 sm:right-6`. Click toggles a panel that slides up using CSS transform transition. No new packages — pure Tailwind + useState.

```typescript
// FeedbackWidget.tsx — key structure
const [open, setOpen] = useState(false);
const [submitted, setSubmitted] = useState(false);

// Panel: fixed positioning, translate-y transition
// Closed: translate-y-full opacity-0 pointer-events-none
// Open:   translate-y-0 opacity-100
```

**z-index concern:** Use `z-50` for the widget to sit above all page content. The floating button is `z-50`, the panel is also `z-50`. This is safe — no modals or dialogs compete at this z-level in the current layout.

**Dismiss patterns:** Click the close button (X), click outside (optional, adds complexity — omit for simplicity), or submit successfully (auto-close after 1.5s).

### Pattern 4: API Route (/api/feedback and /api/newsletter)

**Template — exactly mirrors `app/api/plugin-suggestions/route.ts`:**

```typescript
// app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, cleanupExpiredEntries } from "@/lib/rate-limit";
import { getSupabaseAdminClient, SupabaseNotConfiguredError } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    cleanupExpiredEntries();
    const { allowed } = checkRateLimit(request, {
      name: "feedback",
      maxRequests: 5,
      windowMs: 60 * 60_000,  // 5 per hour
    });
    if (!allowed) {
      return NextResponse.json({ error: "..." }, { status: 429 });
    }

    const body = await request.json();
    // validate body fields
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("feedback").insert({
      page: body.page ?? "unknown",
      message: body.message,
      type: body.type,       // "bug" | "feature" | "other"
    });
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return NextResponse.json({ error: "..." }, { status: 503 });
    }
    return NextResponse.json({ error: "..." }, { status: 500 });
  }
}
```

**Newsletter duplicate handling — use upsert:**

```typescript
// Supabase upsert with ignoreDuplicates — silently handles unique email constraint
const { error } = await supabase
  .from("newsletter_subscribers")
  .upsert({ email, source: "landing" }, { onConflict: "email", ignoreDuplicates: true });
// Whether email was new or existing, return 201 — never reveal existence
```

**Why upsert not insert:** The `newsletter_subscribers` table has `unique(email)`. A plain `insert` on duplicate throws a PostgreSQL unique violation (error code `23505`). The upsert with `ignoreDuplicates: true` silently skips existing rows and returns no error. This is the privacy-correct pattern — the response to the user is always success.

### Pattern 5: Admin Feedback Page

**Exactly mirrors `app/admin/suggestions/page.tsx`:**

```typescript
// app/admin/feedback/page.tsx
import { requireAdminSession } from "@/lib/admin-session";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  requireAdminSession("/admin/feedback");
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });
  // render list...
}
```

Navigation: Add link to admin feedback page in `app/admin/suggestions/page.tsx` alongside the existing "플러그인 관리" link.

### Pattern 6: i18n Extension

**Three new top-level sections added to `types.ts`, `ko.ts`, `en.ts`:**

```typescript
// lib/i18n/types.ts additions
share: {
  button: string;        // "공유하기" / "Share"
  copied: string;        // "복사됨" / "Copied"
  title: string;         // page title passed to navigator.share
};
feedback: {
  buttonLabel: string;   // "피드백" / "Feedback"
  panelTitle: string;    // "의견을 알려주세요" / "Send feedback"
  typeBug: string;       // "버그 신고" / "Bug report"
  typeFeature: string;   // "기능 제안" / "Feature request"
  typeOther: string;     // "기타" / "Other"
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  successMsg: string;
  errorMsg: string;
  close: string;
};
newsletter: {
  sectionTitle: string;
  sectionDesc: string;
  placeholder: string;   // "이메일 주소" / "Email address"
  submit: string;        // "구독하기" / "Subscribe"
  submitting: string;
  successMsg: string;
  errorMsg: string;
  privacyNote: string;   // brief no-spam note
};
```

### Pattern 7: Analytics Event Extension

**Five new EventName literals added to `lib/analytics.ts`:**

```typescript
type EventName =
  // ... existing 16 events ...
  | "result_share"           // share button clicked (outcome: native|clipboard|error)
  | "feedback_open"          // feedback widget opened
  | "feedback_submit"        // feedback form submitted successfully
  | "newsletter_subscribe"   // newsletter form submitted successfully
  | "newsletter_error";      // newsletter API returned error (for debugging)
```

### Anti-Patterns to Avoid

- **SSR navigator access:** Never call `navigator.share` or `navigator.clipboard` at module/component load time. Always call inside event handlers or useEffect. `'use client'` is not sufficient — SSR still runs client component code on the server during hydration setup.
- **Revealing email existence:** Never return a 409 or "already subscribed" message. Always return success for newsletter duplicate attempts. Use Supabase upsert `ignoreDuplicates: true`.
- **Rating field in feedback:** The Phase 17 migration added a `rating` column (nullable smallint). The locked decision removed star rating in favor of type select + free text. Leave the `rating` column null — do not send it from the API route.
- **Global z-index conflicts:** The floating FeedbackWidget must be `position: fixed` in the DOM, added as a direct child of the `<I18nProvider>` wrapper in `layout.tsx`. Do not nest it inside `{children}` or the `<Nav>` component.
- **Large bundle from unnecessary imports:** ShareResultButton and FeedbackWidget are `'use client'` — keep them lean. Do not import Supabase client or server-only modules in these components.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Duplicate email handling | Custom SELECT-then-INSERT logic | Supabase `upsert` with `ignoreDuplicates: true` | Race-condition-safe, atomic, one round-trip |
| Rate limiting | Custom IP tracking | `checkRateLimit()` from `lib/rate-limit.ts` | Already battle-tested in this codebase, named buckets |
| Copy state reset | Manual clearTimeout management | `useState(false)` + `setTimeout(() => setCopied(false), 2000)` | Identical to pattern in `InstallScript.tsx` — just copy it |
| Web Share feature detection | Regex user-agent sniffing | `'share' in navigator` | Spec-compliant, handles all edge cases |
| Admin auth | New auth system | `requireAdminSession()` from `lib/admin-session` | Already used in all three admin pages |

---

## Common Pitfalls

### Pitfall 1: Web Share API Not Available on Desktop Chrome
**What goes wrong:** `navigator.share` is defined in Chrome desktop 89+ but with restrictions — it only works in response to a user gesture AND only on HTTPS. In practice, many desktop environments still return `undefined` for `'share' in navigator`.
**Why it happens:** The spec allows implementations to expose the API conditionally.
**How to avoid:** Always check `'share' in navigator` at call time inside the event handler. The clipboard fallback handles all desktop cases. Test both paths.
**Warning signs:** `navigator.share is not a function` errors in desktop browser console.

### Pitfall 2: navigator.share Requires User Gesture
**What goes wrong:** Calling `navigator.share()` outside of a direct user gesture handler throws `NotAllowedError`.
**Why it happens:** Browser security restriction — prevents programmatic share abuse.
**How to avoid:** Call `shareResult()` only from `onClick` handlers, never from `useEffect` or timers.

### Pitfall 3: Supabase Insert vs Upsert for Newsletter
**What goes wrong:** Using `.insert()` for newsletter subscription causes a PostgreSQL unique constraint error (code `23505`) on duplicate emails. If not caught specifically, this surfaces as a 500 to the user.
**Why it happens:** The `newsletter_subscribers_email_key` unique constraint from the Phase 17 migration.
**How to avoid:** Use `.upsert({ email, source }, { onConflict: "email", ignoreDuplicates: true })`. Always return success to the caller regardless.

### Pitfall 4: FeedbackWidget Hydration Mismatch
**What goes wrong:** If `FeedbackWidget` renders any state-dependent content during SSR that differs client-side, React throws a hydration mismatch warning.
**Why it happens:** `useState` values are always `false`/empty on server, but if the component tries to read localStorage or window on first render it fails.
**How to avoid:** The widget starts with `open: false`, `submitted: false` — purely static initial render. No localStorage reads at render time. No issues expected, but verify with `pnpm build`.

### Pitfall 5: i18n Types Must Be Extended, Not Bypassed
**What goes wrong:** Adding translation keys to `ko.ts` / `en.ts` without updating `types.ts` causes TypeScript errors. Using `as any` or optional chaining to bypass the type check creates silent missing-key bugs.
**Why it happens:** `Translations` type in `types.ts` fully defines the shape; both locale files must implement it exactly.
**How to avoid:** Update `types.ts` first, then implement both `ko.ts` and `en.ts` simultaneously. `pnpm typecheck` catches any mismatch immediately.

### Pitfall 6: Analytics EventName Union Must Be Extended
**What goes wrong:** Calling `trackEvent("result_share", ...)` before adding `"result_share"` to the `EventName` union in `lib/analytics.ts` causes a TypeScript error at every call site.
**Why it happens:** `trackEvent` takes `event: EventName` — strictly typed.
**How to avoid:** Plan 19-01 extends `EventName` first. All subsequent plans then have the correct types available.

---

## Code Examples

### Web Share + Clipboard Fallback (verified browser spec pattern)

```typescript
// Source: MDN Web Docs — Navigator.share()
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share

// Feature detect at call time (not at module load — SSR safe)
if (typeof navigator !== "undefined" && "share" in navigator) {
  // Native share sheet (mobile)
  await navigator.share({ url, title });
} else {
  // Clipboard fallback (desktop)
  await navigator.clipboard.writeText(url);
}
```

### Supabase Upsert with ignoreDuplicates (verified Supabase JS v2 pattern)

```typescript
// Source: Supabase JS v2 docs — upsert
// https://supabase.com/docs/reference/javascript/upsert
const { error } = await supabase
  .from("newsletter_subscribers")
  .upsert(
    { email, source: "landing", confirmed: false },
    { onConflict: "email", ignoreDuplicates: true }
  );
// error is null for both new inserts and duplicate-ignored rows
```

### CSS Slide-Up Drawer (Tailwind, no package)

```tsx
// Slide-up panel with CSS transition — no shadcn Sheet needed
<div
  className={cn(
    "fixed bottom-16 right-4 sm:right-6 z-50 w-80 transition-all duration-300",
    "rounded-[24px] border border-overlay-border bg-card shadow-xl",
    open
      ? "translate-y-0 opacity-100 pointer-events-auto"
      : "translate-y-4 opacity-0 pointer-events-none"
  )}
>
  {/* form content */}
</div>
```

### Rate Limit Config for Feedback/Newsletter

```typescript
// feedback: permissive — feedback is valuable
checkRateLimit(request, { name: "feedback", maxRequests: 5, windowMs: 60 * 60_000 });

// newsletter: stricter — prevent spam subscriptions
checkRateLimit(request, { name: "newsletter", maxRequests: 3, windowMs: 60 * 60_000 });
```

### Existing Copy→Check Pattern (from InstallScript.tsx — copy this exactly)

```typescript
const [copied, setCopied] = useState(false);

const handleCopy = () => {
  navigator.clipboard.writeText(url);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

// In JSX:
{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
{copied ? t.share.copied : t.share.button}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom share dialog (jQuery era) | `navigator.share()` Web Share API | 2018+ (Chrome 61, Safari 12.1) | Zero-package native share sheet on mobile |
| Full-page newsletter forms | Inline email field + inline success state | 2020+ (common SaaS pattern) | Lower friction, no redirect |
| Toast notifications for copy feedback | Inline icon state transition (Copy→Check) | Already established in this codebase | Consistent with existing 7 components |

**Not applicable here:**
- External email service (Resend, Mailchimp) — deferred to v2 (NEWS-04)
- Double opt-in — deferred to v2 (NEWS-03)

---

## Open Questions

1. **feedback table `page` column — where to get the value**
   - What we know: The `feedback` table has a `page text not null` column (from Phase 17 migration)
   - What's unclear: FeedbackWidget lives in `layout.tsx` globally — it needs to know the current page path to populate `page`
   - Recommendation: Use `window.location.pathname` inside the submit handler of FeedbackWidget (client-side only, inside `'use client'` component). This is already safe since the widget is client-only.

2. **Admin feedback page navigation link placement**
   - What we know: All three admin pages link to each other; `app/admin/suggestions/page.tsx` has "플러그인 관리" link
   - What's unclear: Whether to add a "피드백" link to the suggestions page header or create a shared admin nav component
   - Recommendation: Add inline link alongside existing admin nav links for Phase 19. A shared AdminNav component is a v2 refactor.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (vitest.config.ts) |
| Config file | `vitest.config.ts` — esbuild jsx automatic, node environment, `@` alias |
| Quick run command | `pnpm test -- share-utils` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SHAR-01 | shareResult() calls navigator.share when available | unit | `pnpm test -- share-utils` | ❌ Wave 0 |
| SHAR-02 | shareResult() falls back to clipboard.writeText when no share API | unit | `pnpm test -- share-utils` | ❌ Wave 0 |
| SHAR-03 | shareResult() returns "native" / "clipboard" / "error" outcomes | unit | `pnpm test -- share-utils` | ❌ Wave 0 |
| FDBK-02 | /api/feedback POST inserts to Supabase and enforces rate limit | unit | `pnpm test -- feedback-route` | ❌ Wave 0 |
| FDBK-02 | /api/feedback POST returns 429 when rate limit exceeded | unit | `pnpm test -- feedback-route` | ❌ Wave 0 |
| NEWS-02 | /api/newsletter POST uses upsert (no error on duplicate email) | unit | `pnpm test -- newsletter-route` | ❌ Wave 0 |
| NEWS-02 | /api/newsletter POST returns 429 when rate limit exceeded | unit | `pnpm test -- newsletter-route` | ❌ Wave 0 |
| FDBK-01, NEWS-01 | Component rendering and form submission | manual | `pnpm dev` visual check | — |
| FDBK-03 | Admin page shows feedback list | manual | `pnpm dev` + admin login | — |

### Sampling Rate
- **Per task commit:** `pnpm typecheck && pnpm test -- [test-file-name]`
- **Per wave merge:** `pnpm test && pnpm typecheck && pnpm lint`
- **Phase gate:** `pnpm test && pnpm typecheck && pnpm lint && pnpm build` — full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `lib/__tests__/share-utils.test.ts` — covers SHAR-01, SHAR-02, SHAR-03
- [ ] `lib/__tests__/feedback-route.test.ts` — covers FDBK-02
- [ ] `lib/__tests__/newsletter-route.test.ts` — covers NEWS-02

*(Framework install: none needed — Vitest already configured)*

---

## Sources

### Primary (HIGH confidence)
- Codebase: `lib/rate-limit.ts`, `lib/supabase-admin.ts` — exact API signatures verified by reading source
- Codebase: `app/api/plugin-suggestions/route.ts` — exact API route template
- Codebase: `components/InstallScript.tsx` — exact Copy→Check clipboard pattern
- Codebase: `app/admin/suggestions/page.tsx` — exact admin page template
- Codebase: `lib/i18n/types.ts`, `lib/i18n/ko.ts` — exact i18n extension points
- Codebase: `supabase/migrations/20260329_create_feedback.sql` + `20260329_create_newsletter_subscribers.sql` — exact column names and constraints (from Phase 17 plan)
- Codebase: `vitest.config.ts` — test runner configuration confirmed

### Secondary (MEDIUM confidence)
- MDN Web Docs: Navigator.share() — Web Share API Level 1 feature detection and usage
- Supabase JS v2 docs: `.upsert()` with `ignoreDuplicates: true` for conflict handling

### Tertiary (LOW confidence)
- None — all critical patterns verified from codebase source

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all patterns verified from existing codebase code
- Architecture: HIGH — directly mirrors established patterns (plugin-suggestions, admin/suggestions, InstallScript)
- Pitfalls: HIGH — identified from actual codebase constraints (unique constraint in Phase 17 SQL, SSR navigator restriction is well-known)
- i18n extension: HIGH — types.ts structure fully read and understood

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (stable patterns, no external dependency on fast-moving libraries)

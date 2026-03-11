# 보안 감사 리포트

**프로젝트:** plugin-advisor
**점검일:** 2026-03-10
**점검 범위:** 8개 카테고리, 28개 파일 분석

## 요약

| 심각도 | 발견 수 |
|--------|---------|
| CRITICAL | 0 |
| HIGH | 3 |
| MEDIUM | 3 |
| LOW | 2 |
| **총계** | **8** |

---

## 발견된 취약점

### [HIGH-1] Rate Limiting 없음 — AI 분석 엔드포인트

- **심각도:** HIGH
- **카테고리:** Rate Limiting
- **위치:** `app/api/analyze/route.ts`
- **설명:** Anthropic API를 호출하는 `/api/analyze` 엔드포인트에 rate limiting이 없음. 악의적 사용자가 무제한으로 AI 분석을 요청하면 Anthropic API 비용이 급증할 수 있음.
- **영향:** API 비용 폭증, 서비스 가용성 저하
- **수정 방법:**
  ```typescript
  // upstash/ratelimit 또는 간단한 in-memory rate limiter 적용
  // 예: IP당 분당 5회 제한
  import { Ratelimit } from "@upstash/ratelimit";
  import { Redis } from "@upstash/redis";

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
  });

  // POST 핸들러 내부
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "요청이 너무 많아요." }, { status: 429 });
  }
  ```

---

### [HIGH-2] Rate Limiting 없음 — 관리자 로그인

- **심각도:** HIGH
- **카테고리:** Rate Limiting
- **위치:** `app/api/admin/login/route.ts`
- **설명:** 관리자 로그인 엔드포인트에 brute-force 방어가 없음. 비밀번호가 짧은 문자열(`pluginadvisor`)이므로 자동화된 공격에 취약.
- **영향:** 관리자 계정 탈취, 제안 데이터 조작
- **수정 방법:**
  ```typescript
  // IP당 5분에 5회 시도 제한 + 실패 시 지수적 백오프
  const loginLimiter = new Map<string, { count: number; resetAt: number }>();

  function checkLoginRate(ip: string): boolean {
    const now = Date.now();
    const entry = loginLimiter.get(ip);
    if (!entry || entry.resetAt < now) {
      loginLimiter.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 });
      return true;
    }
    entry.count++;
    return entry.count <= 5;
  }
  ```

---

### [HIGH-3] Rate Limiting 없음 — 플러그인 제안

- **심각도:** HIGH
- **카테고리:** Rate Limiting
- **위치:** `app/api/plugin-suggestions/route.ts`
- **설명:** 플러그인 제안 제출에 rate limiting이 없어 스팸 제안이 대량 유입될 수 있음.
- **영향:** DB 스팸, 관리자 검토 부담 증가
- **수정 방법:** IP당 시간당 3~5회 제한 적용

---

### [MEDIUM-1] 보안 헤더 미설정

- **심각도:** MEDIUM
- **카테고리:** 정보 노출
- **위치:** `next.config.mjs`
- **설명:** CSP, X-Frame-Options, X-Content-Type-Options 등 보안 헤더가 설정되지 않음. middleware.ts도 없음.
- **영향:** 클릭재킹, MIME 스니핑, XSS 공격 가능성 증가
- **수정 방법:**
  ```javascript
  // next.config.mjs
  const nextConfig = {
    async headers() {
      return [{
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      }];
    },
  };
  ```

---

### [MEDIUM-2] Prompt Injection 가능성

- **심각도:** MEDIUM
- **카테고리:** Prompt Injection
- **위치:** `app/api/analyze/route.ts:71`
- **설명:** 사용자 입력 텍스트가 AI 프롬프트에 직접 삽입됨. 시스템/사용자 메시지 분리는 되어 있으나, 입력 텍스트에 대한 살균 처리 없음. AI 응답의 pluginId 검증은 수행 중(line 84-88).
- **영향:** 추천 결과 조작 가능 (실제 피해는 제한적 — pluginId가 허용 목록으로 검증됨)
- **수정 방법:** 입력 텍스트 길이 제한(이미 4000자 slice 적용)은 유지하되, 응답 파싱 시 예외 처리 강화. 현재 수준에서 실질적 위험은 낮음.

---

### [MEDIUM-3] 에러 메시지에 내부 정보 포함 가능성

- **심각도:** MEDIUM
- **카테고리:** 정보 노출
- **위치:** `app/api/analyze/route.ts:110-111`
- **설명:** catch 블록에서 `e.message`를 클라이언트에 직접 반환. Anthropic SDK 내부 에러 메시지(API 키 형식, rate limit 정보 등)가 노출될 수 있음.
- **영향:** 공격자가 내부 API 구성 정보를 유추
- **수정 방법:**
  ```typescript
  // 수정 전
  const msg = e instanceof Error ? e.message : "AI 분석 중 오류가 발생했어요.";

  // 수정 후
  const msg = "AI 분석 중 오류가 발생했어요.";
  ```

---

### [LOW-1] 의존성 취약점 — Next.js 14

- **심각도:** LOW (Vercel 배포 시 자동 완화)
- **카테고리:** 의존성 취약점
- **위치:** `package.json` → `next@^14.2.0`
- **설명:** Next.js 14에 알려진 CVE 2건 (HTTP request deserialization DoS, Image Optimizer DoS). 패치 버전은 15.0.8+, 15.5.10+이므로 Next.js 14 범위 내에서는 패치 불가.
- **영향:** Vercel 배포 시 인프라 레벨에서 대부분 완화됨. 셀프호스팅 시 위험도 상승.
- **수정 방법:** Next.js 15로 메이저 업그레이드 검토 (중장기)

---

### [LOW-2] 의존성 취약점 — glob (dev only)

- **심각도:** LOW
- **카테고리:** 의존성 취약점
- **위치:** `eslint-config-next` → `@next/eslint-plugin-next` → `glob@10.x`
- **설명:** glob CLI의 command injection 취약점. devDependency 경로이며, 프로덕션 빌드에 포함되지 않음.
- **영향:** 개발 환경에서만 해당, 프로덕션 영향 없음
- **수정 방법:** eslint-config-next 업데이트 시 자연 해소

---

## 긍정적 발견 (잘 된 부분)

| 항목 | 상세 |
|------|------|
| 시크릿 관리 | `.env.local` gitignore 포함, NEXT_PUBLIC에 service_role 미노출 |
| Admin 인증 | HMAC-SHA256 세션 토큰, timing-safe 비밀번호 비교 |
| 서버 전용 분리 | `server-only` 패키지로 admin 클라이언트 클라이언트 번들 유입 차단 |
| RLS 활성 | plugin_suggestions 테이블 RLS 활성 (service role만 접근) |
| 공개 API 응답 제한 | 제안 POST는 `{id, status}`만 반환, admin_notes 미노출 |
| 에러 처리 | 대부분 제네릭 한국어 메시지 반환, 스택 트레이스 미노출 |
| 입력 검증 | URL https 강제, reason 필수, 길이 제한 적용 |

---

## 우선순위 액션 아이템

| 순위 | 심각도 | 난이도 | 액션 | 파일 |
|------|--------|--------|------|------|
| 1 | HIGH | 낮음 | `/api/admin/login`에 로그인 시도 횟수 제한 추가 | `app/api/admin/login/route.ts` |
| 2 | HIGH | 낮음 | `/api/plugin-suggestions`에 IP 기반 rate limit 추가 | `app/api/plugin-suggestions/route.ts` |
| 3 | HIGH | 중간 | `/api/analyze`에 rate limit 추가 (upstash 또는 in-memory) | `app/api/analyze/route.ts` |
| 4 | MEDIUM | 낮음 | `next.config.mjs`에 보안 헤더 추가 | `next.config.mjs` |
| 5 | MEDIUM | 낮음 | `/api/analyze` catch 블록에서 제네릭 에러 메시지 반환 | `app/api/analyze/route.ts` |
| 6 | LOW | 높음 | Next.js 15 메이저 업그레이드 검토 | `package.json` |

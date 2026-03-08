import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Read-only client safe for Server Components.
 * setAll is a no-op since RSCs cannot write cookies.
 */
export function createReadOnlyClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // no-op in Server Components
        },
      },
    }
  );
}

/**
 * Mutable client for Route Handlers and Server Actions.
 * Can read and write cookies for auth session management.
 */
export function createMutableClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll may throw in edge cases; safe to ignore during SSR
          }
        },
      },
    }
  );
}

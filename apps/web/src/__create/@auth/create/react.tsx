/**
 * V1 auth-client compatibility surface for migrated V2 apps.
 *
 * V1 projects import SessionProvider / session helpers from `@auth/create/react`
 * (an alias to `@hono/auth-js/react` / NextAuth-shaped client). V2 ships Better
 * Auth via `@/lib/auth-client` and has no `@auth/create` package, so those
 * imports fail the module graph with "Can't resolve '@auth/create/react'".
 *
 * This shim makes the bare specifier resolvable so a migrated build can boot.
 * It is intentionally a thin resolution bridge, not a full NextAuth → Better
 * Auth port:
 *   - SessionProvider: Better Auth has no React session provider. Render
 *     children only so existing <SessionProvider>...</SessionProvider> JSX
 *     keeps compiling.
 *   - useSession / signIn / signUp / signOut: re-exported from the V2 Better
 *     Auth client. The call / return shapes are NOT identical to NextAuth;
 *     call sites that rely on NextAuth-specific APIs still need app-level
 *     cleanup (useAuth compat helper, or the migration repair agent).
 *
 * Referenced by apps/web/next.config.js resolve aliases. Removing it breaks
 * V1→V2 migrated projects that still import `@auth/create/react`.
 */
'use client';

import type { ReactNode } from 'react';

export { signIn, signUp, signOut, useSession } from '@/lib/auth-client';

export function SessionProvider({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export default SessionProvider;

/**
 * V1 server auth helper compatibility surface for migrated V2 apps.
 *
 * V1's `@auth/create` default export was a CreateAuth factory used by the
 * server bundler. V2 server auth is `@/lib/auth` (betterAuth). This shim makes
 * the bare specifier resolvable and exposes a getSession-shaped default so
 * residual `import CreateAuth from "@auth/create"` call sites do not fail the
 * module graph. Prefer `@/lib/auth` for new code.
 */
import { auth as betterAuth } from '@/lib/auth';

type AuthRequest = {
  headers?: Headers;
};

async function getSession(request?: AuthRequest) {
  return betterAuth.api.getSession({
    headers: request?.headers ?? new Headers(),
  });
}

export default function CreateAuth() {
  return {
    auth: getSession,
  };
}

export { betterAuth, getSession as auth };

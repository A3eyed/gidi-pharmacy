declare module '*.css' {}

declare module 'vitest/config' {
  export function defineConfig(config: Record<string, any>): Record<string, any>;
}

/**
 * V1 auth-client specifier kept resolvable for migrated apps. See
 * src/__create/@auth/create/react.tsx for the runtime shim.
 */
declare module '@auth/create/react' {
  import type { ReactNode } from 'react';
  export function SessionProvider(props: { children?: ReactNode }): ReactNode;
  export const signIn: (...args: any[]) => any;
  export const signUp: (...args: any[]) => any;
  export const signOut: (...args: any[]) => any;
  export const useSession: (...args: any[]) => any;
  export default SessionProvider;
}

declare module '@auth/create' {
  export default function CreateAuth(): { auth: (request?: { headers?: Headers }) => Promise<any> };
  export const betterAuth: any;
  export const auth: (request?: { headers?: Headers }) => Promise<any>;
}

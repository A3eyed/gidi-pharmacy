/**
 * ⚠ ANYTHING PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 auth scaffolding. Same contract as signup/page.tsx: <form
 * onSubmit>, e.preventDefault(), and window.location.href redirect are all
 * load-bearing for the mobile WebView. DO NOT replace <form onSubmit> with
 * <button onClick> — that broke signin platform-wide in a prior AI rewrite.
 *
 *   Safe:   restyle, rewrite copy, add form fields.
 *   Unsafe: replacing <form>, removing preventDefault, bypassing
 *           authClient.signIn.email, changing the callbackUrl redirect.
 */
'use client';

import { useSearchParams } from 'next/navigation';
import { type FormEvent, Suspense, useState } from 'react';
import { SocialSignInButtons } from '@/components/SocialSignInButtons';
import { authClient } from '@/lib/auth-client';

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message ?? 'Sign in failed');
      setLoading(false);
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.href = callbackUrl;
    } else {
      console.warn('signin: window is undefined; cannot redirect to callbackUrl');
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white p-6 font-inter">
      <form
        onSubmit={(e) => {
          void onSubmit(e);
        }}
        className="flex w-full max-w-[400px] flex-col gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-6"
      >
        <p className="text-xs font-medium tracking-[0.14em] text-[#A3A3A3]">GIDI</p>
        <h1 className="text-2xl font-semibold tracking-tight text-black">Sign in</h1>
        <p className="text-sm leading-5 text-[#737373]">Use the same email and password as the website.</p>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-black">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl border border-[#E5E5E5] px-3.5 text-base font-normal text-black outline-none focus:border-black"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-black">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl border border-[#E5E5E5] px-3.5 text-base font-normal text-black outline-none focus:border-black"
          />
        </label>

        {error && (
          <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3 text-sm text-black">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-xl bg-black text-base font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <SocialSignInButtons callbackUrl={callbackUrl} />

        <a
          href={`/account/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="text-center text-sm font-medium text-black underline"
        >
          No account? Create one
        </a>
      </form>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}

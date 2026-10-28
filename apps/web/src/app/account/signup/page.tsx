/**
 * ⚠ ANYTHING PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 auth scaffolding. The <form onSubmit>, e.preventDefault(), and
 * window.location.href redirect are load-bearing for the mobile WebView auth
 * flow (AuthWebView intercepts the navigation to capture the session). A
 * prior AI rewrite replaced <form onSubmit> with <button onClick> and broke
 * signup platform-wide — "credentials cleared" / "button does nothing" for
 * every user until a human reverted it. DO NOT repeat that mistake.
 *
 *   Safe:   restyle, rewrite copy, add form fields (pass `name` explicitly).
 *   Unsafe: replacing <form>, removing preventDefault, bypassing
 *           authClient.signUp.email, changing the callbackUrl redirect.
 */
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { type FormEvent, Suspense, useState } from 'react';
import { SocialSignInButtons } from '@/components/SocialSignInButtons';
import { authClient } from '@/lib/auth-client';

function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isAdult) {
      setError('You must confirm you are 16 or older to create an account.');
      setLoading(false);
      return;
    }

    // The server backfills `name` from the email local-part when it's missing,
    // so email + password is enough.
    const { error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name: '',
    });

    if (signUpError) {
      setError(signUpError.message ?? 'Sign up failed');
      setLoading(false);
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.href = callbackUrl;
    } else {
      console.warn('signup: window is undefined; cannot redirect to callbackUrl');
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
        <h1 className="text-2xl font-semibold tracking-tight text-black">Create account</h1>
        <p className="text-sm leading-5 text-[#737373]">
          Email and a password are enough to start. GiDi is for pharmacy professionals 16 and older.
        </p>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-black">
          Email
          <input
            type="email"
            name="email"
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
            name="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl border border-[#E5E5E5] px-3.5 text-base font-normal text-black outline-none focus:border-black"
          />
        </label>

        <label className="flex items-start gap-2.5 text-sm leading-5 text-[#404040]">
          <input
            type="checkbox"
            name="ageConfirm"
            required
            checked={isAdult}
            onChange={(e) => setIsAdult(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-[#D4D4D4]"
          />
          <span>
            I confirm that I am at least 16 years old and that I am creating this account for pharmacy
            work, not for personal medical use. I agree to the{' '}
            <Link href="/terms" className="font-medium text-black underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-black underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {error && (
          <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-3 text-sm text-black">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !isAdult}
          className="h-12 rounded-xl bg-black text-base font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Continue'}
        </button>

        <SocialSignInButtons callbackUrl={callbackUrl} />

        <a
          href={`/account/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="text-center text-sm font-medium text-black underline"
        >
          Already have an account? Sign in
        </a>
      </form>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}

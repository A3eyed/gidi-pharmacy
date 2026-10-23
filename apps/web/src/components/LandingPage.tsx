'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarClock,
  Globe2,
  Package,
  Pill,
  Receipt,
  ShieldCheck,
  Users,
} from 'lucide-react';

const GOLD = '#C9A227';
const APP_STORE_URL = 'https://apps.apple.com/us/app/gidi-pharmacy-manager/id6814044768';

/**
 * Public landing page shown at "/" for signed-out visitors.
 * Glassmorphism + bento grid, responsive, light & dark mode.
 * Palette is strictly black / white / gold.
 */

function GlassCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-black/10 bg-white/60 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.06] ${className}`}
    >
      {children}
    </div>
  );
}

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 backdrop-blur-md dark:border-white/10 dark:bg-white/10"
      style={{ color: GOLD }}
    >
      {children}
    </div>
  );
}

/** Official-style App Store badge that opens the live listing. */
function AppStoreBadge({ className = '' }: { className?: string }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-xl border border-black/15 bg-black px-4 py-2.5 text-white transition-opacity hover:opacity-90 dark:border-white/20 dark:bg-white dark:text-black ${className}`}
      aria-label="Download GiDi Pharmacy Manager on the App Store"
    >
      <svg width="18" height="22" viewBox="0 0 18 22" fill="currentColor" aria-hidden="true">
        <path d="M14.77 11.65c-.02-2.13 1.74-3.16 1.82-3.21-1-1.46-2.55-1.66-3.1-1.68-1.32-.13-2.58.78-3.25.78-.67 0-1.71-.76-2.81-.74-1.45.02-2.78.84-3.52 2.14-1.5 2.61-.38 6.47 1.08 8.58.71 1.03 1.56 2.19 2.68 2.15 1.07-.04 1.48-.69 2.78-.69 1.29 0 1.66.69 2.8.67 1.16-.02 1.89-1.05 2.6-2.09.82-1.19 1.15-2.34 1.17-2.4-.03-.01-2.24-.86-2.25-3.41zM12.04 4.84c.59-.71.99-1.7.88-2.69-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.64-.9 2.61.95.07 1.92-.48 2.51-1.2z" />
      </svg>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-medium opacity-90">Download on the</span>
        <span className="text-sm font-semibold tracking-tight">App Store</span>
      </span>
    </a>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-white font-inter text-black dark:bg-black dark:text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -top-32 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full opacity-25 blur-3xl dark:opacity-20"
          style={{ background: GOLD }}
        />
        <div className="absolute bottom-0 left-[-120px] h-[320px] w-[320px] rounded-full bg-black opacity-10 blur-3xl dark:bg-white dark:opacity-10" />
        <div
          className="absolute right-[-100px] top-1/3 h-[280px] w-[280px] rounded-full opacity-20 blur-3xl"
          style={{ background: GOLD }}
        />
      </div>

      {/* Glass navbar */}
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white">
              <Pill size={16} className="text-white dark:text-black" />
            </div>
            <span className="text-lg font-semibold tracking-tight">GiDi</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-black/15 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10 sm:inline-flex"
            >
              iOS app
            </a>
            <Link
              href="/account/signin"
              className="rounded-full border border-black/15 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Sign in
            </Link>
            <Link
              href="/account/signup"
              className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-black"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-14 md:px-8 md:pt-20">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-semibold backdrop-blur-md dark:border-white/10 dark:bg-white/10"
            style={{ color: GOLD }}
          >
            <ShieldCheck size={12} />
            Built for modern pharmacies · Now on the App Store
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Smart Pharmacy <span style={{ color: GOLD }}>Management</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-black/70 dark:text-white/70 md:text-lg">
            Track inventory, record sales, understand your numbers, and look up medicine references
            with Azara — built in, and works offline. On web and mobile, in your language and
            currency.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/account/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-85 dark:bg-white dark:text-black sm:w-auto"
            >
              Create your pharmacy
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/account/signin"
              className="inline-flex w-full items-center justify-center rounded-full border border-black/15 bg-white/60 px-6 py-3 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-black/5 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10 sm:w-auto"
            >
              I already have an account
            </Link>
            <AppStoreBadge className="w-full justify-center sm:w-auto" />
          </div>
          <p className="mt-3 text-xs text-black/50 dark:text-white/50">
            Free on the App Store for iPhone and iPad.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Azara — large feature card */}
          <GlassCard className="sm:col-span-2 lg:row-span-2">
            <FeatureIcon>
              <Bot size={20} />
            </FeatureIcon>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">Azara reference assistant</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/70 dark:text-white/70">
              Look up dosing, interactions, counselling points and stock decisions. Azara knows what
              your pharmacy carries and answers from a reference library built into the app — no
              external AI service, so it keeps working offline.
            </p>
            <div className="mt-5 rounded-xl border border-black/10 bg-white/70 p-4 backdrop-blur-md dark:border-white/10 dark:bg-black/40">
              <p className="text-xs font-medium text-black/50 dark:text-white/50">You</p>
              <p className="mt-0.5 text-sm">Cetirizine — adult dose and cautions?</p>
              <p className="mt-3 text-xs font-medium" style={{ color: GOLD }}>
                Azara
              </p>
              <p className="mt-0.5 text-sm text-black/80 dark:text-white/80">
                Cetirizine 10 mg once daily for adults — you have 42 in stock. Reduce in renal
                impairment; may cause drowsiness…
              </p>
              <p className="mt-2 text-xs text-black/50 dark:text-white/50">
                Reference information for professionals — not a diagnosis.
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <FeatureIcon>
              <Package size={20} />
            </FeatureIcon>
            <h3 className="mt-4 text-base font-semibold tracking-tight">Inventory control</h3>
            <p className="mt-1.5 text-sm text-black/70 dark:text-white/70">
              Stock levels, reorder alerts and pricing for every medication.
            </p>
          </GlassCard>

          <GlassCard>
            <FeatureIcon>
              <Receipt size={20} />
            </FeatureIcon>
            <h3 className="mt-4 text-base font-semibold tracking-tight">Fast sales</h3>
            <p className="mt-1.5 text-sm text-black/70 dark:text-white/70">
              Record sales in seconds — stock adjusts automatically.
            </p>
          </GlassCard>

          <GlassCard>
            <FeatureIcon>
              <BarChart3 size={20} />
            </FeatureIcon>
            <h3 className="mt-4 text-base font-semibold tracking-tight">Analytics & reports</h3>
            <p className="mt-1.5 text-sm text-black/70 dark:text-white/70">
              Revenue trends, top sellers and downloadable statements.
            </p>
          </GlassCard>

          <GlassCard>
            <FeatureIcon>
              <CalendarClock size={20} />
            </FeatureIcon>
            <h3 className="mt-4 text-base font-semibold tracking-tight">Expiry tracking</h3>
            <p className="mt-1.5 text-sm text-black/70 dark:text-white/70">
              Know what expires in the next 90 days before it becomes waste.
            </p>
          </GlassCard>

          <GlassCard className="sm:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <FeatureIcon>
                <Users size={20} />
              </FeatureIcon>
              <div>
                <h3 className="text-base font-semibold tracking-tight">Your whole team</h3>
                <p className="mt-1 text-sm text-black/70 dark:text-white/70">
                  Invite staff with a join code. Admins manage, staff dispense — everyone stays in
                  sync.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="sm:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <FeatureIcon>
                <Globe2 size={20} />
              </FeatureIcon>
              <div>
                <h3 className="text-base font-semibold tracking-tight">
                  Your language, your currency
                </h3>
                <p className="mt-1 text-sm text-black/70 dark:text-white/70">
                  Multi-language interface with local currency formatting, plus light and dark mode
                  on web and mobile.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Bottom CTA */}
        <GlassCard className="mt-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Run your pharmacy the smart way
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-black/70 dark:text-white/70">
            Free to get started on the web, or install the iOS app from the App Store.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/account/signup"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-85"
              style={{ background: GOLD }}
            >
              Get started free
              <ArrowRight size={16} />
            </Link>
            <AppStoreBadge />
          </div>
        </GlassCard>

        <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-black/10 pt-6 text-xs text-black/50 dark:border-white/10 dark:text-white/50 sm:flex-row">
          <span>GiDi — Smart Pharmacy Management. Built by Abdallah Fuseini.</span>
          <span className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black dark:hover:text-white"
            >
              App Store
            </a>
            <Link href="/privacy" className="hover:text-black dark:hover:text-white">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-black dark:hover:text-white">
              Terms
            </Link>
          </span>
        </footer>
      </main>
    </div>
  );
}

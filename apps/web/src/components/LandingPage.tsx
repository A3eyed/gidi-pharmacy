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
            Built for modern pharmacies
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Smart Pharmacy <span style={{ color: GOLD }}>Management</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-black/70 dark:text-white/70 md:text-lg">
            Track inventory, record sales, understand your numbers, and look up medicine references
            with Azara — built in, and works offline. On web and mobile, in your language and
            currency.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
          </div>
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
            Free to get started. Set up your pharmacy in under two minutes.
          </p>
          <Link
            href="/account/signup"
            className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-85"
            style={{ background: GOLD }}
          >
            Get started free
            <ArrowRight size={16} />
          </Link>
        </GlassCard>

        <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-black/10 pt-6 text-xs text-black/50 dark:border-white/10 dark:text-white/50 sm:flex-row">
          <span>GiDi — Smart Pharmacy Management. Built by Abdallah Fuseini.</span>
          <span className="flex gap-4">
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

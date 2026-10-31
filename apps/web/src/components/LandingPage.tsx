'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarClock,
  Check,
  Globe2,
  Package,
  Pill,
  Receipt,
  ShieldCheck,
  Sparkles,
  Users,
  WifiOff,
} from 'lucide-react';

const GOLD = '#C9A227';
const APP_STORE_URL = 'https://apps.apple.com/us/app/gidi-pharmacy-manager/id6814044768';

/**
 * Public landing for signed-out visitors.
 * 2026 SaaS patterns: outcome headline, product-first hero (CSS 3D stage),
 * bento features, single primary CTA, dark-capable instrument aesthetic.
 * No external 3D libraries — depth is pure CSS for performance.
 */

function AppStoreBadge({ className = '' }: { className?: string }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white px-4 py-2.5 text-black shadow-lg shadow-black/20 transition hover:scale-[1.02] ${className}`}
      aria-label="Download Pharmacy Manager on the App Store"
    >
      <svg width="18" height="22" viewBox="0 0 18 22" fill="currentColor" aria-hidden="true">
        <path d="M14.77 11.65c-.02-2.13 1.74-3.16 1.82-3.21-1-1.46-2.55-1.66-3.1-1.68-1.32-.13-2.58.78-3.25.78-.67 0-1.71-.76-2.81-.74-1.45.02-2.78.84-3.52 2.14-1.5 2.61-.38 6.47 1.08 8.58.71 1.03 1.56 2.19 2.68 2.15 1.07-.04 1.48-.69 2.78-.69 1.29 0 1.66.69 2.8.67 1.16-.02 1.89-1.05 2.6-2.09.82-1.19 1.15-2.34 1.17-2.4-.03-.01-2.24-.86-2.25-3.41zM12.04 4.84c.59-.71.99-1.7.88-2.69-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.64-.9 2.61.95.07 1.92-.48 2.51-1.2z" />
      </svg>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-medium opacity-70">Download on the</span>
        <span className="text-sm font-semibold tracking-tight">App Store</span>
      </span>
    </a>
  );
}

/** CSS 3D product stage — real UI mock, not abstract blobs. */
function ProductStage() {
  return (
    <div className="relative mx-auto w-full max-w-4xl perspective-[1600px]">
      <div
        className="relative mx-auto origin-center transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform: 'rotateX(12deg) rotateY(-8deg)',
        }}
      >
        {/* Glow under device */}
        <div
          className="pointer-events-none absolute -inset-8 rounded-[40px] opacity-40 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at 50% 80%, rgba(201,162,39,0.45), transparent 65%)',
          }}
        />

        {/* Device frame */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#0a0a0a] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)]">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="ml-3 text-[11px] font-medium text-white/40">Pharmacy Manager</span>
          </div>

          <div className="grid grid-cols-12 gap-0">
            {/* Sidebar */}
            <div className="col-span-3 hidden border-r border-white/10 bg-white/[0.02] p-3 sm:block">
              <div className="mb-4 flex items-center gap-2 px-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
                  <Pill size={14} className="text-black" />
                </div>
                <span className="text-xs font-semibold text-white">GiDi</span>
              </div>
              {['Dashboard', 'Inventory', 'Sales', 'Azara', 'Reports'].map((item, i) => (
                <div
                  key={item}
                  className={`mb-1 rounded-lg px-2.5 py-2 text-[11px] ${
                    i === 0
                      ? 'bg-white/10 font-medium text-white'
                      : 'text-white/45 hover:bg-white/5'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Main panel */}
            <div className="col-span-12 space-y-3 p-4 sm:col-span-9">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-white/35">
                    Today
                  </p>
                  <p className="text-lg font-semibold tracking-tight text-white">₵2,480.00</p>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-black"
                  style={{ background: GOLD }}
                >
                  +18% vs yesterday
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Sales', value: '47' },
                  { label: 'Low stock', value: '6' },
                  { label: 'Expiring', value: '3' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                  >
                    <p className="text-[10px] text-white/40">{s.label}</p>
                    <p className="mt-0.5 text-base font-semibold text-white">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Bot size={12} style={{ color: GOLD }} />
                  <span className="text-[11px] font-medium text-white/70">Azara</span>
                </div>
                <p className="text-[11px] leading-relaxed text-white/55">
                  Amoxicillin 500mg — 24 packs left. Reorder threshold is 30. Two batches expire in
                  41 days.
                </p>
              </div>

              <div className="space-y-1.5">
                {['Paracetamol 500mg ×2', 'ORS sachets ×10', 'Cetirizine 10mg ×1'].map((row, i) => (
                  <div
                    key={row}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2"
                  >
                    <span className="text-[11px] text-white/70">{row}</span>
                    <span className="text-[11px] font-medium text-white/40">
                      {['₵12.00', '₵18.50', '₵8.00'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating cards for depth */}
        <div
          className="absolute -left-2 top-16 hidden w-40 rounded-2xl border border-white/15 bg-[#111]/80 p-3 shadow-2xl backdrop-blur-xl sm:block md:-left-8"
          style={{ transform: 'translateZ(40px) rotateY(12deg)' }}
        >
          <p className="text-[10px] text-white/40">Expiry watch</p>
          <p className="mt-1 text-sm font-semibold text-white">3 batches</p>
          <p className="mt-0.5 text-[10px]" style={{ color: GOLD }}>
            Next in 12 days
          </p>
        </div>
        <div
          className="absolute -right-2 bottom-20 hidden w-44 rounded-2xl border border-white/15 bg-[#111]/80 p-3 shadow-2xl backdrop-blur-xl sm:block md:-right-6"
          style={{ transform: 'translateZ(50px) rotateY(-10deg)' }}
        >
          <div className="flex items-center gap-2">
            <WifiOff size={12} style={{ color: GOLD }} />
            <p className="text-[10px] font-medium text-white/70">Works offline</p>
          </div>
          <p className="mt-1 text-[11px] text-white/45">Stock & sales stay available without signal.</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
  className = '',
}: {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:border-white/20 hover:bg-white/[0.06] ${className}`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition group-hover:opacity-30"
        style={{ background: GOLD }}
      />
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5"
        style={{ color: GOLD }}
      >
        <Icon size={20} />
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#050505] font-inter text-white">
      {/* Grid + mesh background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)',
          }}
        />
        <div
          className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 opacity-40 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(201,162,39,0.35), transparent 60%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-[400px] w-[400px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)',
          }}
        />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 md:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
              <Pill size={16} className="text-black" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-tight">GiDi</span>
              <span className="text-[10px] text-white/40">Pharmacy Manager</span>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-white/55 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#azara" className="transition hover:text-white">
              Azara
            </a>
            <a href="#platforms" className="transition hover:text-white">
              Platforms
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/account/signin"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-white/80 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/account/signup"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-14 md:px-8 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur">
              <Sparkles size={12} style={{ color: GOLD }} />
              Now on the App Store · Built for pharmacy teams 18+
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl md:leading-[1.05]">
              Run the counter, stock, and sales{' '}
              <span style={{ color: GOLD }}>from one place</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
              Pharmacy Manager keeps inventory, sales, expiry alerts, and Azara reference lookup
              together — on web, iPhone, and iPad. Works online and offline.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/account/signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-black transition hover:opacity-90 sm:w-auto"
                style={{ background: GOLD }}
              >
                Create your pharmacy
                <ArrowRight size={16} />
              </Link>
              <AppStoreBadge className="w-full justify-center sm:w-auto" />
            </div>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/40">
              {['No patient records required', 'Team join codes', 'Statements as PDF'].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <Check size={12} style={{ color: GOLD }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-14 md:mt-16">
            <ProductStage />
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-white/5 bg-white/[0.02]">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5 text-xs font-medium text-white/35 md:px-8">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={14} style={{ color: GOLD }} /> Business tool for licensed pharmacies
            </span>
            <span className="inline-flex items-center gap-2">
              <WifiOff size={14} style={{ color: GOLD }} /> Offline-capable stock & sales
            </span>
            <span className="inline-flex items-center gap-2">
              <Bot size={14} style={{ color: GOLD }} /> Azara reference library built in
            </span>
          </div>
        </section>

        {/* Features bento */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 md:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
              Capabilities
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Everything the counter needs, nothing it doesn&apos;t
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/50 md:text-base">
              Built for owners and staff who sell, restock, and report — not for patient charts.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Package}
              title="Inventory that warns you"
              body="Levels, reorder points, pricing, and batch expiry in one catalogue. Low stock surfaces before the shelf is empty."
            />
            <FeatureCard
              icon={Receipt}
              title="Sales in seconds"
              body="Ring a sale, deduct stock automatically, and keep a clean history for statements and audits."
            />
            <FeatureCard
              icon={BarChart3}
              title="Numbers you can act on"
              body="Revenue, top movers, and period reports. Download statements with pharmacy identity on the page."
            />
            <FeatureCard
              icon={CalendarClock}
              title="Expiry before waste"
              body="See what hits the 90-day window early so you can discount, return, or rotate stock."
            />
            <FeatureCard
              icon={Users}
              title="Whole team, one code"
              body="Invite staff with a join code. Admins manage the catalogue; everyone records sales on the same books."
            />
            <FeatureCard
              icon={Globe2}
              title="Language & currency"
              body="Interface languages and local currency formatting so the till matches how you already work."
            />
          </div>
        </section>

        {/* Azara spotlight */}
        <section id="azara" className="mx-auto max-w-6xl px-4 pb-20 md:px-8">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent">
            <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-medium"
                  style={{ color: GOLD }}
                >
                  <Bot size={12} />
                  Azara
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  Reference answers that know your shelf
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/55 md:text-base">
                  Azara looks up dosing, interactions, and counselling points from a library inside
                  the product — not an external AI API. It can list stock, flag low lines, and guide
                  inventory actions under your command. Reference only; not a diagnosis.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-white/60">
                  {[
                    'Works when the network drops',
                    'Tied to what you actually carry',
                    'No patient data required',
                  ].map((line) => (
                    <li key={line} className="flex items-center gap-2">
                      <Check size={14} style={{ color: GOLD }} />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 p-5 shadow-2xl">
                <p className="text-[11px] font-medium text-white/35">You</p>
                <p className="mt-1 text-sm text-white/90">List low stock and what expires in 30 days</p>
                <p className="mt-4 text-[11px] font-medium" style={{ color: GOLD }}>
                  Azara
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/70">
                  Six items at or below reorder. Amoxicillin 500mg and ORS hit expiry inside 30 days
                  (two batches). I can open those lines for quantity or expiry updates when you say
                  so.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms */}
        <section id="platforms" className="mx-auto max-w-6xl px-4 pb-20 md:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center md:p-12">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Web, iPhone, and iPad — same pharmacy books
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
              Start on the web in minutes, or install from the App Store for the counter and the
              road.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/account/signup"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Open web app
                <ArrowRight size={16} />
              </Link>
              <AppStoreBadge />
            </div>
          </div>
        </section>

        <footer className="border-t border-white/5">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-white/35 md:flex-row md:px-8">
            <span>GiDi Pharmacy Manager · Built by Abdallah Fuseini</span>
            <span className="flex flex-wrap items-center justify-center gap-5">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                App Store
              </a>
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

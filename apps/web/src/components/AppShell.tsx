'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import {
  BarChart3,
  BookOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Monitor,
  Moon,
  Package,
  Pill,
  Plus,
  Receipt,
  Settings,
  Sun,
  Users,
} from 'lucide-react';
import { usePreferences } from '@/utils/locale/PreferencesProvider';
import type { TranslationKey } from '@/utils/locale/translations';

export type Pharmacy = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  member_role?: 'admin' | 'staff';
};

type PharmacyContextValue = {
  pharmacy: Pharmacy;
  pharmacies: Pharmacy[];
  setPharmacyId: (id: number) => void;
  role: 'admin' | 'staff';
};

const PharmacyContext = createContext<PharmacyContextValue | null>(null);

export function usePharmacy() {
  const ctx = useContext(PharmacyContext);
  if (!ctx) {
    throw new Error('usePharmacy must be used inside AppShell');
  }
  return ctx;
}

const NAV_ITEMS: Array<{ href: string; key: TranslationKey; icon: typeof LayoutDashboard }> = [
  { href: '/', key: 'dashboard', icon: LayoutDashboard },
  { href: '/inventory', key: 'inventory', icon: Package },
  { href: '/sales', key: 'sales', icon: Receipt },
  { href: '/analytics', key: 'analytics', icon: BarChart3 },
  { href: '/reports', key: 'reports', icon: FileText },
  { href: '/azara', key: 'azara', icon: MessageCircle },
  { href: '/knowledge', key: 'knowledge', icon: BookOpen },
  { href: '/staff', key: 'staff', icon: Users },
  { href: '/settings', key: 'settings', icon: Settings },
];

/** Cycles light -> dark -> system. */
function ThemeToggle({ compact }: { compact?: boolean }) {
  const { theme, setTheme, t } = usePreferences();
  const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const label = theme === 'light' ? t('light') : theme === 'dark' ? t('dark') : t('system');

  if (compact) {
    return (
      <button
        onClick={() => setTheme(next)}
        title={`${t('theme')}: ${label}`}
        className="glass flex h-8 w-8 items-center justify-center rounded-lg text-gold"
      >
        <Icon size={14} />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(next)}
      title={`${t('theme')}: ${label}`}
      className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-black transition-colors"
    >
      <Icon size={12} className="text-gold" />
      {label}
    </button>
  );
}

function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="bg-gold flex h-8 w-8 items-center justify-center rounded-lg shadow-[0_4px_14px_rgba(201,162,39,0.35)]">
        <Pill size={16} className="text-black" />
      </div>
      <span className="text-lg font-semibold tracking-tight text-black">
        Gi<span className="text-gold">Di</span>
      </span>
    </div>
  );
}

function CenteredScreen({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 font-inter">
      {children}
    </div>
  );
}

function SignInPrompt() {
  const { t } = usePreferences();
  return (
    <CenteredScreen>
      <div className="w-full max-w-sm rounded-xl border border-[#E5E5E5] bg-white p-8">
        <Wordmark />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-black">
          Pharmacy management
        </h1>
        <p className="mt-1 text-sm text-[#737373]">{t('tagline')}</p>
        <div className="mt-6 flex flex-col gap-2">
          <a
            href="/account/signin?callbackURL=/"
            className="flex h-10 items-center justify-center rounded-lg bg-black text-sm font-medium text-white transition-colors hover:bg-[#262626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            {t('signIn')}
          </a>
          <a
            href="/account/signup?callbackURL=/"
            className="flex h-10 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white text-sm font-medium text-black transition-colors hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            {t('createAccount')}
          </a>
        </div>
        <div className="mt-6 flex justify-center border-t border-[#E5E5E5] pt-4">
          <ThemeToggle />
        </div>
      </div>
    </CenteredScreen>
  );
}

function JoinPharmacyForm() {
  const queryClient = useQueryClient();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [joinedName, setJoinedName] = useState<string | null>(null);

  const join = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/pharmacies/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error ?? `Join failed with status ${response.status}`);
      }
      return payload;
    },
    onSuccess: (data) => {
      setJoinedName(data.pharmacy?.name ?? 'your pharmacy');
      if (data.pharmacy?.id) {
        localStorage.setItem('gidi.pharmacyId', String(data.pharmacy.id));
      }
      queryClient.invalidateQueries({ queryKey: ['pharmacies'] });
    },
    onError: (err) => {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid or expired pharmacy code. Please check the code with your pharmacy administrator.'
      );
    },
  });

  if (joinedName) {
    return (
      <div className="py-4 text-center">
        <h2 className="text-base font-semibold text-black">
          You&apos;ve successfully joined {joinedName}.
        </h2>
        <p className="mt-1 text-sm text-[#737373]">Loading your pharmacy dashboard…</p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        if (code.trim()) join.mutate();
      }}
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-[#737373]">
          Enter your pharmacy invitation code
        </label>
        <input
          className="h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm uppercase tracking-widest text-black placeholder:normal-case placeholder:tracking-normal placeholder:text-[#A3A3A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. GIDI-7K2M9QX4"
          autoComplete="off"
          required
        />
      </div>
      {error && <div className="text-sm text-black">{error}</div>}
      <button
        type="submit"
        disabled={join.isPending || !code.trim()}
        className="flex h-10 items-center justify-center rounded-lg bg-black text-sm font-medium text-white transition-colors hover:bg-[#262626] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        {join.isPending ? 'Joining…' : 'Join Pharmacy'}
      </button>
    </form>
  );
}

function CreatePharmacyForm({ title }: { title: string }) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createPharmacy = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/pharmacies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, phone }),
      });
      if (!response.ok) {
        throw new Error(
          `When creating pharmacy, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacies'] });
    },
    onError: (err) => {
      console.error(err);
      setError('Could not create the pharmacy. Please try again.');
    },
  });

  const inputClass =
    'h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-black placeholder:text-[#A3A3A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black';

  return (
    <div className="w-full max-w-sm rounded-xl border border-[#E5E5E5] bg-white p-8">
      <Wordmark />
      <h1 className="mt-6 text-xl font-semibold tracking-tight text-black">
        {mode === 'create' ? title : 'Join an Existing Pharmacy'}
      </h1>
      <p className="mt-1 text-sm text-[#737373]">
        {mode === 'create'
          ? 'Set up your pharmacy to start managing inventory and sales.'
          : 'Enter the invitation code from your pharmacy administrator.'}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-lg border border-[#E5E5E5] p-1">
        <button
          type="button"
          onClick={() => setMode('create')}
          className={
            mode === 'create'
              ? 'rounded-md bg-black px-2 py-1.5 text-xs font-medium text-white'
              : 'rounded-md px-2 py-1.5 text-xs font-medium text-[#737373] transition-colors hover:text-black'
          }
        >
          Create New
        </button>
        <button
          type="button"
          onClick={() => setMode('join')}
          className={
            mode === 'join'
              ? 'rounded-md bg-black px-2 py-1.5 text-xs font-medium text-white'
              : 'rounded-md px-2 py-1.5 text-xs font-medium text-[#737373] transition-colors hover:text-black'
          }
        >
          Join Existing
        </button>
      </div>

      {mode === 'join' ? (
        <div className="mt-5">
          <JoinPharmacyForm />
        </div>
      ) : (
        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            if (name.trim()) {
              createPharmacy.mutate();
            }
          }}
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-[#737373]">Pharmacy name</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Unity Chemists"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#737373]">
              Address (optional)
            </label>
            <input
              className={inputClass}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#737373]">
              Phone (optional)
            </label>
            <input
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
            />
          </div>
          {error && <div className="text-sm text-black">{error}</div>}
          <button
            type="submit"
            disabled={createPharmacy.isPending || !name.trim()}
            className="mt-1 flex h-10 items-center justify-center rounded-lg bg-black text-sm font-medium text-white transition-colors hover:bg-[#262626] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            {createPharmacy.isPending ? 'Creating…' : 'Create pharmacy'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const { t } = usePreferences();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showNewPharmacy, setShowNewPharmacy] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('gidi.pharmacyId');
    if (stored) {
      setSelectedId(Number(stored));
    }
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['pharmacies'],
    queryFn: async () => {
      const response = await fetch('/api/pharmacies');
      if (!response.ok) {
        throw new Error(
          `When fetching /api/pharmacies, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    enabled: !!session,
  });

  if (isPending) {
    return (
      <CenteredScreen>
        <div className="text-sm text-[#737373]">Loading…</div>
      </CenteredScreen>
    );
  }

  if (!session) {
    return <SignInPrompt />;
  }

  if (isLoading) {
    return (
      <CenteredScreen>
        <div className="text-sm text-[#737373]">Loading your pharmacies…</div>
      </CenteredScreen>
    );
  }

  if (error) {
    return (
      <CenteredScreen>
        <div className="rounded-xl border border-[#E5E5E5] p-8 text-sm text-black">
          Could not load your pharmacies. Please refresh the page.
        </div>
      </CenteredScreen>
    );
  }

  const pharmacies: Pharmacy[] = data?.pharmacies ?? [];

  if (pharmacies.length === 0) {
    return (
      <CenteredScreen>
        <CreatePharmacyForm title="Create your first pharmacy" />
      </CenteredScreen>
    );
  }

  const activePharmacy = pharmacies.find((p) => p.id === selectedId) ?? pharmacies[0];
  const role: 'admin' | 'staff' = activePharmacy.member_role === 'staff' ? 'staff' : 'admin';

  const setPharmacyId = (id: number) => {
    setSelectedId(id);
    localStorage.setItem('gidi.pharmacyId', String(id));
  };

  if (showNewPharmacy) {
    return (
      <CenteredScreen>
        <div className="flex flex-col items-center gap-3">
          <CreatePharmacyForm title="Add another pharmacy" />
          <button
            onClick={() => setShowNewPharmacy(false)}
            className="text-sm font-medium text-[#737373] transition-colors hover:text-black"
          >
            Back to dashboard
          </button>
        </div>
      </CenteredScreen>
    );
  }

  return (
    <PharmacyContext.Provider value={{ pharmacy: activePharmacy, pharmacies, setPharmacyId, role }}>
      <div className="min-h-screen bg-[#FAFAFA] font-inter">
        {/* Desktop sidebar */}
        <aside className="no-print fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-[#E5E5E5] bg-white/70 backdrop-blur-xl md:flex">
          <div className="px-5 pt-6">
            <Wordmark />
          </div>

          <div className="mt-6 px-3">
            <div className="px-2 text-xs font-medium text-[#737373]">Pharmacy</div>
            <div className="mt-1.5 flex items-center gap-1.5 px-2">
              <select
                value={activePharmacy.id}
                onChange={(e) => setPharmacyId(Number(e.target.value))}
                className="h-9 w-full rounded-lg border border-[#E5E5E5] bg-white px-2 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                {pharmacies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowNewPharmacy(true)}
                title="Add pharmacy"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] text-black transition-colors hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <nav className="mt-6 flex flex-col gap-0.5 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const linkClass = isActive
                ? 'flex items-center gap-2.5 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white'
                : 'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-normal text-[#737373] transition-colors hover:bg-[#FAFAFA] hover:text-black';
              return (
                <Link key={item.href} href={item.href} className={linkClass}>
                  <item.icon size={16} />
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[#E5E5E5] p-4">
            <div className="truncate text-xs font-medium text-[#737373]">{session.user?.email}</div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <ThemeToggle />
              <a
                href="/account/logout"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-[#FAFAFA]"
              >
                <LogOut size={12} />
                {t('signOut')}
              </a>
              <Link
                href="/privacy"
                className="inline-flex items-center rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-[#737373] transition-colors hover:bg-[#FAFAFA] hover:text-black"
              >
                Privacy
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile header + tabs */}
        <header className="no-print sticky top-0 z-20 border-b border-[#E5E5E5] bg-white/70 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between px-4 pt-4">
            <Wordmark />
            <div className="flex items-center gap-2">
              <select
                value={activePharmacy.id}
                onChange={(e) => setPharmacyId(Number(e.target.value))}
                className="h-8 max-w-[140px] rounded-lg border border-[#E5E5E5] bg-white px-2 text-xs text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                {pharmacies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ThemeToggle compact />
              <a
                href="/account/logout"
                title="Sign out"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] text-black"
              >
                <LogOut size={14} />
              </a>
            </div>
          </div>
          <nav className="mt-3 flex gap-5 overflow-x-auto px-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const tabClass = isActive
                ? 'whitespace-nowrap border-b-2 border-gold pb-3 -mb-[1px] text-sm font-medium text-black'
                : 'whitespace-nowrap border-b-2 border-transparent pb-3 text-sm font-normal text-[#737373] hover:text-black';
              return (
                <Link key={item.href} href={item.href} className={tabClass}>
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="app-canvas min-h-screen px-4 py-6 md:ml-60 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </PharmacyContext.Provider>
  );
}

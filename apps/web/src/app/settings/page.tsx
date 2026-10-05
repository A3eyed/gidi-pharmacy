'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ExternalLink,
  FileText,
  Globe,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
  TriangleAlert,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useSession } from '@/lib/auth-client';
import { usePreferences, type ThemeMode } from '@/utils/locale/PreferencesProvider';
import { COUNTRIES } from '@/utils/locale/countries';
import { LANGUAGES } from '@/utils/locale/translations';
import { formatCurrency } from '@/utils/format';

function AppearanceCard() {
  const { theme, setTheme, resolvedTheme, t } = usePreferences();

  const options: Array<{ id: ThemeMode; label: string; icon: typeof Sun }> = [
    { id: 'light', label: t('light'), icon: Sun },
    { id: 'dark', label: t('dark'), icon: Moon },
    { id: 'system', label: t('system'), icon: Monitor },
  ];

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
      <div className="flex items-center gap-2">
        <Sun size={16} className="text-black" />
        <h2 className="text-base font-semibold text-black">{t('appearance')}</h2>
      </div>
      <p className="mt-1 text-sm text-[#737373]">
        Choose light, dark, or follow your device setting.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {options.map((option) => {
          const isActive = theme === option.id;
          const cls = isActive
            ? 'flex flex-col items-center gap-1.5 rounded-lg border-2 border-black bg-white px-3 py-3 text-xs font-medium text-black'
            : 'flex flex-col items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 py-3 text-xs font-medium text-[#737373] transition-colors hover:bg-[#FAFAFA] hover:text-black';
          return (
            <button key={option.id} onClick={() => setTheme(option.id)} className={cls}>
              <option.icon size={16} />
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-[#737373]">
        Currently showing the {resolvedTheme === 'dark' ? t('dark') : t('light')} theme.
      </p>
    </div>
  );
}

function RegionCard() {
  const { country, setCountry, language, setLanguage, currency, locale, t } = usePreferences();

  const selectClass =
    'h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black';

  return (
    <div className="mt-4 rounded-xl border border-[#E5E5E5] bg-white p-6">
      <div className="flex items-center gap-2">
        <Globe size={16} className="text-black" />
        <h2 className="text-base font-semibold text-black">{t('region')}</h2>
      </div>
      <p className="mt-1 text-sm text-[#737373]">
        Your country sets the currency used across the app. Your language changes the interface and
        the language Azara replies in.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-[#737373]">{t('country')}</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={selectClass}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.currency})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#737373]">{t('language')}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={selectClass}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native} — {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#E5E5E5] pt-4">
        <span className="rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-black">
          {t('currency')}: {currency}
        </span>
        <span className="rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-black">
          {formatCurrency(1234.5)}
        </span>
        <span className="rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-[#737373]">
          {locale}
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-[#737373]">
        Changing country updates prices, totals and reports everywhere — on web and in the mobile
        app. Existing amounts are not converted; they are shown in your selected currency.
      </p>
    </div>
  );
}

function SettingsContent() {
  const { data: session } = useSession();
  const { t } = usePreferences();
  const [confirmEmail, setConfirmEmail] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data } = useQuery({
    queryKey: ['account-summary'],
    queryFn: async () => {
      const response = await fetch('/api/account');
      if (!response.ok) {
        throw new Error(
          `When fetching /api/account, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const counts = data?.data ?? {};
  const email = session?.user?.email ?? '';

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      const response = await fetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmEmail }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? `Delete failed with status ${response.status}`);
      }
      // Account is gone — clear local state and send the user out.
      localStorage.removeItem('gidi.pharmacyId');
      window.location.href = '/account/logout';
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : 'Could not delete your account. Please try again.'
      );
      setIsDeleting(false);
    }
  };

  const cardClass = 'rounded-xl border border-[#E5E5E5] bg-white p-6';

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-black">{t('settings')}</h1>
        <p className="text-sm text-[#737373]">Appearance, region, account, privacy and data.</p>
      </div>

      <div className="mt-6">
        <AppearanceCard />
      </div>
      <RegionCard />

      <div className={`${cardClass} mt-4`}>
        <h2 className="text-base font-semibold text-black">Account</h2>
        <dl className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-[#737373]">Email</dt>
            <dd className="truncate text-sm font-medium text-black">{email}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[#E5E5E5] pt-3">
            <dt className="text-sm text-[#737373]">Pharmacies</dt>
            <dd className="text-sm font-medium text-black">{counts.pharmacy_count ?? '—'}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[#E5E5E5] pt-3">
            <dt className="text-sm text-[#737373]">Medications</dt>
            <dd className="text-sm font-medium text-black">{counts.medication_count ?? '—'}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[#E5E5E5] pt-3">
            <dt className="text-sm text-[#737373]">Sales recorded</dt>
            <dd className="text-sm font-medium text-black">{counts.sale_count ?? '—'}</dd>
          </div>
        </dl>
        <a
          href="/account/logout"
          className="mt-5 inline-flex h-9 items-center rounded-lg border border-[#E5E5E5] px-4 text-sm font-medium text-black transition-colors hover:bg-[#FAFAFA]"
        >
          Sign out
        </a>
      </div>

      <div className={`${cardClass} mt-4`}>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-black" />
          <h2 className="text-base font-semibold text-black">Privacy</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#404040]">
          GiDi shows no advertisements and never uses your pharmacy data, sales or Azara
          conversations for advertising, marketing or profiling. Your data is encrypted in transit
          and every request is scoped to your account.
        </p>
        <Link
          href="/privacy"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#FAFAFA]"
        >
          <FileText size={14} />
          Read the privacy policy
          <ExternalLink size={12} className="text-[#737373]" />
        </Link>
      </div>

      <div className={`${cardClass} mt-4`}>
        <div className="flex items-center gap-2">
          <TriangleAlert size={16} className="text-black" />
          <h2 className="text-base font-semibold text-black">Medical disclaimer</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[#404040]">
          Azara is a reference lookup tool for qualified pharmacy and healthcare professionals. It
          returns general reference information from a built-in library and from notes your own team
          adds. It does not diagnose patients, does not recommend treatment for any individual
          patient, does not prescribe, and is not a substitute for the professional judgement of a
          qualified pharmacist or physician.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#404040]">
          Entries can be incomplete or out of date. Always verify against an authoritative source
          such as the BNF, WHO guidance or your national formulary, and follow the prescriber&apos;s
          instructions. In an emergency, contact your local emergency services.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#404040]">
          Restock briefings are commercial stocking estimates calculated from your own sales
          history, the season and current weather. They are not clinical or procurement advice.
        </p>
      </div>

      {/* Account deletion — required to be available in-app */}
      <div className="mt-4 rounded-xl border-2 border-black bg-white p-6">
        <h2 className="text-base font-semibold text-black">Delete account</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#404040]">
          This permanently removes your login, all of your pharmacies, your full medication
          catalogue and every sale you have recorded. It happens immediately and cannot be undone.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#404040]">
          If you want to keep your records, download them from the{' '}
          <Link href="/reports" className="font-medium text-black underline">
            Reports
          </Link>{' '}
          page first.
        </p>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="mt-5 inline-flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-[#262626]"
          >
            Delete my account
          </button>
        ) : (
          <div className="mt-5 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-4">
            <label className="block text-sm font-medium text-black">
              Type <span className="font-semibold">{email}</span> to confirm
            </label>
            <input
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder={email}
              autoComplete="off"
              className="mt-2 h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-black placeholder:text-[#A3A3A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
            {error && <p className="mt-2 text-sm font-medium text-black">{error}</p>}
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting || confirmEmail.trim().toLowerCase() !== email.toLowerCase()}
                className="inline-flex h-10 items-center rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-[#262626] disabled:opacity-30"
              >
                {isDeleting ? 'Deleting…' : 'Permanently delete'}
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setConfirmEmail('');
                  setError(null);
                }}
                disabled={isDeleting}
                className="inline-flex h-10 items-center rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white disabled:opacity-40"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsContent />
    </AppShell>
  );
}

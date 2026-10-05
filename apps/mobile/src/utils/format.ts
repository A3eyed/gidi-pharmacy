/**
 * Locale-aware formatting for the mobile app.
 *
 * PreferencesProvider sets the active locale/currency, so every existing
 * `formatCurrency(...)` call across all screens becomes localized with no
 * changes at the call sites.
 */
let currentLocale = 'en-GH';
let currentCurrency = 'GHS';

export function setFormattingLocale(locale: string, currency: string) {
  currentLocale = locale || 'en';
  currentCurrency = currency || 'USD';
}

export function getFormattingLocale() {
  return { locale: currentLocale, currency: currentCurrency };
}

export function formatCurrency(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  try {
    // Intl applies the right precision per currency (2 for GHS, 0 for JPY...).
    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: currentCurrency,
    }).format(safe);
  } catch {
    // Older Hermes builds without full ICU fall back to a plain code + amount.
    return `${currentCurrency} ${safe.toFixed(2)}`;
  }
}

export function formatNumber(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  const safe = Number.isFinite(n) ? n : 0;
  try {
    return new Intl.NumberFormat(currentLocale).format(safe);
  } catch {
    return String(safe);
  }
}

export function formatShortDate(value: string | Date | null | undefined) {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  try {
    return d.toLocaleDateString(currentLocale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  try {
    return d.toLocaleString(currentLocale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return d.toISOString().slice(0, 16).replace('T', ' ');
  }
}

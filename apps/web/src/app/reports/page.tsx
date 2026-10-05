'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Printer } from 'lucide-react';
import AppShell, { usePharmacy } from '@/components/AppShell';
import { formatCurrency, formatDateTime, formatShortDate } from '@/utils/format';
import { QUICK_RANGES, isoDaysAgo, todayIso } from '@/utils/dates';

type StatementType = 'sales' | 'inventory' | 'summary';

const TYPES: Array<{ id: StatementType; label: string; description: string }> = [
  { id: 'sales', label: 'Sales statement', description: 'Every item sold, line by line.' },
  { id: 'summary', label: 'Period summary', description: 'Totals by category and medication.' },
  { id: 'inventory', label: 'Stock statement', description: 'Full inventory with valuation.' },
];

function ReportsContent() {
  const { pharmacy } = usePharmacy();
  const [type, setType] = useState<StatementType>('sales');
  // Empty until mounted so the server and first client render match
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    setFrom(isoDaysAgo(29));
    setTo(todayIso());
  }, []);

  const rangeReady = Boolean(from && to);
  const params = `pharmacyId=${pharmacy.id}&type=${type}&from=${from}&to=${to}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ['statement', pharmacy.id, type, from, to],
    enabled: rangeReady,
    queryFn: async () => {
      const response = await fetch(`/api/statements?${params}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/statements, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const inputClass =
    'h-9 rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black';

  const th = 'border-b border-[#E5E5E5] px-3 py-2 text-left text-xs font-semibold text-black';
  const thRight = 'border-b border-[#E5E5E5] px-3 py-2 text-right text-xs font-semibold text-black';
  const td = 'border-b border-[#F5F5F5] px-3 py-2 text-sm text-black';
  const tdRight = 'border-b border-[#F5F5F5] px-3 py-2 text-right text-sm text-black';

  let table: React.ReactNode = null;
  let totalsRow: React.ReactNode = null;

  if (data && type === 'sales') {
    const rows = data.rows ?? [];
    totalsRow = (
      <div className="flex flex-wrap gap-6">
        <div>
          <div className="text-xs text-[#737373]">Total revenue</div>
          <div className="text-lg font-semibold text-black">
            {formatCurrency(data.totals?.revenue)}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#737373]">Units sold</div>
          <div className="text-lg font-semibold text-black">{data.totals?.units ?? 0}</div>
        </div>
        <div>
          <div className="text-xs text-[#737373]">Receipts</div>
          <div className="text-lg font-semibold text-black">{data.totals?.receipts ?? 0}</div>
        </div>
      </div>
    );
    table =
      rows.length === 0 ? (
        <p className="text-sm text-[#737373]">No sales in this period.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Receipt</th>
              <th className={th}>Date</th>
              <th className={th}>Medication</th>
              <th className={thRight}>Qty</th>
              <th className={thRight}>Unit price</th>
              <th className={thRight}>Line total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(
              (
                r: {
                  sale_id: number;
                  created_at: string;
                  medication_name: string;
                  quantity: number;
                  unit_price: string;
                  subtotal: string;
                },
                i: number
              ) => (
                <tr key={`${r.sale_id}-${i}`}>
                  <td className={td}>#{r.sale_id}</td>
                  <td className={td}>{formatDateTime(r.created_at)}</td>
                  <td className={td}>{r.medication_name}</td>
                  <td className={tdRight}>{r.quantity}</td>
                  <td className={tdRight}>{formatCurrency(r.unit_price)}</td>
                  <td className={tdRight}>{formatCurrency(r.subtotal)}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      );
  }

  if (data && type === 'inventory') {
    const rows = data.rows ?? [];
    totalsRow = (
      <div className="flex flex-wrap gap-6">
        <div>
          <div className="text-xs text-[#737373]">Stock value</div>
          <div className="text-lg font-semibold text-black">
            {formatCurrency(data.totals?.stockValue)}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#737373]">Line items</div>
          <div className="text-lg font-semibold text-black">{data.totals?.items ?? 0}</div>
        </div>
      </div>
    );
    table =
      rows.length === 0 ? (
        <p className="text-sm text-[#737373]">No medications in stock.</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className={th}>Medication</th>
              <th className={th}>Category</th>
              <th className={thRight}>Stock</th>
              <th className={thRight}>Unit price</th>
              <th className={thRight}>Stock value</th>
              <th className={th}>Expires</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(
              (r: {
                name: string;
                category: string | null;
                stock_quantity: number;
                unit_price: string;
                stock_value: string;
                expiry_date: string | null;
              }) => (
                <tr key={r.name}>
                  <td className={td}>{r.name}</td>
                  <td className={td}>{r.category ?? '—'}</td>
                  <td className={tdRight}>{r.stock_quantity}</td>
                  <td className={tdRight}>{formatCurrency(r.unit_price)}</td>
                  <td className={tdRight}>{formatCurrency(r.stock_value)}</td>
                  <td className={td}>{r.expiry_date ? formatShortDate(r.expiry_date) : '—'}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      );
  }

  if (data && type === 'summary') {
    const t = data.totals ?? {};
    totalsRow = (
      <div className="flex flex-wrap gap-6">
        <div>
          <div className="text-xs text-[#737373]">Revenue</div>
          <div className="text-lg font-semibold text-black">{formatCurrency(t.revenue)}</div>
        </div>
        <div>
          <div className="text-xs text-[#737373]">Gross profit</div>
          <div className="text-lg font-semibold text-black">{formatCurrency(t.gross_profit)}</div>
        </div>
        <div>
          <div className="text-xs text-[#737373]">Units sold</div>
          <div className="text-lg font-semibold text-black">{t.units ?? 0}</div>
        </div>
        <div>
          <div className="text-xs text-[#737373]">Transactions</div>
          <div className="text-lg font-semibold text-black">{t.sale_count ?? 0}</div>
        </div>
      </div>
    );
    table = (
      <div className="flex flex-col gap-6">
        <div className="print-break">
          <h3 className="mb-2 text-sm font-semibold text-black">By category</h3>
          {(data.byCategory ?? []).length === 0 ? (
            <p className="text-sm text-[#737373]">No sales in this period.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className={th}>Category</th>
                  <th className={thRight}>Units</th>
                  <th className={thRight}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.byCategory.map((r: { category: string; units: number; revenue: string }) => (
                  <tr key={r.category}>
                    <td className={td}>{r.category}</td>
                    <td className={tdRight}>{r.units}</td>
                    <td className={tdRight}>{formatCurrency(r.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="print-break">
          <h3 className="mb-2 text-sm font-semibold text-black">By medication</h3>
          {(data.byMedication ?? []).length === 0 ? (
            <p className="text-sm text-[#737373]">No sales in this period.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className={th}>Medication</th>
                  <th className={thRight}>Units</th>
                  <th className={thRight}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.byMedication.map((r: { name: string; units: number; revenue: string }) => (
                  <tr key={r.name}>
                    <td className={td}>{r.name}</td>
                    <td className={tdRight}>{r.units}</td>
                    <td className={tdRight}>{formatCurrency(r.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  const activeType = TYPES.find((t) => t.id === type);
  const periodLabel = rangeReady ? `${formatShortDate(from)} – ${formatShortDate(to)}` : '—';
  const asAtLabel = to ? `As at ${formatShortDate(to)}` : '—';

  return (
    <div className="mx-auto max-w-5xl">
      <div className="no-print flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-black">Reports</h1>
        <p className="text-sm text-[#737373]">Download or print statements for any period.</p>
      </div>

      {/* Controls */}
      <div className="no-print mt-6 rounded-xl border border-[#E5E5E5] bg-white p-5">
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => {
            const isActive = type === t.id;
            const cls = isActive
              ? 'rounded-full bg-black px-3.5 py-1.5 text-xs font-medium text-white'
              : 'rounded-full border border-[#E5E5E5] bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-[#FAFAFA]';
            return (
              <button key={t.id} onClick={() => setType(t.id)} className={cls}>
                {t.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[#737373]">{activeType?.description}</p>

        {type !== 'inventory' && (
          <>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#737373]">From</label>
                <input
                  type="date"
                  value={from}
                  max={to}
                  onChange={(e) => setFrom(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#737373]">To</label>
                <input
                  type="date"
                  value={to}
                  min={from}
                  onChange={(e) => setTo(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {QUICK_RANGES.map((r) => (
                <button
                  key={r.label}
                  onClick={() => {
                    setFrom(isoDaysAgo(r.days));
                    setTo(todayIso());
                  }}
                  className="rounded-full border border-[#E5E5E5] bg-white px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-[#FAFAFA]"
                >
                  {r.label}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#E5E5E5] pt-4">
          <a
            href={`/api/statements?${params}&format=csv`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#262626]"
          >
            <Download size={14} />
            Download CSV
          </a>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-[#FAFAFA]"
          >
            <Printer size={14} />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable sheet */}
      <div className="print-sheet mt-4 rounded-xl border border-[#E5E5E5] bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E5E5E5] pb-4">
          <div>
            <h2 className="text-lg font-semibold text-black">{pharmacy.name}</h2>
            {pharmacy.address && <p className="text-xs text-[#737373]">{pharmacy.address}</p>}
            {pharmacy.phone && <p className="text-xs text-[#737373]">{pharmacy.phone}</p>}
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-black">{activeType?.label}</div>
            <div className="text-xs text-[#737373]">
              {type === 'inventory' ? asAtLabel : periodLabel}
            </div>
            <div className="text-xs text-[#737373]">Generated by GiDi</div>
          </div>
        </div>

        {(isLoading || !rangeReady) && (
          <p className="mt-4 text-sm text-[#737373]">Preparing statement…</p>
        )}
        {error && <p className="mt-4 text-sm text-black">Could not load this statement.</p>}

        {data && (
          <>
            <div className="mt-4">{totalsRow}</div>
            <div className="mt-5 overflow-x-auto">{table}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <AppShell>
      <ReportsContent />
    </AppShell>
  );
}

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AppShell, { usePharmacy } from '@/components/AppShell';
import PeriodAnalytics from '@/components/PeriodAnalytics';
import RestockInsights from '@/components/RestockInsights';
import { formatCurrency, formatShortDate } from '@/utils/format';

type TopMed = { name: string; units_sold: number; revenue: string };

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
      <div className="text-xs font-medium text-[#737373]">{label}</div>
      <div className="mt-1.5 text-2xl font-semibold tracking-tight text-black">{value}</div>
      {hint && <div className="mt-1 text-xs font-medium text-[#737373]">{hint}</div>}
    </div>
  );
}

function OverviewTab() {
  const { pharmacy } = usePharmacy();
  const [rankBy, setRankBy] = useState<'revenue' | 'units'>('revenue');

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', pharmacy.id],
    queryFn: async () => {
      const response = await fetch(`/api/analytics?pharmacyId=${pharmacy.id}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/analytics, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div className="text-sm text-[#737373]">Loading analytics…</div>;
  }
  if (error || !data) {
    return <div className="text-sm text-black">Could not load analytics. Please refresh.</div>;
  }

  const topMeds: TopMed[] = (data.topMedications ?? []).map((m: TopMed) => ({
    ...m,
    revenue_num: Number(m.revenue),
  }));
  const sortedTop = [...topMeds].sort((a, b) => {
    if (rankBy === 'units') return b.units_sold - a.units_sold;
    return Number(b.revenue) - Number(a.revenue);
  });

  const trend = (data.trend ?? []).map((t: { day: string; revenue: string }) => ({
    day: t.day.slice(5),
    revenue: Number(t.revenue),
  }));

  const monthRevenue = Number(data.month?.revenue ?? 0);
  const monthSales = Number(data.month?.sale_count ?? 0);
  const avgSale = monthSales > 0 ? monthRevenue / monthSales : 0;

  const categories = data.categories ?? [];
  const maxCategoryCount = Math.max(
    1,
    ...categories.map((c: { med_count: number }) => c.med_count)
  );

  const expiring = data.expiringSoon ?? [];

  const rankToggle = (
    <div className="flex gap-1.5">
      {(
        [
          { id: 'revenue', label: 'By revenue' },
          { id: 'units', label: 'By units' },
        ] as const
      ).map((option) => {
        const isActive = rankBy === option.id;
        const pillClass = isActive
          ? 'rounded-full bg-black px-3 py-1 text-xs font-medium text-white'
          : 'rounded-full border border-[#E5E5E5] bg-white px-3 py-1 text-xs font-medium text-black transition-colors hover:bg-[#FAFAFA]';
        return (
          <button key={option.id} onClick={() => setRankBy(option.id)} className={pillClass}>
            {option.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Revenue (30 days)" value={formatCurrency(monthRevenue)} />
        <StatCard label="Sales (30 days)" value={String(monthSales)} />
        <StatCard label="Average sale" value={formatCurrency(avgSale)} />
        <StatCard label="Inventory value" value={formatCurrency(data.inventory?.inventory_value)} />
      </div>

      <div className="mt-6 rounded-xl border border-[#E5E5E5] bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-black">Top performing medications</h2>
            <p className="text-sm text-[#737373]">Best sellers in the last 30 days.</p>
          </div>
          {rankToggle}
        </div>

        {sortedTop.length === 0 ? (
          <div className="mt-6 text-sm text-[#737373]">
            No sales in the last 30 days yet. Record sales to see your top performers.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedTop} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#737373', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E5E5' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: '#737373', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                  />
                  <Tooltip
                    cursor={{ fill: '#FAFAFA' }}
                    contentStyle={{
                      border: '1px solid #E5E5E5',
                      borderRadius: 8,
                      fontSize: 12,
                      color: '#000000',
                    }}
                  />
                  <Bar
                    dataKey={rankBy === 'revenue' ? 'revenue_num' : 'units_sold'}
                    name={rankBy === 'revenue' ? 'Revenue' : 'Units sold'}
                    fill="#000000"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ul className="divide-y divide-[#E5E5E5]">
              {sortedTop.map((med, index) => (
                <li key={med.name} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] text-xs font-semibold text-black">
                      {index + 1}
                    </span>
                    <span className="truncate text-sm font-medium text-black">{med.name}</span>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-semibold text-black">
                      {formatCurrency(med.revenue)}
                    </div>
                    <div className="text-xs text-[#737373]">{med.units_sold} units</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-black">Revenue trend</h2>
            <p className="text-sm text-[#737373]">Daily revenue, last 14 days.</p>
          </div>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#737373', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E5E5' }}
                />
                <YAxis
                  tick={{ fill: '#737373', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                />
                <Tooltip
                  contentStyle={{
                    border: '1px solid #E5E5E5',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#000000',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#000000' }}
                  activeDot={{ r: 4, fill: '#000000' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold text-black">Inventory by category</h2>
              <p className="text-sm text-[#737373]">Where your stock is concentrated.</p>
            </div>
            {categories.length === 0 ? (
              <div className="mt-4 text-sm text-[#737373]">No medications yet.</div>
            ) : (
              <ul className="mt-4 flex flex-col gap-3">
                {categories.map((c: { category: string; med_count: number }) => (
                  <li key={c.category}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-black">{c.category}</span>
                      <span className="text-xs font-medium text-[#737373]">
                        {c.med_count} items
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#F5F5F5]">
                      <div
                        className="h-1.5 rounded-full bg-black"
                        style={{ width: `${(c.med_count / maxCategoryCount) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold text-black">Expiring soon</h2>
              <p className="text-sm text-[#737373]">Within the next 90 days.</p>
            </div>
            {expiring.length === 0 ? (
              <div className="mt-4 text-sm text-[#737373]">Nothing expiring soon.</div>
            ) : (
              <ul className="mt-3 divide-y divide-[#E5E5E5]">
                {expiring
                  .slice(0, 5)
                  .map((m: { id: number; name: string; expiry_date: string }) => (
                    <li key={m.id} className="flex items-center justify-between py-2">
                      <span className="text-sm text-black">{m.name}</span>
                      <span className="text-xs font-medium text-[#737373]">
                        {formatShortDate(m.expiry_date)}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'period', label: 'By period' },
  { id: 'insights', label: 'AI restock insights' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function AnalyticsContent() {
  const { pharmacy } = usePharmacy();
  const [tab, setTab] = useState<TabId>('overview');

  let body: React.ReactNode = <OverviewTab />;
  if (tab === 'period') {
    body = <PeriodAnalytics />;
  }
  if (tab === 'insights') {
    body = <RestockInsights />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="no-print flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-black">Analytics</h1>
        <p className="text-sm text-[#737373]">{pharmacy.name}</p>
      </div>

      <div className="no-print mt-5 flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const isActive = tab === t.id;
          const cls = isActive
            ? 'rounded-full bg-black px-3.5 py-1.5 text-xs font-medium text-white'
            : 'rounded-full border border-[#E5E5E5] bg-white px-3.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-[#FAFAFA]';
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={cls}>
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">{body}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AppShell>
      <AnalyticsContent />
    </AppShell>
  );
}

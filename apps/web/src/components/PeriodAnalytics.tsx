'use client';

import { useEffect, useState } from 'react';
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
import { ArrowDownRight, ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import { usePharmacy } from '@/components/AppShell';
import { formatCurrency, formatShortDate } from '@/utils/format';
import { QUICK_RANGES, isoDaysAgo, todayIso } from '@/utils/dates';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const chartTooltipStyle = {
  border: '1px solid #E5E5E5',
  borderRadius: 8,
  fontSize: 12,
  color: '#000000',
};

function Delta({ pct }: { pct: number | null }) {
  if (pct === null) {
    return <span className="text-xs font-medium text-[#737373]">new</span>;
  }
  const rounded = Math.round(pct);
  if (rounded === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-[#737373]">
        <ArrowRight size={11} />
        0%
      </span>
    );
  }
  const Icon = rounded > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-black">
      <Icon size={11} />
      {Math.abs(rounded)}%
    </span>
  );
}

function StatCard({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: number | null;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
      <div className="text-xs font-medium text-[#737373]">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight text-black">{value}</span>
        {delta !== undefined && <Delta pct={delta} />}
      </div>
      {hint && <div className="mt-1 text-xs text-[#737373]">{hint}</div>}
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-black">{title}</h2>
        {subtitle && <p className="text-sm text-[#737373]">{subtitle}</p>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function PeriodAnalytics() {
  const { pharmacy } = usePharmacy();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    setFrom(isoDaysAgo(29));
    setTo(todayIso());
  }, []);

  const ready = Boolean(from && to);

  const { data, isLoading, error } = useQuery({
    queryKey: ['period-analytics', pharmacy.id, from, to],
    enabled: ready,
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics/period?pharmacyId=${pharmacy.id}&from=${from}&to=${to}`
      );
      if (!response.ok) {
        throw new Error(
          `When fetching /api/analytics/period, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const inputClass =
    'h-9 rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black';

  const controls = (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-5">
      <div className="flex flex-wrap items-end gap-3">
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
        <a
          href={`/api/statements?pharmacyId=${pharmacy.id}&type=summary&from=${from}&to=${to}&format=csv`}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm font-medium text-black transition-colors hover:bg-[#FAFAFA]"
        >
          <Download size={14} />
          Export
        </a>
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
    </div>
  );

  if (!ready || isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {controls}
        <p className="text-sm text-[#737373]">Loading period analytics…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-4">
        {controls}
        <p className="text-sm text-black">Could not load analytics for this period.</p>
      </div>
    );
  }

  const summary = data.summary ?? {};
  const previous = data.previousSummary ?? {};

  const unitsDelta =
    Number(previous.units ?? 0) > 0
      ? ((Number(summary.units) - Number(previous.units)) / Number(previous.units)) * 100
      : null;
  const salesDelta =
    Number(previous.saleCount ?? 0) > 0
      ? ((Number(summary.saleCount) - Number(previous.saleCount)) / Number(previous.saleCount)) *
        100
      : null;
  const profitDelta =
    Number(previous.grossProfit ?? 0) > 0
      ? ((Number(summary.grossProfit) - Number(previous.grossProfit)) /
          Number(previous.grossProfit)) *
        100
      : null;

  const daily = (data.daily ?? []).map((d: { day: string; revenue: string }) => ({
    day: d.day.slice(5),
    revenue: Number(d.revenue),
  }));

  const weekday = DAY_NAMES.map((name, index) => {
    const row = (data.weekday ?? []).find((w: { dow: number }) => w.dow === index);
    return { name, revenue: Number(row?.revenue ?? 0), sales: Number(row?.sale_count ?? 0) };
  });

  const hourly = (data.hourly ?? []).map(
    (h: { hour: number; revenue: string; sale_count: number }) => ({
      hour: `${String(h.hour).padStart(2, '0')}:00`,
      revenue: Number(h.revenue),
      sales: h.sale_count,
    })
  );

  const meds = data.medications ?? [];
  const risers = [...meds]
    .filter((m: { change_pct: number | null }) => m.change_pct === null || m.change_pct > 0)
    .sort(
      (a: { change_pct: number | null }, b: { change_pct: number | null }) =>
        (b.change_pct ?? 999) - (a.change_pct ?? 999)
    )
    .slice(0, 5);
  const fallers = [...meds]
    .filter((m: { change_pct: number | null }) => m.change_pct !== null && m.change_pct < 0)
    .sort((a: { change_pct: number }, b: { change_pct: number }) => a.change_pct - b.change_pct)
    .slice(0, 5);

  const busiestDay = [...weekday].sort((a, b) => b.revenue - a.revenue)[0];
  const busiestHour = [...hourly].sort(
    (a: { revenue: number }, b: { revenue: number }) => b.revenue - a.revenue
  )[0];

  const categories = data.categories ?? [];
  const maxCategoryRevenue = Math.max(
    1,
    ...categories.map((c: { revenue: string }) => Number(c.revenue))
  );

  const slowMovers = data.slowMovers ?? [];

  return (
    <div className="flex flex-col gap-4">
      {controls}

      <p className="text-sm text-[#737373]">
        {formatShortDate(data.range.from)} – {formatShortDate(data.range.to)} ({data.range.days}{' '}
        days), compared with {formatShortDate(data.previousRange.from)} –{' '}
        {formatShortDate(data.previousRange.to)}.
      </p>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatCurrency(summary.revenue)}
          delta={data.revenueChangePct}
          hint={`was ${formatCurrency(previous.revenue)}`}
        />
        <StatCard
          label="Gross profit"
          value={formatCurrency(summary.grossProfit)}
          delta={profitDelta}
          hint="revenue minus cost price"
        />
        <StatCard
          label="Units sold"
          value={String(summary.units ?? 0)}
          delta={unitsDelta}
          hint={`${summary.saleCount ?? 0} transactions`}
        />
        <StatCard
          label="Average sale"
          value={formatCurrency(summary.averageSale)}
          delta={salesDelta}
          hint="per transaction"
        />
      </div>

      <Card title="Revenue over the period" subtitle="Daily totals across the selected window.">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#737373', fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#E5E5E5' }}
                minTickGap={16}
              />
              <YAxis
                tick={{ fill: '#737373', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#000000"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#000000' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card
          title="Busiest days"
          subtitle={
            busiestDay && busiestDay.revenue > 0
              ? `${busiestDay.name} is your strongest day in this window.`
              : 'Revenue by day of the week.'
          }
        >
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekday} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                <XAxis
                  dataKey="name"
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
                <Tooltip cursor={{ fill: '#FAFAFA' }} contentStyle={chartTooltipStyle} />
                <Bar dataKey="revenue" name="Revenue" fill="#000000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Busiest hours"
          subtitle={
            busiestHour ? `Peak trading around ${busiestHour.hour}.` : 'Revenue by hour of the day.'
          }
        >
          {hourly.length === 0 ? (
            <p className="text-sm text-[#737373]">No sales in this period.</p>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourly} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: '#737373', fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E5E5E5' }}
                    minTickGap={8}
                  />
                  <YAxis
                    tick={{ fill: '#737373', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                  />
                  <Tooltip cursor={{ fill: '#FAFAFA' }} contentStyle={chartTooltipStyle} />
                  <Bar dataKey="revenue" name="Revenue" fill="#000000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Rising" subtitle="Growing fastest vs the previous period.">
          {risers.length === 0 ? (
            <p className="text-sm text-[#737373]">Nothing rising in this window.</p>
          ) : (
            <ul className="divide-y divide-[#E5E5E5]">
              {risers.map(
                (m: {
                  name: string;
                  revenue: number;
                  units_sold: number;
                  change_pct: number | null;
                }) => (
                  <li key={m.name} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-black">{m.name}</div>
                      <div className="text-xs text-[#737373]">{m.units_sold} units</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-semibold text-black">
                        {formatCurrency(m.revenue)}
                      </div>
                      <Delta pct={m.change_pct} />
                    </div>
                  </li>
                )
              )}
            </ul>
          )}
        </Card>

        <Card title="Slowing" subtitle="Declining vs the previous period.">
          {fallers.length === 0 ? (
            <p className="text-sm text-[#737373]">Nothing declining in this window.</p>
          ) : (
            <ul className="divide-y divide-[#E5E5E5]">
              {fallers.map(
                (m: { name: string; revenue: number; units_sold: number; change_pct: number }) => (
                  <li key={m.name} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-black">{m.name}</div>
                      <div className="text-xs text-[#737373]">{m.units_sold} units</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-semibold text-black">
                        {formatCurrency(m.revenue)}
                      </div>
                      <Delta pct={m.change_pct} />
                    </div>
                  </li>
                )
              )}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Revenue by category" subtitle="Where the money came from.">
          {categories.length === 0 ? (
            <p className="text-sm text-[#737373]">No sales in this period.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {categories.map((c: { category: string; revenue: string; units_sold: number }) => (
                <li key={c.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-black">{c.category}</span>
                    <span className="text-xs font-medium text-[#737373]">
                      {formatCurrency(c.revenue)} · {c.units_sold} units
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#F5F5F5]">
                    <div
                      className="h-1.5 rounded-full bg-black"
                      style={{ width: `${(Number(c.revenue) / maxCategoryRevenue) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Cash sitting still" subtitle="In stock but nothing sold this period.">
          {slowMovers.length === 0 ? (
            <p className="text-sm text-[#737373]">Everything in stock sold at least once.</p>
          ) : (
            <ul className="divide-y divide-[#E5E5E5]">
              {slowMovers.map(
                (m: {
                  id: number;
                  name: string;
                  stock_quantity: number;
                  tied_up_value: string;
                }) => (
                  <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <div className="truncate text-sm text-black">{m.name}</div>
                      <div className="text-xs text-[#737373]">{m.stock_quantity} in stock</div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-black">
                      {formatCurrency(m.tied_up_value)}
                    </span>
                  </li>
                )
              )}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

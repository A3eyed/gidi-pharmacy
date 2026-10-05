'use client';

import { useQuery } from '@tanstack/react-query';
import {
  CloudSun,
  Lightbulb,
  Printer,
  RefreshCw,
  Sparkles,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react';
import { usePharmacy } from '@/components/AppShell';

type Recommendation = {
  medication: string;
  action: string;
  suggestedQuantity: number | null;
  urgency: 'high' | 'medium' | 'low';
  reason: string;
};

function UrgencyBadge({ urgency }: { urgency: string }) {
  const isHigh = urgency === 'high';
  const cls = isHigh
    ? 'rounded-full bg-black px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white'
    : 'rounded-full border border-[#E5E5E5] bg-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-black';
  return <span className={cls}>{urgency}</span>;
}

/**
 * Restocking briefing.
 *
 * Combines this pharmacy's own sales history and stock levels with the climate
 * season and live weather, then applies a deterministic run-rate calculation to
 * produce a prioritised buying list. No language model is involved.
 */
export default function RestockInsights() {
  const { pharmacy } = usePharmacy();

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['restock-insights', pharmacy.id],
    // These cost a model call, so keep them fresh for a while
    staleTime: 1000 * 60 * 30,
    retry: false,
    queryFn: async () => {
      const response = await fetch(`/api/insights?pharmacyId=${pharmacy.id}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/insights, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-8 text-center">
        <Sparkles size={20} className="mx-auto text-black" />
        <p className="mt-3 text-sm font-medium text-black">Azara is reviewing your pharmacy…</p>
        <p className="mt-1 text-xs text-[#737373]">
          Reading sales history, stock levels, the season and today&apos;s weather.
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-8 text-center">
        <p className="text-sm text-black">Could not generate the restock briefing right now.</p>
        <button
          onClick={() => refetch()}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#262626]"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      </div>
    );
  }

  const recommendations: Recommendation[] = data.recommendations ?? [];
  const watchouts: string[] = data.watchouts ?? [];
  const opportunities: string[] = data.opportunities ?? [];
  const weather = data.weather;
  const season = data.season;

  return (
    <div className="flex flex-col gap-4">
      {/* Header + context */}
      <div className="print-sheet rounded-xl border border-[#E5E5E5] bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black">
              <Sparkles size={17} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-black">What to restock</h2>
              <p className="text-sm text-[#737373]">
                Calculated from your sales run-rate, the season and current weather.
              </p>
            </div>
          </div>
          <div className="no-print flex gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-[#FAFAFA] disabled:opacity-40"
            >
              <RefreshCw size={12} />
              {isFetching ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-[#FAFAFA]"
            >
              <Printer size={12} />
              Print
            </button>
          </div>
        </div>

        {data.headline && (
          <p className="mt-4 text-sm font-medium leading-relaxed text-black">{data.headline}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {season && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-black">
              {season.label} · {season.months}
            </span>
          )}
          {weather && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-black">
              <CloudSun size={12} />
              {weather.city}: {weather.condition}, {Math.round(weather.tempC)}°C ·{' '}
              {weather.humidity}% humidity
            </span>
          )}
        </div>

        {data.seasonalOutlook && (
          <p className="mt-4 border-t border-[#E5E5E5] pt-4 text-sm leading-relaxed text-[#404040]">
            {data.seasonalOutlook}
          </p>
        )}

        <div className="mt-4 flex gap-2.5 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-3">
          <TriangleAlert size={14} className="mt-0.5 shrink-0 text-black" />
          <p className="text-xs leading-relaxed text-[#404040]">
            <strong className="font-semibold text-black">Commercial estimates only.</strong> These
            are stocking suggestions calculated from your sales data, the season and current
            weather. They are estimates, not clinical or procurement advice. Always apply your own
            professional judgement and check regulatory requirements before ordering.
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="print-sheet rounded-xl border border-[#E5E5E5] bg-white p-6">
        <h3 className="text-base font-semibold text-black">Buying list</h3>
        <p className="text-sm text-[#737373]">Most urgent first.</p>

        {recommendations.length === 0 ? (
          <p className="mt-4 text-sm text-[#737373]">
            No specific restock actions right now. Record more sales to sharpen the calculation.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[#E5E5E5]">
            {recommendations.map((r, index) => (
              <li key={`${r.medication}-${index}`} className="print-break py-4 first:pt-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] text-xs font-semibold text-black">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-black">{r.medication}</span>
                    <UrgencyBadge urgency={r.urgency} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-black">
                      {r.action}
                    </span>
                    {r.suggestedQuantity ? (
                      <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                        {r.suggestedQuantity} units
                      </span>
                    ) : null}
                  </div>
                </div>
                <p className="mt-2 pl-8.5 text-sm leading-relaxed text-[#404040]">{r.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Watchouts + opportunities */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="print-sheet rounded-xl border border-[#E5E5E5] bg-white p-6">
          <div className="flex items-center gap-2">
            <TriangleAlert size={15} className="text-black" />
            <h3 className="text-base font-semibold text-black">Watch out for</h3>
          </div>
          {watchouts.length === 0 ? (
            <p className="mt-3 text-sm text-[#737373]">Nothing flagged.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2.5">
              {watchouts.map((w, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-black" />
                  <span className="text-sm leading-relaxed text-[#404040]">{w}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="print-sheet rounded-xl border border-[#E5E5E5] bg-white p-6">
          <div className="flex items-center gap-2">
            <Lightbulb size={15} className="text-black" />
            <h3 className="text-base font-semibold text-black">Opportunities</h3>
          </div>
          {opportunities.length === 0 ? (
            <p className="mt-3 text-sm text-[#737373]">Nothing suggested.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2.5">
              {opportunities.map((o, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-black" />
                  <span className="text-sm leading-relaxed text-[#404040]">{o}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Evidence */}
      {data.evidence?.risingSellers?.length > 0 && (
        <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-black" />
            <h3 className="text-base font-semibold text-black">Rising demand in your data</h3>
          </div>
          <p className="text-sm text-[#737373]">
            Units sold in the last 30 days vs the 30 days before.
          </p>
          <ul className="mt-3 divide-y divide-[#E5E5E5]">
            {data.evidence.risingSellers.map(
              (s: { name: string; unitsLast30: number; unitsPrior30: number }) => (
                <li key={s.name} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-black">{s.name}</span>
                  <span className="text-xs font-medium text-[#737373]">
                    {s.unitsPrior30} → {s.unitsLast30} units
                  </span>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

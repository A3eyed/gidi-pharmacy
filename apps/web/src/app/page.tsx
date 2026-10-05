'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bot,
  CalendarClock,
  Package,
  Plus,
  Receipt,
} from 'lucide-react';
import AppShell, { usePharmacy } from '@/components/AppShell';
import LandingPage from '@/components/LandingPage';
import { useSession } from '@/lib/auth-client';
import { formatCurrency, formatDateTime, formatShortDate } from '@/utils/format';

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="glass rounded-xl p-5 transition-transform hover:-translate-y-0.5">
      <div className="text-xs font-medium text-[#737373]">{label}</div>
      <div className="mt-1.5 text-2xl font-semibold tracking-tight text-black">{value}</div>
      {hint && <div className="mt-1 text-xs font-medium text-gold">{hint}</div>}
    </div>
  );
}

/** Large tappable shortcuts to the work people do every day. */
function QuickActions() {
  const actions = [
    { href: '/sales', label: 'Record a sale', icon: Receipt },
    { href: '/inventory', label: 'Add medicine', icon: Plus },
    { href: '/azara', label: 'Ask Azara', icon: Bot },
    { href: '/analytics', label: 'View analytics', icon: BarChart3 },
  ];
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="glass-gold flex items-center gap-2.5 rounded-xl p-4 text-sm font-medium text-black transition-transform hover:-translate-y-0.5"
        >
          <action.icon size={16} className="text-gold" />
          {action.label}
        </Link>
      ))}
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-black">{title}</h2>
          {subtitle && <p className="text-sm text-[#737373]">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function DashboardContent() {
  const { pharmacy } = usePharmacy();

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

  const { data: salesData } = useQuery({
    queryKey: ['sales', pharmacy.id, 5],
    queryFn: async () => {
      const response = await fetch(`/api/sales?pharmacyId=${pharmacy.id}&limit=5`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/sales, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div className="text-sm text-[#737373]">Loading dashboard…</div>;
  }
  if (error || !data) {
    return <div className="text-sm text-black">Could not load the dashboard. Please refresh.</div>;
  }

  const inv = data.inventory ?? {};
  const recentSales = salesData?.sales ?? [];
  const lowStock = data.lowStock ?? [];
  const expiring = data.expiringSoon ?? [];

  const viewAllLink = (href: string) => (
    <Link
      href={href}
      className="glass inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-black transition-colors hover:text-gold"
    >
      View all
      <ArrowUpRight size={12} />
    </Link>
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-black">Dashboard</h1>
        <p className="text-sm text-[#737373]">{pharmacy.name} — today at a glance</p>
        <div className="gold-rule mt-2 h-px w-24" />
      </div>

      <QuickActions />

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Today's revenue"
          value={formatCurrency(data.today?.revenue)}
          hint={`${data.today?.sale_count ?? 0} sales today`}
        />
        <StatCard
          label="Last 30 days"
          value={formatCurrency(data.month?.revenue)}
          hint={`${data.month?.sale_count ?? 0} sales`}
        />
        <StatCard
          label="Medications"
          value={String(inv.total_medications ?? 0)}
          hint={`${inv.out_of_stock_count ?? 0} out of stock`}
        />
        <StatCard
          label="Inventory value"
          value={formatCurrency(inv.inventory_value)}
          hint={`${inv.low_stock_count ?? 0} low stock items`}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard
          title="Low stock"
          subtitle="At or below reorder level"
          action={viewAllLink('/inventory')}
        >
          {lowStock.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-[#737373]">
              <Package size={14} />
              All medications are sufficiently stocked.
            </div>
          ) : (
            <ul className="divide-y divide-[#E5E5E5]">
              {lowStock.map(
                (m: {
                  id: number;
                  name: string;
                  stock_quantity: number;
                  reorder_level: number;
                }) => (
                  <li key={m.id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle size={14} className="text-gold" />
                      <span className="text-sm text-black">{m.name}</span>
                    </div>
                    <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-black">
                      {m.stock_quantity} left · reorder at {m.reorder_level}
                    </span>
                  </li>
                )
              )}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Expiring soon"
          subtitle="Within the next 90 days"
          action={viewAllLink('/inventory')}
        >
          {expiring.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-[#737373]">
              <CalendarClock size={14} />
              Nothing expiring in the next 90 days.
            </div>
          ) : (
            <ul className="divide-y divide-[#E5E5E5]">
              {expiring.map(
                (m: { id: number; name: string; expiry_date: string; stock_quantity: number }) => (
                  <li key={m.id} className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-black">{m.name}</span>
                    <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-black">
                      {formatShortDate(m.expiry_date)} · {m.stock_quantity} in stock
                    </span>
                  </li>
                )
              )}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="mt-4">
        <SectionCard
          title="Recent sales"
          subtitle="Latest transactions"
          action={viewAllLink('/sales')}
        >
          {recentSales.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-[#737373]">
              <Receipt size={14} />
              No sales recorded yet. Record your first sale from the Sales page.
            </div>
          ) : (
            <ul className="divide-y divide-[#E5E5E5]">
              {recentSales.map(
                (s: {
                  id: number;
                  total_amount: string;
                  created_at: string;
                  items: Array<{ id: number; medication_name: string; quantity: number }>;
                }) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-black">
                        {formatDateTime(s.created_at)}
                      </div>
                      <div className="truncate text-xs text-[#737373]">
                        {s.items.map((i) => `${i.medication_name} ×${i.quantity}`).join(', ')}
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-black">
                      {formatCurrency(s.total_amount)}
                    </span>
                  </li>
                )
              )}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="glass-gold mt-4 flex flex-col items-start justify-between gap-3 rounded-xl p-5 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <div className="bg-gold flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Bot size={18} className="text-black" />
          </div>
          <div>
            <p className="text-sm font-semibold text-black">Ask Azara</p>
            <p className="text-xs text-[#737373]">
              Dosing, interactions, protocols and counselling — looked up in the built-in pharmacy
              reference library, even offline. Reference information only, not a diagnosis.
            </p>
          </div>
        </div>
        <Link
          href="/azara"
          className="bg-gold shrink-0 rounded-full px-4 py-2 text-xs font-medium text-black"
        >
          Open Azara
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  // While the session loads, render nothing heavy to keep first paint fast
  if (isPending) {
    return <div className="min-h-screen bg-white dark:bg-black" />;
  }

  // Signed-out visitors see the marketing landing page
  if (!session) {
    return <LandingPage />;
  }

  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}

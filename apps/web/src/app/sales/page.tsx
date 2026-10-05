'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Minus, Plus, Receipt, Search, X } from 'lucide-react';
import AppShell, { usePharmacy } from '@/components/AppShell';
import { formatCurrency, formatDateTime } from '@/utils/format';

type Med = {
  id: number;
  name: string;
  generic_name: string | null;
  unit_price: string;
  stock_quantity: number;
};

type CartLine = {
  medicationId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
};

function NewSaleCard() {
  const { pharmacy } = usePharmacy();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);

  const { data: medsData, isLoading: medsLoading } = useQuery({
    queryKey: ['medications', pharmacy.id, search, 'sale-picker'],
    queryFn: async () => {
      const params = new URLSearchParams({ pharmacyId: String(pharmacy.id) });
      if (search) params.set('search', search);
      const response = await fetch(`/api/medications?${params.toString()}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/medications, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const recordSale = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacyId: pharmacy.id,
          items: cart.map((l) => ({ medicationId: l.medicationId, quantity: l.quantity })),
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ??
            `When recording sale, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Sale recorded');
    },
    onError: (err: Error) => {
      console.error(err);
      toast.error(err.message || 'Could not record the sale');
    },
  });

  const meds: Med[] = medsData?.medications ?? [];
  const availableMeds = meds.filter((m) => m.stock_quantity > 0);

  const addToCart = (med: Med) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.medicationId === med.id);
      if (existing) {
        if (existing.quantity >= existing.maxStock) return prev;
        return prev.map((l) =>
          l.medicationId === med.id ? { ...l, quantity: l.quantity + 1 } : l
        );
      }
      return [
        ...prev,
        {
          medicationId: med.id,
          name: med.name,
          unitPrice: Number(med.unit_price),
          quantity: 1,
          maxStock: med.stock_quantity,
        },
      ];
    });
  };

  const changeQty = (medicationId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => {
          if (l.medicationId !== medicationId) return l;
          const next = Math.min(Math.max(l.quantity + delta, 0), l.maxStock);
          return { ...l, quantity: next };
        })
        .filter((l) => l.quantity > 0)
    );
  };

  const removeLine = (medicationId: number) => {
    setCart((prev) => prev.filter((l) => l.medicationId !== medicationId));
  };

  const total = cart.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  let pickerContent: React.ReactNode = null;
  if (medsLoading) {
    pickerContent = <div className="py-4 text-sm text-[#737373]">Loading medications…</div>;
  } else if (availableMeds.length === 0) {
    pickerContent = (
      <div className="py-4 text-sm text-[#737373]">
        {search ? 'No matching medications in stock.' : 'No medications in stock yet.'}
      </div>
    );
  } else {
    pickerContent = (
      <ul className="max-h-56 divide-y divide-[#E5E5E5] overflow-y-auto">
        {availableMeds.map((med) => (
          <li key={med.id}>
            <button
              onClick={() => addToCart(med)}
              className="flex w-full items-center justify-between gap-3 px-1 py-2.5 text-left transition-colors hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-black">{med.name}</div>
                <div className="text-xs text-[#737373]">{med.stock_quantity} in stock</div>
              </div>
              <span className="shrink-0 text-sm text-black">{formatCurrency(med.unit_price)}</span>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-black">New sale</h2>
        <p className="text-sm text-[#737373]">Search and tap medications to add them.</p>
      </div>

      <div className="relative mt-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search medications…"
          className="h-10 w-full rounded-lg border border-[#E5E5E5] bg-white pl-9 pr-3 text-sm text-black placeholder:text-[#A3A3A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        />
      </div>

      <div className="mt-2">{pickerContent}</div>

      <div className="mt-4 border-t border-[#E5E5E5] pt-4">
        <div className="text-xs font-medium text-[#737373]">Items in this sale</div>
        {cart.length === 0 ? (
          <div className="mt-2 text-sm text-[#737373]">Nothing added yet.</div>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {cart.map((line) => (
              <li
                key={line.medicationId}
                className="flex items-center justify-between gap-2 rounded-lg border border-[#E5E5E5] px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-black">{line.name}</div>
                  <div className="text-xs text-[#737373]">
                    {formatCurrency(line.unitPrice)} each
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => changeQty(line.medicationId, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E5E5E5] text-black transition-colors hover:bg-[#FAFAFA]"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-black">
                    {line.quantity}
                  </span>
                  <button
                    onClick={() => changeQty(line.medicationId, 1)}
                    disabled={line.quantity >= line.maxStock}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E5E5E5] text-black transition-colors hover:bg-[#FAFAFA] disabled:opacity-40"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => removeLine(line.medicationId)}
                    className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg text-[#737373] transition-colors hover:text-black"
                  >
                    <X size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-[#E5E5E5] pt-4">
          <span className="text-sm font-medium text-[#737373]">Total</span>
          <span className="text-xl font-semibold tracking-tight text-black">
            {formatCurrency(total)}
          </span>
        </div>

        <button
          onClick={() => recordSale.mutate()}
          disabled={cart.length === 0 || recordSale.isPending}
          className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-black text-sm font-medium text-white transition-colors hover:bg-[#262626] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          {recordSale.isPending ? 'Recording…' : 'Record sale'}
        </button>
      </div>
    </div>
  );
}

function SalesHistoryCard() {
  const { pharmacy } = usePharmacy();
  const { data, isLoading, error } = useQuery({
    queryKey: ['sales', pharmacy.id, 25],
    queryFn: async () => {
      const response = await fetch(`/api/sales?pharmacyId=${pharmacy.id}&limit=25`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/sales, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const sales = data?.sales ?? [];

  let content: React.ReactNode = null;
  if (isLoading) {
    content = <div className="text-sm text-[#737373]">Loading sales…</div>;
  } else if (error) {
    content = <div className="text-sm text-black">Could not load sales history.</div>;
  } else if (sales.length === 0) {
    content = (
      <div className="flex items-center gap-2 text-sm text-[#737373]">
        <Receipt size={14} />
        No sales recorded yet.
      </div>
    );
  } else {
    content = (
      <ul className="divide-y divide-[#E5E5E5]">
        {sales.map(
          (s: {
            id: number;
            total_amount: string;
            created_at: string;
            items: Array<{
              id: number;
              medication_name: string;
              quantity: number;
              subtotal: string;
            }>;
          }) => (
            <li key={s.id} className="py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black">
                  {formatDateTime(s.created_at)}
                </span>
                <span className="text-sm font-semibold text-black">
                  {formatCurrency(s.total_amount)}
                </span>
              </div>
              <ul className="mt-1.5 flex flex-col gap-0.5">
                {s.items.map((item) => (
                  <li key={item.id} className="text-sm text-[#737373]">
                    <span className="mr-2 text-[#A3A3A3]">-</span>
                    {item.medication_name} ×{item.quantity} · {formatCurrency(item.subtotal)}
                  </li>
                ))}
              </ul>
            </li>
          )
        )}
      </ul>
    );
  }

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-black">Sales history</h2>
        <p className="text-sm text-[#737373]">Most recent transactions first.</p>
      </div>
      <div className="mt-4">{content}</div>
    </div>
  );
}

function SalesContent() {
  const { pharmacy } = usePharmacy();
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-black">Sales</h1>
        <p className="text-sm text-[#737373]">{pharmacy.name} — record and review sales</p>
      </div>
      <div className="mt-6 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <NewSaleCard />
        <SalesHistoryCard />
      </div>
    </div>
  );
}

export default function SalesPage() {
  return (
    <AppShell>
      <SalesContent />
    </AppShell>
  );
}

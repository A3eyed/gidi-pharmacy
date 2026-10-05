'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import AppShell, { usePharmacy } from '@/components/AppShell';
import MedicationDialog, { type Medication } from '@/components/MedicationDialog';
import { formatCurrency, formatShortDate } from '@/utils/format';

const FILTERS = [
  { id: '', label: 'All' },
  { id: 'low', label: 'Low stock' },
  { id: 'out', label: 'Out of stock' },
  { id: 'expiring', label: 'Expiring soon' },
];

function StockPill({ med }: { med: Medication }) {
  let dotClass = 'bg-black';
  let label = 'In stock';
  if (med.stock_quantity === 0) {
    dotClass = 'bg-white border border-black';
    label = 'Out of stock';
  } else if (med.stock_quantity <= med.reorder_level) {
    dotClass = 'bg-[#737373]';
    label = 'Low';
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-3 py-1 text-xs font-medium text-black">
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      {med.stock_quantity} · {label}
    </span>
  );
}

function InventoryContent() {
  const { pharmacy } = usePharmacy();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['medications', pharmacy.id, search, filter],
    queryFn: async () => {
      const params = new URLSearchParams({ pharmacyId: String(pharmacy.id) });
      if (search) params.set('search', search);
      if (filter) params.set('filter', filter);
      const response = await fetch(`/api/medications?${params.toString()}`);
      if (!response.ok) {
        throw new Error(
          `When fetching /api/medications, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/medications/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(
          `When deleting medication, the response was [${response.status}] ${response.statusText}`
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Medication removed');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Could not remove the medication');
    },
  });

  const medications: Medication[] = data?.medications ?? [];

  const openAdd = () => {
    setEditingMed(null);
    setDialogOpen(true);
  };
  const openEdit = (med: Medication) => {
    setEditingMed(med);
    setDialogOpen(true);
  };
  const confirmDelete = (med: Medication) => {
    if (window.confirm(`Remove ${med.name} from inventory?`)) {
      deleteMutation.mutate(med.id);
    }
  };

  let tableBody: React.ReactNode = null;
  if (isLoading) {
    tableBody = <div className="p-6 text-sm text-[#737373]">Loading inventory…</div>;
  } else if (error) {
    tableBody = (
      <div className="p-6 text-sm text-black">Could not load inventory. Please refresh.</div>
    );
  } else if (medications.length === 0) {
    tableBody = (
      <div className="p-10 text-center">
        <div className="text-sm font-medium text-black">No medications found</div>
        <div className="mt-1 text-sm text-[#737373]">
          {search || filter
            ? 'Try adjusting your search or filter.'
            : 'Add your first medication to get started.'}
        </div>
      </div>
    );
  } else {
    tableBody = (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-[#E5E5E5]">
              <th className="px-4 py-3 text-xs font-medium text-[#737373]">Medication</th>
              <th className="px-4 py-3 text-xs font-medium text-[#737373]">Category</th>
              <th className="px-4 py-3 text-xs font-medium text-[#737373]">Price</th>
              <th className="px-4 py-3 text-xs font-medium text-[#737373]">Stock</th>
              <th className="px-4 py-3 text-xs font-medium text-[#737373]">Expiry</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-[#737373]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((med) => (
              <tr
                key={med.id}
                className="border-b border-[#E5E5E5] last:border-b-0 hover:bg-[#FAFAFA]"
              >
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-black">{med.name}</div>
                  {med.generic_name && (
                    <div className="text-xs text-[#737373]">{med.generic_name}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {med.category ? (
                    <span className="inline-flex items-center rounded-full border border-[#E5E5E5] px-3 py-1 text-xs font-medium text-black">
                      {med.category}
                    </span>
                  ) : (
                    <span className="text-xs text-[#737373]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-black">{formatCurrency(med.unit_price)}</td>
                <td className="px-4 py-3">
                  <StockPill med={med} />
                </td>
                <td className="px-4 py-3 text-sm text-[#737373]">
                  {formatShortDate(med.expiry_date)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => openEdit(med)}
                      title="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] text-black transition-colors hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => confirmDelete(med)}
                      title="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E5E5] text-black transition-colors hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-black">Inventory</h1>
          <p className="text-sm text-[#737373]">{pharmacy.name} — manage medications and stock</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-[#262626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <Plus size={16} />
          Add medication
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, generic, SKU…"
            className="h-10 w-full rounded-lg border border-[#E5E5E5] bg-white pl-9 pr-3 text-sm text-black placeholder:text-[#A3A3A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => {
            const isActive = filter === f.id;
            const pillClass = isActive
              ? 'whitespace-nowrap rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white'
              : 'whitespace-nowrap rounded-full border border-[#E5E5E5] bg-white px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-[#FAFAFA]';
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} className={pillClass}>
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[#E5E5E5] bg-white">{tableBody}</div>

      <MedicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        pharmacyId={pharmacy.id}
        medication={editingMed}
      />
    </div>
  );
}

export default function InventoryPage() {
  return (
    <AppShell>
      <InventoryContent />
    </AppShell>
  );
}

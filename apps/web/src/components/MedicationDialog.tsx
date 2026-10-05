'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export type Medication = {
  id: number;
  name: string;
  generic_name: string | null;
  category: string | null;
  sku: string | null;
  unit_price: string;
  cost_price: string;
  stock_quantity: number;
  reorder_level: number;
  expiry_date: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pharmacyId: number;
  medication: Medication | null;
};

const emptyForm = {
  name: '',
  genericName: '',
  category: '',
  sku: '',
  unitPrice: '',
  costPrice: '',
  stockQuantity: '',
  reorderLevel: '10',
  expiryDate: '',
};

export default function MedicationDialog({ open, onOpenChange, pharmacyId, medication }: Props) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!medication;

  useEffect(() => {
    if (open) {
      setError(null);
      if (medication) {
        setForm({
          name: medication.name ?? '',
          genericName: medication.generic_name ?? '',
          category: medication.category ?? '',
          sku: medication.sku ?? '',
          unitPrice: String(medication.unit_price ?? ''),
          costPrice: String(medication.cost_price ?? ''),
          stockQuantity: String(medication.stock_quantity ?? ''),
          reorderLevel: String(medication.reorder_level ?? '10'),
          expiryDate: medication.expiry_date ? medication.expiry_date.slice(0, 10) : '',
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [open, medication]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        pharmacyId,
        name: form.name,
        genericName: form.genericName,
        category: form.category,
        sku: form.sku,
        unitPrice: Number(form.unitPrice || 0),
        costPrice: Number(form.costPrice || 0),
        stockQuantity: Number(form.stockQuantity || 0),
        reorderLevel: Number(form.reorderLevel || 0),
        expiryDate: form.expiryDate || null,
      };
      const url = isEditing ? `/api/medications/${medication.id}` : '/api/medications';
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(
          `When saving medication, the response was [${response.status}] ${response.statusText}`
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success(isEditing ? 'Medication updated' : 'Medication added');
      onOpenChange(false);
    },
    onError: (err) => {
      console.error(err);
      setError('Could not save the medication. Please try again.');
    },
  });

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const inputClass =
    'h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-sm text-black placeholder:text-[#A3A3A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black';
  const labelClass = 'mb-1 block text-xs font-medium text-[#737373]';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border border-[#E5E5E5] bg-white font-inter sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight text-black">
            {isEditing ? 'Edit medication' : 'Add medication'}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#737373]">
            {isEditing
              ? 'Update details, pricing, and stock levels.'
              : 'Add a new item to this pharmacy inventory.'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            if (form.name.trim()) {
              saveMutation.mutate();
            }
          }}
        >
          <div className="sm:col-span-2">
            <label className={labelClass}>Name</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Paracetamol 500mg"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Generic name</label>
            <input
              className={inputClass}
              value={form.genericName}
              onChange={set('genericName')}
              placeholder="e.g. Acetaminophen"
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input
              className={inputClass}
              value={form.category}
              onChange={set('category')}
              placeholder="e.g. Analgesic"
            />
          </div>
          <div>
            <label className={labelClass}>SKU / Barcode</label>
            <input
              className={inputClass}
              value={form.sku}
              onChange={set('sku')}
              placeholder="Optional"
            />
          </div>
          <div>
            <label className={labelClass}>Expiry date</label>
            <input
              type="date"
              className={inputClass}
              value={form.expiryDate}
              onChange={set('expiryDate')}
            />
          </div>
          <div>
            <label className={labelClass}>Selling price (GH₵)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              value={form.unitPrice}
              onChange={set('unitPrice')}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Cost price (GH₵)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={inputClass}
              value={form.costPrice}
              onChange={set('costPrice')}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className={labelClass}>Stock quantity</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.stockQuantity}
              onChange={set('stockQuantity')}
              placeholder="0"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Reorder level</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.reorderLevel}
              onChange={set('reorderLevel')}
              placeholder="10"
            />
          </div>

          {error && <div className="text-sm text-black sm:col-span-2">{error}</div>}

          <div className="mt-1 flex justify-end gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-lg border border-[#E5E5E5] bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending || !form.name.trim()}
              className="h-10 rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-[#262626] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              {saveMutation.isPending ? 'Saving…' : isEditing ? 'Save changes' : 'Add medication'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

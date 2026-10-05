import { create } from 'zustand';

type PharmacyStore = {
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
};

export const usePharmacyStore = create<PharmacyStore>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));

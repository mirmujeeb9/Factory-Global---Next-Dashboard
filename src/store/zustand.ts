import type {} from "@redux-devtools/extension"; // required for devtools typing
import { create } from "zustand";

interface KnoState {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

interface SupplierState extends KnoState {
  supplierStartDate: Date;
  supplierEndDate: Date;
  setSupplierStartDate: (date: Date) => void;
  setSupplierEndDate: (date: Date) => void;
}

export const useKnoStore = create<SupplierState>()((set) => ({
  startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
  endDate: new Date(),
  supplierStartDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
  supplierEndDate: new Date(),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setSupplierStartDate: (date) => set({ supplierStartDate: date }),
  setSupplierEndDate: (date) => set({ supplierEndDate: date }),
}));

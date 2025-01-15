import { Account } from "@schema/account.schema";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { GetFilters } from "./projects";

type FilterStore = {
  filters?: GetFilters;
  setFilters: (filters?: GetFilters) => void;
};

export const useAccountStore = create(
  combine(
    {
      account: undefined as undefined | null | Account,
    },
    (set) => ({
      setAccount: (account: Account | null) => set({ account }),
    })
  )
);

export const useProjectFilterStore = create<FilterStore>((set) => ({
  filters: undefined,
  setFilters: (filters?: GetFilters) => set({ filters }),
}));

import { Account } from "@server/schema/account.schema";
import { create } from "zustand";
import { combine } from "zustand/middleware";

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

import { fetchApi } from "@/api/api";
import { useAccountStore } from "@/api/store";
import { Account, AccountResponse } from "@server/schema/account.schema";
import { useCallback } from "react";

export enum authStatus {
  Unknown = 0,
  Authentificated = 1,
  Guest = 2,
}

export function useAuth() {
  const { account, setAccount } = useAccountStore();
  let status;
  switch (account) {
    case null:
      status = authStatus.Guest;
      break;
    case undefined:
      status = authStatus.Unknown;
      break;
    default:
      status = authStatus.Authentificated;
      break;
  }

  const authenticate = useCallback(() => {
    fetchApi<AccountResponse>("/user/profile")
      .then((res) => {
        const { account } = res.data;
        return account;
      })
      .then(setAccount)
      .catch(() => setAccount(null));
  }, [setAccount]);

  const register = useCallback(
    (
      username: string,
      email: string,
      password: string,
      name: string,
      lastname: string
    ) => {
      fetchApi<Account>("/auth/register", {
        payload: { account: { username, email, password, name, lastname } },
      })
        .then(setAccount)
        .catch(() => setAccount(null));
    },
    [setAccount]
  );

  const login = useCallback(
    (username: string, password: string) => {
      fetchApi<Account>("/auth/login", {
        payload: { username, password },
      }).then(setAccount);
    },
    [setAccount]
  );

  const logout = useCallback(() => {
    fetchApi<Account>("/auth/logout", { method: "POST" }).then(setAccount);
  }, [setAccount]);

  return {
    account,
    status,
    authenticate,
    register,
    login,
    logout,
  };
}

import { fetchApi } from "@/api/api";
import { useAccountStore } from "@/api/store";
import { Account } from "@server/schema/account.schema";
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

  const authenticate = useCallback(async () => {
    try {
      const account = await fetchApi<Account>("/user/profile");
      setAccount(account);
    } catch (error) {
      setAccount(null);
      console.error(error);
    }
  }, [setAccount]);

  const register = useCallback(
    async (
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

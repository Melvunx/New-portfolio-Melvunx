import { useAuth } from "./useAuth";

export function useAccount() {
  const { account } = useAuth();

  if (!account) {
    throw new Error("User is not authentificated !");
  }
  
  return {
    account,
  };
}

import { useAuth } from "./useAuth";

export function useAccount() {
  const { account } = useAuth();
  const { VITE_MODERATOR_ID, VITE_ADMIN_ID } = import.meta.env;

  console.log("account from useAccount : ", account);

  if (!account) {
    throw new Error("User is not authentificated !");
  }

  const isModerator = () => {
    if (account.role_id === VITE_MODERATOR_ID) {
      return true;
    }
    return false;
  };

  const isAdmin = () => {
    if (account.role_id === VITE_ADMIN_ID) {
      return true;
    }
    return false;
  };

  return {
    account,
    isModerator,
    isAdmin,
  };
}

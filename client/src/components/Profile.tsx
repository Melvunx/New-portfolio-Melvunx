import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/useAccount";
import { useAuth } from "@/hooks/useAuth";
import { formateDate } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useTransition } from "react";

export default function Profile() {
  const { account } = useAccount();
  const { logout } = useAuth();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center gap-6">
        <h1>{account.name}'s Profile</h1>
        <ul className="flex flex-col items-center justify-center gap-3">
          <li>Username: {account.username}</li>
          <li>email: {account.email}</li>
          <li>Last name: {account.lastname}</li>
          <li>
            verfied account:{" "}
            {account.verified === 1 ? "Compte vérifié !" : "Compte non vérifié"}
          </li>
          <li>
            Last login:{" "}
            {account.lastlogin
              ? formateDate(account.lastlogin)
              : "Première connexion"}
          </li>
        </ul>

        <Button
          className="flex gap-3 italic"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              return new Promise((resolve) =>
                setTimeout(() => resolve(logout()), 1000)
              );
            });
          }}
        >
          Logout
          {isPending ? <LoaderCircleIcon className="animate-spin" /> : ""}
        </Button>
      </div>
    </>
  );
}

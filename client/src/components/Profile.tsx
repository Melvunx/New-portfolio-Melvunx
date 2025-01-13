import { useAccount } from "@/hooks/useAccount";
import { useAuth } from "@/hooks/useAuth";
import { formateDate } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function Profile() {
  const { account } = useAccount();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-6">
      <h1>{account.name}'s Profile</h1>
      <ul className="flex flex-col items-center justify-center gap-3">
        <li>Username: {account.username}</li>
        <li>email: {account.email}</li>
        <li>Last name: {account.lastname}</li>
        <li>verfied account: {account.verified}</li>
        <li>
          Last login:{" "}
          {account.lastlogin
            ? formateDate(account.lastlogin)
            : "Première connexion"}
        </li>
      </ul>

      <Button
        className="italic"
        onClick={() => {
          logout();
          return navigate("/");
        }}
      >
        Logout
      </Button>
    </div>
  );
}

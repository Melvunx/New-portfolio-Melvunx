import { useAuth } from "@/hooks/useAuth";
import { Code } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { NavLink } from "./ui/NavLink";

export function NavBar() {
  const { account } = useAuth();

  return (
    <nav className="flex w-full items-center justify-around bg-gradient-to-t from-slate-800/20 to-black">
      <h1 className="flex items-center gap-2">
        <Code /> <Link to="/">Melvunx Portfolio</Link>
      </h1>
      <div className="flex items-center gap-6 py-1">
        <NavLink to="/project">Projets</NavLink>
        <NavLink to="/project">A propos de Moi</NavLink>
      </div>
      <div className="flex items-center gap-4">
        {account ? (
          <NavLink to="/profile">{account.username}</NavLink>
        ) : (
          <NavLink to="/auth">Connexion</NavLink>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}

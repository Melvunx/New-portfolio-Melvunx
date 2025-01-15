import { Code } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { NavLink } from "./ui/NavLink";

export function NavBar() {
  return (
    <nav className="flex w-full items-center">
      <div className="">
        <h1 className="flex items-center gap-2">
          <Code /> <Link to="/">Melvunx Portfolio</Link>
        </h1>
      </div>
      <div className="flex items-center">
        <NavLink to="/project">Projets</NavLink>
      </div>
      <div className="">
        <ModeToggle />
      </div>
    </nav>
  );
}

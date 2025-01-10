import { Code } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export function NavBar() {
  return (
    <nav className="flex w-full items-center">
      <div className="">
        <h1 className="flex items-center gap-2">
          <Code /> Melvunx Portfolio
        </h1>
      </div>
      <div className="">
        <ModeToggle />
      </div>
    </nav>
  );
}

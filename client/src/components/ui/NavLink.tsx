import clsx from "clsx";
import { Link } from "react-router-dom";
import { Button } from "./button";

type NavLinkProps = {
  to: string;
  children: React.ReactNode;
  className?: string;
};

export function NavLink({ to, children, className }: NavLinkProps) {
  return (
    <Button className={clsx("tracking-wide", className)} variant="outline">
      <Link to={to}>{children}</Link>
    </Button>
  );
}

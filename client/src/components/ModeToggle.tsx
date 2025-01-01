import { MoonIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Toggle } from "./ui/toggle";

export function ModeToggle() {
  return (
    <Toggle>
      <MoonIcon />
    </Toggle>
  );
}

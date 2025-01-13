import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

type SubmitButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

export function SubmitButton({
  children = "Submit",
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const navigate = useNavigate();

  return (
    <Button
      className={clsx(
        "flex items-center justify-between gap-4 tracking-wide",
        className
      )}
      type="submit"
      disabled={pending}
      onClick={() => navigate("/")}
    >
      {children}
      {pending ? <LoaderCircle className="animate-spin" size={20} /> : ""}
    </Button>
  );
}

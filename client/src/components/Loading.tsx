import { LoaderCircle } from "lucide-react";

export function Loading() {
  return (
    <div className="w-full">
      <h1 className="mx-auto flex w-1/2 items-center justify-between">
        Loading... <LoaderCircle className="animate-spin" size={24} />{" "}
      </h1>
    </div>
  );
}

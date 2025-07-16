"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { caller } from "@/trpc/server";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: (data) => {
        toast.success(
          "Background job invoked successfully with response: " + data.ok
        );
      },
    })
  );

  return (
    <div className="p-4">
      <Button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ email: "prakash@gmail.com" })}
      >
        {" "}
        {invoke.isPending
          ? "Invoking Background Job"
          : " Invoke Background Job"}{" "}
      </Button>
    </div>
  );
}

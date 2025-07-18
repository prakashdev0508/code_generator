"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { caller } from "@/trpc/server";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [value, setValue] = useState("");

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
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter Some thing "
        className="mb-5 "
      />
      <Button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ value: value })}
      >
        {" "}
        {invoke.isPending
          ? "Invoking Background Job"
          : " Invoke Background Job"}{" "}
      </Button>
    </div>
  );
}

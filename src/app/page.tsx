"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [value, setValue] = useState("");

  const trpc = useTRPC();
  const { data: messages } = useQuery(trpc.messages.getMessages.queryOptions());
  const createMessage = useMutation(
    trpc.messages.createMessage.mutationOptions({
      onSuccess: (data) => {
        toast.success("Message created successfully");
      },
    })
  );

  return (
    <div className="p-4">
      <Input
        value={value}
        maxLength={100}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter Some thing "
        className="mb-5 "
      />
      <Button
        disabled={createMessage.isPending}
        onClick={() => createMessage.mutate({ content: value })}
      >
        {" "}
        {createMessage.isPending
          ? "Invoking Background Job"
          : " Invoke Background Job"}
      </Button>
      <div className="flex flex-col gap-2">
        {JSON.stringify(messages)}
        {/* {messages?.map((message) => (
          <div key={message.id}><p className="text-sm mb-3">{message.content}</p>
            
          </div>
        ))} */}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ArrowUpIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
});

const MessageForm = ({ projectId }: { projectId: string }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showUses, setShowUses] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createmessage = useMutation(
    trpc.messages.createMessage.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.getMessages.queryOptions({ projectId })
        );
        toast.success("Message sent work in progress");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const isPending = createmessage.isPending;
  const isDisabled = isPending || !form.formState.isValid;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await createmessage.mutateAsync({
      projectId,
      content: data.message,
    });
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
            isFocused && "shadow-xs",
            showUses && "rounded-t-none"
          )}
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                minRows={2}
                maxRows={8}
                disabled={isPending}
                className="w-full resize-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 pt-3"
                placeholder="What do you want to build?"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }
                }}
              />
            )}
          />
          <div className="flex items-end gap-x-2 justify-between pt-2">
            <div className="text-[10px] text-muted-foreground font-mono">
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center rounded border bg-secondary px-2 font-sans text-xs font-medium text-secondary-foreground">
                <span className="mr-2">&#8984;</span>Enter
              </kbd>
              &nbsp; to submit
            </div>
            <Button
              type="submit"
              size="icon"
              className={cn(
                "size-8",
                isDisabled && "bg-muted-foreground border"
              )}
              disabled={isDisabled}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowUpIcon className="size-4" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MessageForm;

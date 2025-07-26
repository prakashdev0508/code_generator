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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowUpIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../constant";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

const ProjectForm = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [showUses, setShowUses] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();

  const trpc = useTRPC();
  const createProject = useMutation(
    trpc.project.createProject.mutationOptions({
      onSuccess: async (data) => {
        form.reset();
        toast.success("Project created successfully");
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const isPending = createProject.isPending;
  const isDisabled = isPending || !form.formState.isValid;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    await createProject.mutateAsync({
      name: data.name,
    });
  };

  return (
    <div className="relative p-3 pt-1">
      <div className="absolute inset-0  h-6 bg-gradient-to-b from-transparent to-background/70 -top-6 left-0 right-0  pointer-events-none " />
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextareaAutosize
                    {...field}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    minRows={3}
                    maxRows={8}
                    className="w-full resize-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 pt-3"
                    placeholder="What do you want to build?"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)(e);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
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
        <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl mt-4">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-sidebar "
              key={template.title}
              onClick={() => {
                form.setValue("name", template.prompt, {
                  shouldDirty: true,
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
            >
              {template.emoji}
              {template.title}
            </Button>
          ))}
        </div>
      </Form>
    </div>
  );
};

export default ProjectForm;

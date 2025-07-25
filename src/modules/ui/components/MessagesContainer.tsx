"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import MessageForm from "./MessageForm";
import { Fragment } from "@/generated/prisma";
import MessageLoading from "./MessageLoading";

const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}) => {
  const trpc = useTRPC();

  const buttonRef = useRef<HTMLDivElement>(null);

  const { data: messages, error: messagesError } = useSuspenseQuery(
    trpc.messages.getMessages.queryOptions(
      {
        projectId,
      }
    )
  );

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.role === "ASSISTANT"
    );
    if (lastAssistantMessage && lastAssistantMessage.fragments) {
      buttonRef.current?.scrollIntoView({ behavior: "smooth" });
      setActiveFragment(lastAssistantMessage.fragments);
    }
  }, [messages, setActiveFragment]);

  const lastMessage = messages[messages.length - 1];
  const isLastUserMessage = lastMessage?.role === "USER";

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden">
        <div className="pt-2 pr-1">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={message.content}
              message={message}
              role={message.role}
              fragments={message.fragments ? [message.fragments] : []}
              createdAt={message.createdAt}
              isActiveFeagment={activeFragment?.id === message.fragments?.id}
              onFragmentClick={() => {
                setActiveFragment(message.fragments);
              }}
              onFragmentMouseEnter={() => {}}
              type={message.type}
            />
          ))}
        </div>
        {isLastUserMessage && <MessageLoading />}
        <div ref={buttonRef} />
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute inset-0  h-6 bg-gradient-to-b from-transparent to-background/70 -top-6 left-0 right-0  pointer-events-none " />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};

export default MessagesContainer;

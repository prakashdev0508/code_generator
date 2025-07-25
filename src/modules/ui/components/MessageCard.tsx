"use client";

import { Card } from "@/components/ui/card";
import Logo from "../../../../public/logo2.png";
import { format } from "date-fns";
import {
  Fragment,
  Message,
  MessageRole,
  MessageType,
} from "@/generated/prisma";
import { cn } from "@/lib/utils";
import React from "react";
import { ChevronRightIcon, Code2Icon } from "lucide-react";

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="flex justify-end pr-2 pb-2 pl-10">
      <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80% break-words  ">
        {content}
      </Card>
    </div>
  );
};

interface FragmentCardProps {
  fragment: Fragment;
  isFragmentActive: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  isFragmentActive,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        "flex items-start gap-2 border rounded-lg bg-muted w-fit hover:bg-secondary p-2",
        isFragmentActive &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <Code2Icon className="size-4 mt-0.5 " />
      <div className=" flex flex-col flex-1 ">
        <span className="tex-sm font-medium line-clamp-1 ">
          {fragment.title}
        </span>
        <span className="text-sm"> Preview </span>
      </div>
      <div className="flex items-center justify-center mt-0.5">
        <ChevronRightIcon className="size-4 mt-0.5 " />
      </div>
    </button>
  );
};

const AssistantMessage = ({
  content,
  fragments,
  createdAt,
  isActiveFeagment,
  onFragmentClick,
  onFragmentMouseEnter,
  type,
}: {
  content: string;
  fragments: Fragment[];
  createdAt: Date;
  isActiveFeagment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  onFragmentMouseEnter: () => void;
  type: MessageType;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4 border-none mt-3",
        type === "ERROR" && "text-red-700 dark:text-red-500  "
      )}
    >
      <div className=" flex items-center gap-2 pl-2 mb-2 mt-2">
        <span className="text-sm font-medium "></span>
        <img src={Logo.src} alt="Vibe" width={20} height={20} />{" "}
        <span className="font-medium ">Vibe</span>
        <span className="text-xs text-muted-foreground  opacity-0 transition-opacity group-hover:opacity-100 ">
          {" "}
          {format(createdAt, "HH:mm 'on' MMM d, yyyy")}{" "}
        </span>
      </div>
      <div className="flex flex-col gap-2 ml-3">
        <span className="ml-3">
          {content.replace(/<\/?task_summary>/g, "\n")}
        </span>{" "}
        <span>
          {fragments && type === "RESULT" && (
            <div className="ml-2 mt-1">
              {fragments.map((fragment) => (
                <FragmentCard
                  key={fragment.id}
                  fragment={fragment}
                  isFragmentActive={isActiveFeagment}
                  onFragmentClick={onFragmentClick}
                />
              ))}
            </div>
          )}
        </span>
      </div>
    </div>
  );
};

interface Props {
  message: Message;
  content: string;
  role: MessageRole;
  fragments: Fragment[];
  createdAt: Date;
  isActiveFeagment: boolean;
  onFragmentClick: () => void;
  onFragmentMouseEnter: () => void;
  type: MessageType;
}

const MessageCard = ({
  message,
  content,
  role,
  fragments,
  createdAt,
  isActiveFeagment,
  onFragmentClick,
  onFragmentMouseEnter,
  type,
}: Props) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        fragments={fragments}
        createdAt={createdAt}
        isActiveFeagment={isActiveFeagment}
        onFragmentClick={onFragmentClick}
        onFragmentMouseEnter={onFragmentMouseEnter}
        type={type}
      />
    );
  }

  return <UserMessage content={content} />;
};

export default MessageCard;

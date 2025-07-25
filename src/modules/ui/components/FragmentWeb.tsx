import { Fragment } from "@/generated/prisma";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import Hint from "@/components/hint";

const FragmentWeb = ({ data }: { data: Fragment }) => {
  const [fragmentKey, setFragmentKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!data?.sandboxUrl) return;
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setFragmentKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full w-full  ">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2 ">
        <Hint text="Refresh" side="bottom" align="start">
          <Button variant={"outline"} size={"sm"} onClick={handleRefresh}>
            <RefreshCcwIcon className="size-4" />
          </Button>
        </Hint>

        <Hint text="Copy to clipboard" side="bottom" align="center">
          <Button
            variant={"outline"}
            size={"sm"}
            disabled={!data?.sandboxUrl || copied}
            onClick={handleCopy}
            className="flex-1 justify-start text-start font-normal"
          >
            <span className=" truncate ">{data?.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint text="Open in new tab" side="bottom" align="start">
          <Button
            variant={"outline"}
            size={"sm"}
            disabled={!data?.sandboxUrl}
            onClick={() => {
              if (!data?.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon className="size-4" />
          </Button>
        </Hint>
      </div>

      <iframe
        key={fragmentKey}
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl ?? ""}
        title="sandbox"
      />
    </div>
  );
};

export default FragmentWeb;

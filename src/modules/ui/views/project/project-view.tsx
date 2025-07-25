"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import MessagesContainer from "../../components/MessagesContainer";
import { Suspense } from "react";

interface Props {
  projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
  const trpc = useTRPC();

  const { data: project, error: projectError } = useSuspenseQuery(
    trpc.project.getOne.queryOptions({
      projectId,
    })
  );



  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={25}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <Suspense fallback={<div>Loading ...</div>}>
            <MessagesContainer projectId={projectId} />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={75}
          minSize={50}
          className="flex flex-col min-h-0"
        >
          {projectError ? (
              <div>Error</div>
            ) : (
              <div>{JSON.stringify(project)}</div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;

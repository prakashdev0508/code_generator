import ProjectView from "@/modules/ui/views/project/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import React from "react";

interface Props {
  params: Promise<{ projectId: string }>;
}

const page = async ({ params }: Props) => {
  const { projectId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.messages.getMessages.queryOptions({ projectId })
  );

  void queryClient.prefetchQuery(
    trpc.project.getOne.queryOptions({ projectId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectView projectId={projectId} />
    </HydrationBoundary>
  );
};

export default page;

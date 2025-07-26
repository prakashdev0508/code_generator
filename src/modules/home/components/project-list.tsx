"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const ProjectList = () => {
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.project.getProjects.queryOptions());

  return (
    <div className=" w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-4 sm:gap-y-6 ">
      <h2>Saved Vibes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projects?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">No projects found</p>
          </div>
        )}
        {projects?.map((project) => (
          <Button
            asChild
            variant="outline"
            className="font-normal h-auto justify-start w-full text-start p-4 "
            key={project.id}
          >
            <Link href={`/projects/${project.id}`} className="p-2">
              <div className="flex items-center gap-x-4">
                <Image
                  src={"/logo2.png"}
                  alt={project.name}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="truncate">{project.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(project.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  ChevronDownIcon,
  SunMoonIcon,
} from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const ProjectHeader = ({ projectId }: { projectId: string }) => {
  const trpc = useTRPC();
  const { setTheme, theme } = useTheme();
  const { data: project } = useSuspenseQuery(
    trpc.project.getOne.queryOptions({
      projectId,
    })
  );

  return (
    <>
      <header className="p-2 flex justify-between items-center border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              size={"sm"}
              className=" focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2! "
            >
              <Image src="/logo2.png" alt="logo" width={20} height={20} />
              <span className="text-sm font-medium"> {project.name} </span>
              <ChevronDownIcon className="size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom" className="w-56">
            <DropdownMenuItem asChild>
              <Link href={`/`}>
                <ChevronLeftIcon />
                <span>Back to Projects</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <SunMoonIcon className="size-4 text-muted-foreground " />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value="light">
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </>
  );
};

export default ProjectHeader;

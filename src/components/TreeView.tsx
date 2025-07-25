import React from "react";
import { TreeItems } from "@/lib/types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "./ui/sidebar";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface TreeViewProps {
  data: TreeItems[];
  value?: string;
  onSelect: (path: string) => void;
}

const TreeView = ({ data, value, onSelect }: TreeViewProps) => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="w-full">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map((item, index) => (
                  <Tree
                    key={index}
                    item={item}
                    selectedValue={value}
                    onSelect={onSelect}
                    parentPath={""}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};

interface TreeProps {
  item: TreeItems;
  selectedValue?: string | null;
  onSelect: (path: string) => void;
  parentPath?: string;
}

const Tree = ({ item, selectedValue, onSelect, parentPath }: TreeProps) => {
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const currentPath = parentPath ? `${parentPath}/${name}` : name;

  console.log("currentPath", currentPath);

  if (!items.length) {
    const isSelected = selectedValue === currentPath;
    return (
      <SidebarMenuButton
        isActive={isSelected}
        onClick={() => onSelect?.(currentPath)}
        className="data-[active=true]:bg-transparent"
      >
        <FileIcon className="size-4 mr-2" />
        <span className="truncate">{name}</span>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger>
          <SidebarMenuButton>
            <ChevronRightIcon className="transition-transform" />
            <FolderIcon className="size-4 mr-2" />
            <span className="truncate">{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-4">
          {items.map((item, index) => (
            <Tree
              key={index}
              item={item}
              selectedValue={selectedValue}
              onSelect={onSelect}
              parentPath={currentPath}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default TreeView;

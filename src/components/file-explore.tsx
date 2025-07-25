import React from "react";
import { FileIcon, CopyCheck, CopyCheckIcon } from "lucide-react";
import { useState, useMemo, Fragment, useCallback } from "react";
import { Button } from "./ui/button";
import Hint from "./hint";

import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "./ui/resizable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import CodeView from "./code-view";
import TreeView from "./TreeView";
import { convertFilesToTreeItems } from "@/lib/utils";
import { toast } from "sonner";

type FileCollection = {
  [path: string]: string;
};

function getLanguageFromExtension(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension || "text";
}

interface FileExploreProps {
  files: FileCollection;
}

const FileExplore = ({ files }: FileExploreProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const firstFile = Object.keys(files)[0];
    return firstFile.length > 0 ? firstFile : null;
  });

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const fileBreadcrumb = useMemo(() => {
    if (!selectedFile) return [];
    const pathParts = selectedFile.split("/");
    const breadcrumb = pathParts.map((part, index) => {
      const path = pathParts.slice(0, index + 1).join("/");
      return {
        label: part,
        href: path,
      };
    });
    return breadcrumb;
  }, [selectedFile]);

  const handleSelect = useCallback(
    (path: string) => {
      console.log("path", path);
      if (files[path]) {
        setSelectedFile(path);
      }
    },
    [files]
  );

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile]);
    }
    toast.success("Copied to clipboard");
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25} minSize={25} className="bg-sidebar">
        <TreeView
          data={treeData}
          value={selectedFile || ""}
          onSelect={handleSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary  transition-colors " />
      <ResizablePanel defaultSize={75} minSize={50} className="bg-sidebar">
        {selectedFile && files[selectedFile] ? (
          <div className="  h-full w-full flex flex-col ">
            <div className=" border-b py-2 px-4 flex justify-between items-center bg-sidebar gap-x-2 ">
              {/* <Breadcrumb className="flex items-center gap-1">
                {fileBreadcrumb.map((item, index) => (
                  <Fragment key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={item.href} className="text-sm">
                        {item.label}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < fileBreadcrumb.length - 1 && (
                      <BreadcrumbSeparator />
                    )}
                  </Fragment>
                ))}
              </Breadcrumb> */}
              <div></div>
              <Hint text="Copy to clipboard">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  disabled={false}
                  onClick={handleCopy}
                >
                  <CopyCheckIcon className="size-4" />
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto ">
              <CodeView
                code={files[selectedFile]}
                language={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className=" flex h-full items-center justify-center text-muted-foreground ">
            Select a file to view it&apos;s content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default FileExplore;

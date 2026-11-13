"use client";

import React from "react";
import {
  Group,
  Panel as BasePanel,
  Separator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
} from "react-resizable-panels";
import { cn } from "@/lib/utils";

export const PanelGroup: React.FC<GroupProps> = ({
  className,
  orientation = "horizontal",
  ...props
}) => {
  return (
    <Group
      orientation={orientation}
      className={cn(
        "flex w-full h-full",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className
      )}
      {...props}
    />
  );
};

export const Panel: React.FC<PanelProps> = ({ className, ...props }) => {
  return (
    <BasePanel
      className={cn("overflow-hidden flex flex-col", className)}
      {...props}
    />
  );
};

export type { GroupProps as PanelGroupProps, PanelProps };

export interface CustomResizeHandleProps extends SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const ResizeHandle: React.FC<CustomResizeHandleProps> = ({
  orientation = "horizontal",
  className,
  ...props
}) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <Separator
      className={cn(
        "relative flex items-center justify-center transition-colors group focus:outline-none shrink-0",
        isHorizontal
          ? "w-2.5 mx-1 cursor-col-resize hover:bg-slate-300/60 rounded-full"
          : "h-2.5 my-1 cursor-row-resize hover:bg-slate-300/60 rounded-full",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "bg-slate-400 group-hover:bg-slate-900 group-focus:bg-slate-900 transition-colors rounded-full",
          isHorizontal ? "w-1 h-8" : "h-1 w-8"
        )}
      />
    </Separator>
  );
};

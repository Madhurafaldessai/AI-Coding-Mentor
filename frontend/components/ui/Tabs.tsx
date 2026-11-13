"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  size = "md",
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border-2 border-slate-900 shadow-retro-sm",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-150 select-none",
              size === "sm" ? "px-2.5 py-1" : "px-3.5 py-1.5",
              isActive
                ? "bg-[#A5F3FC]/60 text-slate-950 border-2 border-slate-900 shadow-retro-sm"
                : "text-slate-600 hover:text-slate-900 border-2 border-transparent hover:bg-white/50"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};


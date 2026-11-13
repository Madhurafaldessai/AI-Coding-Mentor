"use client";

import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Loader2, CheckCircle2 } from "lucide-react";
import { Lang } from "@mentor/shared";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

export interface RunBarProps {
  language: Lang;
  isRunning: boolean;
  isRuntimeReady: boolean;
  onRun: () => void;
  onReset: () => void;
  className?: string;
}

export const RunBar: React.FC<RunBarProps> = ({
  language,
  isRunning,
  isRuntimeReady,
  onRun,
  onReset,
  className,
}) => {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const platform = window.navigator.platform || window.navigator.userAgent || "";
      setIsMac(/Mac/i.test(platform));
    }
  }, []);

  const shortcutText = isMac ? "Cmd+Enter" : "Ctrl+Enter";

  const renderRuntimeStatus = () => {
    if (language === "python") {
      if (!isRuntimeReady) {
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg text-xs font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
            <span>Initializing Python runtime...</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Python 3.11 Ready</span>
        </div>
      );
    }

    if (language === "javascript") {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>JS Worker Ready</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-300 rounded-lg text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-sky-500" />
        <span>Remote C++ Runner</span>
      </div>
    );
  };

  const isRunDisabled = isRunning || (language === "python" && !isRuntimeReady);

  return (
    <div
      className={cn(
        "w-full bg-white border-2 border-slate-900 rounded-2xl shadow-retro-sm px-3 py-2 sm:p-2.5 flex items-center justify-between select-none shrink-0 gap-2",
        className
      )}
    >
      {/* Left: Reset Button & Runtime Status */}
      <div className="flex items-center gap-2">
        <Tooltip content="Reset code to starter template">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isRunning}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs font-pixel px-2.5 py-1"
          >
            RESET
          </Button>
        </Tooltip>

        <div className="hidden sm:flex items-center">{renderRuntimeStatus()}</div>
      </div>

      {/* Right: Shortcut Hint & Run Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="hidden md:inline text-xs font-mono font-medium text-slate-500">
          Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-slate-700">{shortcutText}</kbd>
        </span>

        <Tooltip
          content={
            !isRuntimeReady && language === "python"
              ? "Waiting for Python runtime to finish loading..."
              : `Run test cases (${shortcutText})`
          }
        >
          <Button
            variant="primary"
            size="md"
            onClick={onRun}
            disabled={isRunDisabled}
            isLoading={isRunning}
            leftIcon={<Play className="w-4 h-4 fill-white" />}
            className="font-pixel font-bold tracking-wider text-xs sm:text-sm px-3.5 sm:px-5 py-1.5 sm:py-2"
          >
            RUN CODE
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

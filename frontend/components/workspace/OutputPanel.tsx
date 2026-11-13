"use client";

import React, { useState } from "react";
import {
  Terminal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { RunResult, Lang, TestCase } from "@mentor/shared";
import { explainError } from "@/lib/errorExplainer";
import { Badge } from "@/components/ui/Badge";
import { formatTime, cn } from "@/lib/utils";

export interface OutputPanelProps {
  result: RunResult | null;
  isRunning: boolean;
  language: Lang;
  testCases: TestCase[];
  className?: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  result,
  isRunning,
  language,
  testCases,
  className,
}) => {
  const [showRawTraceback, setShowRawTraceback] = useState(false);

  // Empty State (before first run)
  if (!result && !isRunning) {
    return (
      <div
        className={cn(
          "h-full flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-900 rounded-2xl shadow-retro text-center select-none",
          className
        )}
      >
        <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-slate-900 flex items-center justify-center mb-3 shadow-retro-sm text-slate-700">
          <Terminal className="w-6 h-6" />
        </div>
        <h3 className="font-pixel font-bold text-base text-slate-900 mb-1">
          Execution Console
        </h3>
        <p className="text-xs text-slate-500 max-w-xs">
          Press <span className="font-bold text-slate-800">RUN CODE</span> or{" "}
          <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[11px] font-mono text-slate-700">
            Cmd/Ctrl+Enter
          </kbd>{" "}
          to test your code against standard test cases.
        </p>
      </div>
    );
  }

  // Running State
  if (isRunning) {
    return (
      <div
        className={cn(
          "h-full flex flex-col items-center justify-center p-6 bg-white border-2 border-slate-900 rounded-2xl shadow-retro text-center select-none",
          className
        )}
      >
        <div className="w-10 h-10 rounded-xl bg-cyan-50 border-2 border-slate-900 flex items-center justify-center mb-3 shadow-retro-sm">
          <Terminal className="w-5 h-5 text-[#0095FF] animate-pulse" />
        </div>
        <p className="font-pixel font-bold text-sm text-slate-900 animate-pulse">
          Executing test suite in sandbox worker...
        </p>
      </div>
    );
  }

  // Completed Run Result
  const isAllPassed = result ? result.passed === result.total && result.total > 0 : false;
  const friendlyDiagnosis = result?.stderr ? explainError(result.stderr, language) : null;

  return (
    <div
      className={cn(
        "h-full flex flex-col bg-white border-2 border-slate-900 rounded-2xl shadow-retro overflow-hidden",
        className
      )}
    >
      {/* Header Summary */}
      <div className="px-4 py-2.5 border-b-2 border-slate-900 bg-slate-50 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-700" />
          <span className="font-pixel font-bold text-xs uppercase tracking-wider text-slate-900">
            TEST RESULTS
          </span>
        </div>

        <div className="flex items-center gap-2">
          {result && (
            <>
              <Badge variant={isAllPassed ? "green" : "rose"} size="sm">
                {result.passed}/{result.total} PASSED
              </Badge>
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{formatTime(result.runtimeMs)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        {/* Friendly Error Diagnosis Alert */}
        {friendlyDiagnosis && (
          <div className="p-3.5 bg-amber-50/80 border-2 border-amber-400 rounded-xl space-y-1.5 shadow-retro-sm">
            <div className="flex items-center gap-2 text-amber-900 font-sans font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{friendlyDiagnosis.title}</span>
            </div>
            <p className="text-slate-700 font-sans text-xs leading-relaxed">
              {friendlyDiagnosis.explanation}
            </p>
            <div className="pt-1 text-[11px] font-sans font-semibold text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Suggestion: {friendlyDiagnosis.suggestion}</span>
            </div>
          </div>
        )}

        {/* Test Case Breakdown */}
        {result && (
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-slate-700 text-xs select-none">
              Test Cases:
            </h4>
            {testCases.map((tc, idx) => {
              const isTestCasePassed = idx < result.passed;
              return (
                <div
                  key={idx}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-colors",
                    isTestCasePassed
                      ? "bg-emerald-50/50 border-emerald-300"
                      : "bg-rose-50/50 border-rose-300"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5 font-sans font-bold">
                    <span className="flex items-center gap-1.5 text-slate-900">
                      {isTestCasePassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                      Test Case #{idx + 1}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border",
                        isTestCasePassed
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-rose-100 text-rose-800 border-rose-300"
                      )}
                    >
                      {isTestCasePassed ? "Passed" : "Failed"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-500 font-sans font-semibold">Input: </span>
                      <span className="text-slate-800 font-mono">{tc.input}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-sans font-semibold">Expected: </span>
                      <span className="text-slate-800 font-mono">{tc.expected}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stdout Output if any */}
        {result?.stdout && (
          <div className="p-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 font-mono text-xs">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 select-none">
              Console Output (stdout):
            </div>
            <pre className="whitespace-pre-wrap">{result.stdout}</pre>
          </div>
        )}

        {/* Expandable Raw Traceback / Stderr Accordion */}
        {result?.stderr && (
          <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
            <button
              type="button"
              onClick={() => setShowRawTraceback(!showRawTraceback)}
              className="w-full px-3 py-2 text-left font-sans font-bold text-xs text-slate-700 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Raw Traceback &amp; Stderr</span>
              {showRawTraceback ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {showRawTraceback && (
              <pre className="p-3 bg-slate-900 text-rose-300 text-[11px] overflow-x-auto whitespace-pre-wrap border-t border-slate-300 font-mono">
                {result.stderr}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


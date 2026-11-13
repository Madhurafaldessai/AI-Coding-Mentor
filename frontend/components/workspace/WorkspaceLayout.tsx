"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Challenge } from "@/lib/challenges";
import { Lang, RunResult } from "@mentor/shared";
import { runnerService } from "@/lib/runner";
import { sessionStore } from "@/lib/session";
import { WorkspaceNav } from "./WorkspaceNav";
import { ProblemPanel } from "./ProblemPanel";
import { CodeEditor } from "./CodeEditor";
import { RunBar } from "./RunBar";
import { OutputPanel } from "./OutputPanel";
import { MentorShell } from "./MentorShell";
import { SuccessModal } from "./SuccessModal";
import { ResetConfirmModal } from "./ResetConfirmModal";
import { PanelGroup, Panel, ResizeHandle } from "@/components/ui/ResizablePanels";
import { Tabs } from "@/components/ui/Tabs";
import { BookOpen, Code, Terminal, Sparkles, X, ChevronUp } from "lucide-react";

export interface WorkspaceLayoutProps {
  challenge: Challenge;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({ challenge }) => {
  // Active Language State (initialized from user session if set)
  const [language, setLanguage] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const sess = sessionStore.getSession();
      if (sess?.selectedLanguage) return sess.selectedLanguage;
    }
    return "python";
  });

  // Per-language code draft states
  const [codeDrafts, setCodeDrafts] = useState<Record<Lang, string>>(() => {
    const defaults: Record<Lang, string> = {
      python: challenge.starterCode.python,
      javascript: challenge.starterCode.javascript,
      cpp: challenge.starterCode.cpp,
    };
    if (typeof window !== "undefined") {
      (["python", "javascript", "cpp"] as Lang[]).forEach((l) => {
        const saved = localStorage.getItem(`draft_${challenge.id}_${l}`);
        if (saved) defaults[l] = saved;
      });
    }
    return defaults;
  });

  const currentCode = codeDrafts[language] || challenge.starterCode[language];

  // Execution & Status States
  const [isRunning, setIsRunning] = useState(false);
  const [isPythonReady, setIsPythonReady] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [failedRunsCount, setFailedRunsCount] = useState(0);

  // Panel Collapse States
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false);
  const [isMentorCollapsed, setIsMentorCollapsed] = useState(false);

  // Mobile Navigation States
  const [activeMobileTab, setActiveMobileTab] = useState<"problem" | "code" | "output">("code");
  const [isMobileMentorOpen, setIsMobileMentorOpen] = useState(false);

  // Modals
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Track Python worker readiness
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync worker state after hydration.
    setIsPythonReady(runnerService.isPythonReady());
    const unsubscribe = runnerService.onPythonReady(() => {
      setIsPythonReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Handle Code Changes and Save Draft to localStorage
  const handleCodeChange = (newCode: string) => {
    setCodeDrafts((prev) => ({
      ...prev,
      [language]: newCode,
    }));
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`draft_${challenge.id}_${language}`, newCode);
      } catch (err) {
        console.warn("Failed to persist draft to localStorage", err);
      }
    }
  };

  // Language Switching Handler
  const handleLanguageChange = (newLang: Lang) => {
    setLanguage(newLang);
    sessionStore.saveSession({ selectedLanguage: newLang });
    setRunResult(null); // Clear previous output on language change
  };

  // Reset to original starter code
  const handleConfirmReset = () => {
    const defaultCode = challenge.starterCode[language];
    handleCodeChange(defaultCode);
    setRunResult(null);
  };

  // Run Code Execution Handler
  const handleRunCode = useCallback(async () => {
    if (isRunning) return;
    if (language === "python" && !isPythonReady) return;

    setIsRunning(true);
    // On mobile, auto-switch to output tab so student sees tests running
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setActiveMobileTab("output");
    }

    try {
      const result = await runnerService.runCode(language, currentCode, challenge.testCases);
      setRunResult(result);

      if (result.passed === result.total && result.total > 0) {
        setFailedRunsCount(0);
        setIsSuccessModalOpen(true);
      } else {
        setFailedRunsCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Runner execution failed", err);
      setFailedRunsCount((prev) => prev + 1);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, language, isPythonReady, currentCode, challenge]);

  // Global Keyboard Shortcut: Cmd/Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRunCode]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900 select-none overflow-hidden">
      {/* Top Navbar */}
      <WorkspaceNav
        language={language}
        onLanguageChange={handleLanguageChange}
        streak={3}
        totalXp={400}
      />

      {/* Mobile Tab Switcher (< 1024px) */}
      <div className="lg:hidden px-2.5 py-1.5 bg-white border-b-2 border-slate-900 flex items-center justify-between gap-1 shrink-0">
        <Tabs
          tabs={[
            { id: "problem", label: "Spec", icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: "code", label: "Editor", icon: <Code className="w-3.5 h-3.5" /> },
            { id: "output", label: "Output", icon: <Terminal className="w-3.5 h-3.5" /> },
          ]}
          activeTab={activeMobileTab}
          onChange={(tab) => setActiveMobileTab(tab as "problem" | "code" | "output")}
          size="sm"
        />

        {/* Floating Mobile Mentor Button */}
        <button
          type="button"
          onClick={() => setIsMobileMentorOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-[#C084FC]/30 text-purple-900 border-2 border-slate-900 rounded-xl font-pixel text-xs font-bold shadow-retro-sm retro-press shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-700" />
          <span>MENTOR</span>
        </button>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 p-2.5 sm:p-3 overflow-hidden relative">
        {/* ========================================================================= */}
        {/* DESKTOP VIEW (>= 1024px): 3 Resizable Column Panels */}
        {/* ========================================================================= */}
        <div className="hidden lg:block h-[calc(100vh-68px)]">
          <PanelGroup
            orientation="horizontal"
            defaultLayout={{ problem: 28, center: 44, mentor: 28 }}
          >
            {/* 1. LEFT PANEL: Problem Specification */}
            <Panel
              id="problem"
              defaultSize="28%"
              minSize="18%"
              maxSize="45%"
              className="h-full w-full"
            >
              <ProblemPanel
                challenge={challenge}
                isCollapsed={isProblemCollapsed}
                onToggleCollapse={() => setIsProblemCollapsed(!isProblemCollapsed)}
              />
            </Panel>

            <ResizeHandle orientation="horizontal" />

            {/* 2. CENTER PANEL: Code Editor & Output (Vertical Split) */}
            <Panel id="center" defaultSize="44%" minSize="30%" className="h-full w-full">
              <PanelGroup
                orientation="vertical"
                defaultLayout={{ editor: 58, output: 42 }}
              >
                {/* Editor on Top */}
                <Panel id="editor" defaultSize="58%" minSize="25%" className="h-full w-full pb-1 flex flex-col">
                  <CodeEditor
                    language={language}
                    value={currentCode}
                    onChange={handleCodeChange}
                    onRun={handleRunCode}
                    className="flex-1"
                  />
                </Panel>

                <ResizeHandle orientation="vertical" />

                {/* Run Bar + Output Panel Below */}
                <Panel id="output" defaultSize="42%" minSize="20%" className="h-full w-full pt-1 flex flex-col gap-2">
                  <RunBar
                    language={language}
                    isRunning={isRunning}
                    isRuntimeReady={isPythonReady}
                    onRun={handleRunCode}
                    onReset={() => setIsResetModalOpen(true)}
                  />
                  <div className="flex-1 overflow-hidden">
                    <OutputPanel
                      result={runResult}
                      isRunning={isRunning}
                      language={language}
                      testCases={challenge.testCases}
                    />
                  </div>
                </Panel>
              </PanelGroup>
            </Panel>

            <ResizeHandle orientation="horizontal" />

            {/* 3. RIGHT PANEL: AI Mentor Shell */}
            <Panel
              id="mentor"
              defaultSize="28%"
              minSize="18%"
              maxSize="45%"
              className="h-full w-full"
            >
              <MentorShell
                failedRunsCount={failedRunsCount}
                isCollapsed={isMentorCollapsed}
                onToggleCollapse={() => setIsMentorCollapsed(!isMentorCollapsed)}
              />
            </Panel>
          </PanelGroup>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE / TABLET VIEW (< 1024px): Tabbed Views + Bottom Sheet Drawer */}
        {/* ========================================================================= */}
        <div className="lg:hidden h-[calc(100vh-125px)] flex flex-col">
          {activeMobileTab === "problem" && (
            <div className="flex-1 overflow-hidden">
              <ProblemPanel challenge={challenge} />
            </div>
          )}

          {activeMobileTab === "code" && (
            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  language={language}
                  value={currentCode}
                  onChange={handleCodeChange}
                  onRun={handleRunCode}
                />
              </div>
              <RunBar
                language={language}
                isRunning={isRunning}
                isRuntimeReady={isPythonReady}
                onRun={handleRunCode}
                onReset={() => setIsResetModalOpen(true)}
              />
            </div>
          )}

          {activeMobileTab === "output" && (
            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
              <RunBar
                language={language}
                isRunning={isRunning}
                isRuntimeReady={isPythonReady}
                onRun={handleRunCode}
                onReset={() => setIsResetModalOpen(true)}
              />
              <div className="flex-1 overflow-hidden">
                <OutputPanel
                  result={runResult}
                  isRunning={isRunning}
                  language={language}
                  testCases={challenge.testCases}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Mentor Bottom Sheet Drawer */}
        {isMobileMentorOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div
              className="fixed inset-0 bg-slate-950/70"
              onClick={() => setIsMobileMentorOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-10 w-full max-h-[85vh] h-[520px] bg-white rounded-t-3xl border-t-2 border-x-2 border-slate-900 shadow-retro-lg flex flex-col animate-slideUp">
              <div className="p-3 border-b-2 border-slate-900 flex items-center justify-between bg-purple-50 rounded-t-3xl">
                <span className="font-pixel font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  AI MENTOR GUIDE
                </span>
                <button
                  onClick={() => setIsMobileMentorOpen(false)}
                  className="p-1 rounded-lg border-2 border-slate-900 bg-white text-slate-700"
                  aria-label="Close mentor sheet"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <MentorShell failedRunsCount={failedRunsCount} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        challengeId={challenge.id}
        code={currentCode}
        passedCount={runResult?.passed || challenge.testCases.length}
        totalCount={challenge.testCases.length}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
};

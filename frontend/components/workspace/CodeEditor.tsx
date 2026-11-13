"use client";

import React, { useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Lang } from "@mentor/shared";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export interface CodeEditorProps {
  language: Lang;
  value: string;
  onChange: (val: string) => void;
  onRun?: () => void;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  onRun,
  className,
}) => {
  const onRunRef = useRef(onRun);
  useEffect(() => {
    onRunRef.current = onRun;
  }, [onRun]);

  const monacoLangMap: Record<Lang, string> = {
    python: "python",
    javascript: "javascript",
    cpp: "cpp",
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Register Cmd+Enter / Ctrl+Enter run shortcut directly in Monaco
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunRef.current?.();
    });
  };

  return (
    <div
      className={cn(
        "h-full w-full bg-[#1e1e1e] border-2 border-slate-900 rounded-2xl shadow-retro overflow-hidden relative",
        className
      )}
    >
      <Editor
        height="100%"
        language={monacoLangMap[language]}
        value={value}
        onChange={(val) => onChange(val || "")}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontLigatures: false,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          lineNumbersMinChars: 3,
          wordWrap: "on",
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "all",
          tabSize: language === "python" ? 4 : 2,
        }}
        loading={
          <div className="w-full h-full p-4 flex flex-col gap-2 bg-[#1e1e1e]">
            <Skeleton className="w-1/3 h-5 bg-slate-800 border-slate-700" />
            <Skeleton className="w-2/3 h-4 bg-slate-800 border-slate-700" />
            <Skeleton className="w-1/2 h-4 bg-slate-800 border-slate-700" />
            <Skeleton className="w-3/4 h-4 bg-slate-800 border-slate-700" />
          </div>
        }
      />
    </div>
  );
};


"use client";

import { Wrench } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface ToolCallDisplayProps {
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
  state: "call" | "result" | "partial-call";
}

const toolLabels: Record<string, string> = {
  analyzeText: "テキスト分析",
  searchWeb: "Web検索",
  getCurrentDateTime: "日時取得",
};

export function ToolCallDisplay({
  toolName,
  args,
  result,
  state,
}: ToolCallDisplayProps) {
  const label = toolLabels[toolName] ?? toolName;
  const isComplete = state === "result";

  return (
    <Collapsible
      className="my-2"
      title={
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-blue-500" />
          <span className="text-sm">{label}</span>
          <Badge variant={isComplete ? "success" : "warning"}>
            {isComplete ? "完了" : "実行中..."}
          </Badge>
        </div>
      }
    >
      <div className="space-y-3 text-xs">
        <div>
          <p className="font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
            入力:
          </p>
          <pre className="rounded-md bg-zinc-100 dark:bg-zinc-800 p-2 overflow-x-auto whitespace-pre-wrap break-all">
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>
        {result !== undefined && (
          <div>
            <p className="font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
              結果:
            </p>
            <pre className="rounded-md bg-zinc-100 dark:bg-zinc-800 p-2 overflow-x-auto whitespace-pre-wrap break-all">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Collapsible>
  );
}

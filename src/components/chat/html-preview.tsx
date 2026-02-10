"use client";

import { Play, Code } from "lucide-react";
import { usePreview } from "@/components/preview/preview-context";

interface CodeBlockCardProps {
  code: string;
  language: string;
}

export function CodeBlockCard({ code, language }: CodeBlockCardProps) {
  const { openPreview } = usePreview();
  const isHtml = language === "html";

  if (isHtml) {
    return (
      <div
        className="group my-3 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden cursor-pointer transition-all hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10"
        onClick={() => openPreview(code, language)}
      >
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm group-hover:scale-105 transition-transform">
            <Play className="h-4 w-4 ml-0.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              HTMLプレビュー
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              クリックしてプレビューを表示
            </div>
          </div>
          <div className="text-xs text-zinc-400 dark:text-zinc-500">
            {code.split("\n").length} 行
          </div>
        </div>
      </div>
    );
  }

  // Non-HTML code blocks: compact card with code preview
  const lines = code.split("\n");
  const previewLines = lines.slice(0, 5).join("\n");
  const hasMore = lines.length > 5;

  return (
    <div
      className="group my-2 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden cursor-pointer transition-colors hover:border-zinc-400 dark:hover:border-zinc-500"
      onClick={() => openPreview(code, language)}
    >
      <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 border-b border-zinc-200 dark:border-zinc-700">
        <Code className="h-3 w-3 text-zinc-400" />
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mr-auto">
          {language || "code"}
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {lines.length} 行
        </span>
      </div>
      <pre className="px-3 py-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 bg-zinc-100/50 dark:bg-zinc-900/50 overflow-hidden">
        <code>
          {previewLines}
          {hasMore && (
            <span className="text-zinc-400 dark:text-zinc-600">
              {"\n..."}
            </span>
          )}
        </code>
      </pre>
    </div>
  );
}

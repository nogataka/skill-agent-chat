"use client";

import { useState, useEffect, useCallback, useId } from "react";
import { Code, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface HtmlPreviewProps {
  code: string;
}

export function HtmlPreview({ code }: HtmlPreviewProps) {
  const [tab, setTab] = useState<"code" | "preview">("preview");
  const [iframeHeight, setIframeHeight] = useState(200);
  const frameId = useId();

  // Build the full HTML document for srcdoc
  const srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body { margin: 8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }</style>
</head>
<body>
${code}
<script>
function reportHeight() {
  var h = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: "html-preview-resize", id: ${JSON.stringify(frameId)}, height: h }, "*");
}
new ResizeObserver(reportHeight).observe(document.body);
reportHeight();
<\/script>
</body>
</html>`;

  const handleMessage = useCallback(
    (e: MessageEvent) => {
      if (
        e.data?.type === "html-preview-resize" &&
        e.data?.id === frameId
      ) {
        setIframeHeight(Math.min(Math.max(e.data.height, 100), 600));
      }
    },
    [frameId]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden my-2">
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-1 border-b border-zinc-200 dark:border-zinc-700">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mr-auto">
          HTML
        </span>
        <button
          type="button"
          onClick={() => setTab("code")}
          className={cn(
            "flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
            tab === "code"
              ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <Code className="h-3 w-3" />
          コード
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={cn(
            "flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
            tab === "preview"
              ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <Eye className="h-3 w-3" />
          プレビュー
        </button>
      </div>

      {/* Content */}
      {tab === "code" ? (
        <pre className="overflow-x-auto p-3 text-xs leading-relaxed bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 m-0 rounded-none">
          <code>{code}</code>
        </pre>
      ) : (
        <div className="bg-white">
          <iframe
            srcDoc={srcdoc}
            sandbox="allow-scripts"
            title="HTML Preview"
            className="w-full border-0"
            style={{ height: iframeHeight }}
          />
        </div>
      )}
    </div>
  );
}

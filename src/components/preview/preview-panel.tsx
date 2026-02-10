"use client";

import { useState, useEffect, useCallback, useId } from "react";
import { X, Code, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePreview } from "./preview-context";

export function PreviewPanel() {
  const { preview, closePreview } = usePreview();
  const [tab, setTab] = useState<"code" | "preview">("preview");
  const [iframeHeight, setIframeHeight] = useState(0);
  const frameId = useId();

  const isHtml = preview?.language === "html";

  // Reset tab when preview changes
  useEffect(() => {
    if (preview) {
      setTab(isHtml ? "preview" : "code");
      setIframeHeight(0);
    }
  }, [preview, isHtml]);

  const srcdoc =
    isHtml && preview
      ? `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body { margin: 8px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }</style>
</head>
<body>
${preview.code}
<script>
function reportHeight() {
  var h = document.documentElement.scrollHeight;
  window.parent.postMessage({ type: "panel-resize", id: ${JSON.stringify(frameId)}, height: h }, "*");
}
new ResizeObserver(reportHeight).observe(document.body);
reportHeight();
<\/script>
</body>
</html>`
      : "";

  const handleMessage = useCallback(
    (e: MessageEvent) => {
      if (e.data?.type === "panel-resize" && e.data?.id === frameId) {
        setIframeHeight(Math.max(e.data.height, 200));
      }
    },
    [frameId]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  if (!preview) return null;

  return (
    <div className="hidden md:flex h-full w-[50%] max-w-[720px] shrink-0 flex-col border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mr-auto">
          {preview.language || "code"}
        </span>
        {isHtml && (
          <>
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
          </>
        )}
        <button
          type="button"
          onClick={closePreview}
          className="ml-2 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {tab === "code" ? (
          <pre className="p-4 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap break-words">
            <code>{preview.code}</code>
          </pre>
        ) : (
          <iframe
            srcDoc={srcdoc}
            sandbox="allow-scripts"
            title="HTML Preview"
            className="w-full border-0"
            style={{ height: iframeHeight || "100%" }}
          />
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolCallDisplay } from "./tool-call-display";
import { CodeBlockCard } from "./html-preview";
import ReactMarkdown, { type Components } from "react-markdown";
import type { UIMessage } from "ai";

interface MessageBubbleProps {
  message: UIMessage;
}

function isToolPart(
  part: UIMessage["parts"][number]
): part is UIMessage["parts"][number] & {
  type: string;
  toolName: string;
  toolCallId: string;
  state: string;
  input?: unknown;
  output?: unknown;
} {
  return (
    part.type.startsWith("tool-") ||
    part.type === "dynamic-tool"
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  // Define inside component so CodeBlockCard can access PreviewContext
  const markdownComponents: Components = useMemo(
    () => ({
      pre({ children }) {
        if (
          children &&
          typeof children === "object" &&
          "props" in (children as React.ReactElement)
        ) {
          const codeEl = children as React.ReactElement<{
            className?: string;
            children?: string;
          }>;
          const className = codeEl.props.className ?? "";
          const lang = className.replace("language-", "");
          const code =
            typeof codeEl.props.children === "string"
              ? codeEl.props.children
              : "";

          if (code.trim()) {
            return <CodeBlockCard code={code} language={lang} />;
          }
        }
        return <pre>{children}</pre>;
      },
    }),
    []
  );

  return (
    <div
      className={cn(
        "flex gap-3 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div
        className={cn(
          "space-y-2",
          isUser ? "max-w-[80%] order-first" : "w-full max-w-[80%]"
        )}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text" && part.text.trim()) {
            return (
              <div
                key={i}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  isUser
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                )}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:my-2 prose-headings:my-2">
                  <ReactMarkdown components={markdownComponents}>{part.text}</ReactMarkdown>
                </div>
              </div>
            );
          }

          if (isToolPart(part)) {
            const toolPart = part as {
              type: string;
              toolCallId: string;
              state: string;
              input?: Record<string, unknown>;
              output?: unknown;
            };
            const toolName = toolPart.type.startsWith("tool-")
              ? toolPart.type.slice(5)
              : (toolPart as { toolName?: string }).toolName ?? toolPart.type;

            const isComplete =
              toolPart.state === "output-available" ||
              toolPart.state === "result";

            return (
              <ToolCallDisplay
                key={i}
                toolName={toolName}
                args={toolPart.input ?? {}}
                result={isComplete ? toolPart.output : undefined}
                state={isComplete ? "result" : "call"}
              />
            );
          }

          return null;
        })}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

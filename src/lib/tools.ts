import { tool } from "ai";
import { z } from "zod";

export const demoTools = {
  analyzeText: tool({
    description:
      "テキストを分析し、文字数・単語数・段落数・文の数などの統計情報を返します。",
    inputSchema: z.object({
      text: z.string().describe("分析対象のテキスト"),
    }),
    execute: async ({ text }) => {
      const charCount = text.length;
      const paragraphs = text
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0);
      const sentences = text
        .split(/[。！？.!?]+/)
        .filter((s) => s.trim().length > 0);
      const lines = text.split("\n").filter((l) => l.trim().length > 0);

      return {
        charCount,
        paragraphCount: paragraphs.length,
        sentenceCount: sentences.length,
        lineCount: lines.length,
        charCountNoSpaces: text.replace(/\s/g, "").length,
      };
    },
  }),

  searchWeb: tool({
    description:
      "キーワードでWeb検索を実行します（デモ用モックデータを返します）。",
    inputSchema: z.object({
      query: z.string().describe("検索クエリ"),
    }),
    execute: async ({ query }) => {
      // デモ用のモック検索結果
      return {
        query,
        results: [
          {
            title: `「${query}」に関する最新記事`,
            url: "https://example.com/article-1",
            snippet: `${query}について詳しく解説した記事です。最新のトレンドや技術動向をカバーしています。`,
          },
          {
            title: `${query} - 入門ガイド`,
            url: "https://example.com/guide",
            snippet: `初心者向けの${query}入門ガイド。基本概念から実践的な使い方まで幅広く紹介。`,
          },
          {
            title: `${query}のベストプラクティス`,
            url: "https://example.com/best-practices",
            snippet: `${query}を効果的に活用するためのベストプラクティス集。`,
          },
        ],
        note: "これはデモ用のモックデータです。実際のWeb検索結果ではありません。",
      };
    },
  }),

  getCurrentDateTime: tool({
    description: "現在の日時を取得します。",
    inputSchema: z.object({}),
    execute: async () => {
      const now = new Date();
      return {
        iso: now.toISOString(),
        formatted: now.toLocaleString("ja-JP", {
          timeZone: "Asia/Tokyo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        timezone: "Asia/Tokyo",
      };
    },
  }),
};

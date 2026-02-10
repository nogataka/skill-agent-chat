import { db } from "./index";
import { conversations, messages } from "./schema";
import { eq, desc } from "drizzle-orm";
import type { UIMessage } from "ai";

export function createConversation(
  id: string,
  skillId: string,
  title: string
) {
  const now = new Date().toISOString();
  return db
    .insert(conversations)
    .values({ id, skillId, title, createdAt: now, updatedAt: now })
    .returning()
    .get();
}

export function listConversations() {
  return db
    .select()
    .from(conversations)
    .orderBy(desc(conversations.updatedAt))
    .limit(50)
    .all();
}

export function updateConversationTitle(id: string, title: string) {
  return db
    .update(conversations)
    .set({ title, updatedAt: new Date().toISOString() })
    .where(eq(conversations.id, id))
    .returning()
    .get();
}

export function deleteConversation(id: string) {
  return db
    .delete(conversations)
    .where(eq(conversations.id, id))
    .returning()
    .get();
}

export function saveMessages(
  conversationId: string,
  uiMessages: UIMessage[]
) {
  // Delete existing messages then reinsert (idempotent)
  db.delete(messages)
    .where(eq(messages.conversationId, conversationId))
    .run();

  if (uiMessages.length === 0) return;

  const rows = uiMessages.map((msg, idx) => ({
    id: msg.id,
    conversationId,
    role: msg.role,
    content: extractTextContent(msg.parts),
    parts: msg.parts as unknown,
    sortOrder: idx,
    createdAt: new Date().toISOString(),
  }));

  db.insert(messages).values(rows).run();

  // Update conversation's updatedAt
  db.update(conversations)
    .set({ updatedAt: new Date().toISOString() })
    .where(eq(conversations.id, conversationId))
    .run();
}

export function loadMessages(conversationId: string): UIMessage[] {
  const rows = db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.sortOrder)
    .all();

  return rows.map((row) => ({
    id: row.id,
    role: row.role as UIMessage["role"],
    parts: (row.parts ?? [{ type: "text", text: row.content }]) as UIMessage["parts"],
  }));
}

export function extractTextContent(
  parts: UIMessage["parts"] | undefined
): string {
  if (!parts) return "";
  return parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("\n");
}

import { NextRequest, NextResponse } from "next/server";
import {
  createConversation,
  listConversations,
} from "@/lib/db/conversations";

export async function GET() {
  const list = listConversations();
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, skillId, title } = body;
  if (!skillId || !title) {
    return NextResponse.json(
      { error: "skillId and title are required" },
      { status: 400 }
    );
  }
  const conversationId = id ?? crypto.randomUUID();
  const conversation = createConversation(conversationId, skillId, title);
  return NextResponse.json(conversation, { status: 201 });
}

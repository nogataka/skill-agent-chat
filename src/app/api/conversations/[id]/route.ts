import { NextRequest, NextResponse } from "next/server";
import {
  updateConversationTitle,
  deleteConversation,
} from "@/lib/db/conversations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title } = body;
  if (!title) {
    return NextResponse.json(
      { error: "title is required" },
      { status: 400 }
    );
  }
  const updated = updateConversationTitle(id, title);
  if (!updated) {
    return NextResponse.json(
      { error: "conversation not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteConversation(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "conversation not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true });
}

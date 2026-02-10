import { NextRequest, NextResponse } from "next/server";
import { saveMessages, loadMessages } from "@/lib/db/conversations";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const msgs = loadMessages(id);
  return NextResponse.json(msgs);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { messages } = body;
  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: "messages array is required" },
      { status: 400 }
    );
  }
  saveMessages(id, messages);
  return NextResponse.json({ success: true });
}

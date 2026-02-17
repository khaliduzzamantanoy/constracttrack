import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const sessions = await Session.find({ userId: "admin" }).sort({ lastActive: -1 });
  
  return NextResponse.json({ 
    sessions,
    currentSessionId: session.sessionId
  });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  await dbConnect();
  await Session.deleteOne({ sessionId, userId: "admin" });

  return NextResponse.json({ success: true });
}

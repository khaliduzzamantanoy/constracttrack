import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SystemConfig from "@/models/SystemConfig";
import Session from "@/models/Session";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await dbConnect();
  
  const { pin } = await req.json();

  if (!pin) {
    return NextResponse.json({ error: "PIN is required" }, { status: 400 });
  }

  const config = await SystemConfig.findOne({ key: "admin_pin" });
  if (!config) {
    return NextResponse.json({ error: "Auth system not initialized" }, { status: 400 });
  }

  const isMatch = await bcrypt.compare(pin, config.value);

  if (!isMatch) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  // Create session tracking in DB
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const userAgent = req.headers.get("user-agent") || "Unknown";
  const ip = req.headers.get("x-forwarded-for") || "Local";
  
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await Session.create({
    sessionId,
    userId: "admin",
    userAgent,
    ip,
    expiresAt: expires
  });

  // Create JWT with sessionId
  const sessionToken = await encrypt({ userId: "admin", sessionId, expires });

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "session",
    value: sessionToken,
    httpOnly: true,
    expires: expires,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "session",
    value: "",
    expires: new Date(0),
    path: "/",
  });
  return response;
}

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SystemConfig from "@/models/SystemConfig";
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

  // Create session
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId: "admin", expires });

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: "session",
    value: session,
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

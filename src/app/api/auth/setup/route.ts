import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SystemConfig from "@/models/SystemConfig";
import bcrypt from "bcryptjs";
import { encrypt, getSession } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const config = await SystemConfig.findOne({ key: "admin_pin" });
  return NextResponse.json({ setupRequired: !config });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  
  // Check if PIN already exists
  const existingConfig = await SystemConfig.findOne({ key: "admin_pin" });
  if (existingConfig) {
    return NextResponse.json({ error: "Setup already completed" }, { status: 400 });
  }

  const { pin } = await req.json();

  if (!pin || pin.length !== 6) {
    return NextResponse.json({ error: "PIN must be 6 digits" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(pin, 10);

  await SystemConfig.create({
    key: "admin_pin",
    value: hashedPassword
  });

  // Log in immediately after setup (create session)
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

export async function PATCH(req: NextRequest) {
  // The `getSession` function is not defined in the provided context.
  // Assuming it's an external utility that needs to be imported or defined.
  // For the purpose of this edit, we'll assume it exists and is imported.
  // If it's not, this line would cause a runtime error.
  // import { getSession } from "@/lib/auth"; // Example import if it exists
  const session = await getSession(); 
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { pin } = await req.json();

  if (!pin || pin.length !== 6) {
    return NextResponse.json({ error: "PIN must be 6 digits" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(pin, 10);

  await SystemConfig.findOneAndUpdate(
    { key: "admin_pin" },
    { value: hashedPassword },
    { upsert: true }
  );

  return NextResponse.json({ success: true, message: "PIN updated successfully" });
}

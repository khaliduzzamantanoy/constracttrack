import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SystemConfig from "@/models/SystemConfig";
import { getSession } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const projectConfig = await SystemConfig.findOne({ key: "project_name" });
  return NextResponse.json({ 
    projectName: projectConfig?.value || "PROJECT: INFRASTRUCTURE DEVELOPMENT - SITE A1" 
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const { projectName } = await req.json();

  if (!projectName) {
    return NextResponse.json({ error: "Project name is required" }, { status: 400 });
  }

  await SystemConfig.findOneAndUpdate(
    { key: "project_name" },
    { value: projectName },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, projectName });
}

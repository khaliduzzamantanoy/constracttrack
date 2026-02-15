import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ConstructionLog from "@/models/Log";
import Stock from "@/models/Stock";
import { getSession } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    // Erase all logs and stock
    await ConstructionLog.deleteMany({});
    await Stock.updateMany({}, { $set: { quantity: 0 } });
    
    return NextResponse.json({ success: true, message: "Database wiped successfully" });
  } catch (error: any) {
    console.error("Reset failed:", error);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}

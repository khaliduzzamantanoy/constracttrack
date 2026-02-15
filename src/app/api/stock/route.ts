import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Stock from '@/models/Stock';

export async function GET() {
  await dbConnect();
  try {
    const stocks = await Stock.find({});
    return NextResponse.json(stocks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  await dbConnect();
  try {
    const { materialId, quantity } = await request.json();
    
    if (!materialId || quantity === undefined) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Upsert: Create if not exists, otherwise increment
    const stock = await Stock.findOneAndUpdate(
      { materialId },
      { $inc: { quantity: quantity }, lastUpdated: new Date() },
      { new: true, upsert: true } // Upsert ensures initial stock creation
    );

    return NextResponse.json(stock);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}

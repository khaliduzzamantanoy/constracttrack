import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Stock from '@/models/Stock';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const stocks = await Stock.find({});
    return NextResponse.json(stocks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

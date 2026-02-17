import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Log from '@/models/Log';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await dbConnect();
  try {
    const logs = await Log.find({}).sort({ timestamp: -1 });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

import Stock from '@/models/Stock';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const body = await request.json();
    const newLog = await Log.create(body);

    // Deduct from Stock
    const updates = [];
    if (body.cement > 0) updates.push(Stock.findOneAndUpdate({ materialId: 'cement' }, { $inc: { quantity: -body.cement } }));
    if (body.sand_fine > 0) updates.push(Stock.findOneAndUpdate({ materialId: 'sand_fine' }, { $inc: { quantity: -body.sand_fine } }));
    if (body.sand_selection > 0) updates.push(Stock.findOneAndUpdate({ materialId: 'sand_selection' }, { $inc: { quantity: -body.sand_selection } }));
    if (body.brick_chips > 0) updates.push(Stock.findOneAndUpdate({ materialId: 'brick_chips' }, { $inc: { quantity: -body.brick_chips } }));
    
    await Promise.all(updates);

    return NextResponse.json(newLog, { status: 201 });
  } catch (error: any) {
    console.error('Error creating log:', error);
    return NextResponse.json({ error: error.message || 'Failed to create log' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, ...data } = await request.json();
  await dbConnect();
  try {
    if (!id) throw new Error('Log ID is required');
    const updatedLog = await Log.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updatedLog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update log' }, { status: 400 });
  }
}



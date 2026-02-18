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
    
    // Get old log for stock adjustment
    const oldLog = await Log.findById(id);
    if (!oldLog) throw new Error('Log not found');

    const updatedLog = await Log.findByIdAndUpdate(id, data, { new: true });

    // Adjust Stock based on difference
    const updates: any[] = [];
    const adjustStock = (key: string) => {
      const diff = (data[key] || 0) - (oldLog[key] || 0);
      if (diff !== 0) {
        updates.push(Stock.findOneAndUpdate({ materialId: key }, { $inc: { quantity: -diff } }));
      }
    };

    ['cement', 'sand_fine', 'sand_selection', 'brick_chips'].forEach(adjustStock);
    if (updates.length > 0) await Promise.all(updates);

    return NextResponse.json(updatedLog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update log' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  await dbConnect();
  try {
    if (!id) throw new Error('Log ID is required');
    
    const log = await Log.findById(id);
    if (!log) throw new Error('Log not found');

    // Replenish Stock
    const updates: any[] = [];
    if (log.cement > 0) updates.push(Stock.findOneAndUpdate({ materialId: 'cement' }, { $inc: { quantity: log.cement } }));
    if (log.sand_fine > 0) updates.push(Stock.findOneAndUpdate({ materialId: 'sand_fine' }, { $inc: { quantity: log.sand_fine } }));
    if (log.sand_selection > 0) updates.push(Stock.findOneAndUpdate({ materialId: 'sand_selection' }, { $inc: { quantity: log.sand_selection } }));
    if (log.brick_chips > 0) updates.push(Stock.findOneAndUpdate({ materialId: 'brick_chips' }, { $inc: { quantity: log.brick_chips } }));
    
    await Promise.all(updates);
    await Log.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete log' }, { status: 400 });
  }
}



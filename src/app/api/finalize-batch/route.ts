import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { batchId } = await request.json();

    if (!batchId) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
    }
    
    const batch = db.getBatchById(batchId);

    if (!batch) {
        return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    if (batch.qualityTests.length === 0) {
        return NextResponse.json({ error: 'Cannot finalize a batch without a quality test.' }, { status: 400 });
    }
    
    const updatedBatch = db.finalizeBatch(batchId);

    return NextResponse.json(updatedBatch, { status: 200 });

  } catch (error: any) {
    console.error('Error in /api/finalize-batch:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

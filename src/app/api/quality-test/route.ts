import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { QualityTest } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body: Omit<QualityTest, 'id'> = await request.json();

    if (!body.batchId || body.moisturePct === undefined || body.pesticideDetected === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const updatedBatch = db.addQualityTest(body);

    if (!updatedBatch) {
        return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBatch, { status: 201 });
  } catch (error: any) {
    console.error('Error in /api/quality-test:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

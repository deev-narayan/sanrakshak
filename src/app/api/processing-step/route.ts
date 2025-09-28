import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { ProcessingStep } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body: Omit<ProcessingStep, 'id'> = await request.json();

    if (!body.batchId || !body.stepName || !body.details) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const updatedBatch = db.addProcessingStep({
        ...body,
        timestamp: new Date().toISOString(),
    });

    if (!updatedBatch) {
        return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBatch, { status: 201 });
  } catch (error: any) {
    console.error('Error in /api/processing-step:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// src/app/api/farmers/[farmerId]/batches/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { farmerId: string } }
) {
  try {
    const farmerId = params.farmerId;
    if (!farmerId) {
      return NextResponse.json({ error: 'Farmer ID is required' }, { status: 400 });
    }

    const batches = db.getBatchesByFarmerId(farmerId);

    return NextResponse.json(batches);
  } catch (error) {
    console.error(`Error fetching batches for farmer ${params.farmerId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

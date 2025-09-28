import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TraceabilityContract } from '@/lib/chaincode';
import type { CollectionEvent } from '@/lib/schemas';

export async function POST(request: Request) {
  const contract = new TraceabilityContract();

  try {
    const body: Omit<CollectionEvent, 'id' | 'batchId'> = await request.json();

    if (!body.species || !body.weightKg || !body.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Step 1: Call the simulated smart contract for validation
    try {
      contract.recordCollectionEvent({
        species: body.species,
        location: body.location,
      });
    } catch (validationError: any) {
      // If the contract throws an error, it's a validation failure.
      return NextResponse.json({ error: validationError.message }, { status: 400 });
    }

    // Step 2: If validation passes, save to the database.
    const newBatch = db.addCollectionEvent({
      ...body,
      collectionDate: new Date().toISOString()
    });

    return NextResponse.json(newBatch, { status: 201 });

  } catch (error) {
    console.error('Error in /api/collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

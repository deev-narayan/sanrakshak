// src/app/api/farmers/[farmerId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Farmer } from '@/lib/schemas';

export async function GET(
  request: Request,
  { params }: { params: { farmerId: string } }
) {
  try {
    const farmerId = params.farmerId;
    if (!farmerId) {
      return NextResponse.json({ error: 'Farmer ID is required' }, { status: 400 });
    }

    const farmer = db.getFarmerById(farmerId);

    if (!farmer) {
      return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
    }

    return NextResponse.json(farmer);
  } catch (error) {
    console.error(`Error fetching farmer ${params.farmerId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { farmerId: string } }
) {
  try {
    const farmerId = params.farmerId;
    const body: Partial<Omit<Farmer, 'id' | 'registeredDate'>> = await request.json();

    if (!farmerId) {
      return NextResponse.json({ error: 'Farmer ID is required' }, { status: 400 });
    }
    
    const updatedFarmer = db.updateFarmer(farmerId, body);

    if (!updatedFarmer) {
      return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
    }

    return NextResponse.json(updatedFarmer, { status: 200 });

  } catch (error: any) {
    console.error(`Error updating farmer ${params.farmerId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

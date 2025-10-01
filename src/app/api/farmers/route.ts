// src/app/api/farmers/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Farmer } from '@/lib/schemas';

export async function GET() {
  try {
    const farmers = db.getFarmers();
    return NextResponse.json(farmers);
  } catch (error) {
    console.error('Error fetching farmers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: Omit<Farmer, 'registeredDate'> = await request.json();

    if (!body.id || !body.name || !body.village || !body.contact || !body.geoFence) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newFarmer = db.addFarmer(body);

    return NextResponse.json(newFarmer, { status: 201 });

  } catch (error: any) {
    console.error('Error in /api/farmers:', error);
    // Check for specific error message from db
    if (error.message.includes('already exists')) {
        return NextResponse.json({ error: error.message }, { status: 409 }); // 409 Conflict
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

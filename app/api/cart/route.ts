import { NextResponse } from 'next/server';
import { mockData } from '@/data/mockData';

export async function GET() {
  // Simulate fetching cart data from a database
  return NextResponse.json(mockData);
}

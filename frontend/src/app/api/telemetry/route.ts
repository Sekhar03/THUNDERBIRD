import { NextRequest, NextResponse } from 'next/server';

const SIMULATOR_BASE_URL = process.env.SIMULATOR_BASE_URL || 'http://localhost:9090';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${SIMULATOR_BASE_URL}/telemetry`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch telemetry data' },
      { status: 500 }
    );
  }
}

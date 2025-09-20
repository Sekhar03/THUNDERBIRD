import { NextRequest, NextResponse } from 'next/server';

const SERVER_BASE_URL = process.env.SERVER_BASE_URL || 'http://localhost:8080';
const SIMULATOR_BASE_URL = process.env.SIMULATOR_BASE_URL || 'http://localhost:9090';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/api/status`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching system status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system status' },
      { status: 500 }
    );
  }
}

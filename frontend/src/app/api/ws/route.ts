import { NextRequest, NextResponse } from 'next/server';

const SERVER_BASE_URL = process.env.SERVER_BASE_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${SERVER_BASE_URL}/ws`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error connecting to WebSocket:', error);
    return NextResponse.json(
      { 
        message: 'WebSocket connection not available',
        status: 'use polling instead',
        error: 'WebSocket not supported in serverless environment'
      },
      { status: 200 }
    );
  }
}

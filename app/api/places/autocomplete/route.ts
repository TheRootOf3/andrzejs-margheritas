import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input');

  if (!input) {
    return NextResponse.json({ error: 'Input parameter is required' }, { status: 400 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=establishment&location=51.5074,0.1278&radius=50000&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${data.error_message || 'Unknown error'}`);
    }

    if (!data.predictions) {
      console.warn('No predictions in response:', data);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch autocomplete suggestions:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch suggestions',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

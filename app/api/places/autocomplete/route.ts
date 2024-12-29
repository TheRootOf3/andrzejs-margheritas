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
    )}&types=establishment&strictbounds=false&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Google Places API response:', data);
    
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

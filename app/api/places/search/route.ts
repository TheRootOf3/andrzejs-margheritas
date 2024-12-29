import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    console.log('Fetching place details for query:', query);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&type=restaurant&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    
    console.log('Calling Google Places API:', url);
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Google Places API response:', data);

    if (!response.ok) {
      throw new Error(`Google Places API error: ${data.error_message || 'Unknown error'}`);
    }

    if (!data.results?.length) {
      console.warn('No results found in response:', data);
      return NextResponse.json({ error: 'No results found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch places:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch places',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

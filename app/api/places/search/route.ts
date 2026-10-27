import { NextResponse } from 'next/server';
import { getAdminSession } from '@/auth';

export async function GET(request: Request) {
  // Each call is billed to our Google Places key, so only the admin may use it
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    console.log('Fetching place details for query:', query);
    // If query starts with 'place_id:', use Place Details API instead of Text Search
    const isPlaceId = query.startsWith('place_id:');
    // Request only the fields we use; without `fields` Google bills every data tier
    const url = isPlaceId
      ? `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
          query.replace('place_id:', '')
        )}&fields=name,formatted_address,geometry,place_id&key=${process.env.GOOGLE_PLACES_API_KEY}`
      : `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          query
        )}&type=restaurant&key=${process.env.GOOGLE_PLACES_API_KEY}`;
        
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Google Places API error: ${data.error_message || 'Unknown error'}`);
    }

    // Handle different response formats for Place Details vs Text Search
    if (isPlaceId) {
      if (!data.result) {
        console.warn('No result found in Place Details response:', data);
        return NextResponse.json({ error: 'No results found' }, { status: 404 });
      }
      // Transform Place Details response to match Text Search format
      return NextResponse.json({
        results: [{
          name: data.result.name,
          formatted_address: data.result.formatted_address,
          geometry: data.result.geometry,
          place_id: data.result.place_id
        }]
      });
    } else {
      if (!data.results?.length) {
        console.warn('No results found in Text Search response:', data);
        return NextResponse.json({ error: 'No results found' }, { status: 404 });
      }
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Failed to fetch places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/auth';

export async function GET(request: Request) {
  // Each call is billed to our Google Places key, so only the admin may use it
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
    
    // Google reports failures (e.g. REQUEST_DENIED) with HTTP 200, so check the status field too
    if (!response.ok || (data.status !== 'OK' && data.status !== 'ZERO_RESULTS')) {
      throw new Error(`Google Places API error: ${data.status} ${data.error_message || 'Unknown error'}`);
    }

    if (!data.predictions) {
      console.warn('No predictions in response:', data);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch autocomplete suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}

'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Restaurant } from '@/lib/loadRestaurants';

interface MapProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const defaultCenter = { lat: 52.229676, lng: 21.012229 };
const defaultZoom = 13;

export function ClientMap({ restaurants, center = defaultCenter, zoom = defaultZoom }: MapProps) {
  return (
    <div className="w-full h-[600px] relative">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerClassName="w-full h-full rounded-lg"
          center={center}
          zoom={zoom}
        >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.name}
            position={restaurant.coordinates}
            title={restaurant.name}
          />
        ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

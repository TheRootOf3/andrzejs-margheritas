import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Restaurant } from '@/lib/loadRestaurants';

interface MapProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const defaultCenter = { lat: 52.229676, lng: 21.012229 };
const defaultZoom = 13;

export function Map({ restaurants, center = defaultCenter, zoom = defaultZoom }: MapProps) {
  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerClassName="w-full h-[600px] rounded-lg"
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
  );
}

"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import type { Restaurant } from "@/lib/loadRestaurants";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 52.229676,
  lng: 21.012229,
};

interface MapProps {
  restaurants: Restaurant[];
}

export default function Map({ restaurants }: MapProps) {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
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

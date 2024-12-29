"use client";

import { useState, useCallback } from "react";
import { RestaurantCard } from "@/components/RestaurantCard";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import type { Restaurant } from "@/lib/loadRestaurants";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 51.515,
  lng: -0.135,
};

interface MapProps {
  restaurants: Restaurant[];
}

export default function Map({ restaurants }: MapProps) {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const getMarkerIcon = useCallback(() => {
    if (!map) return null;

    return {
      url: `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="52" height="52">
          <circle cx="26" cy="26" r="26" fill="rgba(0, 0, 0, 0.5)"/>
          <circle cx="26" cy="26" r="22" stroke="green" stroke-width="2" fill="rgba(0, 0, 0, 0.5)"/>
          <text y="36" x="26" font-size="32" text-anchor="middle">🍕</text>
        </svg>`
      )}`,
      scaledSize: new google.maps.Size(52, 52),
    };
  }, [map]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        options={{
          streetViewControl: false,
          gestureHandling: "greedy",
        }}
      >
        {map &&
          restaurants.map((restaurant) => (
            <Marker
              key={restaurant.name}
              position={restaurant.coordinates}
              title={restaurant.name}
              onClick={() => setSelectedRestaurant(restaurant)}
              icon={getMarkerIcon()}
            />
          ))}

        {selectedRestaurant && (
          <InfoWindow
            position={selectedRestaurant.coordinates}
            onCloseClick={() => setSelectedRestaurant(null)}
          >
            <RestaurantCard restaurant={selectedRestaurant} />
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

"use client";

import { useState, useCallback } from "react";
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
  lat: 52.229676,
  lng: 21.012229,
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
          <circle cx="26" cy="26" r="26" fill="#CDBCAB"/>
          <circle cx="26" cy="26" r="24" fill="white"/>
          <circle cx="26" cy="26" r="20" fill="#CDBCAB"/>
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
          gestureHandling: "greedy"
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
            <div className="p-2 max-w-xs text-black">
              <h2 className="font-bold text-lg">{selectedRestaurant.name}</h2>
              <p className="text-sm mt-1">{selectedRestaurant.address}</p>
              <p className="text-sm mt-1">
                Score: {selectedRestaurant.score}/10
              </p>
              {selectedRestaurant.notes && (
                <p className="text-sm mt-1 italic">
                  {selectedRestaurant.notes}
                </p>
              )}
              <a
                href={selectedRestaurant.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 mt-2 block"
              >
                View on Google Maps
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

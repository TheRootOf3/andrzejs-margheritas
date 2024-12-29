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

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={() => {
          const getMarkerIcon = () => ({
            url: `data:image/svg+xml,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
              <circle cx="16" cy="16" r="16" fill="#F5DEB3"/>
              <text y="24" x="16" font-size="24" text-anchor="middle">🍕</text>
            </svg>`
            )}`,
            scaledSize: new google.maps.Size(32, 32),
          });
        {restaurants.map((restaurant) => {
          const icon = getMarkerIcon();
          return (
            <Marker
              key={restaurant.name}
              position={restaurant.coordinates}
              title={restaurant.name}
              onClick={() => setSelectedRestaurant(restaurant)}
              icon={icon}
            />
          );
        })}

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

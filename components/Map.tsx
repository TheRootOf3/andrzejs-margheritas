"use client";

import { useState, useCallback, useEffect } from "react";
import { useMapContext } from "@/contexts/MapContext";
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

const defaultCenter = {
  lat: 51.515,
  lng: -0.135,
};

interface MapProps {
  restaurants: Restaurant[];
}

export default function Map({ restaurants }: MapProps) {
  const { focusedCoordinates, showAllRestaurants } = useMapContext();
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  useEffect(() => {
    if (map && showAllRestaurants) {
      const bounds = new google.maps.LatLngBounds();
      restaurants.forEach((restaurant) => {
        bounds.extend(restaurant.coordinates);
      });
      map.fitBounds(bounds, { padding: 50 });
    }
  }, [map, showAllRestaurants, restaurants]);

  const getMarkerIcon = useCallback(
    (restaurant: Restaurant) => {
      if (!map) return null;

      const svgSize = 52;
      const centerPoint = svgSize / 2;

      return {
        url: `data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
          <circle cx="${centerPoint}" cy="${centerPoint}" r="${centerPoint}" fill="rgba(0, 0, 0, 0.5)"/>
          <circle cx="${centerPoint}" cy="${centerPoint}" r="${
            centerPoint - 4
          }" stroke="${
            restaurant.score === 5
              ? "#FFD700" // Gold
              : restaurant.score === 4
              ? "#E5E5E5" // Silver
              : restaurant.score === 3
              ? "#CD7F32" // Bronze
              : "grey"
          }" stroke-width="2" fill="rgba(0, 0, 0, 0.5)"/>
          <text y="${
            centerPoint + 10
          }" x="${centerPoint}" font-size="30" text-anchor="middle">🍕</text>
          
        </svg>`
        )}`,
        scaledSize: new google.maps.Size(svgSize, svgSize),
      };
    },
    [map]
  );

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={focusedCoordinates || defaultCenter}
        zoom={focusedCoordinates ? 16 : 13}
        options={{
          streetViewControl: false,
          gestureHandling: "greedy",
        }}
        onLoad={onLoad}
      >
        {map &&
          restaurants.map((restaurant) => (
            <Marker
              key={restaurant.name}
              position={restaurant.coordinates}
              title={restaurant.name}
              onClick={() => setSelectedRestaurant(restaurant)}
              icon={getMarkerIcon(restaurant) || undefined}
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

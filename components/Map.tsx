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

  const getMarkerIcon = useCallback((restaurant: Restaurant) => {
    if (!map) return null;

    const isPerfectScore = restaurant.score === 5;
    const svgSize = isPerfectScore ? 80 : 52;
    const centerPoint = svgSize / 2;

    let additionalPizzas = '';
    if (isPerfectScore) {
      // Add 5 small pizzas in a circle around the main one
      const radius = 28;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5;
        const x = centerPoint + radius * Math.cos(angle);
        const y = centerPoint + radius * Math.sin(angle);
        additionalPizzas += `<text y="${y + 4}" x="${x}" font-size="16" text-anchor="middle">🍕</text>`;
      }
    }

    return {
      url: `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">
          <circle cx="${centerPoint}" cy="${centerPoint}" r="${centerPoint}" fill="rgba(0, 0, 0, 0.5)"/>
          <circle cx="${centerPoint}" cy="${centerPoint}" r="${centerPoint - 4}" stroke="white" stroke-width="2" fill="rgba(0, 0, 0, 0.5)"/>
          <text y="${centerPoint + 10}" x="${centerPoint}" font-size="32" text-anchor="middle">🍕</text>
          ${additionalPizzas}
        </svg>`
      )}`,
      scaledSize: new google.maps.Size(svgSize, svgSize),
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
              icon={getMarkerIcon(restaurant)}
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

"use client";

import { Restaurant } from "@/lib/loadRestaurants";
import { useState } from "react";

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export default function RestaurantList({ restaurants }: RestaurantListProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-10 min-w-[280px] max-w-[90vw]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white rounded-lg px-4 py-3 w-full text-left touch-manipulation"
        style={{
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
        }}
      >
        <p className="text-sm sm:text-base font-marker">
          {restaurants.length} places discovered
        </p>
      </button>
      
      {isOpen && (
        <div
          className="mt-2 rounded-lg p-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
          }}
        >
          <ul className="space-y-2">
            {restaurants.map((restaurant, index) => (
              <li key={index} className="text-white">
                <a
                  href={restaurant.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <div className="font-marker">{restaurant.name}</div>
                  <div className="text-sm text-gray-300">{restaurant.address}</div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

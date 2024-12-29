"use client";

import { Restaurant } from "@/lib/loadRestaurants";
import { useState } from "react";

const defaultCenter = {
  lat: 51.515,
  lng: -0.135,
};
import { useMapContext } from "@/contexts/MapContext";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

interface RestaurantListProps {
  restaurants: Restaurant[];
}

export default function RestaurantList({ restaurants }: RestaurantListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setMapFocus, setShowAllRestaurants } = useMapContext();

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
        <div className="flex items-center justify-between">
          <p className="text-sm sm:text-base font-marker">
            {restaurants.length} places discovered
          </p>
          {isOpen ? (
            <ChevronDownIcon className="h-5 w-5" />
          ) : (
            <ChevronUpIcon className="h-5 w-5" />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div
          className="mt-2 rounded-lg p-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="space-y-4">
            <button
              onClick={() => {
                setMapFocus(null);
                setShowAllRestaurants(true);
              }}
              className="w-full bg-white/10 hover:bg-white/20 rounded-lg py-2 px-4 text-sm font-marker transition-colors"
            >
              Show All Restaurants
            </button>
            <ul className="space-y-2">
            {restaurants.map((restaurant, index) => (
              <li
                key={index}
                className="text-white p-2 hover:bg-white/10 rounded-lg cursor-pointer flex justify-between items-start gap-2"
                onClick={() => setMapFocus(restaurant.coordinates)}
              >
                <div>
                  <div className="font-marker">{restaurant.name}</div>
                  <div className="text-sm text-gray-300">{restaurant.address}</div>
                </div>
                <a
                  href={restaurant.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 bg-white/10 hover:bg-white/20 rounded p-1.5 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </li>
            ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

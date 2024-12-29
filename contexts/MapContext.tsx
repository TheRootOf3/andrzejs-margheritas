"use client";

import { createContext, useContext, useState } from 'react';

interface MapContextType {
  setMapFocus: (coordinates: { lat: number; lng: number } | null) => void;
  focusedCoordinates: { lat: number; lng: number } | null;
  showAllRestaurants: boolean;
  setShowAllRestaurants: (show: boolean) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [focusedCoordinates, setFocusedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);

  const setMapFocus = (coordinates: { lat: number; lng: number } | null) => {
    setFocusedCoordinates(coordinates);
    setShowAllRestaurants(false);
  };

  return (
    <MapContext.Provider value={{ 
      setMapFocus, 
      focusedCoordinates, 
      showAllRestaurants, 
      setShowAllRestaurants 
    }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
}

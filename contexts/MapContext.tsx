import { createContext, useContext, useState } from 'react';

interface MapContextType {
  setMapFocus: (coordinates: { lat: number; lng: number }) => void;
  focusedCoordinates: { lat: number; lng: number } | null;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [focusedCoordinates, setFocusedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const setMapFocus = (coordinates: { lat: number; lng: number }) => {
    setFocusedCoordinates(coordinates);
  };

  return (
    <MapContext.Provider value={{ setMapFocus, focusedCoordinates }}>
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

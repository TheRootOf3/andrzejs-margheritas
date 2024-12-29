"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PlaceResult {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
}

export default function RestaurantForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<Array<{place_id: string, description: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchInput = async (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(value)}`);
      const data = await response.json();
      
      if (data.predictions) {
        setPredictions(data.predictions);
      }
    } catch (err) {
      setError("Failed to fetch suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(`/api/places/search?query=place_id:${placeId}`);
      const data = await response.json();
      
      if (data.results?.[0]) {
        handlePlaceSelect(data.results[0]);
      }
    } catch (err) {
      setError("Failed to fetch place details");
    }
  };

  const handlePlaceSelect = (place: PlaceResult) => {
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      (form.elements.namedItem('name') as HTMLInputElement).value = place.name;
      (form.elements.namedItem('address') as HTMLInputElement).value = place.formatted_address;
      (form.elements.namedItem('lat') as HTMLInputElement).value = place.geometry.location.lat.toString();
      (form.elements.namedItem('lng') as HTMLInputElement).value = place.geometry.location.lng.toString();
      (form.elements.namedItem('maps_url') as HTMLInputElement).value = 
        `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
    }
    setPredictions([]);
    setSearchQuery("");
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      address: formData.get("address"),
      coordinates: {
        lat: parseFloat(formData.get("lat") as string),
        lng: parseFloat(formData.get("lng") as string),
      },
      maps_url: formData.get("maps_url"),
      group: formData.get("group"),
      score: parseFloat(formData.get("score") as string),
      notes: formData.get("notes"),
    };

    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit restaurant");
      }

      router.refresh();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 relative">
      <div className="space-y-4 mb-8">
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-1">
            Search for a restaurant
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              className="flex-1 p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
              placeholder="Start typing to search for a restaurant..."
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>

        {predictions.length > 0 && (
          <div className="absolute z-10 w-full bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 max-h-60 overflow-y-auto">
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                type="button"
                onClick={() => {
                  handlePlaceDetails(prediction.place_id);
                  setPredictions([]);
                  setSearchQuery("");
                }}
                className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-white"
              >
                <div className="text-sm">{prediction.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Restaurant Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          required
          className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="lat" className="block text-sm font-medium mb-1">
            Latitude
          </label>
          <input
            type="number"
            id="lat"
            name="lat"
            step="any"
            required
            className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
          />
        </div>
        <div>
          <label htmlFor="lng" className="block text-sm font-medium mb-1">
            Longitude
          </label>
          <input
            type="number"
            id="lng"
            name="lng"
            step="any"
            required
            className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
          />
        </div>
      </div>

      <div>
        <label htmlFor="maps_url" className="block text-sm font-medium mb-1">
          Google Maps URL
        </label>
        <input
          type="url"
          id="maps_url"
          name="maps_url"
          required
          className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
        />
      </div>

      <div>
        <label htmlFor="group" className="block text-sm font-medium mb-1">
          Group
        </label>
        <input
          type="text"
          id="group"
          name="group"
          required
          className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
        />
      </div>

      <div>
        <label htmlFor="score" className="block text-sm font-medium mb-1">
          Score (0-10)
        </label>
        <input
          type="number"
          id="score"
          name="score"
          min="0"
          max="10"
          step="0.1"
          required
          className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          required
          className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors font-marker"
      >
        Add Restaurant
      </button>
    </form>
  );
}

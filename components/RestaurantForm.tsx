"use client";

import { useState, useCallback } from "react";
import FormMap from "./FormMap";
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
  const [predictions, setPredictions] = useState<
    Array<{ place_id: string; description: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleSearchInput = async (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Fetching predictions for:", value);
      const response = await fetch(
        `/api/places/autocomplete?input=${encodeURIComponent(value)}`
      );
      const data = await response.json();

      console.log("Autocomplete response:", data);

      if (response.ok && data.predictions) {
        setPredictions(data.predictions);
      } else {
        console.error("Error in autocomplete response:", data);
        setError(data.error || "Failed to fetch suggestions");
      }
    } catch (err) {
      console.error("Error in handleSearchInput:", err);
      setError("Failed to fetch suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceDetails = async (placeId: string) => {
    try {
      console.log("Fetching details for place ID:", placeId);
      const response = await fetch(
        `/api/places/search?query=place_id:${placeId}`
      );
      const data = await response.json();

      console.log("Place details response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch place details");
      }

      if (!data.results?.length) {
        throw new Error("No results found for this place");
      }

      const place = data.results[0];
      console.log("Selected place details:", place);

      setSelectedLocation(place.geometry.location);

      // Fill in the form fields
      const form = document.querySelector("form") as HTMLFormElement;
      if (form) {
        (form.elements.namedItem("name") as HTMLInputElement).value =
          place.name;
        (form.elements.namedItem("address") as HTMLInputElement).value =
          place.formatted_address;
        (form.elements.namedItem("lat") as HTMLInputElement).value =
          place.geometry.location.lat.toString();
        (form.elements.namedItem("lng") as HTMLInputElement).value =
          place.geometry.location.lng.toString();
        (
          form.elements.namedItem("maps_url") as HTMLInputElement
        ).value = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
      }
      setPredictions([]);
      setSearchQuery("");
    } catch (err) {
      console.error("Error fetching place details:", err);
      setError("Failed to fetch place details");
    }
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
      score: parseFloat(formData.get("score") as string),
      notes: formData.get("notes"),
      visited: formData.get("visited") as string,
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form onSubmit={onSubmit} className="space-y-4 relative">
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
            className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
          />
        </div>

        <input type="hidden" id="lat" name="lat" required />
        <input type="hidden" id="lng" name="lng" required />
        <input type="hidden" id="maps_url" name="maps_url" required />

        <div>
          <label htmlFor="score" className="block text-sm font-medium mb-1">
            Score (0-5)
          </label>
          <input
            type="number"
            id="score"
            name="score"
            min="0"
            max="5"
            step="0.1"
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
            className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="visited" className="block text-sm font-medium mb-1">
            Date Visited
          </label>
          <input
            type="date"
            id="visited"
            name="visited"
            className="w-full p-2 border rounded bg-white/10 backdrop-blur-sm border-white/20 text-white focus:outline-none focus:border-white/40"
          />
        </div>

        <button
          type="submit"
          className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors font-marker"
        >
          Add Restaurant
        </button>
      </form>

      {selectedLocation && (
        <div className="sticky top-4">
          <FormMap center={selectedLocation} />
        </div>
      )}
    </div>
  );
}

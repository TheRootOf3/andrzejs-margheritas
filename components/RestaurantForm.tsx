"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RestaurantForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  
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
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
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

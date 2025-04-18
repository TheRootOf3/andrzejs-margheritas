"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";

interface FormMapProps {
  center: { lat: number; lng: number };
}

export default function FormMap({ center }: FormMapProps) {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <GoogleMap
        zoom={15}
        center={center}
        mapContainerClassName="w-full h-full"
        options={{
          disableDefaultUI: true,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ visibility: "on" }, { color: "#3e606f" }, { weight: 2 }, { gamma: 0.84 }],
            },
            {
              featureType: "all",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "administrative",
              elementType: "geometry",
              stylers: [{ weight: 0.6 }, { color: "#1a3541" }],
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#2c5a71" }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#406d80" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#4e7f8f" }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry",
              stylers: [{ color: "#4e7f8f" }],
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#4e7f8f" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#406d80" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#193341" }],
            },
          ],
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}

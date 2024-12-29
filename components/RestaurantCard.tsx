import { Restaurant } from "@/lib/loadRestaurants";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="p-2 rounded-lg hover:shadow-lg">
      <h2 className="text-xl font-semibold text-white">{restaurant.name}</h2>
      <p className="text-white font-medium">{restaurant.address}</p>
      <div className="mt-2 space-y-1">
        <p className="text-sm text-white font-medium italic">
          {restaurant.notes}
        </p>
        <p className="text-sm text-white font-medium">
          Score: {restaurant.score}/10
        </p>
        <p className="text-sm text-white font-medium">
          Visited: {restaurant.visited}
        </p>
        <div className="flex justify-end mt-2">
          <a
            href={restaurant.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-1"
          >
            View on Maps
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

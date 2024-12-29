import { Restaurant } from "@/lib/loadRestaurants";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="py-2 px-4 rounded-lg hover:shadow-lg">
      <h2 className="text-xl font-semibold text-white text-center">{restaurant.name}</h2>
      <div className="mt-2 space-y-1">
        <div className="p-2 bg-white/10 rounded-lg">
          <p className="text-sm text-white font-medium text-center">{restaurant.notes}</p>
        </div>
        <p className="text-sm text-white font-medium text-center">
          {Array(restaurant.score).fill("🍕").join("")} Score:{" "}
          {restaurant.score}/5{" "}
        </p>
        {restaurant.visited && (
          <p className="text-sm text-white font-medium text-center">
            📅 Visited: {restaurant.visited}
          </p>
        )}
        <div className="flex justify-end mt-2">
          <a
            href={restaurant.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-500/50 hover:bg-gray-600/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-1"
          >
            View on Maps
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

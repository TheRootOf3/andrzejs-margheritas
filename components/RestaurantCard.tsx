import { Restaurant } from "@/lib/loadRestaurants";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="p-2 rounded-lg hover:shadow-lg transition-shadow bg-black/50 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">{restaurant.name}</h2>
      <p className="text-white">{restaurant.address}</p>
      <div className="mt-2 space-y-1">
        <p className="text-sm text-white italic">{restaurant.notes}</p>
        <p className="text-sm text-white">Score: {restaurant.score}/10</p>
        <p className="text-sm text-white">Visited: {restaurant.visited}</p>
        <div className="flex justify-end">
          <a
            href={restaurant.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            View on Maps →
          </a>
        </div>
      </div>
    </div>
  );
}

import { Restaurant } from "@/lib/loadRestaurants";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold">{restaurant.name}</h2>
      <p className="text-gray-600">{restaurant.address}</p>
      <div className="mt-2 space-y-1">
        <div className="flex justify-between items-center">
          <p className="text-sm">Score: {restaurant.score}/10</p>
          <p className="text-sm text-gray-500">Visited: {restaurant.visited}</p>
        </div>
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

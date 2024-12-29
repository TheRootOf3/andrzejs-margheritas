import { loadRestaurants } from "@/lib/loadRestaurants";
import { RestaurantCard } from "@/components/RestaurantCard";

export default function Home() {
  const restaurants = loadRestaurants();
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Pizza Restaurants</h1>
        <div className="space-y-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.name} restaurant={restaurant} />
          ))}
        </div>
      </main>
    </div>
  );
}

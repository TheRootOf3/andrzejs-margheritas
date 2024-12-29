import Map from "@/components/Map";
import { loadRestaurants } from "@/lib/loadRestaurants";

export default function Home() {
  const restaurants = loadRestaurants();
  
  return (
    <main>
      <h1 className="text-4xl font-bold text-center py-6">Andrzej&apos;s Margheritas</h1>
      <Map restaurants={restaurants} />
    </main>
  );
}

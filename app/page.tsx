import Map from "@/components/Map";
import { loadRestaurants } from "@/lib/loadRestaurants";

export default function Home() {
  const restaurants = loadRestaurants();
  
  return (
    <main>
      <h1 className="text-5xl font-bold text-center py-8 font-playfair italic text-white">Andrzej&apos;s Margheritas</h1>
      <Map restaurants={restaurants} />
    </main>
  );
}

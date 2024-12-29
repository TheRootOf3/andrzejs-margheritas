import Map from "@/components/Map";
import { loadRestaurants } from "@/lib/loadRestaurants";

export default function Home() {
  const restaurants = loadRestaurants();
  
  return (
    <main>
      <h1 className="text-5xl text-center py-8 font-marker text-white">Andrzej&apos;s Margheritas</h1>
      <Map restaurants={restaurants} />
    </main>
  );
}

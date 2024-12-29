import Map from "@/components/Map";
import { loadRestaurants } from "@/lib/loadRestaurants";

export default function Home() {
  const restaurants = loadRestaurants();
  
  return (
    <main className="relative">
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
        <h1 className="text-5xl text-center py-8 font-marker text-white">Andrzej&apos;s Margheritas</h1>
      </div>
      <Map restaurants={restaurants} />
    </main>
  );
}

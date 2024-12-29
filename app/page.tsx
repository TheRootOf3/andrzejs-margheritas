import Map from "@/components/Map";
import { loadRestaurants } from "@/lib/loadRestaurants";

export default function Home() {
  const restaurants = loadRestaurants();
  
  return (
    <main className="relative">
      <div className="absolute left-1/2 -translate-x-1/2 top-8 z-10">
        <h1 className="text-5xl px-12 py-8 font-marker text-white bg-black/50 backdrop-blur-sm rounded-lg">
          Andrzej&apos;s Margheritas
        </h1>
      </div>
      <Map restaurants={restaurants} />
    </main>
  );
}

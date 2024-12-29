import Map from "@/components/Map";
import { loadRestaurants } from "@/lib/loadRestaurants";

export default function Home() {
  const restaurants = loadRestaurants();
  
  return (
    <main className="relative">
      <div className="absolute left-1/2 -translate-x-1/2 top-8 z-10 flex flex-col items-center gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-6 md:py-8 font-marker text-white bg-black/50 backdrop-blur-sm rounded-lg whitespace-nowrap">
          Andrzej&apos;s Margheritas
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl px-4 py-2 text-white bg-black/50 backdrop-blur-sm rounded-lg whitespace-nowrap font-marker">
          Yeah, I really do like them.
        </p>
      </div>
      <Map restaurants={restaurants} />
    </main>
  );
}

import Map from "@/components/Map";
import { loadRestaurants } from "@/lib/loadRestaurants";

export default function Home() {
  const restaurants = loadRestaurants();
  
  return (
    <main className="relative">
      <div className="absolute left-1/2 -translate-x-1/2 top-8 z-10">
        <div className="flex flex-col items-center text-white bg-black/50 backdrop-blur-sm rounded-lg">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-6 sm:px-8 md:px-10 lg:px-12 pt-4 sm:pt-6 md:pt-8 font-marker whitespace-nowrap">
            Andrzej&apos;s Margheritas
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl px-4 pb-4 sm:pb-6 md:pb-8 font-marker whitespace-nowrap">
            Yeah, I really do like them.
          </p>
        </div>
      </div>
      <Map restaurants={restaurants} />
    </main>
  );
}

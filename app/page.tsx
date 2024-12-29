import Map from "@/components/Map";
import Navigation from "@/components/Navigation";
import { loadRestaurants } from "@/lib/loadRestaurants";

export default function Home() {
  const restaurants = loadRestaurants();

  return (
    <main className="relative">
      <Navigation />
      <div className="absolute left-1/2 -translate-x-1/2 top-8 z-10">
        <div
          className="flex flex-col items-center text-white rounded-lg"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
          }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 md:px-8 pt-3 sm:pt-4 md:pt-6 font-marker whitespace-nowrap">
            🍕 Andrzej&apos;s Margheritas 🍕
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl px-4 pb-3 sm:pb-4 md:pb-6 font-marker whitespace-nowrap">
            Yeah, I really do like them.
          </p>
        </div>
      </div>
      <Map restaurants={restaurants} />
    </main>
  );
}

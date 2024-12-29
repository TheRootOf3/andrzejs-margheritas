import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import RestaurantForm from "@/components/RestaurantForm";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-marker">Add New Restaurant</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">
            Logged in as: <span className="font-bold">{session.user?.name}</span>
          </span>
          <a
            href="/api/auth/signout"
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            Sign Out
          </a>
        </div>
      </div>
      <GoogleMapsProvider>
        <RestaurantForm />
      </GoogleMapsProvider>
    </main>
  );
}

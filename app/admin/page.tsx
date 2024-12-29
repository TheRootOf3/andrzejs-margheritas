import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-marker mb-6">Admin Dashboard</h1>
      <div className="bg-white/10 p-6 rounded-lg">
        <p className="text-lg mb-4">
          Logged in as: <span className="font-bold">{session.user?.name}</span>
        </p>
        <a
          href="/api/auth/signout"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Sign Out
        </a>
      </div>
    </div>
  )
}
import { auth } from "@/auth";
import RestaurantForm from "@/components/RestaurantForm";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-marker mb-8">Add New Restaurant</h1>
      <RestaurantForm />
    </main>
  );
}

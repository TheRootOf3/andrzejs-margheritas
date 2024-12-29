"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data: session, status } = useSession();

  return (
    <div className="fixed top-4 right-4 z-20">
      {status === "authenticated" ? (
        <Link
          href="/admin"
          className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors font-marker"
        >
          Add Restaurant
        </Link>
      ) : (
        <button
          onClick={() => signIn("github")}
          className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors font-marker"
        >
          Sign In
        </button>
      )}
    </div>
  );
}

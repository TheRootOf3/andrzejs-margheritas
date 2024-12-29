"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="fixed top-4 right-4 z-20">
      <Link
        href="/admin"
        className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors font-marker"
      >
        Add Restaurant
      </Link>
    </div>
  );
}

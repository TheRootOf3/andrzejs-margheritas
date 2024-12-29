import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg text-white max-w-md w-full">
        <h1 className="text-2xl font-marker mb-4">Authentication Error</h1>
        <p className="mb-4">
          Sorry, you are not authorized to access this application. Only specific GitHub users are allowed.
        </p>
        <Link
          href="/"
          className="inline-block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors font-marker"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

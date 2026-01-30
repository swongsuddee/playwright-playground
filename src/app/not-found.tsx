import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">404 — Page not found</h1>
      <p className="text-gray-600">
        The page you’re looking for doesn’t exist (or was moved).
      </p>

      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded border px-3 py-2 hover:bg-gray-50"
        >
          Go to Home
        </Link>

        <Link
          href="/sessions"
          className="inline-flex items-center rounded border px-3 py-2 hover:bg-gray-50"
        >
          Browse Sessions
        </Link>
      </div>
    </div>
  );
}

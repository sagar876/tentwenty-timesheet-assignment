import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-3 bg-gray-50 px-4 py-12 text-center">
      <span className="text-lg font-bold text-gray-900">ticktock</span>
      <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
      <p className="max-w-sm text-sm text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button asChild variant="outline" className="mt-2 h-auto px-4 py-2">
        <Link href="/">Back to ticktock</Link>
      </Button>
    </div>
  );
}

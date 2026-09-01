"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-3 bg-gray-50 px-4 py-12 text-center">
      <span className="text-lg font-bold text-gray-900">ticktock</span>
      <h1 className="text-2xl font-semibold text-gray-900">Something went wrong</h1>
      <p className="max-w-sm text-sm text-gray-500">
        An unexpected error occurred. Please try again.
      </p>
      <Button type="button" variant="outline" onClick={reset} className="mt-2 h-auto px-4 py-2">
        Try again
      </Button>
    </div>
  );
}

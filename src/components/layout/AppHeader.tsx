import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";

interface AppHeaderProps {
  userName: string;
}

export function AppHeader({ userName }: AppHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <nav aria-label="Primary" className="flex items-center gap-6">
          <span className="text-lg font-bold text-gray-900">ticktock</span>
          <Link
            href="/dashboard"
            className="-mx-1 -my-2 rounded px-1 py-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Timesheets
          </Link>
        </nav>

        <details className="group relative">
          <summary
            className="-mx-1 -my-2 flex cursor-pointer list-none items-center gap-1 rounded px-1 py-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 [&::-webkit-details-marker]:hidden"
          >
            {userName}
            <ChevronDown aria-hidden="true" className="h-4 w-4 text-gray-500" />
          </summary>

          <div className="absolute right-0 z-10 mt-2 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-md">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                className="h-auto w-full justify-start rounded-none px-4 py-2 text-left text-sm font-normal text-gray-700"
              >
                Sign out
              </Button>
            </form>
          </div>
        </details>
      </div>
    </header>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WeekDetailView } from "@/features/timesheets/components/detail/WeekDetailView";

export default async function WeekDetailPage(props: PageProps<"/timesheets/[weekId]">) {
  const { weekId } = await props.params;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        aria-label="Back to timesheets"
        className="-m-2 mb-4 inline-flex cursor-pointer items-center gap-1 rounded p-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Back
      </Link>
      <WeekDetailView weekId={weekId} />
    </main>
  );
}

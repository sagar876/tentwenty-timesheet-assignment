import { Suspense } from "react";
import { TimesheetDashboard } from "@/features/timesheets/components/dashboard/TimesheetDashboard";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={null}>
        <TimesheetDashboard />
      </Suspense>
    </main>
  );
}

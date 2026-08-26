import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TimesheetTableSkeletonProps {
  rows?: number;
}

export function TimesheetTableSkeleton({ rows = 5 }: TimesheetTableSkeletonProps) {
  return (
    <>
      <span className="sr-only">Loading timesheets…</span>
      <Table aria-hidden="true" className="min-w-[640px] text-left">
        <TableHeader className="bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
          <TableRow className="hover:bg-gray-50">
            <TableHead className="h-auto px-6 py-3 text-inherit">Week #</TableHead>
            <TableHead className="h-auto px-6 py-3 text-inherit">Date</TableHead>
            <TableHead className="h-auto px-6 py-3 text-inherit">Status</TableHead>
            <TableHead className="h-auto px-6 py-3 text-right text-inherit">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              <TableCell className="bg-gray-50 px-6 py-4">
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell className="px-6 py-4">
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="px-6 py-4">
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <Skeleton className="ml-auto h-4 w-12" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

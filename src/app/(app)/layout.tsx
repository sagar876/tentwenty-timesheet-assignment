import { auth } from "@/auth";
import { AppHeader } from "@/components/layout/AppHeader";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-gray-50">
      <AppHeader userName={session?.user?.name ?? ""} />
      {children}
    </div>
  );
}

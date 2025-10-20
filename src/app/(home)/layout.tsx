import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/common/AppSidebar";

import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 w-full">
        <div className="border-sidebar-border bg-sidebar flex items-center gap-2 rounded-md border p-2 px-4 shadow">
          <div className="ml-auto"></div>
          <UserButton />
        </div>
        <div className="h-4">
          <div className="border-sidebar-border bg-sidebar mt-4 h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border p-4 shadow">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}

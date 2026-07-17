import { SidebarNav } from "@/components/admin/sidebar-nav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col md:flex-row">
      <SidebarNav />
      <div className="min-w-0 flex-1 px-6 py-10 md:px-10">{children}</div>
    </div>
  );
}

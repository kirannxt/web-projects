import AdminSidebar from "@/components/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

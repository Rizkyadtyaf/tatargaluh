import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 ml-20 p-8">
        {children}
      </main>
    </div>
  );
}

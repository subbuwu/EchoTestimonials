import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
      <div className="bg-chinese flex min-h-screen flex-col text-foreground font-primary_regular lg:flex-row">
        <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="">
              {children}
            </div>
          </main>
      </div>
  );
}
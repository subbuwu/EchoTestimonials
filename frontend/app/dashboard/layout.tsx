import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/Sidebar";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <div className="bg-[#171717] flex min-h-screen flex-col text-[#FFFFFF] font-primary_regular lg:flex-row">
        <Sidebar />
          <main className="flex-1 overflow-y-auto p-2 xl:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
      </div>
    </SessionProvider>
  );
}
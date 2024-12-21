import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react"
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <div className="bg-[#171717] flex min-h-screen text-[#FFFFFF] font-primary_regular">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
    </div>
    </SessionProvider>
  )
}
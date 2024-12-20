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
      <div className="flex lg:flex-row flex-col">
        <Sidebar/>
        <section className="bg-[#171717] flex-1 min-h-screen text-[#FFFFFF] font-primary_regular">
          {children}
        </section>
      </div>
    </SessionProvider>
  )
}
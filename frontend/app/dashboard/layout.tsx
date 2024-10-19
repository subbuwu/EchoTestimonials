import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react"

export default async function DashboardLayout({
    children, 
  }: {
    children: React.ReactNode,
  }) {
    const session = await auth();
    if(!session){
        redirect('/');
    }
    return (
      <SessionProvider>
      <section className="bg-[#171717] min-h-screen text-[#FFFFFF] font-primary_regular">
        {children}
      </section>
      </SessionProvider>
    )
  }
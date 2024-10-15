import { auth } from "@/auth";
export default async function DashboardLayout({
    children, 
    params
  }: {
    children: React.ReactNode,
    params : {
        session : any
    }
  }) {
    const session = await auth();
    params.session = session ?? {}
    console.log(session)
    
    if(!session){
        return <>loading..</>
    }


    return (
      <section className="bg-[#171717] min-h-screen text-[#FFFFFF] font-primary_regular">
        {children}
      </section>
    )
  }
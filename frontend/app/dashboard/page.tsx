"use client"
import React from "react"
import { Menu, X, LayoutDashboard, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Dashboard({params} : {params : { session : any }}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const userImage = params.session?.user?.image
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed inset-y-0 left-0 z-50 w-56 lg:w-64 bg-[#171717]  shadow-lg transition-transform duration-300 ease-in-out border-[#4a4a4a]   lg:border-[#2e2e2e] 
          lg:translate-x-0 lg:relative border-r
        `}
      >
        <div className="flex h-12 items-center justify-end lg:justify-between px-4 border-[#2e2e2e] border-b">
          <h1 className="text-xl font-semibold lg:block hidden">Dashboard</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-4 px-4">
          <Button variant="ghost" className="w-full justify-start mb-2">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Your Zones
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#171717]">
        {/* Header */}
        <header className="flex h-12 items-center justify-between border-[#2e2e2e] border-b px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold lg:hidden">Dashboard</h1>
          <div className="ml-auto lg:block hidden" />

          <div className="ml-auto pr-20">
            <img src={userImage} className="w-5 h-5 rounded-full" />
          </div> 
        </header>

        {/* Dashboard Content */}
        <ScrollArea className="flex-1 p-4 lg:p-6">
          <h2 className="text-2xl font-medium mb-4">Good to see you! Let’s get things rolling</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
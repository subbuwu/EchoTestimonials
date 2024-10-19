"use client"
import React from "react"
import { Menu, X, LayoutDashboard, Settings, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const { data: session } = useSession()


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
        <div className="flex h-14 items-center justify-end lg:justify-between px-4 border-[#2e2e2e] border-b">
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
        <header className="flex h-14 items-center justify-between border-[#2e2e2e] border-b px-4 lg:px-6">
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

          <div className="ml-auto lg:pr-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Image
                  width={44}
                  height={44}
                  alt="profile_image"
                  src={session?.user?.image ?? ''}
                  className="rounded-full border p-0.5 cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer"> 
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dashboard Content */}
        <ScrollArea className="flex-1 p-4 lg:p-6">
          <h2 className="text-2xl font-medium mb-4">Good to see you! Let’s get things rolling :</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
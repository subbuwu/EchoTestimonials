"use client"
import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

import { SpacesGrid } from "@/components/Dashboard/SpacesGrid"
import UserMenu from "@/components/UserMenu"

export default function Dashboard() {
  return (
    <div className="flex h-screen">

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[#171717]">

        {/* Dashboard Content */}
        <ScrollArea className="flex-1 p-4 lg:p-6">
          <UserMenu/>
          <h2 className="text-3xl font-medium mb-4">Good to see you! Let’s get things rolling :</h2>
          <SpacesGrid />
        </ScrollArea>
      </div>
    </div>
  )
}
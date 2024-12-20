"use client";
import React, { useState } from "react";
import { X, LayoutDashboard, Settings, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden bg-[#171717] border-[#2e2e2e] border-b h-14 flex items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Ellipsis className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-56 lg:w-64 bg-[#171717] text-white shadow-lg transition-transform duration-300 ease-in-out border-[#4a4a4a] 
          lg:translate-x-0 lg:relative border-r
        `}
      >
        {/* Header */}
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

        {/* Navigation */}
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

      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;

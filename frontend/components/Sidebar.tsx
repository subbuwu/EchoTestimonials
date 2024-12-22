"use client";
import React, { useState } from "react";
import { X, LayoutDashboard, Settings, Ellipsis, PlusCircle, LineChart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Your Spaces", primary: true },
    // { icon: PlusCircle, label: "Create Zone" },
    // { icon: LineChart, label: "AI Analytics" },
    // { icon: Users, label: "Team" },
    { icon: Settings, label: "Settings" }
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#171717] border-[#2e2e2e] border-b h-14 flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Ellipsis className="h-6 w-6 text-white" />
          </Button>
          <span className="font-semibold text-lg">Dashboard</span>
        </div>
        {/* <UserMenu /> */}
      </div>

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-64 bg-[#171717] text-white shadow-lg 
          transition-transform duration-300 ease-in-out border-[#4a4a4a] 
          lg:translate-x-0 lg:relative border-r
        `}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between px-4 border-[#2e2e2e] border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold lg:block hidden">Dashboard</h1>
          </div>
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
        <nav className="mt-4 px-4 space-y-2">
          {menuItems.map((item : any, index : number) => (
            <Button
              key={index}
              variant={item.primary ? "default" : "ghost"}
              className={`w-full justify-start  ${item.primary ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* User Menu - Mobile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2e2e2e] xl:hidden">
          <UserMenu />
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
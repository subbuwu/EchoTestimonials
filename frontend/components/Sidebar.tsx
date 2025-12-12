"use client";
import React, { useState } from "react";
import {
  X,
  LayoutDashboard,
  Settings,
  Ellipsis,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import { usePathname, useRouter } from "next/navigation";


const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    path: string;
  }> = [
    { icon: LayoutDashboard, label: "Organizations", path: "/dashboard" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-raisin border-[#2e2e2e] border-b h-14 flex items-center justify-between px-4">
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
      </div>

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-20 bg-raisin text-gray-300
          transition-transform duration-300 ease-in-out border-r border-[#2e2e2e] 
          lg:translate-x-0 lg:relative flex flex-col items-center
        `}
      >
        {/* Header / Logo */}
        <div className="h-14 w-full flex items-center justify-center border-b border-[#2e2e2e]">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            ET
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6 space-y-2 w-full flex flex-col items-center">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.path || pathname.startsWith(item.path);
            return (
              <button
                key={index}
                onClick={() => {
                  router.push(item.path);
                  setSidebarOpen(false);
                }}
                className={`
                  w-10 h-10 rounded-xl mb-2 flex items-center justify-center transition-colors
                  ${isActive ? "bg-[#7361dc] text-white" : "hover:bg-blue hover:text-primary-foreground" }
                `}
                title={item.label}
              >
                <IconComponent className="h-5 w-5" />
                {/* Tooltip-like label for desktop */}
                <span className="sr-only">{item.label}</span>
              </button>
            );
          })}
           
        </nav>

        {/* User Menu - Bottom */}
        <div className="mb-4">
          <UserMenu />
        </div>

        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden absolute top-3 right-3"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
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

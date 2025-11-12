"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

const UserMenu = () => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-3 text-white">
        
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-zinc-800 text-white rounded-lg shadow-lg">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem className="focus:bg-zinc-700">
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        {/* <DropdownMenuItem className="focus:bg-zinc-700">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-zinc-700">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuItem className="focus:bg-zinc-700">
          <HelpCircle className="w-4 h-4 mr-2" />
          Help & Support
        </DropdownMenuItem> */}
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem 
          className="focus:bg-zinc-700 text-red-400 focus:text-red-400" 

        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
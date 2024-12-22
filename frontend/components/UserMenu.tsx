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
import { LogOut, Settings, User, Bell, HelpCircle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import UserAvatar from "@/components/UserAvatar";

const UserMenu = () => {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-3 text-white">
        {session?.user?.image ? (
          <UserAvatar image={session?.user.image} />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
        )}
        <div className="hidden xl:block text-left">
          <p className="text-sm font-medium">{session?.user?.name || "User"}</p>
          <p className="text-xs text-zinc-400">{session?.user?.email}</p>
        </div>
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
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
"use client";
import React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import UserAvatar from "@/components/UserAvatar"; 

const UserMenu = () => {
    const { data : session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 text-white">
        {session?.user?.image ? (
          <UserAvatar image={session?.user.image} />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
        )}
        {/* <span className="font-semibold">{session?.user?.name || "User"}</span> */}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-zinc-800 text-white rounded-lg shadow-lg w-48">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => alert("Go to Profile")}>
          <User className="w-5 h-5 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => alert("Go to Settings")}>
          <Settings className="w-5 h-5 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

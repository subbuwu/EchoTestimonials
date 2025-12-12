"use client";
import React from "react";
import { UserButton } from "@clerk/nextjs";

const UserMenu = () => {
  return (
    <div className="flex items-center justify-center">
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "w-10 h-10",
            userButtonPopoverCard: "bg-raisin border border-onyx",
            userButtonPopoverActionButton: "text-gray-300 hover:bg-onyx",
            userButtonPopoverActionButtonText: "text-gray-300",
            userButtonPopoverFooter: "hidden",
          }
        }}
      />
    </div>
  );
};

export default UserMenu;
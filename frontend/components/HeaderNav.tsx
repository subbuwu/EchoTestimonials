"use client"
import React from 'react'
import { Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

type Props = {}

const HeaderNav = (props: Props) => {
    return (
        <header className="flex h-14 items-center justify-between border-[#2e2e2e] border-b px-4 lg:px-6">
            <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => console.log('clicked')}
            >
                <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold lg:hidden">Dashboard</h1>
            <div className="ml-auto lg:block hidden" />

            <div className="ml-auto lg:pr-20">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Image
                            src="/images/profile.png"
                            width={44}
                            height={44}
                            alt="profile_image"
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
                        <DropdownMenuItem className="cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

export default HeaderNav
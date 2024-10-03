"use client"
import React, { useState,useEffect } from "react";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import UserAvatar from "@/components/UserAvatar";
import { api } from "@/utils/axios"

type AppbarProps = {
  isAuthenticated: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

const Appbar = ({ isAuthenticated, user }: AppbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  //testing axios api client 
  
  // useEffect(()=>{
  //   const sample = async() => {
  //     try {
  //       const res = await api.get('/users/')
  //     console.log(res.data)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  //   sample()
  // })
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  const AuthenticatedView = () => (
    <div className="flex items-center space-x-4 ">
      <div className="flex items-center space-x-1">
        <span className="text-white">Welcome</span>
        <span className="font-semibold text-white">{user?.name || user?.email || 'User'}</span>
      </div>
      {user?.image && <UserAvatar image={user.image} />}
      <button
        onClick={() => signOut()}
        className="bg-white text-gray-700 px-4 py-2 rounded-md font-bold border border-gray-300 transition duration-300 ease-in-out hover:bg-gray-300 hover:border-gray-400 flex items-center"
      >
        <LogOut className="w-4 h-4 mr-2 text-gray-600" />
        Logout
      </button>
    </div>
  );

  return (
    <nav className="font-primary_regular flex h-full bg-zinc-900 bg-clip-padding backdrop-filter z-[100] backdrop-blur-sm bg-opacity-30 items-center md:px-16 px-6 justify-between py-6 border-b-2 border-zinc-800 sticky top-0">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-[#FFFFFF] font-bold font-nohemiBold text-2xl lg:text-4xl">
            EchoTestimonials
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <AuthenticatedView />
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-white text-gray-700 px-4 py-2 rounded-md font-bold border border-gray-300 transition duration-300 ease-in-out hover:bg-gray-300 hover:border-gray-400 flex items-center"
              >
                <LogIn className="w-4 h-4 mr-2 text-gray-600" />
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu items */}
        {/* Mobile menu items */}
<div
  className={`md:hidden bg-zinc-900 rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform mt-2 ${
    isMobileMenuOpen ? "max-h-[400px] opacity-100 p-4 " : "max-h-0 mt-0 p-0 opacity-0"
  }`}
>
  {isAuthenticated ? (
    <div className="space-y-4">
      <div className="flex items-center space-x-1">
        <span className="text-white">Hello There</span>
        <span className="font-semibold text-white">{user?.name || user?.email || 'User'}</span>
      </div>
      {user?.image && <UserAvatar image={user.image} />}
      <button
        onClick={() => signOut()}
        className="block w-full text-left bg-white text-gray-700 px-4 py-2 rounded-md font-medium border border-gray-300 transition duration-300 ease-in-out hover:bg-gray-100 hover:border-gray-400"
      >
        <LogOut className="w-4 h-4 inline mr-2 text-gray-600" />
        Logout
      </button>
    </div>
  ) : (
    <button
      onClick={() => signIn("google")}
      className="block w-full text-left bg-white text-gray-700 px-4 py-2 rounded-md font-medium border border-gray-300 transition duration-300 ease-in-out hover:bg-gray-100 hover:border-gray-400"
    >
      <LogIn className="w-4 h-4 inline mr-2 text-gray-600" />
      Login
    </button>
  )}
</div>

      </div>
    </nav>
  );
};

export default Appbar;
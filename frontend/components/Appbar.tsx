"use client"
import React, { useState } from 'react'
import { Menu, X, LogIn } from 'lucide-react'
import { signIn } from 'next-auth/react'
type Props = {}

const Appbar = (props: Props) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleSignIn = () => {
      // Trigger Google OAuth sign-in
      signIn('google');
    };

    return (
      <nav className="flex h-full bg-zinc-900 mx-auto bg-clip-padding backdrop-filter z-[100] backdrop-blur-sm bg-opacity-30 items-center md:px-16 px-6 justify-between py-6 border-b-2 border-zinc-800 sticky top-0 ">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-[#FFFFFF] font-bold font-nohemiBold text-5xl">EchoTestimonials</div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClickCapture={handleSignIn} className="bg-white text-gray-700 px-4 py-2 rounded-md font-bold border border-gray-300 transition duration-300 ease-in-out hover:bg-gray-300 hover:border-gray-400 flex items-center">
                <LogIn className="w-4 h-4 mr-2 text-gray-600" />
                Login
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile menu items */}
          {isMobileMenuOpen && (
            <div className="mt-4 md:hidden">
              <button className="block w-full text-left bg-white text-gray-700 px-4 py-2 rounded-md font-medium border border-gray-300 transition duration-300 ease-in-out hover:bg-gray-100 hover:border-gray-400">
                <LogIn className="w-4 h-4 inline mr-2 text-gray-600" />
                Login
              </button>
            </div>
          )}
        </div>
      </nav>
    )
}

export default Appbar
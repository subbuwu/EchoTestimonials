"use client"
import React, { useState} from "react";
import { Menu, X } from "lucide-react";
import {
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useRouter } from "next/navigation";


type AppbarProps = {
  isAuthenticated: boolean;
};

const Appbar = ({ isAuthenticated }: AppbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
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

  const handleSignIn = () => {
    if(!isAuthenticated) {
      router.push('/sign-in');
    } else {
      router.push('/dashboard');
    }
  };


  return (
    <nav className="font-primary_regular bg-zinc-900 bg-clip-padding backdrop-filter z-[100] backdrop-blur-sm bg-opacity-30 border-b-2 border-zinc-800 sticky top-0">
      <div className="container mx-auto px-4 md:px-16">
        <div className="flex items-center justify-between py-6">
          <div className="text-[#FFFFFF] font-bold font-nohemiBold text-2xl sm:text-3xl lg:text-4xl">
            EchoTestimonials
          </div>

          <div className="hidden md:flex items-center space-x-4">
          <SignedOut>
              <SignUpButton>
                <button className="bg-blue-500 hover:bg-blue-600 transition-colors px-6 py-3 rounded-[10px] flex flex-row gap-2 items-center text-[18px] leading-[22px] text-white">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu items */}
        <div
          className={`md:hidden md:max-w-none rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform ${
            isMobileMenuOpen ? "max-h-[400px] opacity-100 p-4 mb-4" : "max-h-0 p-0 opacity-0"
          }`}
        >
           <SignedOut>
              <SignUpButton>
                <button className="bg-blue-500 hover:bg-blue-600 transition-colors px-6 py-3 rounded-[10px] flex flex-row gap-2 items-center text-[18px] leading-[22px]" onClick={handleSignIn}>
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Appbar;
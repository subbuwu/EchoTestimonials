"use client"
import { ArrowRight } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const LandingHero = ({isAuthenticated} : {isAuthenticated : boolean}) => {
    const router = useRouter();
    const words = ["Dazzle", "Amaze", "Analyze"];
    const [displayText, setDisplayText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    
    useEffect(() => {
        let timer;
        const currentWord = words[wordIndex];
        const updateText = () => {
            setDisplayText(prev => {
                if (!isDeleting && prev === currentWord) {
                    setIsDeleting(true);
                    return prev;
                } else if (isDeleting && prev === '') {
                    setIsDeleting(false);
                    setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
                    return '';
                }

                if (isDeleting) {
                    return prev.slice(0, -1);
                }
                return currentWord.slice(0, prev.length + 1);
            });
        };

        timer = setTimeout(updateText, isDeleting ? 100 : 200); 

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, wordIndex, words]);

    const handleGetStartedClick = () => {
        if(isAuthenticated){
            router.push('/dashboard')
        } else {
            signIn('google',{redirectTo: "/dashboard"})
        }
    }
        
    return (
        <div className="flex gap-8 font-primary_regular lg:px-0 px-4 flex-col text-white">
            <h1 className="text-[42px] leading-[42px] lg:text-[88px] lg:leading-[90px] flex flex-col gap-2 font-nohemiBold text-center lg:text-left">
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 items-center font-medium">
                    <span>Testimonials That</span>
                    <div className="relative overflow-hidden p-2 lg:py-3 lg:px-6 rounded-[20px] border-2 border-blue-400 min-w-[300px] lg:min-w-[450px]">
                        <div className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                            <span>{displayText}</span>
                            <span className="animate-pulse text-blue-400">|</span>
                        </div>
                    </div>
                </div>
                <div>No Wizardry Required !</div>
            </h1>
            <h2 className="text-[22px] leading-6 max-w-2xl">
                The all-in-one platform to gather, manage, and display customer testimonials.
                Boost your social proof and convert more leads with authentic feedback.
            </h2>
            <div className="flex gap-4 items-center justify-start">
                    <button onClick={handleGetStartedClick} className="bg-blue-500 hover:bg-blue-600 transition-colors px-6 py-3 rounded-[10px] flex flex-row gap-2 items-center text-[18px] leading-[22px]">
                        {!isAuthenticated ? "Get Started" : "Go To Dashboard"}
                        <ArrowRight />
                    </button>
            </div>
        </div>
    )
}

export default LandingHero
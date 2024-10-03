"use client"
import { ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const LandingHero = () => {
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

    return (
        <div className="flex gap-8 font-primary_regular lg:px-0 px-4 flex-col text-white">
            <h1 className="text-[42px] leading-[42px] lg:text-[96px] lg:leading-[96px] flex flex-col gap-2 font-nohemiBold">
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center font-medium">
                    <span>Testimonials That</span>
                    <div className="relative overflow-hidden py-3 px-6 rounded-[20px] border-2 border-blue-400 min-w-[300px] lg:min-w-[450px]">
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
                <a href="#" className="flex">
                    <button className="bg-blue-500 hover:bg-blue-600 transition-colors px-6 py-3 rounded-[10px] flex flex-row gap-2 items-center text-[18px] leading-[22px]">
                        Start Free Trial
                        <ArrowRight />
                    </button>
                </a>
            </div>
        </div>
    )
}

export default LandingHero
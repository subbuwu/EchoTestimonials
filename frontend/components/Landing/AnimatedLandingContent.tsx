'use client';
import React from "react";
import { motion } from "framer-motion";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import { ShiningCardSection } from "./ShiningCardSection";
import Footer from "./Footer";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function AnimatedLandingContent({isAuthenticated} :{isAuthenticated : boolean}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <motion.div
        className="flex justify-center w-full items-center mt-10"
        variants={childVariants}
      >
        <LandingHero isAuthenticated={isAuthenticated}/>
      </motion.div>
      <motion.div className="md:mt-28 mt-24 lg:mt-40 lg:px-0 px-4" variants={staggerChildren}>
        <motion.h2
          className="text-white mx-auto max-w-7xl font-primary_regular font-medium md:text-6xl text-3xl"
          variants={childVariants}
        >
          Features
        </motion.h2>
        <motion.div variants={childVariants}>
          <LandingFeatures />
        </motion.div>
      </motion.div>
      <motion.div>
        <ShiningCardSection/>
      </motion.div>
      <Footer/>
    </motion.div>
  );
}
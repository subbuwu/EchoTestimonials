'use client';
import React from "react";
import { motion } from "framer-motion";
import LandingHero from "../components/LandingHero";
import LandingFeatures from "../components/LandingFeatures";

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

export default function AnimatedLandingContent() {
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
        <LandingHero />
      </motion.div>
      <motion.div className="mt-40" variants={staggerChildren}>
        <motion.h2
          className="text-white mx-auto max-w-7xl font-primary_regular font-medium text-6xl"
          variants={childVariants}
        >
          Features
        </motion.h2>
        <motion.div variants={childVariants}>
          <LandingFeatures />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
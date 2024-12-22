"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";


const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.3,
    ease: "easeOut"
  }
};

export const PageTransition = ({ children , options } : { children : React.ReactNode , options?: any}) => {
  const pathname = usePathname();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        {...options}
        className="min-h-full"
      >
        <motion.div {...stagger}>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const StaggerItem = ({ children, delay = 0 } : { children : React.ReactNode , delay ?: number }) => (
  <motion.div
    {...staggerItem}
    transition={{ delay, ...staggerItem.transition }}
  >
    {children}
  </motion.div>
);
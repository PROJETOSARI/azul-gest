
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedFormItemProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedFormItem = ({ children, className, delay = 0 }: AnimatedFormItemProps) => {
  return (
    <motion.div
      className={cn("w-full", className)}
      variants={{
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          transition: { 
            duration: 0.5, 
            ease: [0.4, 0, 0.2, 1],
            delay 
          } 
        }
      }}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedFormItem;

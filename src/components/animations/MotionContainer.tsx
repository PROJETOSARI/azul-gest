
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MotionContainerProps {
  children: ReactNode;
  delay?: number;
}

export const MotionContainer = ({ children, delay = 0 }: MotionContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

export const MotionTableContainer = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Update the interface to include onClick as an optional prop
interface MotionTableRowProps {
  children: ReactNode;
  index?: number;
  className?: string;
  onClick?: () => void;
}

export const MotionTableRow = ({ 
  children, 
  index = 0, 
  className = "",
  onClick
}: MotionTableRowProps) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
      className={`border-b hover:bg-gray-50 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.tr>
  );
};

export const MotionCard = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

export const MotionPage = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      className="animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

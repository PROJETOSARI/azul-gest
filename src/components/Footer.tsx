
import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.div 
      className="w-full py-4 px-6 text-gray-600 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <p className="text-center">© 2025 OUT Sistemas. Todos os direitos reservados.</p>
    </motion.div>
  );
};

export default Footer;

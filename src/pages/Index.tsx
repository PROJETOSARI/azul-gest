
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MotionContainer } from '@/components/animations/MotionContainer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <MotionContainer>
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="text-center max-w-3xl px-6"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            OUT Sistemas
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Plataforma completa de gestão para administração pública
          </motion.p>
          
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg"
              onClick={() => navigate('/login')}
            >
              Acessar o Sistema
              <ArrowRight className="ml-2" />
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              © 2025 OUT Sistemas. Todos os direitos reservados.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionContainer>
  );
};

export default Index;

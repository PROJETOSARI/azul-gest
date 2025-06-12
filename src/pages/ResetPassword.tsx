import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { KeyRound, Loader, ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import AnimatedFormItem from '@/components/AnimatedFormItem';
import { useToast } from "@/components/ui/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  const { updatePassword, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Simple validation for demo purposes
    const checkRecoveryToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');

      if (type !== 'recovery') {
        toast({
          variant: "destructive",
          title: "Link inválido",
          description: "Este link de recuperação de senha é inválido ou expirou.",
        });
        navigate('/');
        return;
      }

      // For demo purposes, just set validation to false after a short delay
      setTimeout(() => {
        setIsValidating(false);
      }, 1000);
    };

    checkRecoveryToken();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas diferentes",
        description: "As senhas digitadas não correspondem.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    await updatePassword(password);
  };

  const containerVariants = {
    initial: { opacity: 1 },
    animate: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.2 
      } 
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center bg-neutral-100">
          <Card className="w-full max-w-sm border border-gray-200 bg-white shadow-lg rounded-xl animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Loader size={40} className="animate-spin text-brand-blue mb-4" />
              <p className="text-center text-gray-500">Validando seu link de recuperação...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center bg-neutral-100">
        <Card className="w-full max-w-sm border border-gray-200 bg-white shadow-lg rounded-xl animate-fade-in">
          <CardHeader className="space-y-2">
            <div className="flex justify-center mb-4">
              <img
                src="/lovable-uploads/548e9647-6dbb-4efd-85de-1f3c66260f57.png"
                alt="Logo Completa"
                className="h-auto w-auto max-h-16 object-contain"
              />
            </div>
            <CardTitle className="text-xl text-center">Redefinir Senha</CardTitle>
            <CardDescription className="text-center text-gray-500 text-base">
              Digite sua nova senha abaixo
            </CardDescription>
          </CardHeader>
          <motion.form 
            onSubmit={handleSubmit} 
            autoComplete="off"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <CardContent className="space-y-5 pt-2">
              <AnimatedFormItem>
                <label htmlFor="password" className="sr-only">Nova Senha</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nova senha"
                  className="text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoFocus
                />
              </AnimatedFormItem>
              
              <AnimatedFormItem delay={0.1}>
                <label htmlFor="confirmPassword" className="sr-only">Confirmar Senha</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmar nova senha"
                  className="text-base"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </AnimatedFormItem>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-6 pt-2">
              <AnimatedFormItem delay={0.2}>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader size={22} className="animate-spin text-white" />
                      <span>Processando...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <KeyRound size={20} className="text-white" />
                      <span>Atualizar Senha</span>
                    </span>
                  )}
                </Button>
              </AnimatedFormItem>
              
              <AnimatedFormItem delay={0.3}>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-500"
                >
                  <ArrowLeft size={16} />
                  <span>Voltar para o login</span>
                </Button>
              </AnimatedFormItem>
            </CardFooter>
          </motion.form>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;

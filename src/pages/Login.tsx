
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Loader, UserPlus, KeyRound, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import AnimatedFormItem from '@/components/AnimatedFormItem';
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, resetPassword, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'register') {
        if (password.length < 6) {
          toast({
            variant: "destructive",
            title: "Senha muito curta",
            description: "A senha deve ter pelo menos 6 caracteres.",
          });
          return;
        }
        await register(name, email, password);
      } else if (mode === 'forgot') {
        await resetPassword(email);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
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

  const getTitle = () => {
    switch(mode) {
      case 'login': return "Entrar";
      case 'register': return "Cadastrar";
      case 'forgot': return "Recuperar Senha";
      default: return "Entrar";
    }
  };

  const getDescription = () => {
    switch(mode) {
      case 'login': return "Acesse o sistema com seu e-mail e senha";
      case 'register': return "Crie sua conta para utilizar o sistema";
      case 'forgot': return "Informe seu e-mail para redefinir sua senha";
      default: return "Acesse o sistema com seu e-mail e senha";
    }
  };

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
            <CardDescription className="text-center text-gray-500 text-base">
              {getDescription()}
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
              {mode === 'register' && (
                <AnimatedFormItem>
                  <label htmlFor="name" className="sr-only">Nome</label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nome completo"
                    className="text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={mode === 'register'}
                    autoFocus={mode === 'register'}
                  />
                </AnimatedFormItem>
              )}
              
              <AnimatedFormItem delay={mode === 'login' ? 0 : 0.1}>
                <label htmlFor="email" className="sr-only">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="E-mail"
                  className="text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus={mode === 'login' || mode === 'forgot'}
                  autoComplete="username"
                />
              </AnimatedFormItem>
              
              {mode !== 'forgot' && (
                <AnimatedFormItem delay={mode === 'login' ? 0.1 : 0.2}>
                  <label htmlFor="senha" className="sr-only">Senha</label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Senha"
                    className="text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={mode !== 'forgot'}
                    minLength={6}
                    autoComplete="current-password"
                  />
                </AnimatedFormItem>
              )}
              
              {mode === 'login' && (
                <AnimatedFormItem delay={0.2}>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setMode('forgot');
                        setPassword('');
                      }}
                      className="text-sm text-brand-blue hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue rounded transition-colors duration-200 p-0"
                    >
                      Esqueceu a senha?
                    </Button>
                  </div>
                </AnimatedFormItem>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-6 pt-2">
              <AnimatedFormItem delay={mode === 'login' ? 0.3 : 0.3}>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader size={22} className="animate-spin text-white" />
                      <span>
                        {mode === 'login' && "Entrando..."}
                        {mode === 'register' && "Cadastrando..."}
                        {mode === 'forgot' && "Enviando..."}
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {mode === 'login' && (
                        <>
                          <LogIn size={20} className="text-white" />
                          <span>Entrar</span>
                        </>
                      )}
                      {mode === 'register' && (
                        <>
                          <UserPlus size={20} className="text-white" />
                          <span>Cadastrar</span>
                        </>
                      )}
                      {mode === 'forgot' && (
                        <>
                          <KeyRound size={20} className="text-white" />
                          <span>Recuperar Senha</span>
                        </>
                      )}
                    </span>
                  )}
                </Button>
              </AnimatedFormItem>
              
              {mode === 'forgot' ? (
                <AnimatedFormItem delay={0.4}>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setMode('login');
                      setPassword('');
                    }}
                    className="w-full flex items-center justify-center gap-2 text-sm text-gray-500"
                  >
                    <ArrowLeft size={16} />
                    <span>Voltar para o login</span>
                  </Button>
                </AnimatedFormItem>
              ) : (
                <AnimatedFormItem delay={0.4}>
                  <p className="text-center text-sm text-gray-500">
                    {mode === 'login' ? "Não tem uma conta?" : "Já possui uma conta?"}
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setMode(mode === 'login' ? 'register' : 'login');
                        setName('');
                        setPassword('');
                      }}
                      className="ml-1 text-brand-blue font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue rounded transition-colors duration-200 p-0"
                    >
                      {mode === 'login' ? "Cadastre-se" : "Entrar"}
                    </Button>
                  </p>
                </AnimatedFormItem>
              )}
            </CardFooter>
          </motion.form>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

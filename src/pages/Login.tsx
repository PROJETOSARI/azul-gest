
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Loader, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import AnimatedFormItem from '@/components/AnimatedFormItem';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      await login(email, password);
    } else {
      await register(name, email, password);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    // Clear form when switching modes
    setName('');
    setEmail('');
    setPassword('');
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
              {isLoginMode 
                ? "Acesse o sistema com seu e-mail e senha" 
                : "Crie sua conta para utilizar o sistema"}
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
              {!isLoginMode && (
                <AnimatedFormItem>
                  <label htmlFor="name" className="sr-only">Nome</label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nome completo"
                    className="text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLoginMode}
                    autoFocus={!isLoginMode}
                  />
                </AnimatedFormItem>
              )}
              
              <AnimatedFormItem delay={isLoginMode ? 0 : 0.1}>
                <label htmlFor="email" className="sr-only">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="E-mail"
                  className="text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus={isLoginMode}
                  autoComplete="username"
                />
              </AnimatedFormItem>
              
              <AnimatedFormItem delay={isLoginMode ? 0.1 : 0.2}>
                <label htmlFor="senha" className="sr-only">Senha</label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Senha"
                  className="text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
              </AnimatedFormItem>
              
              {isLoginMode && (
                <AnimatedFormItem delay={0.2}>
                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-sm text-brand-blue hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue rounded transition-colors duration-200">
                      Esqueceu a senha?
                    </Link>
                  </div>
                </AnimatedFormItem>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-6 pt-2">
              <AnimatedFormItem delay={isLoginMode ? 0.3 : 0.3}>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader size={22} className="animate-spin text-white" />
                      <span>{isLoginMode ? "Entrando..." : "Cadastrando..."}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isLoginMode ? (
                        <>
                          <LogIn size={20} className="text-white" />
                          <span>Entrar</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={20} className="text-white" />
                          <span>Cadastrar</span>
                        </>
                      )}
                    </span>
                  )}
                </Button>
              </AnimatedFormItem>
              
              <AnimatedFormItem delay={isLoginMode ? 0.4 : 0.4}>
                <p className="text-center text-sm text-gray-500">
                  {isLoginMode ? "Não tem uma conta?" : "Já possui uma conta?"}
                  <Button
                    type="button"
                    variant="link"
                    onClick={toggleMode}
                    className="ml-1 text-brand-blue font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue rounded transition-colors duration-200 p-0"
                  >
                    {isLoginMode ? "Cadastre-se" : "Entrar"}
                  </Button>
                </p>
              </AnimatedFormItem>
            </CardFooter>
          </motion.form>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

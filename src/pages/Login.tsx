
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, User, Lock, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#9B87F5] via-[#5271ff] to-[#1EAEDB] overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-60 h-60 bg-[#a3a1ff]/20 rounded-full top-10 left-[-4rem] blur-3xl animate-pulse-slow z-0"></div>
        <div className="absolute w-80 h-80 bg-[#ffaac9]/30 rounded-full bottom-20 right-[-5rem] blur-[90px] animate-pulse-extra z-0"></div>
      </div>
      <Card className="w-full max-w-md shadow-2xl border-none bg-white/30 backdrop-blur-xl glass-morphism animate-fade-in z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl text-center animate-fade-in text-gradient-primary drop-shadow">Login</CardTitle>
          <CardDescription className="text-center animate-fade-in delay-100">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} autoComplete="off">
          <CardContent className="space-y-5 pt-4">
            <div className="relative animate-slide-up delay-150">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={20} />
              </div>
              <Input
                type="email"
                placeholder="Email"
                className="pl-10 transition-all duration-300 shadow-input focus:shadow-lg hover:scale-105 focus:scale-105"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
            </div>
            <div className="space-y-2 animate-slide-up delay-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <Input
                  type="password"
                  placeholder="Senha"
                  className="pl-10 transition-all duration-300 shadow-input focus:shadow-lg hover:scale-105 focus:scale-105"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-brand-blue hover:underline transition-colors duration-300 animate-fade-in">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 animate-fade-in delay-250">
            <Button 
              type="submit" 
              className="w-full gradient-btn transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 focus:scale-105 flex items-center justify-center font-bold tracking-wide"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader size={22} className="animate-spin text-white" />
                  <span>Entrando...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={20} className="drop-shadow-sm" />
                  <span>Entrar</span>
                </span>
              )}
            </Button>
            <p className="text-center text-xs text-gray-600 animate-fade-in">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-brand-blue hover:underline transition-colors duration-300 font-semibold">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      <div className="mt-6 text-center text-xs text-white/80 z-10 absolute bottom-3 left-1/2 -translate-x-1/2 rounded-xl px-5 py-2 bg-black/10 backdrop-blur-sm animate-fade-in shadow">
        <p>Para teste, use: <span className="font-bold">admin@example.com</span> / <span className="font-bold">password123</span></p>
      </div>
      {/* Custom keyframes for animation */}
      <style>{`
        .animate-pulse-slow { animation: pulseSlow 7s infinite alternate linear; }
        .animate-pulse-extra { animation: pulseExtra 12s infinite alternate-reverse linear; }
        @keyframes pulseSlow {
          0% { transform: scale(0.92) translateY(0); }
          100% { transform: scale(1.08) translateY(7px); }
        }
        @keyframes pulseExtra {
          0% { transform: scale(1) rotate(-5deg);}
          100% { transform: scale(1.15) rotate(7deg);}
        }
        .text-gradient-primary {
          background: linear-gradient(100deg, #5271ff 20%, #9B87F5 60%, #1EAEDB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .shadow-input {
          box-shadow: 0 2px 8px 0 #846aff26;
        }
      `}</style>
    </div>
  );
};

export default Login;


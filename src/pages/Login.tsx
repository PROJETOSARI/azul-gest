
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, User, Lock } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-brand-blue animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center animate-slide-up">Login</CardTitle>
          <CardDescription className="text-center animate-slide-up delay-100">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="relative animate-slide-up delay-200">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <Input
                type="email"
                placeholder="Email"
                className="pl-10 transition-all duration-300 hover:border-brand-blue focus:border-brand-blue"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2 animate-slide-up delay-300">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <Input
                  type="password"
                  placeholder="Senha"
                  className="pl-10 transition-all duration-300 hover:border-brand-blue focus:border-brand-blue"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-brand-blue hover:underline transition-colors duration-300">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 animate-slide-up delay-400">
            <Button 
              type="submit" 
              className="w-full gradient-btn transition-all duration-300 hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn size={18} className="mr-2" />
                  Entrar
                </div>
              )}
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-brand-blue hover:underline transition-colors duration-300">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-6 text-center text-sm text-gray-500 absolute bottom-4">
        <p>Para teste, use: admin@example.com / password123</p>
      </div>
    </div>
  );
};

export default Login;

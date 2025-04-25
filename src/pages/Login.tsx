import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

const LOGIN_INFOS = [
  { label: "E-mail", value: "admin@example.com" },
  { label: "Senha", value: "Qualquer senha com 6+ caracteres" },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center bg-neutral-100">
        <Card className="w-full max-w-sm border border-gray-200 bg-white shadow-lg rounded-xl animate-fade-in">
          <CardHeader className="space-y-2">
            <CardTitle className="text-center text-3xl font-bold text-brand-blue tracking-tight">Entrar</CardTitle>
            <CardDescription className="text-center text-gray-500 text-base">Acesse o sistema com seu e-mail e senha</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} autoComplete="off">
            <CardContent className="space-y-5 pt-2">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="E-mail"
                  className="text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                />
              </div>
              <div>
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
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-brand-blue hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue rounded transition-colors duration-200">
                  Esqueceu a senha?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-2 pt-0">
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader size={22} className="animate-spin text-white" />
                    <span>Entrando...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn size={20} className="text-white" />
                    <span>Entrar</span>
                  </span>
                )}
              </Button>
              <p className="text-center text-sm text-gray-500">
                Não tem uma conta?
                <Link
                  to="/register"
                  className="ml-1 text-brand-blue font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue rounded transition-colors duration-200"
                >
                  Cadastre-se
                </Link>
              </p>
            </CardFooter>
          </form>
          <div className="p-4">
            <div className="bg-gray-100 rounded-md px-4 py-3 text-sm">
              <span className="font-semibold text-gray-800 block mb-2">Acesso Demo:</span>
              <ul className="space-y-1">
                {LOGIN_INFOS.map(({ label, value }) => (
                  <li key={label} className="flex items-center gap-2">
                    <span className="text-brand-blue">{label}:</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

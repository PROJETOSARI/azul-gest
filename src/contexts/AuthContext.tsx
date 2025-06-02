
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

// Define user type
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define context type
interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  isLoading: boolean;
  isPreparing: boolean;
  finishPreparation: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  isLoading: false,
  isPreparing: false,
  finishPreparation: () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if a user is logged in
  const isAuthenticated = !!user;
  
  // Function to finish preparation and navigate to dashboard
  const finishPreparation = () => {
    setIsPreparing(false);
    navigate('/dashboard');
  };

  // Login function - no validation needed, direct access
  const login = async () => {
    setIsLoading(true);
    
    try {
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a mock user - no validation needed
      const mockUser: UserData = {
        id: '1',
        name: 'Usuário Admin',
        email: 'admin@sistema.com',
        role: 'admin'
      };
      
      setUser(mockUser);
      
      toast({
        title: "Acesso liberado",
        description: "Bem-vindo ao sistema!",
      });
      
      // Set preparing state instead of redirecting
      setIsPreparing(true);
      navigate('/preparing');
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - mock implementation
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Cadastro realizado",
        description: "Conta criada com sucesso!",
      });
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Falha no cadastro",
        description: "Não foi possível criar sua conta.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function - mock implementation
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Instruções enviadas",
        description: "Verifique seu e-mail para redefinir sua senha.",
      });
      
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        variant: "destructive",
        title: "Falha ao enviar instruções",
        description: "Ocorreu um erro ao processar sua solicitação.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update password function - mock implementation
  const updatePassword = async (password: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });
      
      navigate('/');
      
    } catch (error: any) {
      console.error('Update password error:', error);
      toast({
        variant: "destructive",
        title: "Falha ao atualizar senha",
        description: "Ocorreu um erro ao processar sua solicitação.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsPreparing(false);
    
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso.",
    });
    
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout,
      register,
      resetPassword,
      updatePassword,
      isLoading, 
      isPreparing,
      finishPreparation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

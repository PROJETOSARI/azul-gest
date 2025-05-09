
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from '@supabase/supabase-js';

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
  login: (email: string, password: string) => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
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

  // Login function with Supabase
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Get user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      if (data.user) {
        setUser({
          id: data.user.id,
          name: profileData?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          role: 'user', // Default role
        });
        
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta!",
        });
        
        // Set preparing state instead of redirecting
        setIsPreparing(true);
        navigate('/preparing');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Falha no login",
        description: error?.message || "Credenciais inválidas.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register function with Supabase
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Create a new profile without going through Supabase signup
      // First check if a user with this email already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();
        
      if (existingUser) {
        throw new Error("Já existe um usuário com este e-mail.");
      }
      
      // Since Supabase signups are disabled, we'll display a message for now
      toast({
        variant: "destructive",
        title: "Cadastro indisponível",
        description: "No momento, não é possível criar novas contas. Entre em contato com o administrador para obter acesso.",
      });
      
      // Navigate back to login
      navigate('/');
      
      /* 
      To enable signups in the future, re-enable this code and enable signups in Supabase dashboard:
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Cadastro iniciado",
        description: "Por favor, verifique seu e-mail para confirmar o cadastro.",
      });
      */
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Falha no cadastro",
        description: error?.message || "Não foi possível criar sua conta.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Instruções enviadas",
        description: "Verifique seu e-mail para redefinir sua senha.",
      });
      
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        variant: "destructive",
        title: "Falha ao enviar instruções",
        description: error?.message || "Ocorreu um erro ao processar sua solicitação.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update password function
  const updatePassword = async (password: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });
      
      // Redirect to login page after password update
      navigate('/');
      
    } catch (error: any) {
      console.error('Update password error:', error);
      toast({
        variant: "destructive",
        title: "Falha ao atualizar senha",
        description: error?.message || "Ocorreu um erro ao processar sua solicitação.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsPreparing(false);
      
      toast({
        title: "Sessão encerrada",
        description: "Você foi desconectado com sucesso.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar desconectar.",
      });
    }
  };

  // Initialize authentication state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile when session changes
          setTimeout(async () => {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (profileError && profileError.code !== 'PGRST116') {
                console.error('Error fetching profile:', profileError);
              }
              
              setUser({
                id: session.user.id,
                name: profileData?.name || session.user.email?.split('@')[0] || 'User',
                email: session.user.email || '',
                role: 'user', // Default role
              });
            } catch (error) {
              console.error('Error in auth state change:', error);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        // Fetch user profile for existing session
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData, error: profileError }) => {
            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error fetching profile:', profileError);
            }
            
            setUser({
              id: session.user.id,
              name: profileData?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: 'user', // Default role
            });
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

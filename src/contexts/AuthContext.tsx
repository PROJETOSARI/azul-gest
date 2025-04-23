
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  isLoading: false,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// For demo purposes, we're using a mock user
const MOCK_USER: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if a user is logged in
  const isAuthenticated = !!user;

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo purposes:
    // - Accept any email that contains '@'
    // - Password must be at least 6 characters
    if (email.includes('@') && password.length >= 6) {
      setUser(MOCK_USER);
      
      // Store login state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password.",
      });
    }
    
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  // Check if user was previously logged in
  React.useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        setUser(MOCK_USER);
      }
    };
    
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

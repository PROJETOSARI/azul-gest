
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Tenta obter o tema do localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Verifica preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Retorna o tema salvo, ou a preferência do sistema, ou 'light' como fallback
    return (savedTheme as Theme) || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    // Salva o tema no localStorage
    localStorage.setItem('theme', theme);
    
    // Aplica a classe 'dark' no html quando o tema é escuro
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const contextValue = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

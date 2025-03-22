
import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
  });
  
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('highContrast') === 'true';
  });
  
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('reducedMotion') === 'true';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Set theme based on preference
    if (theme === 'system') {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemPreference);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    localStorage.setItem('highContrast', highContrast.toString());
  }, [highContrast]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    localStorage.setItem('reducedMotion', reducedMotion.toString());
  }, [reducedMotion]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      highContrast, 
      setHighContrast, 
      reducedMotion, 
      setReducedMotion 
    }}>
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

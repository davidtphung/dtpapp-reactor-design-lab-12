
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from './ui/button';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useAppContext();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full transition-all duration-300 hover:bg-secondary"
    >
      {theme === 'dark' ? (
        <Moon className="h-5 w-5 text-primary transition-all duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-primary transition-all duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;


import React from 'react';
import { Atom } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import ModeSelector from './ModeSelector';
import { useAppContext } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { userMode } = useAppContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center space-x-2">
          <Atom className="h-6 w-6 text-nuclear" />
          <span className="hidden text-xl font-semibold tracking-tight sm:inline-block">
            <span className="nuclear-text">Designing the Components of Nuclear Power</span>
          </span>
          <span className="text-xl font-semibold tracking-tight sm:hidden">
            <span className="nuclear-text">Nuclear Power</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <ModeSelector />
          <ThemeToggle />
        </div>
      </div>
      
      {userMode === 'kids' && (
        <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
          Kids Edition - Fun and Safe Learning Environment
        </div>
      )}
    </header>
  );
};

export default Navbar;

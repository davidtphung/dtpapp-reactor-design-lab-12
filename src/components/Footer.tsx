
import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border/40 bg-background py-4 transition-all duration-300">
      <div className="container flex flex-col items-center justify-center space-y-4 px-4 text-center md:px-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Presented by <a href="https://x.com/davidtphung" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">David T. Phung <ExternalLink className="ml-1 h-3 w-3" /></a>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <a href="https://davidtphung.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline inline-flex items-center">
              NLT143 <ExternalLink className="ml-1 h-3 w-3" />
            </a>
            <span className="hidden md:inline">•</span>
            <a href="https://warpcast.com/davidtphung" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline inline-flex items-center">
              Warpcast <ExternalLink className="ml-1 h-3 w-3" />
            </a>
            <span className="hidden md:inline">•</span>
            <a href="https://www.youtube.com/playlist?list=PLqchICbseuRpn8PqBDDXwnpAp5MI-9-zN" target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline inline-flex items-center">
              YouTube ☢️ Podcast <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;


import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { userMode, plantType } = useAppContext();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Here we would initialize and render the 3D scene with Three.js
    // For now, we'll just display a placeholder for the 3D reactor model

    // This would be where we'd set up the Three.js scene based on user mode
    console.log(`Canvas initialized with mode: ${userMode} and plant type: ${plantType}`);
  }, [userMode, plantType]);

  return (
    <div 
      ref={canvasRef} 
      className="relative flex items-center justify-center w-full h-full min-h-[400px] rounded-lg bg-secondary/30 border border-border transition-all duration-500"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
        <div className="w-32 h-32 rounded-full bg-nuclear/20 flex items-center justify-center mb-8 nuclear-glow">
          <div className="w-16 h-16 rounded-full bg-nuclear opacity-50"></div>
        </div>
        
        <h3 className="text-xl font-medium mb-2">
          {plantType === 'traditional' ? 'Traditional Nuclear Reactor' : 'Small Modular Reactor (SMR)'}
        </h3>
        
        <p className="text-muted-foreground mb-4 max-w-md">
          {userMode === 'kids' ? (
            'Drag and drop nuclear parts to build your power plant!'
          ) : userMode === 'novice' ? (
            'Select components from the library and place them in the reactor vessel.'
          ) : userMode === 'knowledge' ? (
            'Design your reactor with proper thermal-hydraulic considerations.'
          ) : (
            'Engineer a complete nuclear power system with full control over technical parameters.'
          )}
        </p>
        
        <div className="text-xs text-muted-foreground">
          (Interactive 3D canvas will be rendered here)
        </div>
      </div>
    </div>
  );
};

export default Canvas;

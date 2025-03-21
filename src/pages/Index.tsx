
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AppProvider, useAppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Canvas from '../components/Canvas';
import ComponentLibrary from '../components/ComponentLibrary';
import SimulationDashboard from '../components/SimulationDashboard';
import { ArrowRight, Atom, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Splash screen component
const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(completeTimer);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 20px 2px rgba(59, 130, 246, 0.3), 0 0 6px 1px rgba(59, 130, 246, 0.3)",
                "0 0 30px 4px rgba(59, 130, 246, 0.5), 0 0 10px 2px rgba(59, 130, 246, 0.5)",
                "0 0 20px 2px rgba(59, 130, 246, 0.3), 0 0 6px 1px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="w-24 h-24 rounded-full bg-nuclear/20 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-12 h-12 rounded-full bg-nuclear opacity-50 flex items-center justify-center"
            >
              <Atom className="h-8 w-8 text-white" />
            </motion.div>
          </motion.div>
        </div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold mb-2 nuclear-text"
        >
          Designing the Components of Nuclear Power
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground mb-8"
        >
          Interactive SMR & Reactor Simulator
        </motion.p>
        
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center"
          >
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span>Initializing simulator...</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button onClick={onComplete} className="space-x-2">
              <span>Begin Exploration</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Main application component
const MainApp: React.FC = () => {
  const { setPlantType } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid gap-8">
          <section className="mb-8">
            <div className="flex flex-wrap gap-6 items-center">
              <RadioGroup 
                defaultValue="traditional" 
                className="flex"
                onValueChange={(value) => setPlantType(value as 'traditional')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="traditional" id="traditional" />
                  <Label htmlFor="traditional" className="cursor-pointer">
                    Traditional Nuclear Power Plant
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Small Modular Reactor (SMR) - Coming Soon</span>
              </div>
            </div>
          </section>
          
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <ComponentLibrary />
            </div>
            
            <div className="lg:col-span-5">
              <Canvas />
              <div className="mt-3 text-sm text-center text-muted-foreground">
                <p>1. Drag components from the library on the left<br />
                2. Drop them onto the canvas to build your reactor like a Lego set<br />
                3. Use mouse to rotate view and scroll to zoom</p>
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <SimulationDashboard />
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Index page with AppProvider wrapper
const Index: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <MainApp />
    </AppProvider>
  );
};

export default Index;

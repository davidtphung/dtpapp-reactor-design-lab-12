import React, { createContext, useContext, useState, useEffect } from 'react';

type UserMode = 'kids' | 'novice' | 'knowledge' | 'expert';
type PlantType = 'traditional' | 'smr';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  plantType: PlantType;
  setPlantType: (type: PlantType) => void;
  isSimulating: boolean;
  setIsSimulating: (value: boolean) => void;
  simulationResults: SimulationResults | null;
  runSimulation: () => void;
  draggingComponent: string | null;
  setDraggingComponent: (component: string | null) => void;
}

interface SimulationResults {
  heatOutput: number;
  coreTemperature: number;
  neutronFlux: number;
  coolantFlow: number;
  constructionCost: number;
  licensingTimeline: number;
  nrcApproval: boolean;
  safetyRating: number;
}

const defaultContextValue: AppContextType = {
  theme: 'light',
  toggleTheme: () => {},
  userMode: 'novice',
  setUserMode: () => {},
  plantType: 'traditional',
  setPlantType: () => {},
  isSimulating: false,
  setIsSimulating: () => {},
  simulationResults: null,
  runSimulation: () => {},
  draggingComponent: null,
  setDraggingComponent: () => {},
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userMode, setUserMode] = useState<UserMode>('novice');
  const [plantType, setPlantType] = useState<PlantType>('traditional');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);
  const [draggingComponent, setDraggingComponent] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage or system preference for theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Check for saved user mode preference
    const savedMode = localStorage.getItem('userMode') as UserMode;
    if (savedMode && ['kids', 'novice', 'knowledge', 'expert'].includes(savedMode)) {
      setUserMode(savedMode);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const changeUserMode = (mode: UserMode) => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    
    // Simulate a delay to make it feel like computation is happening
    setTimeout(() => {
      // Generate mock simulation results based on user mode and plant type
      const mockResults: SimulationResults = {
        heatOutput: Math.floor(Math.random() * 1000) + 500, // 500-1500 MW
        coreTemperature: Math.floor(Math.random() * 300) + 250, // 250-550 °C
        neutronFlux: Math.floor(Math.random() * 5) + 10, // 10-15 units
        coolantFlow: Math.floor(Math.random() * 500) + 1000, // 1000-1500 kg/s
        constructionCost: Math.floor(Math.random() * 5) + 5, // $5-10 billion
        licensingTimeline: Math.floor(Math.random() * 24) + 36, // 36-60 months
        nrcApproval: Math.random() > 0.3, // 70% approval chance
        safetyRating: Math.floor(Math.random() * 3) + 8, // 8-10 rating
      };
      
      setSimulationResults(mockResults);
      setIsSimulating(false);
    }, 2000);
  };

  const contextValue: AppContextType = {
    theme,
    toggleTheme,
    userMode,
    setUserMode: changeUserMode,
    plantType,
    setPlantType,
    isSimulating,
    setIsSimulating,
    simulationResults,
    runSimulation,
    draggingComponent,
    setDraggingComponent,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

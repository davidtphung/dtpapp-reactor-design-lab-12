import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { motion } from 'framer-motion';
import { Gauge, Thermometer, Atom, Droplets, DollarSign, Calendar, FileCheck, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

const SimulationDashboard: React.FC = () => {
  const { userMode, isSimulating, simulationResults, runSimulation, missingComponents } = useAppContext();

  const getPlaceholderData = () => {
    if (userMode === 'kids') {
      return (
        <div className="space-y-4 p-2">
          <div className="space-y-2">
            <div className="flex items-center text-lg font-medium">
              <Thermometer className="mr-2 h-5 w-5 text-primary" />
              Heat
            </div>
            <Progress value={70} className="h-4" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-lg font-medium">
              <Shield className="mr-2 h-5 w-5 text-green-500" />
              Safety
            </div>
            <Progress value={90} className="h-4" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-lg font-medium">
              <DollarSign className="mr-2 h-5 w-5 text-yellow-500" />
              Cost
            </div>
            <Progress value={50} className="h-4" />
          </div>
        </div>
      );
    }

    if (userMode === 'novice') {
      return (
        <div className="space-y-3 p-2">
          <div className="space-y-1">
            <div className="flex items-center">
              <Gauge className="mr-2 h-4 w-4 text-primary" />
              Heat Output
            </div>
            <Progress value={75} className="h-3" />
            <div className="text-right text-xs text-muted-foreground">750 MW</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center">
              <Thermometer className="mr-2 h-4 w-4 text-orange-500" />
              Core Temperature
            </div>
            <Progress value={60} className="h-3" />
            <div className="text-right text-xs text-muted-foreground">320°C</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-green-500" />
              Construction Cost
            </div>
            <Progress value={80} className="h-3" />
            <div className="text-right text-xs text-muted-foreground">$8B</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-blue-500" />
              Safety Rating
            </div>
            <Progress value={90} className="h-3" />
            <div className="text-right text-xs text-muted-foreground">9/10</div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center p-4 text-muted-foreground">
        Run simulation to see detailed results
      </div>
    );
  };

  const renderMissingComponentsAlert = () => {
    if (!missingComponents || missingComponents.length === 0) return null;
    
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Missing Components</AlertTitle>
        <AlertDescription>
          Your reactor design is incomplete. Please add the following components before running the simulation:
          <ul className="list-disc ml-6 mt-2 space-y-1">
            {missingComponents.map((component, index) => (
              <li key={index}>{getComponentDisplayName(component)}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  const getComponentDisplayName = (componentType: string) => {
    const componentNames = {
      'core': 'Reactor Core',
      'cooling': 'Cooling Tower',
      'generator': 'Power Generator',
      'pipe': 'Pipes',
      'reactor-vessel': 'Reactor Vessel',
      'control-rods': 'Control Rods',
      'coolant-system': 'Coolant System',
      'steam-generator': 'Steam Generator',
      'turbine-generator': 'Turbine Generator',
      'pressure-vessel': 'Pressure Vessel',
      'fuel-assemblies': 'Fuel Assemblies',
      'control-rod-mechanism': 'Control Rod Mechanism',
      'primary-coolant-loop': 'Primary Coolant Loop',
      'secondary-loop-system': 'Secondary Loop System',
      'containment-structure': 'Containment Structure',
      'neutron-moderator': 'Neutron Moderator',
      'reactor-instrumentation': 'Reactor Instrumentation',
      'emergency-cooling': 'Emergency Cooling System',
      'fuel-management': 'Fuel Management System',
      'thermal-exchange': 'Thermal Exchange Network'
    };
    
    return componentNames[componentType] || componentType;
  };

  const getNRCRejectionReasons = () => {
    if (!simulationResults || simulationResults.nrcApproval) return null;
    
    const reasons = [
      {
        reason: "Insufficient Safety Systems",
        details: "The design lacks redundant safety features required by 10 CFR Part 50, Appendix A.",
        source: "https://www.nrc.gov/reading-rm/doc-collections/cfr/part050/part050-appa.html"
      },
      {
        reason: "Cooling System Inadequacies",
        details: "The cooling capacity doesn't meet NRC requirements for accident scenarios.",
        source: "https://www.nrc.gov/reactors/operating/ops-experience/grndwtr-contam-tritium.html"
      },
      {
        reason: "Containment Structure Issues",
        details: "Design doesn't comply with containment integrity requirements.",
        source: "https://www.nrc.gov/docs/ML1122/ML11223A249.pdf"
      },
      {
        reason: "Seismic Qualification Deficiencies",
        details: "Design doesn't meet NRC seismic requirements in 10 CFR Part 100.",
        source: "https://www.nrc.gov/reading-rm/doc-collections/cfr/part100/part100-0023.html"
      }
    ];
    
    return (
      <div className="mt-4 border border-destructive/50 rounded-md p-3 bg-destructive/10">
        <h4 className="font-semibold flex items-center text-destructive mb-2">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Potential NRC Rejection Reasons
        </h4>
        <ul className="space-y-2 text-xs">
          {reasons.map((item, index) => (
            <li key={index} className="pb-2 border-b border-border last:border-0 last:pb-0">
              <div className="font-medium mb-1">{item.reason}</div>
              <div className="text-muted-foreground mb-1">{item.details}</div>
              <a 
                href={item.source} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-500 hover:underline"
              >
                Source: NRC Documentation
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderResults = () => {
    if (isSimulating) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 p-4 h-full">
          <div className="w-16 h-16 rounded-full bg-nuclear/20 flex items-center justify-center mb-4 nuclear-glow">
            <div className="w-8 h-8 rounded-full bg-nuclear opacity-50"></div>
          </div>
          <p className="text-center text-muted-foreground animate-pulse">
            Running simulation...
          </p>
        </div>
      );
    }

    if (!simulationResults) {
      return getPlaceholderData();
    }

    if (userMode === 'kids') {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 p-2"
        >
          <div className="space-y-2">
            <div className="flex items-center text-lg font-medium">
              <Thermometer className="mr-2 h-5 w-5 text-primary" />
              Heat
            </div>
            <Progress value={(simulationResults.heatOutput / 1500) * 100} className="h-4" />
            <div className="text-right">Super Hot!</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-lg font-medium">
              <Shield className="mr-2 h-5 w-5 text-green-500" />
              Safety
            </div>
            <Progress value={simulationResults.safetyRating * 10} className="h-4" />
            <div className="text-right">
              {simulationResults.safetyRating > 9 ? 'Super Safe!' : 'Very Safe!'}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-lg font-medium">
              <DollarSign className="mr-2 h-5 w-5 text-yellow-500" />
              Cost
            </div>
            <Progress value={(simulationResults.constructionCost / 10) * 100} className="h-4" />
            <div className="text-right">
              {simulationResults.constructionCost < 7 ? 'Not too expensive!' : 'A bit pricey!'}
            </div>
          </div>
        </motion.div>
      );
    }

    if (userMode === 'novice') {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3 p-2"
        >
          <div className="space-y-1">
            <div className="flex items-center">
              <Gauge className="mr-2 h-4 w-4 text-primary" />
              Heat Output
            </div>
            <Progress value={(simulationResults.heatOutput / 1500) * 100} className="h-3" />
            <div className="text-right text-xs">{simulationResults.heatOutput} MW</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center">
              <Thermometer className="mr-2 h-4 w-4 text-orange-500" />
              Core Temperature
            </div>
            <Progress value={(simulationResults.coreTemperature / 550) * 100} className="h-3" />
            <div className="text-right text-xs">{simulationResults.coreTemperature}°C</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-green-500" />
              Construction Cost
            </div>
            <Progress value={(simulationResults.constructionCost / 10) * 100} className="h-3" />
            <div className="text-right text-xs">${simulationResults.constructionCost}B</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-purple-500" />
              Licensing Timeline
            </div>
            <Progress value={(simulationResults.licensingTimeline / 60) * 100} className="h-3" />
            <div className="text-right text-xs">{simulationResults.licensingTimeline} months</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-blue-500" />
              Safety Rating
            </div>
            <Progress value={simulationResults.safetyRating * 10} className="h-3" />
            <div className="text-right text-xs">{simulationResults.safetyRating}/10</div>
          </div>
        </motion.div>
      );
    }

    if (userMode === 'knowledge' || userMode === 'expert') {
      const existingJSX = (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3 p-2 text-sm"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center mb-1">
                <Gauge className="mr-2 h-4 w-4 text-primary" />
                Heat Output
              </div>
              <div className="font-medium">{simulationResults.heatOutput} MW</div>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <Thermometer className="mr-2 h-4 w-4 text-orange-500" />
                Core Temperature
              </div>
              <div className="font-medium">{simulationResults.coreTemperature}°C</div>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <Atom className="mr-2 h-4 w-4 text-blue-500" />
                Neutron Flux
              </div>
              <div className="font-medium">{simulationResults.neutronFlux} × 10¹³ n/cm²·s</div>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <Droplets className="mr-2 h-4 w-4 text-cyan-500" />
                Coolant Flow Rate
              </div>
              <div className="font-medium">{simulationResults.coolantFlow} kg/s</div>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                Construction Cost
              </div>
              <div className="font-medium">${simulationResults.constructionCost} billion</div>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                Licensing Timeline
              </div>
              <div className="font-medium">{simulationResults.licensingTimeline} months</div>
            </div>
          </div>
          
          <div className="pt-2 space-y-2">
            <div className="flex items-center">
              <FileCheck className="mr-2 h-4 w-4 text-indigo-500" />
              NRC Approval: 
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${simulationResults.nrcApproval ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'}`}>
                {simulationResults.nrcApproval ? 'Approved' : 'Not Approved'}
              </span>
            </div>
            
            <div className="flex items-center">
              <Shield className="mr-2 h-4 w-4 text-blue-500" />
              Safety Rating: 
              <span className="ml-2 font-medium">{simulationResults.safetyRating}/10</span>
            </div>
          </div>
          
          {!simulationResults.nrcApproval && getNRCRejectionReasons()}
        </motion.div>
      );
      
      return existingJSX;
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-lg border border-border bg-background">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Simulation Results</h2>
        <Button 
          onClick={runSimulation} 
          disabled={isSimulating || (missingComponents && missingComponents.length > 0)}
          className="transition-all duration-300"
        >
          Run Simulation
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {renderMissingComponentsAlert()}
        {renderResults()}
      </div>
    </div>
  );
};

export default SimulationDashboard;

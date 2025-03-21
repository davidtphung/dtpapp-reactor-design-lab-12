
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { 
  SquareStack, 
  Cylinder, 
  Pipette, 
  Container, 
  Gauge, 
  Zap, 
  ArrowDownUp 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ComponentItemProps {
  name: string;
  icon: React.ReactNode;
  description: string;
}

const ComponentItem: React.FC<ComponentItemProps> = ({ name, icon, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-4 cursor-pointer hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-center mb-2">
        <div className="mr-3 text-primary">
          {icon}
        </div>
        <h3 className="font-medium">{name}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </motion.div>
  );
};

const ComponentLibrary: React.FC = () => {
  const { userMode } = useAppContext();

  const kidsComponents = [
    {
      name: 'Reactor Core',
      icon: <SquareStack size={20} />,
      description: 'The heart of the nuclear plant where energy is made.'
    },
    {
      name: 'Cooling Tower',
      icon: <Cylinder size={20} />,
      description: 'Keeps the reactor from getting too hot.'
    },
    {
      name: 'Power Generator',
      icon: <Zap size={20} />,
      description: 'Makes electricity from heat energy.'
    }
  ];

  const noviceComponents = [
    {
      name: 'Reactor Vessel',
      icon: <Container size={20} />,
      description: 'Contains the nuclear fuel and controls the reaction.'
    },
    {
      name: 'Control Rods',
      icon: <ArrowDownUp size={20} />,
      description: 'Adjust the rate of the nuclear reaction.'
    },
    {
      name: 'Coolant System',
      icon: <Pipette size={20} />,
      description: 'Transfers heat from the reactor core.'
    },
    {
      name: 'Steam Generator',
      icon: <Gauge size={20} />,
      description: 'Converts water to steam for the turbine.'
    },
    {
      name: 'Turbine Generator',
      icon: <Zap size={20} />,
      description: 'Transforms steam energy into electrical power.'
    }
  ];

  const knowledgeComponents = [
    {
      name: 'Pressure Vessel',
      icon: <Container size={20} />,
      description: 'High-strength container for the reactor core operating at 15-17 MPa.'
    },
    {
      name: 'Fuel Assemblies',
      icon: <SquareStack size={20} />,
      description: 'Arranged UO2 fuel pellets in zirconium alloy tubes.'
    },
    {
      name: 'Control Rod Mechanism',
      icon: <ArrowDownUp size={20} />,
      description: 'Precision system for neutron absorption and reaction control.'
    },
    {
      name: 'Primary Coolant Loop',
      icon: <Pipette size={20} />,
      description: 'Circulates pressurized water to transfer thermal energy.'
    },
    {
      name: 'Secondary Loop System',
      icon: <Gauge size={20} />,
      description: 'Isolated steam generation system for turbine operation.'
    }
  ];

  const expertComponents = knowledgeComponents;

  const getComponentsByMode = () => {
    switch (userMode) {
      case 'kids':
        return kidsComponents;
      case 'novice':
        return noviceComponents;
      case 'knowledge':
        return knowledgeComponents;
      case 'expert':
        return expertComponents;
      default:
        return noviceComponents;
    }
  };

  const components = getComponentsByMode();

  return (
    <div className={cn(
      "w-full h-full overflow-auto rounded-lg border border-border bg-background p-4",
      userMode === 'kids' ? 'space-y-3' : 'space-y-2'
    )}>
      <h2 className="text-lg font-semibold mb-4">Component Library</h2>
      
      <div className="grid gap-3">
        {components.map((component, index) => (
          <ComponentItem 
            key={index}
            name={component.name}
            icon={component.icon}
            description={component.description}
          />
        ))}
      </div>
      
      <div className="pt-2 text-xs text-center text-muted-foreground">
        Drag components to the canvas to build your reactor
      </div>
    </div>
  );
};

export default ComponentLibrary;

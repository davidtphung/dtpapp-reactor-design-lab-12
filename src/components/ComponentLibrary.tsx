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
import { toast } from "@/components/ui/use-toast";

interface ComponentItemProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  componentType: string;
  onDragStart: (componentType: string) => void;
}

const ComponentItem: React.FC<ComponentItemProps> = ({ 
  name, 
  icon, 
  description, 
  componentType,
  onDragStart 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-4 cursor-grab hover:border-primary/30 transition-all duration-300"
      draggable
      onDragStart={() => onDragStart(componentType)}
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
  const { userMode, setDraggingComponent } = useAppContext();

  const handleDragStart = (componentType: string) => {
    setDraggingComponent(componentType);
    toast({
      title: "Component Selected",
      description: `Drag the ${componentType} to a valid location on the canvas`,
    });
  };

  const kidsComponents = [
    {
      name: 'Reactor Core',
      icon: <SquareStack size={20} />,
      description: 'The heart of the nuclear plant where energy is made.',
      componentType: 'core'
    },
    {
      name: 'Cooling Tower',
      icon: <Cylinder size={20} />,
      description: 'Keeps the reactor from getting too hot.',
      componentType: 'cooling'
    },
    {
      name: 'Power Generator',
      icon: <Zap size={20} />,
      description: 'Makes electricity from heat energy.',
      componentType: 'generator'
    },
    {
      name: 'Pipes',
      icon: <Pipette size={20} />,
      description: 'Connects parts of the reactor together.',
      componentType: 'pipe'
    }
  ];

  const noviceComponents = [
    {
      name: 'Reactor Vessel',
      icon: <Container size={20} />,
      description: 'Contains the nuclear fuel and controls the reaction.',
      componentType: 'reactor-vessel'
    },
    {
      name: 'Control Rods',
      icon: <ArrowDownUp size={20} />,
      description: 'Adjust the rate of the nuclear reaction.',
      componentType: 'control-rods'
    },
    {
      name: 'Coolant System',
      icon: <Pipette size={20} />,
      description: 'Transfers heat from the reactor core.',
      componentType: 'coolant-system'
    },
    {
      name: 'Steam Generator',
      icon: <Gauge size={20} />,
      description: 'Converts water to steam for the turbine.',
      componentType: 'steam-generator'
    },
    {
      name: 'Turbine Generator',
      icon: <Zap size={20} />,
      description: 'Transforms steam energy into electrical power.',
      componentType: 'turbine-generator'
    }
  ];

  const knowledgeComponents = [
    {
      name: 'Pressure Vessel',
      icon: <Container size={20} />,
      description: 'High-strength container for the reactor core operating at 15-17 MPa.',
      componentType: 'pressure-vessel'
    },
    {
      name: 'Fuel Assemblies',
      icon: <SquareStack size={20} />,
      description: 'Arranged UO2 fuel pellets in zirconium alloy tubes.',
      componentType: 'fuel-assemblies'
    },
    {
      name: 'Control Rod Mechanism',
      icon: <ArrowDownUp size={20} />,
      description: 'Precision system for neutron absorption and reaction control.',
      componentType: 'control-rod-mechanism'
    },
    {
      name: 'Primary Coolant Loop',
      icon: <Pipette size={20} />,
      description: 'Circulates pressurized water to transfer thermal energy.',
      componentType: 'primary-coolant-loop'
    },
    {
      name: 'Secondary Loop System',
      icon: <Gauge size={20} />,
      description: 'Isolated steam generation system for turbine operation.',
      componentType: 'secondary-loop-system'
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
            componentType={component.componentType || component.name.toLowerCase().replace(' ', '-')}
            onDragStart={handleDragStart}
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

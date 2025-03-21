
import React, { useRef, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Canvas as ThreeCanvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Cylinder, Box, CircleIcon, Info } from 'lucide-react';
import { Vector3 } from 'three';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

// Component to represent a reactor core
const ReactorCore = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.6, 0.6, 1.2, 32]} />
        <meshStandardMaterial color="#3a7e9e" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#666" metalness={0.5} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Component to represent cooling towers
const CoolingTower = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <mesh position={[position[0], position[1], position[2]]} scale={scale} castShadow>
      <cylinderGeometry args={[0.3, 0.6, 1.5, 32]} />
      <meshStandardMaterial color="#d1d5db" metalness={0.1} roughness={0.8} />
    </mesh>
  );
};

// Component to represent pipes
const Pipe = ({ start = [0, 0, 0], end = [1, 0, 0], radius = 0.08 }) => {
  const [x1, y1, z1] = start;
  const [x2, y2, z2] = end;
  
  // Calculate pipe length and orientation
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
  
  // Calculate center position
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const centerZ = (z1 + z2) / 2;
  
  // Calculate rotation (simplified version - only handles simple cases)
  const directionX = x2 - x1;
  const directionY = y2 - y1;
  const directionZ = z2 - z1;
  
  // Simple rotation for vertical/horizontal pipes
  let rotationX = 0;
  let rotationZ = 0;
  
  if (Math.abs(directionY) > Math.abs(directionX) && Math.abs(directionY) > Math.abs(directionZ)) {
    rotationX = Math.PI / 2; // Vertical pipe
  } else if (Math.abs(directionZ) > Math.abs(directionX)) {
    rotationZ = Math.PI / 2; // Pipe along Z axis
  }
  
  return (
    <mesh position={[centerX, centerY, centerZ]} rotation={[rotationX, 0, rotationZ]} castShadow>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
    </mesh>
  );
};

// Component to represent power generator
const PowerGenerator = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.8, 0.8]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.7, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Floor component
const Floor = () => {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
    </mesh>
  );
};

// Component selection indicator for dragging
const ComponentIndicator = ({ position, visible, component }) => {
  if (!visible) return null;
  
  let indicatorColor = "#10b981"; // Default green
  
  // Change color based on whether position is valid for placement
  const isValidPosition = true; // This would be determined by your placement rules
  if (!isValidPosition) {
    indicatorColor = "#ef4444"; // Red for invalid positions
  }
  
  return (
    <mesh position={position} scale={[0.5, 0.5, 0.5]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color={indicatorColor} transparent opacity={0.7} />
    </mesh>
  );
};

// Component to capture mouse interactions with the scene
const MouseInteractionHandler = ({ onPlaceComponent, updatePlacementIndicator }) => {
  const { raycaster, camera, mouse, scene } = useThree();
  
  useEffect(() => {
    const handleMouseMove = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        // Find the floor intersection
        const floorIntersection = intersects.find(
          intersect => intersect.object.rotation && 
          intersect.object.rotation.x === -Math.PI / 2
        );
        
        if (floorIntersection) {
          updatePlacementIndicator(floorIntersection.point);
        }
      }
    };
    
    handleMouseMove();
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [raycaster, camera, mouse, scene, updatePlacementIndicator]);
  
  useEffect(() => {
    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        // Find the floor intersection
        const floorIntersection = intersects.find(
          intersect => intersect.object.rotation && 
          intersect.object.rotation.x === -Math.PI / 2
        );
        
        if (floorIntersection) {
          onPlaceComponent(floorIntersection.point);
        }
      }
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [raycaster, camera, mouse, scene, onPlaceComponent]);
  
  return null;
};

// Advanced component renderers for knowledge and expert modes
const PressureVessel = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.7, 0.7, 1.5, 32]} />
        <meshStandardMaterial color="#2a4365" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#718096" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

const FuelAssemblies = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 1.2, 0.8]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Fuel rods */}
      {[-0.2, 0, 0.2].map((x, i) => 
        [-0.2, 0, 0.2].map((z, j) => (
          <mesh key={`rod-${i}-${j}`} position={[x, 0.1, z]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.4, 12]} />
            <meshStandardMaterial color="#d97706" metalness={0.5} roughness={0.4} />
          </mesh>
        ))
      )}
    </group>
  );
};

const ControlRodMechanism = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[1, 0.3, 1]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Control rods */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={`control-rod-${i}`} position={[x, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1.2, 12]} />
          <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0.4, 0.2, 0]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#4b5563" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
};

const PrimaryCoolantLoop = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      {/* Main pipes */}
      <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.6, 0.1, 16, 100, Math.PI * 2]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
};

const SecondaryLoopSystem = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      {/* Heat exchanger */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 0.7, 0.7]} />
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Pipes */}
      <mesh position={[0.7, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.7, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
};

// Additional components for expert level
const NeutronModerator = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.8, 24]} />
        <meshStandardMaterial color="#4ade80" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial color="#22c55e" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
};

const ReactorInstrumentation = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.4, 0.6]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Displays */}
      {[-0.2, 0.2].map((x, i) => (
        <mesh key={`display-${i}`} position={[x, 0.25, 0]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.4]} />
          <meshStandardMaterial color="#0ea5e9" metalness={0.8} roughness={0.2} emissive="#0ea5e9" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const EmergencyCooling = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.9, 24]} />
        <meshStandardMaterial color="#0369a1" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.7, 0.3, 0.7]} />
        <meshStandardMaterial color="#0284c7" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Pipes */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={`pipe-${i}`} position={[x, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 12]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

const FuelManagement = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.4, 0.8]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Grid pattern */}
      {[-0.3, 0, 0.3].map((x, i) => 
        [-0.2, 0.2].map((z, j) => (
          <mesh key={`grid-${i}-${j}`} position={[x, 0.25, z]} castShadow>
            <boxGeometry args={[0.2, 0.1, 0.2]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.4} />
          </mesh>
        ))
      )}
    </group>
  );
};

const ThermalExchange = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[1.0, 0.6, 0.6]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Heat exchanger fins */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`fin-${i}`} position={[i * 0.2 - 0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.05, 0.8, 0.5]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const ContainmentStructure = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[1.2, 1.2, 2.0, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1.2, 0.4, 32]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.3} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
};

// For novice components
const ReactorVessel = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.65, 0.65, 1.3, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

const ControlRods = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.9, 0.2, 0.9]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Rods */}
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={`rod-${i}`} position={[x, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

const CoolantSystem = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.8, 24]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 16]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
};

const SteamGenerator = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.2, 24]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 0.2, 24]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
};

const TurbineGenerator = ({ position = [0, 0, 0], scale = 1 }) => {
  return (
    <group position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh castShadow>
        <boxGeometry args={[1.4, 0.6, 0.7]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.8, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Dynamic reactor model based on placed components
const DynamicReactorModel = ({ placedComponents, missingComponents, userMode }) => {
  return (
    <group>
      <Floor />
      
      {placedComponents.map((component, index) => {
        const { type, position, scale } = component;
        
        switch (type) {
          // Kids components
          case 'core':
            return <ReactorCore key={index} position={position} scale={scale || 1} />;
          case 'cooling':
            return <CoolingTower key={index} position={position} scale={scale || 1} />;
          case 'generator':
            return <PowerGenerator key={index} position={position} scale={scale || 1} />;
          case 'pipe':
            return (
              <mesh key={index} position={position} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.5, 12]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
              </mesh>
            );
            
          // Novice components
          case 'reactor-vessel':
            return <ReactorVessel key={index} position={position} scale={scale || 1} />;
          case 'control-rods':
            return <ControlRods key={index} position={position} scale={scale || 1} />;
          case 'coolant-system':
            return <CoolantSystem key={index} position={position} scale={scale || 1} />;
          case 'steam-generator':
            return <SteamGenerator key={index} position={position} scale={scale || 1} />;
          case 'turbine-generator':
            return <TurbineGenerator key={index} position={position} scale={scale || 1} />;
            
          // Knowledge components
          case 'pressure-vessel':
            return <PressureVessel key={index} position={position} scale={scale || 1} />;
          case 'fuel-assemblies':
            return <FuelAssemblies key={index} position={position} scale={scale || 1} />;
          case 'control-rod-mechanism':
            return <ControlRodMechanism key={index} position={position} scale={scale || 1} />;
          case 'primary-coolant-loop':
            return <PrimaryCoolantLoop key={index} position={position} scale={scale || 1} />;
          case 'secondary-loop-system':
            return <SecondaryLoopSystem key={index} position={position} scale={scale || 1} />;
          case 'containment-structure':
            return <ContainmentStructure key={index} position={position} scale={scale || 1} />;
            
          // Expert components
          case 'neutron-moderator':
            return <NeutronModerator key={index} position={position} scale={scale || 1} />;
          case 'reactor-instrumentation':
            return <ReactorInstrumentation key={index} position={position} scale={scale || 1} />;
          case 'emergency-cooling':
            return <EmergencyCooling key={index} position={position} scale={scale || 1} />;
          case 'fuel-management':
            return <FuelManagement key={index} position={position} scale={scale || 1} />;
          case 'thermal-exchange':
            return <ThermalExchange key={index} position={position} scale={scale || 1} />;
            
          default:
            console.log("Unknown component type:", type);
            return null;
        }
      })}
    </group>
  );
};

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { userMode, plantType, draggingComponent, setDraggingComponent } = useAppContext();
  const [indicatorPosition, setIndicatorPosition] = useState([0, 0, 0]);
  const [placedComponents, setPlacedComponents] = useState([]);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [missingComponents, setMissingComponents] = useState<string[]>([]);
  const [showMissingComponentInfo, setShowMissingComponentInfo] = useState(false);

  // Handles component placement
  const handlePlaceComponent = (position) => {
    if (!draggingComponent) return;
    
    const newComponent = {
      type: draggingComponent,
      position: [position.x, position.y, position.z],
      scale: draggingComponent === 'core' ? 1.2 : 1
    };
    
    const newComponents = [...placedComponents, newComponent];
    setPlacedComponents(newComponents);
    setDraggingComponent(null);
    
    // Show toast notification
    toast({
      title: "Component Placed",
      description: `Successfully placed ${draggingComponent}`
    });
    
    // Check for completion and missing components
    checkCompletionAndMissing(newComponents);
  };
  
  // Updates indicator position for component placement preview
  const updatePlacementIndicator = (position) => {
    setIndicatorPosition([position.x, position.y, position.z]);
  };
  
  // Checks if reactor is complete based on required components and identifies missing components
  const checkCompletionAndMissing = (components) => {
    const requiredComponentsByMode = {
      'kids': {
        'traditional': ['core', 'cooling', 'generator', 'pipe'],
        'smr': ['core', 'generator', 'pipe']
      },
      'novice': {
        'traditional': ['reactor-vessel', 'control-rods', 'coolant-system', 'steam-generator', 'turbine-generator'],
        'smr': ['reactor-vessel', 'control-rods', 'coolant-system', 'turbine-generator']
      },
      'knowledge': {
        'traditional': ['pressure-vessel', 'fuel-assemblies', 'control-rod-mechanism', 'primary-coolant-loop', 'secondary-loop-system', 'containment-structure'],
        'smr': ['pressure-vessel', 'fuel-assemblies', 'control-rod-mechanism', 'primary-coolant-loop', 'secondary-loop-system']
      },
      'expert': {
        'traditional': ['pressure-vessel', 'fuel-assemblies', 'control-rod-mechanism', 'primary-coolant-loop', 'secondary-loop-system', 'containment-structure', 'neutron-moderator', 'reactor-instrumentation', 'emergency-cooling'],
        'smr': ['pressure-vessel', 'fuel-assemblies', 'control-rod-mechanism', 'primary-coolant-loop', 'secondary-loop-system', 'neutron-moderator', 'emergency-cooling']
      }
    };
    
    const required = requiredComponentsByMode[userMode]?.[plantType] || requiredComponentsByMode['novice'][plantType];
    const placed = components.map(c => c.type);
    
    // Find missing components
    const missing = required.filter(type => !placed.includes(type));
    setMissingComponents(missing);
    
    const hasAllRequired = missing.length === 0;
    
    if (hasAllRequired && !showCompletionMessage) {
      setShowCompletionMessage(true);
      
      toast({
        title: "Reactor Complete!",
        description: `Your ${plantType === 'traditional' ? 'Traditional Reactor' : 'SMR'} is now fully assembled.`,
        variant: "default"
      });
      
      setTimeout(() => setShowCompletionMessage(false), 5000);
    }
  };
  
  // Handle canvas drag events for component placement
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggingComponent) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    const y = -((e.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;
    
    // Simple placement - in a real app, you would raytrace to find 3D position
    const newComponent = {
      type: draggingComponent,
      position: [x * 3, 0, y * 3],
      scale: draggingComponent === 'core' ? 1.2 : 1
    };
    
    const newComponents = [...placedComponents, newComponent];
    setPlacedComponents(newComponents);
    setDraggingComponent(null);
    
    // Show toast notification
    toast({
      title: "Component Placed",
      description: `Successfully placed ${draggingComponent}`
    });
    
    // Check for completion
    checkCompletionAndMissing(newComponents);
  };
  
  const resetSimulation = () => {
    setPlacedComponents([]);
    setMissingComponents([]);
    setShowCompletionMessage(false);
    toast({
      title: "Simulation Reset",
      description: "Start building your reactor from scratch"
    });
  };

  // Get component display name for UI
  const getComponentDisplayName = (componentType) => {
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

  return (
    <div 
      ref={canvasRef} 
      className="relative w-full h-full min-h-[400px] rounded-lg bg-secondary/30 border border-border transition-all duration-500 overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Add instructions at the top of the canvas */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 p-3 text-center border-b border-border">
        <h3 className="font-medium mb-1">Putting Together the Components of Nuclear Energy</h3>
        <p className="text-sm text-muted-foreground">
          1. Drag components from the library on the left
          2. Drop them onto the canvas to build your reactor like a Lego set
          3. Use mouse to rotate view and scroll to zoom
        </p>
      </div>
      
      <ThreeCanvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        
        <DynamicReactorModel 
          placedComponents={placedComponents} 
          missingComponents={missingComponents}
          userMode={userMode}
        />
        
        <ComponentIndicator 
          position={indicatorPosition} 
          visible={draggingComponent !== null}
          component={draggingComponent} 
        />
        
        <MouseInteractionHandler 
          onPlaceComponent={handlePlaceComponent}
          updatePlacementIndicator={updatePlacementIndicator}
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
        />
        <Environment preset="city" />
      </ThreeCanvas>
      
      {userMode === 'kids' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 p-2 px-4 rounded-full text-sm">
          Drag parts from the left to build your reactor!
        </div>
      )}
      
      {userMode === 'expert' && (
        <div className="absolute top-20 right-2 bg-background/80 p-2 rounded text-xs space-y-1">
          <div className="flex items-center space-x-2">
            <Box size={12} />
            <span>Use WASD to pan</span>
          </div>
          <div className="flex items-center space-x-2">
            <Cylinder size={12} />
            <span>Scroll to zoom</span>
          </div>
          <div className="flex items-center space-x-2">
            <CircleIcon size={12} />
            <span>Drag to rotate</span>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {missingComponents.length > 0 && (
          <Button
            onClick={() => setShowMissingComponentInfo(!showMissingComponentInfo)}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Info size={16} className="mr-1" />
            Missing Components
          </Button>
        )}
        
        <Button
          onClick={resetSimulation}
          size="sm"
          className="bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          Reset
        </Button>
      </div>
      
      {showMissingComponentInfo && missingComponents.length > 0 && (
        <div className="absolute top-20 left-8 bg-background/95 p-4 rounded-md border border-border shadow-lg z-20 max-w-xs">
          <h3 className="font-medium mb-2 text-destructive">Missing Components</h3>
          <p className="text-xs text-muted-foreground mb-2">
            Your reactor requires these additional components to function properly:
          </p>
          <ul className="text-sm space-y-1 list-disc pl-4">
            {missingComponents.map((comp, idx) => (
              <li key={idx}>{getComponentDisplayName(comp)}</li>
            ))}
          </ul>
          <p className="text-xs mt-3 text-muted-foreground">
            Drag these components from the library to complete your reactor design.
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2 w-full"
            onClick={() => setShowMissingComponentInfo(false)}
          >
            Close
          </Button>
        </div>
      )}
      
      {showCompletionMessage && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white p-2 px-4 rounded-md text-sm animate-bounce">
          Reactor Complete! 🎉
        </div>
      )}
    </div>
  );
};

export default Canvas;

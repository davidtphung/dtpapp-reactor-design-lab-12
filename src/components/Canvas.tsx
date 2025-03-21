
import React, { useRef, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Canvas as ThreeCanvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Cylinder, Box, CircleIcon } from 'lucide-react';
import { Vector3 } from 'three';
import { toast } from "@/components/ui/use-toast";

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

// Dynamic reactor model based on placed components
const DynamicReactorModel = ({ placedComponents }) => {
  return (
    <group>
      <Floor />
      
      {placedComponents.map((component, index) => {
        const { type, position, scale } = component;
        
        switch (type) {
          case 'core':
            return <ReactorCore key={index} position={position} scale={scale || 1} />;
          case 'cooling':
            return <CoolingTower key={index} position={position} scale={scale || 1} />;
          case 'generator':
            return <PowerGenerator key={index} position={position} scale={scale || 1} />;
          case 'pipe':
            // For simplicity, pipes are placed as single points
            // In a more complex implementation, you would connect them between components
            return (
              <mesh key={index} position={position} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 0.5, 12]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
              </mesh>
            );
          default:
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

  // Handles component placement
  const handlePlaceComponent = (position) => {
    if (!draggingComponent) return;
    
    const newComponent = {
      type: draggingComponent,
      position: [position.x, position.y, position.z],
      scale: draggingComponent === 'core' ? 1.2 : 1
    };
    
    setPlacedComponents([...placedComponents, newComponent]);
    setDraggingComponent(null);
    
    // Show toast notification
    toast({
      title: "Component Placed",
      description: `Successfully placed ${draggingComponent}`
    });
    
    // Check for completion
    checkCompletion([...placedComponents, newComponent]);
  };
  
  // Updates indicator position for component placement preview
  const updatePlacementIndicator = (position) => {
    setIndicatorPosition([position.x, position.y, position.z]);
  };
  
  // Checks if reactor is complete based on required components
  const checkCompletion = (components) => {
    const requiredComponents = {
      'traditional': ['core', 'cooling', 'generator', 'pipe'],
      'smr': ['core', 'generator', 'pipe']
    };
    
    const required = requiredComponents[plantType];
    const placed = components.map(c => c.type);
    
    const hasAllRequired = required.every(type => placed.includes(type));
    
    if (hasAllRequired && !showCompletionMessage) {
      setShowCompletionMessage(true);
      
      toast({
        title: "Reactor Complete!",
        description: `Your ${plantType === 'traditional' ? 'Traditional Reactor' : 'SMR'} is now fully assembled.`,
        variant: "success"
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
    
    setPlacedComponents([...placedComponents, newComponent]);
    setDraggingComponent(null);
    
    // Show toast notification
    toast({
      title: "Component Placed",
      description: `Successfully placed ${draggingComponent}`
    });
    
    // Check for completion
    checkCompletion([...placedComponents, newComponent]);
  };
  
  const resetSimulation = () => {
    setPlacedComponents([]);
    toast({
      title: "Simulation Reset",
      description: "Start building your reactor from scratch"
    });
  };

  return (
    <div 
      ref={canvasRef} 
      className="relative w-full h-full min-h-[400px] rounded-lg bg-secondary/30 border border-border transition-all duration-500 overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ThreeCanvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        
        <DynamicReactorModel placedComponents={placedComponents} />
        
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
        <div className="absolute top-2 right-2 bg-background/80 p-2 rounded text-xs space-y-1">
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
      
      <button
        onClick={resetSimulation}
        className="absolute bottom-4 right-4 bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 transition-colors"
      >
        Reset
      </button>
      
      {showCompletionMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white p-2 px-4 rounded-md text-sm animate-bounce">
          Reactor Complete! 🎉
        </div>
      )}
    </div>
  );
};

export default Canvas;

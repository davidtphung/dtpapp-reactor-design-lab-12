
import React, { useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, Environment } from '@react-three/drei';
import { Cylinder, Box, CircleIcon } from 'lucide-react';

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

// Traditional Reactor Model
const TraditionalReactor = () => {
  return (
    <group>
      <ReactorCore position={[0, 0, 0]} scale={1.5} />
      <CoolingTower position={[-2, 0, -1]} scale={1.5} />
      <CoolingTower position={[-2, 0, 1]} scale={1.5} />
      <PowerGenerator position={[2, -0.5, 0]} scale={1} />
      <Pipe start={[0.5, 0, 0]} end={[1.8, 0, 0]} />
      <Pipe start={[-0.5, 0, 0]} end={[-1.7, 0, -1]} />
      <Pipe start={[-0.5, 0, 0]} end={[-1.7, 0, 1]} />
      <Floor />
    </group>
  );
};

// SMR Reactor Model
const SmrReactor = () => {
  return (
    <group>
      <ReactorCore position={[0, 0, 0]} scale={1} />
      <CoolingTower position={[-1.5, 0, 0]} scale={1} />
      <PowerGenerator position={[1.5, -0.5, 0]} scale={0.8} />
      <Pipe start={[0.4, 0, 0]} end={[1.3, 0, 0]} />
      <Pipe start={[-0.4, 0, 0]} end={[-1.3, 0, 0]} />
      <Floor />
    </group>
  );
};

// Main component selector based on plant type
const ReactorModel = () => {
  const { plantType } = useAppContext();
  
  return plantType === 'traditional' ? <TraditionalReactor /> : <SmrReactor />;
};

// Component selection indicator for dragging
const ComponentIndicator = ({ position, visible, component }) => {
  if (!visible) return null;
  
  return (
    <mesh position={position} scale={[0.5, 0.5, 0.5]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#10b981" transparent opacity={0.7} />
    </mesh>
  );
};

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { userMode, plantType } = useAppContext();
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [dragPosition, setDragPosition] = useState([0, 0, 0]);

  const handleCanvasClick = (event) => {
    console.log('Canvas clicked', event.point);
    // Here you would handle placement of components
  };

  return (
    <div 
      ref={canvasRef} 
      className="relative w-full h-full min-h-[400px] rounded-lg bg-secondary/30 border border-border transition-all duration-500 overflow-hidden"
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
        <ReactorModel />
        <ComponentIndicator 
          position={dragPosition} 
          visible={draggingComponent !== null}
          component={draggingComponent} 
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
    </div>
  );
};

export default Canvas;

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RobotModel from './Robotmodel';
import { ErrorBoundary } from './ErrorBoundary';
import * as THREE from 'three';

// Add this CSS at the top of your file or in your CSS file


function Robo() {
  return (
    <ErrorBoundary>
      <div>
        <Canvas
          camera={{ position: [0, 2, 6], fov: 50 }} // Adjusted camera position
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputEncoding: THREE.sRGBEncoding
          }}
        >
          <color attach="background" args={['#202030']} />
          <fog attach="fog" args={['#202030', 5, 20]} />
          <ambientLight intensity={0.2} />
          
          {/* 360-degree lighting setup */}
          {[0, 72, 144, 216, 288].map((angle) => (
            <directionalLight 
              key={angle}
              position={[
                5 * Math.cos(angle * (Math.PI / 180)),
                5,
                5 * Math.sin(angle * (Math.PI / 180))
              ]}
              intensity={0.4}
              castShadow
            />
          ))}
          
          <pointLight 
            position={[-5, -5, -5]} 
            intensity={0.5}
            color="#ff7d46"
          />
          <spotLight 
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={0.8}
            castShadow
          />
          <RobotModel />
          <OrbitControls 
            enableDamping
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={15}
          />
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            receiveShadow
          >
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#202020" roughness={0.8} metalness={0.2} />
          </mesh>
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}

export default Robo;

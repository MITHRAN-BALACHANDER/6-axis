import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import RobotModel from "./Robotmodel";
import { ErrorBoundary } from "./ErrorBoundary";
import * as THREE from "three";
import useWindowSize from "../hooks/useWindowSize"; // Import the custom hook

export default function Robo({ jointAngles, setJointAngles }) {
  const { width } = useWindowSize();
  const isMobile = width < 768; // Example breakpoint for mobile

  const gridConfig = {
    cellSize: 0.5,
    cellColor: '#cccccc',
    sectionSize: 3,
    sectionColor: '#999999',
    infiniteGrid: true,
  };

  // Adjust camera settings for mobile
  const cameraSettings = {
    position: isMobile ? [5, 3, 6] : [3, 2, 5],
    fov: isMobile ? 60 : 45,
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <ErrorBoundary>
        <Canvas
          shadows
          camera={cameraSettings}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <color attach="background" args={["#f0f0f0"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <Suspense fallback={null}>
            <RobotModel 
              jointAngles={jointAngles}
              setJointAngles={setJointAngles}
            />
          </Suspense>
          <Grid {...gridConfig} />
          <OrbitControls makeDefault />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

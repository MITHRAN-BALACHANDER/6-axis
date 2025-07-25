import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import RobotModel from "./Robotmodel";
import { ErrorBoundary } from "./ErrorBoundary";
import * as THREE from "three";

export default function Robo({ guiContainerRef, jointAngles, setJointAngles }) {
  const gridConfig = {
    cellSize: 0.5,
    cellColor: '#cccccc',
    sectionSize: 3,
    sectionColor: '#999999',
    infiniteGrid: true,
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <ErrorBoundary>
        <Canvas
          shadows
          camera={{ position: [3, 2, 5], fov: 45 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputEncoding: THREE.sRGBEncoding,
          }}
        >
          <color attach="background" args={["#f0f0f0"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <Suspense fallback={null}>
            <RobotModel 
              guiContainerRef={guiContainerRef}
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

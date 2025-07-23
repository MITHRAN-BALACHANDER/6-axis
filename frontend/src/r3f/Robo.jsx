import React from "react";
import { Canvas } from "@react-three/fiber";
import RobotModel from "./Robotmodel";
import { ErrorBoundary } from "./ErrorBoundary";
import * as THREE from "three";
import { Grid, OrbitControls } from "@react-three/drei";

export default function Robo({ guiContainerRef }) {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 1,
    cellColor: '#cccccc',
    sectionSize: 3,
    sectionThickness: 1.5,
    sectionColor: '#999999',
    fadeDistance: 30,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };

  return (
    <ErrorBoundary>
      <div
        className="
          w-full max-w-full h-full min-h-[320px] 
          sm:min-h-[400px] md:min-h-[520px]
          rounded-2xl overflow-hidden flex items-center justify-center
          bg-white shadow-md
        "
      >
        <Canvas
          camera={{ position: [0, 2, 6], fov: 45 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputEncoding: THREE.sRGBEncoding,
          }}
          shadows
          style={{ width: "100%", height: "100%" }}
        >
          <color attach="background" args={["#ffffff"]} />
          <ambientLight intensity={0.35} />
          {[0, 72, 144, 216, 288].map((angle) => (
            <directionalLight
              key={angle}
              position={[
                7 * Math.cos((angle * Math.PI) / 180),
                6,
                7 * Math.sin((angle * Math.PI) / 180),
              ]}
              intensity={0.2}
              castShadow
            />
          ))}
          <pointLight position={[-5, -5, -5]} intensity={0.36} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.32}
            penumbra={0.95}
            intensity={0.55}
            castShadow
          />

          {/* ---- CORRECTION: WRAP MODEL IN A GROUP TO ALIGN IT ---- */}
          {/* Adjust the y position as needed for your specific model. */}
          {/* A small positive value usually lifts it to sit on the grid. */}
          <group position={[0, 0, 0]}>
            <RobotModel guiContainerRef={guiContainerRef} />
          </group>

          <Grid {...gridConfig} />
          <OrbitControls makeDefault />

        </Canvas>
      </div>
    </ErrorBoundary>
  );
}

import React from "react";
import { Canvas } from "@react-three/fiber";
import RobotModel from "./Robotmodel";
import { ErrorBoundary } from "./ErrorBoundary";
import * as THREE from "three";

export default function Robo({ guiContainerRef }) {
  return (
    <ErrorBoundary>
      <div className="w-full h-full min-h-[520px] min-w-[320px]">
        <Canvas
          camera={{ position: [0, 2, 6], fov: 45 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputEncoding: THREE.sRGBEncoding,
          }}
          shadows
        >
          <color attach="background" args={["#ecf4fd"]} />
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
          <RobotModel guiContainerRef={guiContainerRef} />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}

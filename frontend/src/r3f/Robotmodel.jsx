import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as dat from "dat.gui";

// Default control values
const defaultControls = {
  A1: 0,
  A2: 0,
  A3: 0,
  A4: 0,
  A5: 0,
  A6: 0,
  Steering: 0,
  Gripper: 0,
  Gripper001: 0,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
};

export default function RobotModel({ guiContainerRef }) {
  const { nodes, scene } = useGLTF("/Robot.glb");
  const bonesRef = useRef({});
  const robotGroupRef = useRef();
  const controls = useRef({ ...defaultControls });
  const guiRef = useRef(null); // track GUI so we only create once

  useEffect(() => {
    if (!guiContainerRef?.current) {
      console.warn("GUI container ref not available.");
      return;
    }

    if (!nodes || Object.keys(nodes).length === 0) {
      console.error("Robot GLTF model not loaded properly. nodes:", nodes);
      return;
    }

    // Map your model's bones here
    bonesRef.current = {
      A1_bone: nodes.A1_bone,
      A2_bone: nodes.A2_bone,
      A3_bone: nodes.A3_bone,
      A4_bone: nodes.A4_bone,
      A5_bone: nodes.A5_bone,
      A6_bone: nodes.A6_bone,
      Steering_bone: nodes.Steering_bone,
      Gripper: nodes.Gripper,
      Gripper001: nodes.Gripper001,
    };

    if (guiRef.current) return; // prevent duplicate GUI creation

    const gui = new dat.GUI({ width: 250 });
    guiRef.current = gui;

    guiContainerRef.current.appendChild(gui.domElement);
    gui.domElement.style.position = "static";

    // Add controls
    gui.add(controls.current, "A1", -Math.PI, Math.PI).name("Base (A1)");
    gui.add(controls.current, "A2", -Math.PI / 2, Math.PI / 2).name("Joint (A2)");
    gui.add(controls.current, "A3", -Math.PI / 2, Math.PI / 2).name("Joint (A3)");
    gui.add(controls.current, "A4", -Math.PI, Math.PI).name("Joint (A4)");
    gui.add(controls.current, "A5", -Math.PI / 2, Math.PI / 2).name("Joint (A5)");
    gui.add(controls.current, "Steering", -Math.PI / 2, Math.PI / 2).name("Steering");
    gui.add(controls.current, "Gripper", 0, 1).name("Gripper Open");
    gui.add(controls.current, "Gripper001", 0, 1).name("Gripper Close");

    gui.add(controls.current, "positionX", -5, 5).name("Pos X");
    gui.add(controls.current, "positionY", -5, 5).name("Pos Y");
    gui.add(controls.current, "positionZ", -5, 5).name("Pos Z");
    gui.add(controls.current, "rotationX", -Math.PI, Math.PI).name("Rot X");
    gui.add(controls.current, "rotationY", -Math.PI, Math.PI).name("Rot Y");
    gui.add(controls.current, "rotationZ", -Math.PI, Math.PI).name("Rot Z");

    // Cleanup function
    return () => {
      try {
        if (guiRef.current) {
          guiRef.current.destroy();
          guiRef.current = null;
        }
      } catch (e) {
        console.warn("GUI cleanup failed:", e);
      }
    };
  }, [nodes, guiContainerRef]);

  // Animation Frame Loop
  useFrame(() => {
    const c = controls.current;
    const b = bonesRef.current;

    if (robotGroupRef.current) {
      robotGroupRef.current.position.set(c.positionX, c.positionY, c.positionZ);
      robotGroupRef.current.rotation.set(c.rotationX, c.rotationY, c.rotationZ);
    }

    if (b.A1_bone) b.A1_bone.rotation.y = c.A1;
    if (b.A2_bone) b.A2_bone.rotation.z = c.A2;
    if (b.A3_bone) b.A3_bone.rotation.z = c.A3;
    if (b.A4_bone) b.A4_bone.rotation.y = c.A4;
    if (b.A5_bone) b.A5_bone.rotation.z = c.A5;
    if (b.Steering_bone) b.Steering_bone.rotation.z = c.Steering;
    if (b.Gripper) b.Gripper.rotation.z = c.Gripper;
    if (b.Gripper001) b.Gripper001.rotation.z = -c.Gripper001;
  });

  return (
    <group ref={robotGroupRef}>
      <primitive object={scene} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
    </group>
  );
}

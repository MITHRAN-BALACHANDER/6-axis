import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const colorMap = {
  A1_bone: "#2c3e50", 
  A2_bone: "#e74c3c", 
  A3_bone: "#2ecc71", 
  A4_bone: "#3498db", 
  A5_bone: "#3498db", 
  A6_bone: "#3498db", 
  Gripper: "#3498db",
  Gripper001: "#3498db",
};

export default function RobotModel({ jointAngles }) {
  const { nodes, scene } = useGLTF("/robo_assembly.glb");
  const robotGroupRef = useRef();

  useEffect(() => {
    if (!nodes) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        const customColor = colorMap[child.name];
        const material = new THREE.MeshStandardMaterial({
          roughness: jointAngles.roughness,
          metalness: jointAngles.metalness,
        });
        if (customColor) {
          material.color = new THREE.Color(customColor);
        }
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [nodes, scene, jointAngles.roughness, jointAngles.metalness]);

  useFrame(() => {
    if (!nodes) return;
    
    if (robotGroupRef.current) {
      robotGroupRef.current.position.set(jointAngles.positionX, jointAngles.positionY, jointAngles.positionZ);
    }

    if (nodes.A1_bone) nodes.A1_bone.rotation.y = jointAngles.A1;
    if (nodes.A2_bone) nodes.A2_bone.rotation.z = jointAngles.A2;
    if (nodes.A3_bone) nodes.A3_bone.rotation.z = jointAngles.A3;
    if (nodes.A4_bone) nodes.A4_bone.rotation.y = jointAngles.A4;
    if (nodes.A5_bone) nodes.A5_bone.rotation.z = jointAngles.A5;
    if (nodes.A6_bone) nodes.A6_bone.rotation.y = jointAngles.A6;

    if (nodes.Gripper) nodes.Gripper.rotation.z = jointAngles.Gripper;
    if (nodes.Gripper001) nodes.Gripper001.rotation.z = -jointAngles.Gripper;
  });

  return (
    <group ref={robotGroupRef} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/Robot.glb");

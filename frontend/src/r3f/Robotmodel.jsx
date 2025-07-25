import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import GUI from 'lil-gui';
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

export default function RobotModel({ guiContainerRef, jointAngles, setJointAngles }) {
  const { nodes, scene } = useGLTF("/Robot.glb");
  const robotGroupRef = useRef();
  const guiRef = useRef(null);

  useEffect(() => {
    if (!guiContainerRef?.current || !nodes) return;
    if (guiRef.current) return;

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

    const gui = new GUI({ container: guiContainerRef.current });
    guiRef.current = gui;

    const updateState = (key, value) => setJointAngles(prev => ({ ...prev, [key]: value }));

    gui.add(jointAngles, "A1", -Math.PI, Math.PI).name("Base (A1)").onChange(val => updateState('A1', val));
    gui.add(jointAngles, "A2", -Math.PI / 2, Math.PI / 2).name("Joint (A2)").onChange(val => updateState('A2', val));
    gui.add(jointAngles, "A3", -Math.PI / 2, Math.PI / 2).name("Joint (A3)").onChange(val => updateState('A3', val));
    gui.add(jointAngles, "A4", -Math.PI, Math.PI).name("Joint (A4)").onChange(val => updateState('A4', val));
    gui.add(jointAngles, "A5", -Math.PI / 2, Math.PI / 2).name("Joint (A5)").onChange(val => updateState('A5', val));
    gui.add(jointAngles, "A6", -Math.PI, Math.PI).name("Joint (A6)").onChange(val => updateState('A6', val));
    
    gui.add(jointAngles, "Gripper", 0, 1).name("Gripper").onChange(val => updateState('Gripper', val));
    
    const positionFolder = gui.addFolder('Position');
    positionFolder.add(jointAngles, "positionX", -5, 5).name("Pos X").onChange(val => updateState('positionX', val));
    positionFolder.add(jointAngles, "positionY", -5, 5).name("Pos Y").onChange(val => updateState('positionY', val));
    positionFolder.add(jointAngles, "positionZ", -5, 5).name("Pos Z").onChange(val => updateState('positionZ', val));

    const materialFolder = gui.addFolder('Appearance');
    materialFolder.add(jointAngles, "roughness", 0, 1).name("Roughness").onChange((value) => {
        updateState('roughness', value);
        scene.traverse(child => child.isMesh && child.material && (child.material.roughness = value));
    });
    materialFolder.add(jointAngles, "metalness", 0, 1).name("Metalness").onChange((value) => {
        updateState('metalness', value);
        scene.traverse(child => child.isMesh && child.material && (child.material.metalness = value));
    });

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
      if (guiContainerRef.current) {
        guiContainerRef.current.innerHTML = "";
      }
    };
  }, [nodes, scene, guiContainerRef, jointAngles, setJointAngles]);

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

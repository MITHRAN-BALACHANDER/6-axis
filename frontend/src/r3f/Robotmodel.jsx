import { useGLTF, OrbitControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as dat from 'dat.gui';
import * as THREE from 'three';

export default function RobotModel() {
  const { nodes, scene } = useGLTF('/Robot3.glb');

  console.log(nodes);
  console.log(scene); 
// Refs for bones and position
  const bonesRef = useRef({});
  const robotGroupRef = useRef();

  const controls = useRef({
    A1: 0,
    A2: 0,
    A3: 0,
    A4: 1.57,
    A5: 0,
    Gripper: 0,
    Gripper001: 0,
    positionX: 0,
    positionY: 0,
    positionZ: 0,
  });

  useEffect(() => {
    bonesRef.current = {
      A1_bone: nodes.A1_bone,
      A2_bone: nodes.A2_bone,
      A3_bone: nodes.A3_bone,
      A4_bone: nodes.A4_bone,
      A5_bone: nodes.A5_bone,
      Gripper: nodes.Gripper,
      Gripper001: nodes.Gripper001,
    };

    const gui = new dat.GUI();

    gui.add(controls.current, 'positionX', -5, 5).name('Move X');
    gui.add(controls.current, 'positionY', -5, 5).name('Move Y');
    gui.add(controls.current, 'positionZ', -5, 5).name('Move Z');

    gui.add(controls.current, 'A1', -Math.PI, Math.PI).name('Base A1');
    gui.add(controls.current, 'A2', -Math.PI / 2, Math.PI / 2).name('Shoulder A2');
    gui.add(controls.current, 'A3', -Math.PI / 2, Math.PI / 2).name('Elbow A3');
    gui.add(controls.current, 'A4', -Math.PI, Math.PI).name('Wrist Roll A4');
    gui.add(controls.current, 'A5', -Math.PI / 2, Math.PI / 2).name('Wrist Pitch A5');
    gui.add(controls.current, 'Gripper', -0.5, 0.5).name('Gripper Left');
    gui.add(controls.current, 'Gripper001', -0.5, 0.5).name('Gripper Right');

    return () => gui.destroy();
  }, [nodes]);

  useFrame(() => {
    const c = controls.current;
    const b = bonesRef.current;

    // Update robot position
    if (robotGroupRef.current) {
      robotGroupRef.current.position.set(c.positionX, c.positionY, c.positionZ);
    }

    // Bone rotations
    if (b.A1_bone) b.A1_bone.rotation.y = c.A1;
    if (b.A2_bone) b.A2_bone.rotation.z = c.A2;
    if (b.A3_bone) b.A3_bone.rotation.z = c.A3;
    if (b.A4_bone) b.A4_bone.rotation.y = c.A4;
    if (b.A5_bone) b.A5_bone.rotation.z = c.A5;

    // Gripper control
    if (b.Gripper) b.Gripper.rotation.z = c.Gripper;
    if (b.Gripper001) b.Gripper001.rotation.z = -c.Gripper001;
  });

  return (
    <>
      <group ref={robotGroupRef}>
        <primitive object={scene} />
      </group>
      {/* <OrbitControls /> */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
    </>
  );
}

import { useGLTF, OrbitControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as dat from 'dat.gui';
import '../styles/Datgui.css';

export default function RobotModel() {
  const { nodes, scene } = useGLTF('/Robot.glb');

  const bonesRef = useRef({});
  const robotGroupRef = useRef();

  // Default control values
  const controls = useRef({
    positionX: 0,
    positionY: 0.2,
    positionZ: 2.9,
    rotationX: 0,
    rotationY: 1,
    rotationZ: 0,
    A1: 0,
    A2: 0,
    A3: 0,
    A4: 0,
    A5: 0,
    A6: 0,
    Steering: 0,
    Gripper: 0,
    Gripper001: 0,
  });

  useEffect(() => {
    // Map bones from nodes
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
    if (!nodes || Object.keys(nodes).length === 0) {
      console.error("Failed to load nodes from Robot.glb.");
      return null;
    }

    const gui = new dat.GUI();
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '300px';
    gui.domElement.style.left = '100px';
    gui.close();
    // // Position controls
    // gui.add(controls.current, 'positionX', -5, 5).name('Move X');
    // gui.add(controls.current, 'positionY', -5, 5).name('Move Y');
    // gui.add(controls.current, 'positionZ', -5, 5).name('Move Z');

    // Rotation controls
    // gui.add(controls.current, 'rotationX', -Math.PI, Math.PI).name('Rotate X');
    // gui.add(controls.current, 'rotationY', -Math.PI, Math.PI).name('Rotate Y');
    // gui.add(controls.current, 'rotationZ', -Math.PI, Math.PI).name('Rotate Z');

    // Joint controls
    gui.add(controls.current, 'A1', -Math.PI, Math.PI).name('Joint A1');
    gui.add(controls.current, 'A2', 0, Math.PI / 2).name('Joint A2');
    gui.add(controls.current, 'A3', -Math.PI / 2, Math.PI / 2).name('Joint A3');
    gui.add(controls.current, 'A4', -Math.PI / 2, Math.PI / 2).name('Joint A4');
    gui.add(controls.current, 'A5', -Math.PI / 2, Math.PI / 2).name('Joint A5');

    gui.add(controls.current, 'Steering', -Math.PI / 2, Math.PI / 2).name('Steering');

    // Gripper controls
    gui.add(controls.current, 'Gripper', -0.5, 0.5).name('Gripper Left');
    gui.add(controls.current, 'Gripper001', -0.5, 0.5).name('Gripper Right');

    return () => gui.destroy();
  }, [nodes]);

  useFrame(() => {
    const c = controls.current;
    const b = bonesRef.current;

    // Move the entire robot
    if (robotGroupRef.current) {
      robotGroupRef.current.position.set(c.positionX, c.positionY, c.positionZ);
      robotGroupRef.current.rotation.set(c.rotationX, c.rotationY, c.rotationZ);
    }

    // Apply joint rotations (customize axes as needed)
    if (b.A1_bone) b.A1_bone.rotation.y = c.A1;
    if (b.A2_bone) b.A2_bone.rotation.z = c.A2;
    if (b.A3_bone) b.A3_bone.rotation.z = c.A3;
    if (b.A4_bone) b.A4_bone.rotation.y = c.A4;
    if (b.A5_bone) b.A5_bone.rotation.z = c.A5;

    if (b.Steering_bone) b.Steering_bone.rotation.z = c.Steering;

    // Gripper rotation (likely on Z, may vary)
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

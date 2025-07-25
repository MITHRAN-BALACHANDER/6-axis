import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Robo from "../r3f/Robo";
import FullScreenToggleButton from "../components/FullScreenToggle";
import Robot2DViewer from "../components/Robot2DViewer";
import axios from "axios";

const IK_API_URL = "http://localhost:8000/api/motion/ik/";
const DEFAULT_LINK1 = 1.1;  // Update if your robot's link1 is different
const DEFAULT_LINK2 = 1.1;  // Update if your robot's link2 is different

const Dashboard = () => {
  const guiContainerRef = useRef();
  const roboSectionRef = useRef();

  // State for current robot joint angles
  const [jointAngles, setJointAngles] = useState({
    A1: 0, A2: 0, A3: 0, A4: 0, A5: 0, A6: 0,
    Gripper: 0,
    positionX: 0, positionY: 0, positionZ: 0,
    roughness: 0.5,
    metalness: 0.5,
  });

  // State for X/Y target fields
  const [target, setTarget] = useState({ x: 1.4, y: 1.2 });
  const [ikError, setIkError] = useState("");

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTarget(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // Send IK request to backend and update robot
  const handleIKMove = async () => {
    setIkError("");
    try {
      const response = await axios.post(IK_API_URL, {
        x: target.x,
        y: target.y,
        length1: DEFAULT_LINK1,
        length2: DEFAULT_LINK2,
      });
      // Backend returns all angles in degrees by your code; convert to radians for animation
      setJointAngles(prev => ({
        ...prev,
        A1: 0,
        A2: (response.data.A2 * Math.PI) / 180,
        A3: (response.data.A3 * Math.PI) / 180,
        A4: 0,
        A5: 0,
        A6: 0,
        Gripper: 0,
      }));
    } catch (error) {
      setIkError(error.response?.data?.error || "IK request failed");
    }
  };

  return (
    <div className="h-screen overflow-auto bg-gray-100">
      <Header />
      <Navbar />
      <main className="flex flex-col lg:flex-row gap-6 p-6 max-w-screen-9xl w-full mx-auto lg:h-[calc(100vh-160px)]">
        {/* 3D Robot Section */}
        <section
          ref={roboSectionRef}
          className="relative w-full lg:w-[30%] bg-white rounded-3xl shadow-md flex items-center justify-center min-h-[500px]"
        >
          <FullScreenToggleButton
            targetRef={roboSectionRef}
            className="absolute bottom-4 left-4 z-10"
          />
          <Robo
            guiContainerRef={guiContainerRef}
            jointAngles={jointAngles}
            setJointAngles={setJointAngles}
          />
        </section>

        {/* Debug Section */}
        <aside className="w-full lg:w-[40%] bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Debug Panel</h3>
          <div className="flex flex-row gap-6 w-full h-full">
            <div className="w-1/2">
              <Robot2DViewer jointAngles={jointAngles} />
            </div>
            <div ref={guiContainerRef} className="w-1/2" />
          </div>
        </aside>

        {/* Controls Section with X/Y fields under Reset */}
        <aside className="w-full lg:w-[30%] flex flex-col gap-5 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Controls</h3>
          <Button buttonText="Start" />
          <Button buttonText="Stop" />
          <Button buttonText="Simulate" />
          <Button buttonText="Reset" />

          {/* X/Y input fields */}
          <div className="mt-8 flex flex-col gap-3">
            <label className="font-medium text-gray-700 flex flex-col">
              Target X
              <input
                type="number"
                name="x"
                step="0.01"
                value={target.x}
                onChange={handleInputChange}
                className="mt-1 mb-2 px-3 py-2 border rounded"
              />
            </label>
            <label className="font-medium text-gray-700 flex flex-col">
              Target Y
              <input
                type="number"
                name="y"
                step="0.01"
                value={target.y}
                onChange={handleInputChange}
                className="mt-1 mb-2 px-3 py-2 border rounded"
              />
            </label>
            <Button buttonText="Move" onClick={handleIKMove} />
            {ikError && (
              <div className="text-red-600 text-sm">{ikError}</div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;

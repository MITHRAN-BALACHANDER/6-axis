import React, { useRef, useState, useEffect, useCallback } from "react";
import Button from "../components/Button";
import Robo from "../r3f/Robo";
import FullScreenToggleButton from "../components/FullScreenToggle";
import Robot2DViewer from "../components/Robot2DViewer";
import AngleDisplay from "../components/AngleDisplay";
import axios from "axios";

// Define a key for localStorage (must match the one in Setting.jsx)
const LOCAL_STORAGE_KEY = "robotSettings";

const IK_API_URL = "http://localhost:8000/api/motion/ik/";
const L1 = 1.0;  // Base to shoulder
const L2 = 1.0;  // Shoulder to elbow
const L3 = 1.0;  // Elbow to wrist

// Helper to convert degrees to radians
function degToRad(d) {
  return (d * Math.PI) / 180;
}

// Define initial default values if nothing is in localStorage
// This should match the initial structure of robotSettings in Setting.jsx
const INITIAL_DASHBOARD_ROBOT_POSE = {
  A1: 0, A2: 0, A3: 0, A4: 0, A5: 0, A6: 0, Gripper: 0,
  positionX: 0, positionY: 0, positionZ: 0,
  roughness: 0.5, metalness: 0.5,
};


const Dashboard = () => {
  const guiContainerRef = useRef();
  const roboSectionRef = useRef();

  // Robot joint state - Initialize from localStorage
  const [jointAngles, setJointAngles] = useState(() => {
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Map the stored axis settings to jointAngles
        return {
          A1: degToRad(parsedSettings.axis1 || 0),
          A2: degToRad(parsedSettings.axis2 || 0),
          A3: degToRad(parsedSettings.axis3 || 0),
          A4: degToRad(parsedSettings.axis4 || 0),
          A5: degToRad(parsedSettings.axis5 || 0),
          A6: degToRad(parsedSettings.axis6 || 0),
          Gripper: 0, // Gripper isn't in settings, default to 0
          positionX: 0, positionY: 0, positionZ: 0, // Position sliders are separate from joint angles
          roughness: parsedSettings.roughness || 0.5,
          metalness: parsedSettings.metalness || 0.5,
        };
      }
    } catch (error) {
      console.error("Failed to load robot initial settings from localStorage:", error);
    }
    return INITIAL_DASHBOARD_ROBOT_POSE; // Fallback if no settings or error
  });


  // State for X/Y/Z target fields and orientation
  const [target, setTarget] = useState({ x: 1.4, y: 1.2, z: 0.5, roll: 0, pitch: 0, yaw: 0 });
  const [ikError, setIkError] = useState("");


  // Control state for the robot's operating mode
  const [isMoving, setIsMoving] = useState(false);


  // Send IK request to backend and update robot
  const calculateAndMoveRobot = useCallback(async (currentTarget) => {
    setIkError("");
    try {
      const response = await axios.post(IK_API_URL, {
        ...currentTarget,
        l1: L1,
        l2: L2,
        l3: L3,
        l4: 0.5,
      });
      setJointAngles(prev => ({
        ...prev,
        A1: degToRad(response.data.A1),
        A2: degToRad(response.data.A2),
        A3: degToRad(response.data.A3),
        A4: degToRad(response.data.A4),
        A5: degToRad(response.data.A5),
        A6: degToRad(response.data.A6),
        Gripper: 0,
      }));
    } catch (error) {
      setIkError(error.response?.data?.error || "IK request failed");
      console.error("IK Calculation Error:", error);
    }
  }, []);


  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newTarget = { ...target, [name]: parseFloat(value) || 0 };
    setTarget(newTarget);
    if (isMoving) {
      calculateAndMoveRobot(newTarget);
    }
  };


  // --- Control Button Handlers ---
  const handleStart = () => {
    setIsMoving(true);
    calculateAndMoveRobot(target);
    setIkError("");
  };

  const handleStop = () => {
    setIsMoving(false);
    setIkError("Robot stopped. Input changes won't trigger movement.");
  };

  const handleReset = () => {
    setIsMoving(false);
    // When resetting, use the initial pose from localStorage (or default)
    setJointAngles(() => {
        try {
            const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                return {
                    A1: degToRad(parsedSettings.axis1 || 0),
                    A2: degToRad(parsedSettings.axis2 || 0),
                    A3: degToRad(parsedSettings.axis3 || 0),
                    A4: degToRad(parsedSettings.axis4 || 0),
                    A5: degToRad(parsedSettings.axis5 || 0),
                    A6: degToRad(parsedSettings.axis6 || 0),
                    Gripper: 0,
                    positionX: 0, positionY: 0, positionZ: 0,
                    roughness: parsedSettings.roughness || 0.5,
                    metalness: parsedSettings.metalness || 0.5,
                };
            }
        } catch (error) {
            console.error("Failed to load reset pose from localStorage:", error);
        }
        return INITIAL_DASHBOARD_ROBOT_POSE; // Fallback
    });
    setTarget({ x: 1.4, y: 1.2, z: 0.5, roll: 0, pitch: 0, yaw: 0 });
    setIkError("Robot reset to default position.");
  };

  const handleSimulate = () => {
    setIkError("Simulating robot path (functionality not yet implemented).");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 max-w-screen-2xl w-full mx-auto pb-24">
        {/* 3D Robot Section */}
        <section
          ref={roboSectionRef}
          className="relative w-full lg:w-[30%] bg-white rounded-3xl shadow-md flex items-center justify-center min-h-[400px] sm:min-h-[500px]"
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

        {/* Debug Section: 2D Viewer and Angle Display */}
        <aside className="w-full lg:w-[40%] bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Debug Panel</h3>
          <div className="flex flex-col sm:flex-row gap-6 w-full h-full">
            <div className="w-full sm:w-2/3">
              <Robot2DViewer jointAngles={jointAngles} />
            </div>
            <div className="w-full sm:w-1/3">
              <AngleDisplay jointAngles={jointAngles} />
            </div>
          </div>
        </aside>

        {/* Controls Section: X/Y fields at top, Buttons at bottom */}
        <aside className="w-full lg:w-[30%] flex flex-col gap-5 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Controls</h3>

          {/* X/Y/Z input fields at the TOP */}
          <div className="flex flex-col gap-3">
            <label className="font-medium text-gray-700 flex flex-col">
              Target X
              <input
                type="number"
                name="x"
                step="0.01"
                value={target.x}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 border rounded"
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
                className="mt-1 px-3 py-2 border rounded"
              />
            </label>
            <label className="font-medium text-gray-700 flex flex-col">
              Target Z
              <input
                type="number"
                name="z"
                step="0.01"
                value={target.z}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 border rounded"
              />
            </label>
            <label className="font-medium text-gray-700 flex flex-col">
              Roll
              <input
                type="number"
                name="roll"
                step="0.1"
                value={target.roll}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 border rounded"
              />
            </label>
            <label className="font-medium text-gray-700 flex flex-col">
              Pitch
              <input
                type="number"
                name="pitch"
                step="0.1"
                value={target.pitch}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 border rounded"
              />
            </label>
            <label className="font-medium text-gray-700 flex flex-col">
              Yaw
              <input
                type="number"
                name="yaw"
                step="0.1"
                value={target.yaw}
                onChange={handleInputChange}
                className="mt-1 px-3 py-2 border rounded"
              />
            </label>
            {ikError && (
              <div className="text-red-600 text-sm mt-2">{ikError}</div>
            )}
          </div>

          <div className="flex-grow" />

          {/* Control Buttons at the BOTTOM */}
          <div className="flex flex-col gap-3 mt-auto">
            <Button buttonText="Start" onClick={handleStart} disabled={isMoving} />
            <Button buttonText="Stop" onClick={handleStop} disabled={!isMoving} />
            <Button buttonText="Simulate" onClick={handleSimulate} disabled={isMoving} />
            <Button buttonText="Reset" onClick={handleReset} disabled={isMoving} />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;

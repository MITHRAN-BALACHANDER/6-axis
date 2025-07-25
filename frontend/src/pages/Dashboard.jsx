import React, { useRef, useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Robo from "../r3f/Robo";
import FullScreenToggleButton from "../components/FullScreenToggle";
import Robot2DViewer from "../components/Robot2DViewer"; // Import the new component

const Dashboard = () => {
  const guiContainerRef = useRef();
  const roboSectionRef = useRef();

  // The state for the robot is owned by the Dashboard. This stays the same.
  const [jointAngles, setJointAngles] = useState({
    A1: 0, A2: 0, A3: 0, A4: 0, A5: 0, A6: 0,
    Gripper: 0,
    positionX: 0, positionY: 0, positionZ: 0,
    roughness: 0.5,
    metalness: 0.5,
  });

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

        {/* Debug Section - MODIFIED FOR 2-COLUMN LAYOUT */}
        <aside className="w-full lg:w-[40%] bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Debug Panel</h3>
          
          {/* New flex container for the two columns */}
          <div className="flex flex-row gap-6 w-full h-full">

            {/* Left Column: 2D Viewer */}
            <div className="w-1/2">
              <Robot2DViewer jointAngles={jointAngles} />
            </div>

            {/* Right Column: GUI Controls */}
            <div ref={guiContainerRef} className="w-1/2" />

          </div>
        </aside>

        {/* Controls Section */}
        <aside className="w-full lg:w-[30%] flex flex-col gap-5 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Controls</h3>
          <Button buttonText="Start" />
          <Button buttonText="Stop" />
          <Button buttonText="Simulate" />
          <Button buttonText="Reset" />
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;

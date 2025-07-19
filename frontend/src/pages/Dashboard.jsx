import React, { useRef } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Robo from "../r3f/Robo";

const Dashboard = () => {
  const guiContainerRef = useRef();

  return (
    <div className="h-screen overflow-auto bg-gray-100">
      <Header />
      <Navbar />
      <main className="flex flex-col lg:flex-row gap-6 p-6 max-w-screen-9xl w-full mx-auto">
        {/* 3D Robot Section - First Column (30% width) */}
        <section className="w-full lg:w-[30%] bg-white rounded-3xl shadow-md flex items-center justify-center min-h-[500px]">
          <Robo guiContainerRef={guiContainerRef} />
        </section>

        {/* Debug Section - Second Column */}
        <aside className="w-full lg:w-[40%] bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Debug Panel</h3>
          <div 
            ref={guiContainerRef} 
            className="w-full h-full overflow-y-auto max-h-[500px] min-h-[400px]" 
          />
        </aside>

        {/* Controls Section - Third Column */}
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

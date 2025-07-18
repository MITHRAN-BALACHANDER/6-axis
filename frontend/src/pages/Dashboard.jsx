import React, { useRef } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Robo from "../r3f/Robo";
import RobotModel from "../r3f/Robotmodel";

const Dashboard = () => {
  const guiContainerRef = useRef();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navbar />
      <main className="flex flex-col md:flex-row gap-8 p-6  max-w-7xl mx-auto">
        {/* 3D Robot Section */}
        <section className="flex-1 bg-white rounded-3xl shadow-md flex items-center justify-center min-h-[500px] overflow-hidden">
          <Robo guiContainerRef={guiContainerRef} />
        </section>
        
        {/* Controls Section */}
        <aside className="w-full md:w-80 flex flex-col gap-5 bg-white rounded-2xl shadow-lg p-8">
          <Button buttonText="Start" />
          <Button buttonText="Stop" />
          <Button buttonText="Simulate" />
          <Button buttonText="Reset" />
           <div ref={guiContainerRef} className="flex-1  mt-2" />
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;

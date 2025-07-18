import React, { useRef } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Robo from "../r3f/Robo";
import RobotModel from "../r3f/Robotmodel";

const Dashboard = () => {
  const guiContainerRef = useRef();

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <Header />
      <Navbar />
      <main className="flex flex-col md:flex-row gap-8 px-6 py-12 max-w-7xl mx-auto">
        {/* 3D Robot Section */}
        <section className="flex-1 bg-white rounded-2xl shadow-md flex items-center justify-center min-h-[500px]">
          <Robo guiContainerRef={guiContainerRef} />
        </section>
        
        {/* Controls Section */}
        <aside className="w-full md:w-72 flex flex-col gap-5 bg-white rounded-2xl shadow-lg p-8">
          <Button buttonText="Start" />
          <Button buttonText="Stop" />
          <Button buttonText="Simulate" />
          <Button buttonText="Reset" />
          <div ref={guiContainerRef} className="mt-4 overflow-hidden" />
        </aside>
      </main>
    </div>
  );
};

export default Dashboard;

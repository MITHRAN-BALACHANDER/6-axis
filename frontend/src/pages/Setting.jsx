import React, { useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

const Setting = () => {
  const [robotSettings, setRobotSettings] = useState({
    axis1: 0,
    axis2: 0,
    axis3: 0,
    axis4: 0,
    axis5: 0,
    axis6: 0,
    speed: 50,
    acceleration: 50,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRobotSettings((prev) => ({
      ...prev,
      [name]: Number(value), // Store as number
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add API POST/PUT call here to save settings
    console.log("Robot settings submitted:", robotSettings);
    alert("Robot settings applied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
          Robot Settings
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Axes Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((axis) => (
              <div key={axis}>
                <label
                  htmlFor={`axis${axis}`}
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Axis {axis} Position (degrees):
                </label>
                <input
                  type="range"
                  id={`axis${axis}`}
                  name={`axis${axis}`}
                  min="-180"
                  max="180"
                  value={robotSettings[`axis${axis}`]}
                  onChange={handleChange}
                  className="w-full accent-green-600"
                />
                <div className="text-right text-green-700 font-medium">
                  {robotSettings[`axis${axis}`]}°
                </div>
              </div>
            ))}
          </div>

          {/* Speed and Acceleration Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="speed"
                className="block mb-1 font-semibold text-gray-700"
              >
                Speed (%):
              </label>
              <input
                type="range"
                id="speed"
                name="speed"
                min="0"
                max="100"
                value={robotSettings.speed}
                onChange={handleChange}
                className="w-full accent-green-600"
              />
              <div className="text-right text-green-700 font-medium">
                {robotSettings.speed}%
              </div>
            </div>

            <div>
              <label
                htmlFor="acceleration"
                className="block mb-1 font-semibold text-gray-700"
              >
                Acceleration (%):
              </label>
              <input
                type="range"
                id="acceleration"
                name="acceleration"
                min="0"
                max="100"
                value={robotSettings.acceleration}
                onChange={handleChange}
                className="w-full accent-green-600"
              />
              <div className="text-right text-green-700 font-medium">
                {robotSettings.acceleration}%
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button buttonText="Apply Settings" type="submit" />
          </div>
        </form>
      </main>
    </div>
  );
};

export default Setting;

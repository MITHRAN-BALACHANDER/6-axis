import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-1 flex justify-center items-center px-2 py-8">
        <section className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-green-800 mb-4 text-center">About Us</h1>
          <p className="text-gray-700 text-lg mb-4">
            <span className="font-semibold">Welcome!</span> This platform supports robotic learning and demonstration for students and educators. Our tools make six-axis robot control, simulation, and analysis interactive and accessible for everyone—whether you're learning automation or building advanced industrial solutions.
          </p>
          <p className="text-gray-700 text-lg mb-4">
            Our <span className="font-semibold">mission</span> is to provide an easy-to-use, reliable, and insightful robotics dashboard. Built as part of <span className="font-semibold">Sri Shakthi Institute of Engineering and Technology</span>, our tech aids teaching, research, and practical skill-building.
          </p>
          <ul className="text-gray-700 text-lg mb-6 list-disc pl-6">
            <li>Visualize & control a six-axis robotic platform</li>
            <li>Plot and analyze robot motion profiles</li>
            <li>Seamless UI for both web and mobile devices</li>
            <li>Developed with React, Tailwind CSS, ECharts, and Three.js (R3F) and Django</li>
          </ul>
          <p className="text-gray-700 text-lg mb-2">
            <span className="font-semibold">Contact us:</span>
            <br />
            Email: <a href="mailto:info@siet.ac.in" className="text-blue-700 underline">admin@siet.ac.in</a>
            <br />
            Sri Shakthi Institute of Engineering and Technology, Coimbatore, India
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;

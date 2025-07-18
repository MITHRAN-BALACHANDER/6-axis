import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import GraphC from '../components/GraphC';
import Button from '../components/Button';

const Graph = () => {
  const [graphData, setGraphData] = useState({ xData: [], yData: [] });

  // Fetches a specific motion profile from backend
  const fetchProfile = async (type) => {
    try {
      const response = await fetch(`http://localhost:8000/api/motion/${type}/`);
      if (!response.ok) throw new Error('Failed to fetch motion profile');
      const data = await response.json();
      const xData = data.map(point => point.time);
      const yData = data.map(point => point.velocity);
      setGraphData({ xData, yData });
    } catch (error) {
      console.error(`Error fetching motion profile (${type}):`, error);
    }
  };

  useEffect(() => {
    fetchProfile('default');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start px-2 sm:px-6 py-6">
        <div className="w-full  bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">
            Motion Profile Graph
          </h2>
          <GraphC graphData={graphData} />
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button buttonText="Default" onClick={() => fetchProfile('default')} />
            <Button buttonText="Triangular" onClick={() => fetchProfile('triangular')} />
            <Button buttonText="Trapizoidal" onClick={() => fetchProfile('trapezoidal')} />
            <Button buttonText="S-Curve" onClick={() => fetchProfile('s_curve')} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Graph;

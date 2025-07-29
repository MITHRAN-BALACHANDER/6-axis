import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Graph component for velocity vs time plot using Recharts
const GraphC = ({ graphData }) => {
  const data = graphData.xData.map((time, i) => ({
    time,
    velocity: graphData.yData[i]
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }}
          type="number"
          domain={['auto', 'auto']}
        />
        <YAxis
          label={{ value: 'Velocity', angle: -90, position: 'insideLeft' }}
          domain={['auto', 'auto']}
        />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="velocity" stroke="#4ade80" strokeWidth={3} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};


const DEFAULT_PARAMS = {
  total_time: 4,
  steps: 20,
  max_vel: 40,
  max_accel: 10,
};

const Graph = () => {
  const [graphData, setGraphData] = useState({ xData: [], yData: [] });

  // Fetch and parse motion profile from backend
  const fetchProfile = async (type) => {
    const params = new URLSearchParams(DEFAULT_PARAMS).toString();
    try {
      const response = await fetch(`http://localhost:8000/api/motion/${type}/?${params}`);
      if (!response.ok) throw new Error('Failed to fetch motion profile');
      const data = await response.json();
      const xData = data.map(point => point.time);
      const yData = data.map(point => point.velocity || 0);
      setGraphData({ xData, yData });
      console.log(`Fetched profile (${type}):`, data);
    } catch (error) {
      console.error(`Error fetching motion profile (${type}):`, error);
    }
  };

  // Initial fetch of default profile on mount
  useEffect(() => {
    fetchProfile('default');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start px-2 sm:px-6 py-6">
        <div className="w-full bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">
            Motion Profile Graph
          </h2>
          <GraphC graphData={graphData} />
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button buttonText="Default" onClick={() => fetchProfile('default')} />
            <Button buttonText="Triangular" onClick={() => fetchProfile('triangular')} />
            <Button buttonText="Trapezoidal" onClick={() => fetchProfile('trapezoidal')} />
            <Button buttonText="S-Curve" onClick={() => fetchProfile('s_curve')} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Graph;

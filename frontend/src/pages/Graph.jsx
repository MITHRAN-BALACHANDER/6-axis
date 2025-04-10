import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import GraphC from '../components/GraphC';
import Button from '../components/Button';
import '../styles/Graph.css';

const Graph = () => {
    const [graphData, setGraphData] = useState({ xData: [], yData: [] });

    // Function to fetch motion profile from Django backend
    const fetchProfile = async (type) => {
        console.log(`Fetching motion profile: ${type}`); // Debugging log
        try {
            const response = await fetch(`http://localhost:8000/api/motion/${type}/`); // This is endpoint url in backend
            if (!response.ok) {
                throw new Error(`Failed to fetch motion profile: ${type}`);
            }
            const data = await response.json();
            console.log("[INFO] Motion profile data received:", data);

            // Extract xData (position) and yData (velocity) from the response
            const xData = data.map(point => point.time);
            const yData = data.map(point => point.velocity);

            // Update graph data state
            setGraphData({ xData, yData });
        } catch (error) {
            console.error(`Error fetching motion profile (${type}):`, error);
        }
    };

    // Fetch default motion profile on component mount
    useEffect(() => {
        fetchProfile('default');
    }, []);

    return (
        <div>
            <Header />
            <Navbar />
            <br />
            {/* Pass graphData to GraphC for rendering */}
            <GraphC graphData={graphData} />
            <div className="graph-button-container">
                {/* Buttons to fetch different motion profiles */}
                <Button buttonText="Default" onClick={() => fetchProfile('default')} />
                <Button buttonText="Triangular" onClick={() => fetchProfile('triangular')} />
                <Button buttonText="Trapizoidal" onClick={() => fetchProfile('trapezoidal')} />
                <Button buttonText="S-Curve" onClick={() => fetchProfile('s_curve')} />
            </div>
        </div>
    );
};

export default Graph;
import React, { useState } from 'react';
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Button from '../components/Button';

const Setting = () => {
    const [robotSettings, setRobotSettings] = useState({
        axis1: 0,
        axis2: 0,
        axis3: 0,
        axis4: 0,
        axis5: 0,
        axis6: 0,
        speed: 50,
        acceleration: 50
    });

    const handleChange = (e) => {
        setRobotSettings({
            ...robotSettings,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle saving robot settings here
        console.log('Robot settings:', robotSettings);
    };

    return (
        <div>
            <Header/>
            <Navbar/>
            <h1>Robot Settings</h1>
            <form onSubmit={handleSubmit}>
                {/* Axis Controls */}
                {[1, 2, 3, 4, 5, 6].map(axis => (
                    <div key={axis} style={{ marginBottom: '15px' }}>
                        <label htmlFor={`axis${axis}`} style={{ display: 'block', marginBottom: '5px' }}>
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
                            style={{ width: '100%' }}
                        />
                        <span>{robotSettings[`axis${axis}`]}°</span>
                    </div>
                ))}

                {/* Speed Control */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="speed" style={{ display: 'block', marginBottom: '5px' }}>
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
                        style={{ width: '100%' }}
                    />
                    <span>{robotSettings.speed}%</span>
                </div>

                {/* Acceleration Control */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="acceleration" style={{ display: 'block', marginBottom: '5px' }}>
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
                        style={{ width: '100%' }}
                    />
                    <span>{robotSettings.acceleration}%</span>
                </div>

                <Button buttonText="Apply Settings" onClick={handleSubmit} />
                {/* Submit Button */}
                {/* <button 
                    type="submit" 
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: '#007BFF', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '5px' 
                    }}
                >
                    Apply Settings
                </button> */}
            </form>
        </div>
    );
};

export default Setting;
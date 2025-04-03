import React from 'react';
import Button from '../components/Button';
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import '../styles/Dashboard.css';
const Dashboard = () => {
    return (
        <div >
          
             <Header/>
             <Navbar />
             <div className="dashboard-container">
         <div className='Start-container'>
            <Button buttonText="Start" />
            <br />
            <Button buttonText="Stop" />
            <br />
            <Button buttonText="Simulate" />
            <br />  
            <Button buttonText="Reset" />
            </div>
        </div>
        </div>
    );
};

export default Dashboard;
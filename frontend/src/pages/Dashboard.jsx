import React from 'react';
import Button from '../components/Button';
import Header from '../components/Header'
import Navbar from '../components/Navbar'
const Dashboard = () => {
    return (
        <div>
             <Header/>
             <Navbar />
         
            <Button buttonText="Start" />
            <br />
            <Button buttonText="Stop" />
            <br />
            <Button buttonText="Simulate" />
            <br />  
            <Button buttonText="Reset" />

        </div>
    );
};

export default Dashboard;
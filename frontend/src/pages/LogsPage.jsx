import React from 'react';

import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
const LogsPage = () => {
    return (
        <div>
            <Header/>
            <Navbar />
            <h1>Logs Page</h1>
           
            <Button buttonText="Download Logs" onClick={() => console.log('Download Logs clicked')} />
        </div>
    );
};

export default LogsPage;
import React from 'react';
import Header from '../components/Header'
import Navbar from '../components/Navbar'
const About = () => {
    return (
        <div style={{ padding: '20px' }}>
                     <Header/>
                     <Navbar />
            <h1>About Us</h1>
            <p>
                Welcome to our website! We are dedicated to providing the best service and information to our users.
            </p>
            <p>
                Our mission is to create a platform that is user-friendly, informative, and engaging. Thank you for visiting!
            </p>
        </div>
    );
};

export default About;
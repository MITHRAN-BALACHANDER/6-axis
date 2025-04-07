import React from 'react';
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import GraphC from '../components/GraphC';
import Button from '../components/Button';
import '../styles/Graph.css';
const Graph = () => {
    return (
        <div>
                     <Header/>
                     <Navbar />
            <br/>
            <GraphC />
            <div className="graph-button-container">
                <Button buttonText="Start" onClick={() => alert("Bell button clicked!")} />
            <Button buttonText="Trangular" onClick={() => alert("Triangular button clicked!")} />
            <Button buttonText="Trapizoidal" onClick={() => alert("Trapozidal button clicked!")} />
            <Button buttonText="S-Curve" onClick={() => alert("S-curve button clicked!")} />
                <Button buttonText="Stop" onClick={() => alert("Stop button clicked!")} />
                </div>
          
        
        </div>
    );
};

export default Graph;
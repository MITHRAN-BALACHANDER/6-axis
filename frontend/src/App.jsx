import React from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles/App.css'

import Dashboard from './pages/Dashboard'
import Login from './pages/login'
import Navbar from './components/Navbar'
import NotFound from './pages/Notfound';
import Graph from './pages/Graph'
import Setting from './pages/Setting'
import About from './pages/About'


import Header from './components/Header'
function App() {
  return (
    <Router>
   
    <Routes>
    <Route path="/" element={<Login/>} /> 
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/graph" element={<Graph />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/about" element={<About />} />
        <Route path="/Logout" element={<Login />} /> 
    <Route path="*" element={ <NotFound />} />  
  
    </Routes>
  </Router>
  );
}

export default App

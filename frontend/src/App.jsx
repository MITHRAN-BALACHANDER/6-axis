import React from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles/App.css'

import Dashboard from './pages/Dashboard'
import Login from './pages/login'
import Navbar from './components/Navbar'

import Header from './components/Header'
function App() {
  return (
    <Router>
   
    <Routes>
    <Route path="/" element={<Login/>} /> 
    <Route path="/dashboard" element={<Dashboard />} /> 
    
  
    </Routes>
  </Router>
  );
}

export default App

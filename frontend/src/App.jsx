import React from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './styles/App.css'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'

import Header from './components/Header'
function App() {
  return (
    <BrowserRouter>
      <>
        <Header />
        <Navbar />
        <Dashboard />
      </>
    </BrowserRouter>
  );
}

export default App

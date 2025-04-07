import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles/App.css';

import Dashboard from './pages/Dashboard';
import Login from './pages/login';
import Navbar from './components/Navbar';
import NotFound from './pages/Notfound';
import Graph from './pages/Graph';
import Setting from './pages/Setting';
import About from './pages/About';
import LogsPage from './pages/LogsPage';
import Logout from './components/Logout';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Help from './pages/Help';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> 
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/graph"
          element={
            <PrivateRoute>
              <Graph />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Setting />
            </PrivateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About />
            </PrivateRoute>
          }
        />
           <Route
          path="/help"
          element={
            <PrivateRoute>
              <Help />
            </PrivateRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <PrivateRoute>
              <Logout/>
            </PrivateRoute>
          }
        />
        <Route
          path="/log"
          element={
            <PrivateRoute>
              <LogsPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

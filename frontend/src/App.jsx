import React from 'react';
import { useLocation } from 'react-router-dom';
import './styles/App.css';
import Navbar from './components/Navbar';
import Header from './components/Header';
import AppRoutes from './Routes';


function App() {
  const location = useLocation();
  const showHeaderAndNav = location.pathname !== '/login' && location.pathname !== '/';

  return (
    <div>
      {showHeaderAndNav && <Header />}
      {showHeaderAndNav && <Navbar />}
      <AppRoutes />
    </div>
  );
}

export default App;

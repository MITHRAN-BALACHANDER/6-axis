import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Ensure boolean check

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;

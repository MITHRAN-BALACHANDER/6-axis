import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem('isAuthenticated'); // or set to "false"
  }, []);

  return <Navigate to="/" replace />;
};

export default Logout;

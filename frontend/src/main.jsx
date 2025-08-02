import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import './utils/csrf';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>,
)

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import '../utils/csrf'; // Import CSRF configuration

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // This endpoint should return if the user is authenticated
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                await axios.get(`${API_BASE_URL}/api/auth/check-auth/`);
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        try {
            // First, get CSRF token by calling the GET endpoint
            console.log('Getting CSRF token...');
            await axios.get(`${API_BASE_URL}/api/auth/login/`);
            console.log('CSRF cookie:', document.cookie);
            
            // Then, perform the actual login
            console.log('Attempting login for:', username);
            const response = await axios.post(`${API_BASE_URL}/api/auth/login/`, { username, password });
            console.log('Login response:', response);
            
            if (response.status === 200) {
                setIsAuthenticated(true);
            }
            return response;
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response);
            throw error;
        }
    };

    const logout = async () => {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        await axios.post(`${API_BASE_URL}/api/auth/logout/`);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

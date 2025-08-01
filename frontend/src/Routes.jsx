import React from 'react';
import { Routes, Route } from 'react-router-dom';

import NotFound from './pages/Notfound';
import Dashboard from './pages/Dashboard';
import LogsPage from './pages/LogsPage';
import Login from './pages/login';
import Graph from './pages/Graph';
import Setting from './pages/Setting';
import About from './pages/About';
import Logout from './components/Logout';
import PrivateRoute from './components/PrivateRoute';
import Help from './pages/Help';

const AppRoutes = () => {
    return (
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
                        <Logout />
                    </PrivateRoute>
                }
            />
            <Route
                path="/logs"
                element={
                    <PrivateRoute>
                        <LogsPage />
                    </PrivateRoute>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import About from './pages/About';
// import Contact from './pages/Contact';
import NotFound from './pages/Notfound';
import Dashboard from './pages/Dashboard';
import LogsPage2 from './pages/LogsPage2';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/logs" element={<LogsPage2 />} />
                {/* <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} /> */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;

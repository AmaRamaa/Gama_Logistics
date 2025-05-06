import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import layout and pages
import Dashboard from '../pages/Dashboard/Dashboard';
import PlanRoute from '../pages/PlanRoute/PlanRoute';
import Courier from '../pages/Courier/Courier';
import Fleet from '../pages/Fleet/Fleet';
import Notification from '../pages/Notification/Notification';
import Finance from '../pages/Finance/Finance';
import Driver from '../pages/Driver/Driver';
import Report from '../pages/Report/Report';
import Support from '../pages/Support/Support';
import Login from '../pages/Auth/Login';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import Sidebar from '../components/Sidebar';    
import Topbar from '../components/Topbar';


const AppRoutes = () => {
    // Define the regions for the topbar
    const regions = ['North', 'South', 'East', 'West'];
    return (
        <Router>
            <div style={{ display: 'flex', height: '100vh' }}>
                <Sidebar />
                <div style={{ flex: 1, overflow: 'auto' }}>
                <Topbar regions={regions}/>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/plan-route" element={<PlanRoute />} />
                        <Route path="/courier" element={<Courier />} />
                        <Route path="/fleet" element={<Fleet />} />
                        <Route path="/notification" element={<Notification />} />
                        <Route path="/finance" element={<Finance />} />
                        <Route path="/driver" element={<Driver />} />
                        <Route path="/report" element={<Report />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        {/* Optional 404 fallback */}
                        <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default AppRoutes;

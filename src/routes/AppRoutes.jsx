import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

// Lazy load pages
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const PlanRoute = lazy(() => import('../pages/PlanRoute/PlanRoute'));
const Courier = lazy(() => import('../pages/Courier/Courier'));
const Fleet = lazy(() => import('../pages/Fleet/Fleet'));
const Notification = lazy(() => import('../pages/Notification/Notification'));
const Finance = lazy(() => import('../pages/Finance/Finance'));
const Driver = lazy(() => import('../pages/Driver/Driver'));
const Report = lazy(() => import('../pages/Report/Report'));
const Support = lazy(() => import('../pages/Support/Support'));
const Login = lazy(() => import('../pages/Auth/Login'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));

const topbarAttributesMap = {
    '/dashboard': ['Summary', 'Live Map', 'Recent', 'Notifications'],
    '/plan-route': ['North', 'South', 'East', 'West'],
    '/courier': ['Express', 'Standard', 'Same-Day'],
    '/fleet': ['Available', 'In Maintenance', 'In Use'],
    '/notification': ['Unread', 'All', 'System'],
    '/finance': ['Invoices', 'Payments', 'Refunds'],
    '/driver': ['Active', 'Idle', 'Unavailable'],
    '/report': ['Daily', 'Weekly', 'Monthly'],
    '/support': ['Open Tickets', 'Closed Tickets'],
};

const LayoutWithTopbar = ({ children }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Find matching attributes or return empty array
    const topAtribute = topbarAttributesMap[currentPath] || [];

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, overflow: 'auto' }}>
                <Topbar topAtribute={topAtribute} />
                {children}
            </div>
        </div>
    );
};

const AppRoutes = () => {
    return (
        <Router>
            <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
                <LayoutWithTopbar>
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
                        <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
                    </Routes>
                </LayoutWithTopbar>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;

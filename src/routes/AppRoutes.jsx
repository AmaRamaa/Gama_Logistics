import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { supabase } from '../supaBase/supaBase';

// Lazy loaded pages
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
    const { pathname } = useLocation();
    const basePath = `/${pathname.split('/')[1]}`;
    const topAtribute = topbarAttributesMap[basePath] || [];

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

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);

            if (!session) window.location.href = '/login';
        };

        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            setIsAuthenticated(!!session);
            if (!session) window.location.href = '/login';
        });

        return () => authListener?.subscription.unsubscribe();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <DotLottieReact
                    src="https://lottie.host/d1978416-f80a-4f61-9aeb-d45248747fcc/71mHxPhcAZ.lottie"
                    loop
                    autoplay
                    style={{ width: '40%', height: '40%' }}
                />
            </div>
        );
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Router>
            <Suspense fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <DotLottieReact
                        src="https://lottie.host/d1978416-f80a-4f61-9aeb-d45248747fcc/71mHxPhcAZ.lottie"
                        loop
                        autoplay
                        style={{ width: '40%', height: '40%' }}
                    />
                </div>
            }>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Protected Layout */}
                    <Route path="*" element={
                        <ProtectedRoute>
                            <LayoutWithTopbar>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" />} />
                                    
                                    {/* Pages with Subcategories */}
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/dashboard/:topbarAttributes" element={<Dashboard />} />

                                    <Route path="/plan-route" element={<PlanRoute />} />
                                    <Route path="/plan-route/:topbarAttributes" element={<PlanRoute />} />

                                    <Route path="/courier" element={<Courier />} />
                                    <Route path="/courier/:topbarAttributes" element={<Courier />} />

                                    <Route path="/fleet" element={<Fleet />} />
                                    <Route path="/fleet/:topbarAttributes" element={<Fleet />} />

                                    <Route path="/notification" element={<Notification />} />
                                    <Route path="/notification/:topbarAttributes" element={<Notification />} />

                                    <Route path="/finance" element={<Finance />} />
                                    <Route path="/finance/:topbarAttributes" element={<Finance />} />

                                    <Route path="/driver" element={<Driver />} />
                                    <Route path="/driver/:topbarAttributes" element={<Driver />} />

                                    <Route path="/report" element={<Report />} />
                                    <Route path="/report/:topbarAttributes" element={<Report />} />

                                    <Route path="/support" element={<Support />} />
                                    <Route path="/support/:topbarAttributes" element={<Support />} />

                                    {/* Catch-all */}
                                    <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
                                </Routes>
                            </LayoutWithTopbar>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;

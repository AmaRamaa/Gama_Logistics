import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { supabase } from '../supaBase/supaBase';

// Lazy loaded pages
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const PlanRoute = lazy(() => import('../pages/PlanRoute/PlanRoute'));
const Fleet = lazy(() => import('../pages/Fleet/Fleet'));
const Notification = lazy(() => import('../pages/Notification/Notification'));
const Finance = lazy(() => import('../pages/Finance/Finance'));
const Driver = lazy(() => import('../pages/Driver/Driver'));
const Report = lazy(() => import('../pages/Report/Report'));
const Support = lazy(() => import('../pages/Support/Support'));
const Login = lazy(() => import('../pages/Auth/Login'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const Vehicles = lazy(() => import('../pages/Vehicles/Vehicle')); // Corrected path to match the file name
const Settings = lazy(() => import('../pages/Settings/Settings'));

const topbarAttributesMap = {
    '/dashboard': ['Summary', 'Live Map', 'Recent', 'Notifications'],
    '/plan-route': ['North', 'South', 'East', 'West'],
    '/fleet': ['Available', 'In Maintenance', 'Use'],
    '/notification': ['Unread', 'All', 'System'],
    '/finance': ['Invoices', 'Payments', 'Refunds'],
    '/driver': ['Active', 'Idle', 'Unavailable'],
    '/report': ['Daily', 'Weekly', 'Monthly'],
    '/support': ['Open Tickets', 'Closed Tickets'],
    '/vehicle': ['Go Back'],
    '/settings': ['Profile', 'Security', 'Display', 'Language'],
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
            try {
                const { data: { session }, error } = await supabase.auth.getSession() || { data: { session: null }, error: null };
                if (error) throw error;
                setIsAuthenticated(!!session);

                if (!session) window.location.href = '/login';
            } catch (err) {
                console.error('Error fetching session:', err);
                setIsAuthenticated(false);
                window.location.href = '/login';
            }
        };

        checkAuth();
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

const AppRoutes = () => (
    <Router>
        <Suspense
            fallback={
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <DotLottieReact
                        src="https://lottie.host/d1978416-f80a-4f61-9aeb-d45248747fcc/71mHxPhcAZ.lottie"
                        loop
                        autoplay
                        style={{ width: '40%', height: '40%' }}
                    />
                </div>
            }
        >
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <LayoutWithTopbar>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/dashboard/:topbarAttributes" element={<Dashboard />} key="dashboard" />
            
                                    <Route path="/plan-route" element={<PlanRoute />} />
                                    <Route path="/plan-route/:topbarAttributes" element={<PlanRoute />} />
            
                                    <Route path="/fleet" element={<Fleet />} />
                                    <Route path="/fleet/:topbarAttributes" element={<Fleet />} />
            
                                    <Route path="/vehicle" element={<Vehicles />} />
                                    <Route path="/vehicle/:id" element={<Vehicles />} />
                                    <Route path="/vehicle/go-back" element={<Navigate to="/fleet" replace />} />
            
                                    <Route path="/notification" element={<Notification />} />
                                    <Route path="/notification/:topbarAttributes" element={<Notification />} />
            
                                    <Route path="/finance" element={<Finance />} />
                                    <Route path="/finance/:topbarAttributes" element={<Finance />} />
            
                                    <Route path="/driver" element={<Driver />} />
                                    <Route path="/driver/:topbarAttributes" element={<Driver />} />
            
                                    <Route path="/report" element={<Report />} />
                                    <Route path="/report/:topbarAttributes" element={<Report />} />
            
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/settings/:topbarAttributes" element={<Settings />} />
            
                                    <Route path="/support" element={<Support />} />
                                    <Route path="/support/:topbarAttributes" element={<Support />} />
                                </Routes>
                            </LayoutWithTopbar>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Suspense>
    </Router>
);

export default AppRoutes;

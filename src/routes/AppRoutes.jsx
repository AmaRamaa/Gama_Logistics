import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { supabase } from '../supaBase/supaBase';
import ErrorConsoleListener from '../supaBase/supaBaseLogic';


// Lazy loaded pages
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const PlanRoute = lazy(() => import('../pages/PlanRoute/PlanRoute'));
const Fleet = lazy(() => import('../pages/Fleet/Fleet'));
const Notification = lazy(() => import('../pages/Notification/Notification'));
const Driver = lazy(() => import('../pages/Driver/Driver'));
const Report = lazy(() => import('../pages/Report/Report'));
const Support = lazy(() => import('../pages/Support/Support'));
const Login = lazy(() => import('../pages/Auth/Login'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const Settings = lazy(() => import('../pages/Settings/Settings'));
const Vehicles = lazy(() => import('../pages/Vehicles/Vehicle'));

const topbarAttributesMap = {
    '/dashboard': ['Summary', 'Live Map', 'Recent', 'Notifications'],
    '/plan-route': ['North', 'South', 'East', 'West'],
    '/fleet': ['Available', 'In Maintenance', 'Use'],
    '/notification': ['Unread', 'All', 'System'],
    '/driver': ['Active', 'Idle', 'Unavailable'],
    '/report': ['Daily', 'Weekly', 'Monthly'],
    '/support': ['Open Tickets', 'Closed Tickets'],
    '/vehicle': ['Go Back'],
    '/settings': ['Profile', 'Security', 'Display', 'Language'],
};

// Detect mobile user
const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// Desktop layout
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

// Mobile layout (Topbar only)
const TopbarOnlyLayout = ({ children }) => {
    const { pathname } = useLocation();
    const basePath = `/${pathname.split('/')[1]}`;
    const topAtribute = topbarAttributesMap[basePath] || [];

    return (
        <div style={{ height: '100vh', overflow: 'auto' }}>
            <Topbar topAtribute={topAtribute} />
            {children}
        </div>
    );
};

// Auth check + device restriction
const ProtectedRoute = ({ children, allowMobile = false, mobileOnly = false }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const location = useLocation();
    const onMobile = isMobile();

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const { data: { session }, error } = await supabase.auth.getSession() || { data: { session: null }, error: null };
    //             if (error) throw error;
    //             setIsAuthenticated(!!session);

    //             if (!session) window.location.href = '/login';
    //         } catch (err) {
    //             console.error('Error fetching session:', err);
    //             setIsAuthenticated(false);
    //             window.location.href = '/login';
    //         }
    //         const { data: { session } } = await supabase.auth.getSession();
    //         setIsAuthenticated(!!session);
    //         if (!session) window.location.href = '/login';
    //     };

    //     checkAuth();

    //     const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
    //         setIsAuthenticated(!!session);
    //         if (!session) window.location.href = '/login';
    //     });

    //     checkAuth();

    //     return () => authListener?.subscription.unsubscribe();
    // }, []);

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

    if (onMobile && !allowMobile) {
        return <Navigate to="/report" state={{ from: location }} replace />;
    }

    if (!onMobile && mobileOnly) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

const AppRoutes = () => (
    <Router>
        <ErrorConsoleListener />
        <Suspense>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* ✅ Mobile-only Report Route */}
                <Route
                    path="/report"
                    element={
                        <ProtectedRoute allowMobile mobileOnly>
                            <TopbarOnlyLayout>
                                <Report />
                            </TopbarOnlyLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/report/:topbarAttributes"
                    element={
                        <ProtectedRoute allowMobile mobileOnly>
                            <TopbarOnlyLayout>
                                <Report />
                            </TopbarOnlyLayout>
                        </ProtectedRoute>
                    }
                />

                {/* ✅ All other protected routes (desktop only) */}
                <Route
                    path="*"
                    element={
                        <ProtectedRoute allowMobile={false}>
                            <LayoutWithTopbar>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/dashboard/:topbarAttributes" element={<Dashboard />} />

                                    <Route path="/plan-route" element={<PlanRoute />} />
                                    <Route path="/plan-route/:topbarAttributes" element={<PlanRoute />} />

                                    <Route path="/fleet" element={<Fleet />} />
                                    <Route path="/fleet/:topbarAttributes" element={<Fleet />} />

                                    <Route path="/vehicle" element={<Vehicles />} />
                                    <Route path="/vehicle/:id" element={<Vehicles />} />
                                    <Route path="/vehicle/go-back" element={<Navigate to="/fleet" />} />

                                    <Route path="/notification" element={<Notification />} />
                                    <Route path="/notification/:topbarAttributes" element={<Notification />} />

                                    <Route path="/driver" element={<Driver />} />
                                    <Route path="/driver/:topbarAttributes" element={<Driver />} />

                                    <Route path="/support" element={<Support />} />
                                    <Route path="/support/:topbarAttributes" element={<Support />} />

                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="/settings/:topbarAttributes" element={<Settings />} />

                                    {/* 404 Route */}

                                    <Route path="*" element={<div><h1>404 - Page Not Found</h1></div>} />
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

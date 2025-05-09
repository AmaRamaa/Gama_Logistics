import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supaBase/supaBase';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Topbar = ({ topAtribute = [] }) => {
    const [user, setUser] = useState(null);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const basePath = `/${pathname.split('/')[1]}`;

    // 🔁 Set active header based on URL or redirect if needed
    useEffect(() => {
        if (topAtribute.length === 0) return;

        const currentSubPath = pathname.split('/')[2];
        const formatted = (str) => str.toLowerCase().replace(/\s+/g, '-');

        if (!currentSubPath) {
            navigate(`${basePath}/${formatted(topAtribute[0])}`, { replace: true });
        }
    }, [pathname, topAtribute, navigate, basePath]);

    const [activeHeader, setActiveHeader] = useState('');

    // ✅ Sync activeHeader with URL changes
    useEffect(() => {
        const subPath = pathname.split('/')[2];
        const matched = topAtribute.find(attr =>
            pathname.toLowerCase().includes(attr.toLowerCase().replace(/\s+/g, '-'))
        );
        if (matched) {
            setActiveHeader(matched);
        }
    }, [pathname, topAtribute]);

    // 🔐 Fetch user data
    useEffect(() => {
        const fetchUserDetails = async (email) => {
            const { data: userDetails, error } = await supabase
                .from('Users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) console.error('Error fetching user details:', error);
            else setUser(userDetails);
        };

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await fetchUserDetails(session.user.email);
            } else {
                window.location.href = '/login';
            }
        };

        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            if (session) fetchUserDetails(session.user.email);
            else window.location.href = '/login';
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    // 🔔 Fetch notifications and check for unread ones
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data: notifications, error } = await supabase
                    .from('Notifications')
                    .select('*')
                    .eq('status', 'unread'); // Assuming 'status' indicates read/unread

                if (error) {
                    throw error;
                }

                setHasUnreadNotifications(notifications.length > 0);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleHeaderClick = (item) => {
        const slug = item.toLowerCase().replace(/\s+/g, '-');
        setActiveHeader(item);
        navigate(`${basePath}/${slug}`);
    };

    return (
        <div
            className="d-flex justify-content-between align-items-center bg-white px-4 border-bottom shadow-sm position-sticky top-0"
            style={{ height: '60px', zIndex: 1030 }}
        >
            {/* Subcategory links */}
            <div className="d-flex gap-4">
                {topAtribute.map((item, idx) => (
                    <span
                        key={idx}
                        onClick={() => handleHeaderClick(item)}
                        className={
                            activeHeader === item
                                ? 'text-primary text-decoration-underline fw-semibold'
                                : 'text-dark'
                        }
                        style={{ paddingTop: '30px', cursor: 'pointer' }}
                    >
                        {item.toUpperCase()}
                    </span>
                ))}
            </div>

            <div className="d-flex align-items-center gap-4 position-relative">
                <i
                    className="bi bi-bell fs-5 position-relative"
                    role="button"
                    onClick={() => navigate('/notification/unread')}
                >
                    {hasUnreadNotifications && (
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                    )}
                </i>

                <img
                    src={user?.avatar_url || "https://via.placeholder.com/32"}
                    alt="User"
                    className="rounded-circle"
                    width="32"
                    height="32"
                />

                <span
                    className="fw-semibold"
                    role="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <i className="bi bi-chevron-down"></i>
                </span>

                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><NavLink to="/profile" className="dropdown-item">Profile</NavLink>
                    <li className="px-3"></li>
                        <h6 className="mb-0" style={{ fontSize: '13px' }}>{user?.name}</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{user?.email || 'No Email'}</p>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><NavLink to="/settings" className="dropdown-item">Settings</NavLink></li>
                    <li><NavLink to="/support" className="dropdown-item">Support</NavLink></li>
                    <li>
                        <button
                            className="dropdown-item text-danger"
                            onClick={async () => {
                                await supabase.auth.signOut();
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }}
                        >
                            Sign Out
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Topbar;

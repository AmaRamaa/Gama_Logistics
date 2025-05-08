import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supaBase/supaBase';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Topbar = ({ topAtribute }) => {
    const [user, setUser] = useState(null);
    const [activeHeader, setActiveHeader] = useState('');
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // Extract base path like '/dashboard'
    const basePath = `/${pathname.split('/')[1]}`;

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) setUser(session.user);
            else window.location.href = '/login';
        };

        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            if (session) setUser(session.user);
            else window.location.href = '/login';
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    // 1. Redirect to first tab only if subpath is missing (on mount)
    useEffect(() => {
        const currentSubPath = pathname.split('/')[2];
        if (topAtribute.length > 0) {
            const matched = topAtribute.find(attr =>
                attr.toLowerCase().replace(/\s+/g, '-') === currentSubPath
            );
    
            if (matched) {
                setActiveHeader(matched);
            } else {
                // If no valid subpath, redirect to the first one
                const defaultPath = `${basePath}/${topAtribute[0].toLowerCase().replace(/\s+/g, '-')}`;
                navigate(defaultPath, { replace: true });
            }
        }
    }, [pathname, topAtribute, navigate, basePath]);
    

    
    // 2. Always update activeHeader based on URL
    useEffect(() => {
        const currentSubPath = pathname.split('/')[2];

        if (topAtribute.length > 0 && currentSubPath) {
            const matched = topAtribute.find(attr =>
                attr.toLowerCase().replace(/\s+/g, '-') === currentSubPath
            );
            if (matched) {
                setActiveHeader(matched);
            }
        }
    }, [pathname, topAtribute]);




    const handleHeaderClick = (item) => {
        const route = `${basePath}/${item.toLowerCase().replace(/\s+/g, '-')}`;
        navigate(route); // Do NOT setActiveHeader here
    };
    

    return (
        <div className="d-flex justify-content-between align-items-center bg-white px-4 border-bottom shadow-sm" style={{ height: '60px' }}>
            {/* Subcategory links */}
            <div className="d-flex gap-4">
                {topAtribute.map((item, idx) => (
                    <span
                        key={idx}
                        onClick={() => handleHeaderClick(item)}
                        className={
                            activeHeader === item
                                ? 'text-success fw-bold border-bottom border-3 border-success pb-2 text-decoration-none'
                                : 'text-dark text-decoration-none'
                        }
                        style={{ paddingTop: '30px', cursor: 'pointer' }}
                    >
                        {item.toUpperCase()}
                    </span>
                ))}
            </div>

            {/* User actions and bell */}
            <div className="d-flex align-items-center gap-4 position-relative">
                <i className="bi bi-bell fs-5 position-relative" role="button">
                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ width: '8px', height: '8px' }}></span>
                </i>

                <img
                    src={user?.user_metadata?.avatar_url || "https://via.placeholder.com/32"}
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
                    <li><NavLink to="/profile" className="dropdown-item">Profile</NavLink></li>
                    <div style={{ textAlign: "center" }}>
                        <h4 style={{ color: "grey", fontSize: "10px" }}>{user?.email || 'No Email Available'}</h4>
                    </div>
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

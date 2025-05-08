import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supaBase/supaBase';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Topbar = ({ topAtribute = [] }) => {
    const [user, setUser] = useState(null); // Used for user authentication and display
    const { pathname } = useLocation();
    const [activeHeader, setActiveHeader] = useState(null); // Tracks the active header for styling
    const navigate = useNavigate();

    const basePath = `/${pathname.split('/')[1]}`;

    useEffect(() => {
        const fetchUserDetails = async (email) => {
            const { data: userDetails, error } = await supabase
                .from('Users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                console.error('Error fetching user details:', error);
            } else {
                setUser(userDetails);
            }
        };

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const email = session.user.email;

                // Fetch user details based on email
                await fetchUserDetails(email);
            } else {
                window.location.href = '/login';
            }
        };

        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            if (session) {
                const email = session.user.email;

                // Fetch user details based on email when session changes
                fetchUserDetails(email);
            } else {
                window.location.href = '/login';
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const handleHeaderClick = (item) => {
        setActiveHeader(item);
        const route = `${basePath}/${item.toLowerCase().replace(/\s+/g, '-')}`;
        navigate(route);
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
                                ? 'text-dark text-decoration-none'
                                : ''
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
                    src={user?.avatar_url}
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
                    <li style={{ textAlign: "left", paddingLeft: "14px", Left: "14px" }}>
                        <h4 className="dropdown" style={{ padding: "3px", fontSize: "12px", }}>{user?.name}</h4>
                    </li>
                    <li style={{ textAlign: "left", paddingLeft: "14px", Left: "14px" }}>
                        <h4 className="dropdown" style={{ padding: "3px", fontSize: "12px", }}>{user?.email || 'No Email Available'}</h4>
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

import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Topbar = ({ topAtribute }) => {
    
    return (
        <div
            className="d-flex justify-content-between align-items-center bg-white px-4 border-bottom shadow-sm"
            style={{ height: '60px' }}
        >
            <div className="d-flex gap-4">
                {topAtribute.map((region, idx) => (
                    <NavLink
                        key={idx}
                        to={`/region/${region.toLowerCase().replace(' ', '-')}`}
                        className={({ isActive }) =>
                            isActive
                                ? 'text-success fw-bold border-bottom border-3 border-success pb-2 text-decoration-none'
                                : 'text-dark text-decoration-none'
                        }
                        style={{ paddingTop: '30px' }}
                    >
                        {region.toUpperCase()}
                    </NavLink>
                ))}
            </div>

            <div className="d-flex align-items-center gap-4">
                <i className="bi bi-bell fs-5 position-relative" role="button">
                    <span
                        className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                        style={{ width: '8px', height: '8px' }}
                    ></span>
                </i>

                <img
                    src="https://via.placeholder.com/32"
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
                <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                >
                    <li>
                        <NavLink to="/profile" className="dropdown-item">
                            Profile
                        </NavLink>
                    </li>
                    <li>
                        <hr className="dropdown-divider" />
                    </li>
                    <li>
                        <NavLink to="/settings" className="dropdown-item">
                            Settings
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/support" className="dropdown-item">
                            Support
                        </NavLink>
                    </li>
                    <li>
                        <button className="dropdown-item text-danger">
                            Sign Out
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Topbar;

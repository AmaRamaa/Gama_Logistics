import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const menu = [
    { name: 'Dashboard', icon: 'bi-grid', path: '/dashboard' },
    { name: 'Fleet', icon: 'bi-truck-front', path: '/fleet' },
    { name: 'Plan Route', icon: 'bi-geo-alt', path: '/plan-route' },
    { name: 'Notification', icon: 'bi-bell', path: '/notification' },
    { name: 'Finance', icon: 'bi-cash-stack', path: '/finance' },
    { name: 'Driver', icon: 'bi-person-badge', path: '/driver' },
    { name: 'Report', icon: 'bi-bar-chart', path: '/report' },
    { name: 'Support', icon: 'bi-life-preserver', path: '/support' },
  ];

  return (
    <div className="bg-dark text-white d-flex flex-column align-items-start p-1" style={{ width: '', height: '100vh' }}>
      {/* Logo */}
      <div className="mb-4 text-center w-100">
        <i className="bi bi-circle-half fs-3 text-success"></i>
      </div>

      {/* Menu */}
      <ul className="nav nav-pills flex-column w-100">
        {menu.map((item, index) => (
          <li className="nav-item mb-3 text-center" key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active text-success bg-light border-0'
                  : 'nav-link text-white'
              }
            >
              <i className={`${item.icon} fs-4`}></i>
              <div className="small mt-1 d-none d-xl-block">{item.name}</div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

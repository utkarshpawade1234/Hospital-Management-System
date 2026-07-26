import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  IconLayoutDashboard,
  IconUsers,
  IconStethoscope,
  IconHeartbeat,
  IconBuildingHospital,
  IconCalendarEvent,
  IconBell,
  IconMenu2,
  IconX,
  IconActivity,
} from '@tabler/icons-react';
import { Toaster } from 'react-hot-toast';
import '../admin.css';

const navItems = [
  { to: '/admin', icon: IconLayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: IconUsers, label: 'Users' },
  { to: '/admin/doctors', icon: IconStethoscope, label: 'Doctors' },
  { to: '/admin/patients', icon: IconHeartbeat, label: 'Patients' },
  { to: '/admin/departments', icon: IconBuildingHospital, label: 'Departments' },
  { to: '/admin/appointments', icon: IconCalendarEvent, label: 'Appointments' },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const userEmail = localStorage.getItem('userEmail') || 'admin@hms.com';
  const userRole = localStorage.getItem('userRole') || 'ADMIN';
  const initials = userEmail.charAt(0).toUpperCase();

  return (
    <div className="admin-root">
      {/* ─── Top Navbar ─────────────────────────────────────── */}
      <header className="admin-navbar">
        {/* Logo */}
        <div className="admin-navbar-logo">
          <IconActivity size={22} />
          HMS
        </div>

        {/* Desktop nav links */}
        <nav className="admin-nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' active' : ''}`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="admin-nav-right">
          {/* Notification bell */}
          <button className="admin-notification-btn" title="Notifications">
            <IconBell size={20} />
            <span className="admin-notification-badge" />
          </button>

          {/* User info */}
          <div className="admin-user-info">
            <div className="admin-avatar">{initials}</div>
            <div className="admin-user-meta">
              <span className="admin-user-name">{userEmail.split('@')[0]}</span>
              <span className="admin-user-role">{userRole}</span>
            </div>
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="admin-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </header>

      {/* ─── Mobile Menu ────────────────────────────────────── */}
      <div className={`admin-mobile-menu${mobileOpen ? ' open' : ''}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? ' active' : ''}`
            }
            onClick={() => setMobileOpen(false)}
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* ─── Content Area ───────────────────────────────────── */}
      <main className="admin-content">
        <Outlet />
      </main>

      {/* ─── Toast Container ────────────────────────────────── */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            borderRadius: '10px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#1D9E75', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#E5503E', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
}

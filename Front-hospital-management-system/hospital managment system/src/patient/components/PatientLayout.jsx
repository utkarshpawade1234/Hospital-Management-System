import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  IconLayoutDashboard,
  IconStethoscope,
  IconCalendarEvent,
  IconUser,
  IconBell,
  IconLogout,
  IconMenu2,
  IconX,
  IconActivity,
} from '@tabler/icons-react';
import { Toaster } from 'react-hot-toast';
import '../patient.css';

const navItems = [
  { to: '/dashboard', icon: IconLayoutDashboard, label: 'Dashboard', end: true },
  { to: '/find-doctors', icon: IconStethoscope, label: 'Find Doctors' },
  { to: '/my-appointments', icon: IconCalendarEvent, label: 'My Appointments' },
  { to: '/my-profile', icon: IconUser, label: 'My Profile' },
];

export default function PatientLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail') || 'patient@hms.com';
  const userRole = localStorage.getItem('userRole') || 'PATIENT';
  const initials = userEmail.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('patientId');
    navigate('/');
  };

  return (
    <div className="patient-root">
      {/* ─── Top Navbar ─────────────────────────────────── */}
      <header className="patient-navbar">
        <div className="patient-navbar-logo">
          <IconActivity size={22} />
          HMS
        </div>

        {/* Desktop nav */}
        <nav className="patient-nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `patient-nav-link${isActive ? ' active' : ''}`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="patient-nav-right">
          <button className="patient-notification-btn" title="Notifications">
            <IconBell size={20} />
            <span className="patient-notification-badge" />
          </button>

          <div className="patient-user-info">
            <div className="patient-avatar">{initials}</div>
            <div className="patient-user-meta">
              <span className="patient-user-name">
                {userEmail.split('@')[0]}
              </span>
              <span className="patient-user-role">{userRole}</span>
            </div>
          </div>

          <button
            className="patient-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <IconLogout size={18} />
          </button>

          <button
            className="patient-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </header>

      {/* ─── Mobile Menu ────────────────────────────────── */}
      <div className={`patient-mobile-menu${mobileOpen ? ' open' : ''}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `patient-nav-link${isActive ? ' active' : ''}`
            }
            onClick={() => setMobileOpen(false)}
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
        <button
          className="patient-nav-link"
          onClick={handleLogout}
          style={{ border: 'none', background: 'none', textAlign: 'left' }}
        >
          <IconLogout size={16} />
          Logout
        </button>
      </div>

      {/* ─── Content ────────────────────────────────────── */}
      <main className="patient-content">
        <Outlet />
      </main>

      {/* ─── Toasts ─────────────────────────────────────── */}
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
          success: { iconTheme: { primary: '#1D9E75', secondary: '#fff' } },
          error: { iconTheme: { primary: '#E5503E', secondary: '#fff' } },
        }}
      />
    </div>
  );
}

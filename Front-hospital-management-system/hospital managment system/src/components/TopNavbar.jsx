import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  IconActivity,
  IconLayoutDashboard,
  IconStethoscope,
  IconCalendarEvent,
  IconFileText,
  IconUser,
  IconCreditCard,
  IconPill,
  IconHeartbeat,
  IconBuildingHospital,
  IconChevronDown,
  IconLogout,
  IconMenu2,
  IconX,
  IconUserCircle,
} from '@tabler/icons-react';
import { handleSharedLogout } from '../utils/authUtils';
import { getSessionItem } from '../utils/sessionStorage';
import './TopNavbar.css';

const patientNav = [
  { to: '/dashboard', icon: IconLayoutDashboard, label: 'Dashboard', end: true },
  { to: '/find-doctors', icon: IconStethoscope, label: 'Find Doctors' },
  { to: '/my-appointments', icon: IconCalendarEvent, label: 'My Appointments' },
  { to: '/prescriptions', icon: IconFileText, label: 'Prescriptions' },
  { to: '/my-payments', icon: IconCreditCard, label: 'My Payments' },
  { to: '/my-profile', icon: IconUser, label: 'My Profile' },
];

const doctorNav = [
  { to: '/doctor/dashboard', icon: IconLayoutDashboard, label: 'Dashboard', end: true },
  { to: '/doctor/appointments', icon: IconCalendarEvent, label: 'My Appointments' },
  { to: '/doctor/profile', icon: IconUserCircle, label: 'My Profile' },
  { to: '/doctor/medicines', icon: IconPill, label: 'Medicines' },
];

const adminNav = [
  { to: '/admin', icon: IconLayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/doctors', icon: IconStethoscope, label: 'Doctors' },
  { to: '/admin/patients', icon: IconHeartbeat, label: 'Patients' },
  { to: '/admin/departments', icon: IconBuildingHospital, label: 'Departments' },
  { to: '/admin/appointments', icon: IconCalendarEvent, label: 'Appointments' },
  { to: '/admin/medicines', icon: IconPill, label: 'Medicines' },
  { to: '/admin/payments', icon: IconCreditCard, label: 'Payments' },
];

export default function TopNavbar({ role = 'PATIENT' }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userEmail = getSessionItem('userEmail') || `${role.toLowerCase()}@hms.com`;
  const userRole = getSessionItem('userRole') || role;
  const displayName = userEmail.split('@')[0];
  const initials = displayName.charAt(0).toUpperCase();

  const currentRole = (role || '').toUpperCase();
  let navItems = patientNav;
  if (currentRole === 'DOCTOR') {
    navItems = doctorNav;
  } else if (currentRole === 'ADMIN') {
    navItems = adminNav;
  }

  // Profile link in avatar dropdown is removed for all roles
  const profilePath = null;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onLogout = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    handleSharedLogout(navigate);
  };

  return (
    <header className="shared-top-navbar">
      <div className="shared-nav-container">
        {/* Logo Left */}
        <div className="shared-nav-logo">
          <IconActivity size={22} className="logo-icon" />
          <span>CarePulse HMS</span>
        </div>

        {/* Center / Left Nav Links */}
        <nav className="shared-nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `shared-nav-link${isActive ? ' active' : ''}`
              }
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Side: Account Dropdown & Mobile Hamburger */}
        <div className="shared-nav-right">
          <div className="account-dropdown-wrap" ref={dropdownRef}>
            <button
              className="account-trigger-btn"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-label="User menu"
            >
              <div className="avatar-circle">{initials}</div>
              <div className="user-meta">
                <span className="user-name">{displayName}</span>
                <span className="user-role-tag">{userRole}</span>
              </div>
              <IconChevronDown
                size={14}
                className={`chevron-icon${dropdownOpen ? ' open' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <div className="account-dropdown-menu">
                {profilePath && (
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(profilePath);
                    }}
                  >
                    <IconUser size={16} />
                    <span>My Profile</span>
                  </button>
                )}
                <button className="dropdown-item logout-item" onClick={onLogout}>
                  <IconLogout size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileOpen && (
        <div className="shared-mobile-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `shared-nav-link${isActive ? ' active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            className="dropdown-item logout-item mobile-logout"
            onClick={onLogout}
          >
            <IconLogout size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
}

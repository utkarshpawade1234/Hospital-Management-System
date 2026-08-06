import { useState, useEffect } from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  IconBuildingHospital,
  IconLayoutDashboard,
  IconCalendarEvent,
  IconUserCircle,
  IconChevronDown,
  IconLogout,
  IconPill,
} from "@tabler/icons-react";
import api from "../api";
import "../doctor.css";

const initials = (first, last) =>
  `${(first || "?")[0]}${(last || "")[0] || ""}`.toUpperCase();

export default function DoctorLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!token || role !== "DOCTOR") return;
    api
      .get("/doctor/profile")
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, [token, role]);

  // Route guard: no token, or wrong role -> bounce to login
  if (!token || role !== "DOCTOR") {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("patientId");
    navigate("/login");
  };

  return (
    <div className="doctor-app">
      <Toaster position="top-right" />
      <nav className="doctor-navbar">
        <div className="logo">
          <IconBuildingHospital size={20} />
          HMS
        </div>

        <NavLink
          to="/doctor/dashboard"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <IconLayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink
          to="/doctor/appointments"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <IconCalendarEvent size={16} /> My Appointments
        </NavLink>
        <NavLink
          to="/doctor/profile"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <IconUserCircle size={16} /> My Profile
        </NavLink>
        <NavLink
          to="/doctor/medicines"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          <IconPill size={16} /> Medicines
        </NavLink>

        <div className="navbar-right">
          <div
            className="navbar-avatar-wrap"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <div className="navbar-avatar">
              {initials(profile?.firstName, profile?.lastName)}
              {profile?.availabilityStatus && (
                <span
                  className={`status-dot ${profile.availabilityStatus}`}
                />
              )}
            </div>
            <span className="navbar-name">
              Dr. {profile?.lastName || "..."}
            </span>
            <IconChevronDown size={14} color="#9FB3D4" />

            {menuOpen && (
              <div className="navbar-dropdown">
                <button
                  className="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                >
                  <IconLogout size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="doctor-content">
        {/* Nested doctor pages render here */}
        <Outlet context={{ profile, setProfile }} />
      </div>
    </div>
  );
}

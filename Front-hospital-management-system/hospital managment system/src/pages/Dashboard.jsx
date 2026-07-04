import React, { useState, useEffect } from 'react';
import PatientProfile from '../components/PatientProfile';
import DoctorSearch from '../components/DoctorSearch';
import PatientAppointments from '../components/PatientAppointments';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  // Use actual logged-in user from state, fallback to localStorage if refreshed
  const USER = location.state || {
    email: userEmail
  };

  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!token || !USER.email) {
      navigate('/');
      return;
    }
    fetchPatientId();
  }, [USER.email, token, navigate]);

  const fetchPatientId = async () => {
    if (!USER.email) return;
    try {
      const response = await axios.get(`http://localhost:8080/patient/profile/${USER.email}`);
      if (response.data.patientId) {
        localStorage.setItem('patientId', response.data.patientId);
      } else {
        localStorage.removeItem('patientId');
      }
    } catch (err) {
      console.error("Failed to fetch patient ID on load", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('patientId');
    navigate('/');
  };

  // If not authenticated, prevent the layout from rendering
  if (!token || !USER.email) {
    return null;
  }

  return (
    <div className="dashboard-layout top-nav-layout">
      <header className="top-navbar">
        <div className="nav-left">
          <h2 className="logo">HMS Portal</h2>
          <nav className="nav-links">
            <button 
              className={`top-nav-item ${activeTab === 'doctors' ? 'active' : ''}`}
              onClick={() => setActiveTab('doctors')}
            >
              Find a Doctor
            </button>
            <button 
              className={`top-nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              My Appointments
            </button>
          </nav>
        </div>
        
        <div className="nav-right">
          <button 
            className={`profile-avatar ${activeTab === 'profile' ? 'active-avatar' : ''}`}
            onClick={() => setActiveTab('profile')}
            title="My Profile"
          >
            {USER.email.charAt(0).toUpperCase()}
          </button>
          <button className="top-logout-btn" onClick={handleLogout} title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </header>
      
      <main className="main-content">
        <div className="content-body" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', paddingTop: '2rem' }}>
          {activeTab === 'profile' && (
            <>
              <h1 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Patient Dashboard</h1>
              <PatientProfile email={USER.email} />
            </>
          )}
          {activeTab === 'doctors' && <DoctorSearch />}
          {activeTab === 'appointments' && <PatientAppointments />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

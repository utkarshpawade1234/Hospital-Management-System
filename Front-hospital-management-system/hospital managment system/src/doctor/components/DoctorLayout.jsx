import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import TopNavbar from '../../components/TopNavbar';
import { getSessionItem } from '../../utils/sessionStorage';
import api from '../api';
import '../doctor.css';

export default function DoctorLayout() {
  const token = getSessionItem('token');
  const role = getSessionItem('userRole');

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token || role !== 'DOCTOR') return;
    api
      .get('/doctor/profile')
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, [token, role]);

  // Route guard: no token, or wrong role -> bounce to login
  if (!token || role !== 'DOCTOR') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="doctor-app">
      <Toaster position="top-right" />
      <TopNavbar role="DOCTOR" />
      <div className="doctor-content">
        <Outlet context={{ profile, setProfile }} />
      </div>
    </div>
  );
}

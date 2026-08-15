import { Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { getSessionItem } from '../../utils/sessionStorage';
import '../patient.css';

export default function AuthLayout() {
  const token = getSessionItem('token');
  const rawRole = getSessionItem('userRole');
  const role = rawRole ? rawRole.toUpperCase() : '';

  // If already logged in, redirect to respective role dashboard
  if (token && role) {
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'DOCTOR') return <Navigate to="/doctor/dashboard" replace />;
    if (role === 'PATIENT') return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-root">
      <div>
        <Outlet />
      </div>

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

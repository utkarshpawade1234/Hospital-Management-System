import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import TopNavbar from '../../components/TopNavbar';
import CompleteProfileModal from './CompleteProfileModal';
import { getSessionItem, removeSessionItem, useSessionGuard } from '../../utils/sessionStorage';
import '../patient.css';

export default function PatientLayout() {
  const token = useSessionGuard();
  const rawRole = getSessionItem('userRole');
  const role = rawRole ? rawRole.toUpperCase() : '';

  const [showCompleteModal, setShowCompleteModal] = useState(() => {
    const isFirstTime = getSessionItem('firstTimeLogin') === 'true';
    const hasPatientId = !!getSessionItem('patientId');
    return isFirstTime && !hasPatientId;
  });

  const handleCloseModal = () => {
    removeSessionItem('firstTimeLogin');
    setShowCompleteModal(false);
  };

  // Route guard: if no token or role is not PATIENT, redirect to login page
  if (!token || role !== 'PATIENT') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="patient-root">
      <TopNavbar role="PATIENT" />
      <main className="patient-content">
        <Outlet />
      </main>

      <CompleteProfileModal
        open={showCompleteModal}
        onClose={handleCloseModal}
        onSuccess={handleCloseModal}
      />

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

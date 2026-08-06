import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import TopNavbar from '../../components/TopNavbar';
import CompleteProfileModal from './CompleteProfileModal';
import '../patient.css';

export default function PatientLayout() {
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  useEffect(() => {
    const isFirstTime = localStorage.getItem('firstTimeLogin') === 'true';
    const hasPatientId = !!localStorage.getItem('patientId');
    if (isFirstTime && !hasPatientId) {
      setShowCompleteModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    localStorage.removeItem('firstTimeLogin');
    setShowCompleteModal(false);
  };

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

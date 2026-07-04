import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const patientId = localStorage.getItem('patientId');
    if (!patientId) {
      showToast('Please add your Medical Details in the My Profile tab before viewing appointments.', 'error');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/appointment/patient/${patientId}`);
      setAppointments(response.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'badge-pending';
      case 'CONFIRMED': return 'badge-success';
      case 'CANCELLED': return 'badge-error';
      case 'COMPLETED': return 'badge-primary';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="dashboard-card fade-in">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button className="btn-secondary" onClick={fetchAppointments} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="card-body">
        {loading && <div className="loading-state">Loading appointments...</div>}

        {!loading && appointments.length === 0 && (
          <div className="empty-state">
            <p>You have no appointments booked yet.</p>
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <div className="appointment-grid">
            {appointments.map((apt, idx) => (
              <div 
                key={idx} 
                className="appointment-card" 
                style={{ cursor: 'pointer' }}
                onClick={() => { setSelectedAppointment(apt); setIsFullScreen(false); }}
                onDoubleClick={() => { setSelectedAppointment(apt); setIsFullScreen(true); }}
                title="Click to view details, double-click for full screen"
              >
                <div className="appointment-header">
                  <h3>Dr. {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}</h3>
                  <span className={`status-badge ${getStatusBadgeClass(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>
                <div className="appointment-details">
                  <p><strong>Date:</strong> {apt.appointmentDate}</p>
                  <p><strong>Time:</strong> {apt.startTime} - {apt.endTime}</p>
                  <p><strong>Department:</strong> {apt.doctor?.department || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedAppointment && createPortal(
        <div className="drawer-overlay" onClick={(e) => {
          if(e.target.className === 'drawer-overlay') setSelectedAppointment(null);
        }}>
          <div 
            className="drawer-content" 
            onDoubleClick={() => setIsFullScreen(!isFullScreen)}
            style={{ 
              maxWidth: isFullScreen ? '100vw' : '450px', 
              width: '100%',
              transition: 'max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: isFullScreen ? 'zoom-out' : 'zoom-in'
            }}
            title="Double-click to toggle full screen"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>Appointment Details</h3>
              <button 
                onClick={() => setSelectedAppointment(null)}
                style={{ 
                  background: '#f1f5f9', 
                  border: 'none', 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.25rem', 
                  cursor: 'pointer', 
                  color: '#64748b',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
              >
                &#x2715;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              
              {/* Status & Schedule Block */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Status</span>
                  <span className={`status-badge ${getStatusBadgeClass(selectedAppointment.status)}`} style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>
                    {selectedAppointment.status}
                  </span>
                </div>
                
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Date</span>
                      <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{selectedAppointment.appointmentDate}</strong>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Time</span>
                      <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{selectedAppointment.startTime.substring(0,5)} - {selectedAppointment.endTime.substring(0,5)}</strong>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>Remarks</span>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 500 }}>{selectedAppointment.remarks || 'None provided'}</strong>
                  </div>
                </div>
              </div>

              {/* Doctor Info Block */}
              <div style={{ marginTop: '1rem' }}>
                <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '1rem' }}>Physician Information</span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Doctor</span>
                    <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>Dr. {selectedAppointment.doctor?.user?.firstName} {selectedAppointment.doctor?.user?.lastName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Specialty</span>
                    <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{selectedAppointment.doctor?.specialization || 'N/A'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Department</span>
                    <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{selectedAppointment.doctor?.department || 'N/A'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Room</span>
                    <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{selectedAppointment.doctor?.roomNumber || 'TBD'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Contact</span>
                    <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{selectedAppointment.doctor?.user?.email || 'N/A'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Consultation Fee</span>
                    <strong style={{ color: '#0f52ba', fontSize: '0.9rem' }}>${selectedAppointment.doctor?.consultationFee || '0.00'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PatientAppointments;

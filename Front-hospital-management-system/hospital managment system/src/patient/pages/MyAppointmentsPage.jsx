import { useState, useEffect } from 'react';
import {
  IconCalendarEvent,
  IconClock,
  IconNotes,
} from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { getMyAppointments } from '../api/patientApi';

const STATUS_MAP = {
  CONFIRMED: { cls: 'pill-green', label: 'Confirmed' },
  PENDING: { cls: 'pill-amber', label: 'Pending' },
  CANCELLED: { cls: 'pill-red', label: 'Cancelled' },
  COMPLETED: { cls: 'pill-blue', label: 'Completed' },
};

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const patientId = localStorage.getItem('patientId');
    if (!patientId) {
      setLoading(false);
      return;
    }

    try {
      const data = await getMyAppointments(patientId);
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Appointments</h1>
        <p className="page-subtitle">View all your appointment bookings</p>
      </div>

      {loading ? (
        <div className="appt-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="appt-card">
              <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
                <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '160px', height: '16px', marginBottom: '6px' }} />
                  <div className="skeleton" style={{ width: '120px', height: '14px' }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '50px' }} />
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <IconCalendarEvent size={48} />
            <div className="empty-state-title">No appointments yet</div>
            <div className="empty-state-text">
              Book an appointment with a doctor to see it here.
            </div>
          </div>
        </div>
      ) : (
        <div className="appt-list">
          {appointments.map((appt, i) => {
            // Appointment entity has nested doctor/patient objects
            const doctorUser = appt.doctor?.user;
            const doctorName = doctorUser
              ? `Dr. ${doctorUser.firstName || ''} ${doctorUser.lastName || ''}`
              : `Doctor #${appt.doctor?.doctorId || '—'}`;
            const doctorDept = appt.department?.departmentName || '';
            const initials = doctorUser
              ? `${(doctorUser.firstName || '?')[0]}${(doctorUser.lastName || '')[0] || ''}`.toUpperCase()
              : '?';

            const status = STATUS_MAP[appt.status] || {
              cls: 'pill-blue',
              label: appt.status || '—',
            };

            const date = appt.appointmentDate || '—';
            const time = appt.startTime || '—';

            return (
              <div key={appt.appointmentId || i} className="appt-card">
                <div className="appt-info">
                  <div className="appt-doctor-avatar">{initials}</div>
                  <div>
                    <div className="appt-doctor-name">{doctorName}</div>
                    <div className="appt-doctor-dept">{doctorDept}</div>
                  </div>
                </div>

                <div className="appt-meta">
                  <div className="appt-meta-item">
                    <IconCalendarEvent size={14} />
                    {date}
                  </div>
                  <div className="appt-meta-item">
                    <IconClock size={14} />
                    {time}
                  </div>
                  {appt.remarks && (
                    <div className="appt-meta-item">
                      <IconNotes size={14} />
                      {appt.remarks}
                    </div>
                  )}
                  <span className={`pill ${status.cls}`}>{status.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

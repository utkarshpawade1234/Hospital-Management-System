import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconCalendarEvent,
  IconClock,
  IconNotes,
  IconTrash,
  IconStethoscope,
  IconCreditCard,
  IconCheck,
} from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { getMyAppointments, cancelAppointment } from '../api/patientApi';
import ConfirmModal from '../components/ConfirmModal';
import { getSessionItem } from '../../utils/sessionStorage';

const STATUS_MAP = {
  CONFIRMED: { cls: 'pill-green', label: 'Confirmed' },
  PENDING: { cls: 'pill-amber', label: 'Pending' },
  CANCELLED: { cls: 'pill-red', label: 'Cancelled' },
  COMPLETED: { cls: 'pill-blue', label: 'Completed' },
};

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cancellation modal state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchAppointments = useCallback(async () => {
    const patientId = getSessionItem('patientId');
    if (!patientId) {
      setLoading(false);
      return;
    }

    try {
      const data = await getMyAppointments(patientId);
      const list = Array.isArray(data) ? data : [];
      // Sort newest first (descending by date + time)
      list.sort((a, b) => {
        const strA = `${a.appointmentDate || ''}T${a.startTime || '00:00:00'}`;
        const strB = `${b.appointmentDate || ''}T${b.startTime || '00:00:00'}`;
        return new Date(strB) - new Date(strA);
      });
      setAppointments(list);
    } catch {
      toast.error('Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!ignore) {
        await fetchAppointments();
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [fetchAppointments]);

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);

    try {
      await cancelAppointment(cancelTarget.appointmentId);
      toast.success('Appointment cancelled successfully');
      setCancelTarget(null);
      fetchAppointments();
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to cancel appointment'
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Appointments</h1>
        <p className="page-subtitle">View and manage your appointment bookings</p>
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
            const doctorUser = appt.doctor?.user;
            const doctorName = doctorUser
              ? `Dr. ${doctorUser.firstName || ''} ${doctorUser.lastName || ''}`
              : `Doctor #${appt.doctor?.doctorId || '—'}`;
            const doctorDept = appt.department?.departmentName || 'General';
            const initials = doctorUser
              ? `${(doctorUser.firstName || '?')[0]}${(doctorUser.lastName || '')[0] || ''}`.toUpperCase()
              : '?';

            const statusKey = appt.status ? appt.status.toUpperCase() : 'PENDING';
            const payStatusKey = appt.paymentStatus ? appt.paymentStatus.toUpperCase() : 'PENDING';
            const status = STATUS_MAP[statusKey] || {
              cls: 'pill-blue',
              label: appt.status || 'Pending',
            };

            const date = appt.appointmentDate || '—';
            const time = appt.startTime || '—';
            const apptType = appt.appointmentType
              ? appt.appointmentType.replace('_', ' ')
              : 'Consultation';

            const canCancel = statusKey === 'PENDING' || statusKey === 'CONFIRMED';

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
                  <div className="appt-meta-item" style={{ textTransform: 'capitalize' }}>
                    <IconStethoscope size={14} />
                    {apptType}
                  </div>
                  {appt.remarks && (
                    <div className="appt-meta-item">
                      <IconNotes size={14} />
                      {appt.remarks}
                    </div>
                  )}
                  <span className={`pill ${status.cls}`}>{status.label}</span>

                  {canCancel && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#E5503E', borderColor: '#E5503E', padding: '4px 10px' }}
                      onClick={() => setCancelTarget(appt)}
                      title="Cancel appointment"
                    >
                      <IconTrash size={14} />
                      Cancel
                    </button>
                  )}

                  {/* Payment Action / Status */}
                  {payStatusKey === 'REFUNDED' ? (
                    <span
                      style={{
                        background: '#F0F2F5',
                        color: '#6B7690',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <IconClock size={14} />
                      Refunded
                    </span>
                  ) : payStatusKey === 'SUCCESS' ? (
                    statusKey === 'CANCELLED' ? (
                      <span
                        style={{
                          background: '#FEF6E0',
                          color: '#B45309',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <IconClock size={14} />
                        Refunding
                      </span>
                    ) : (
                      <span
                        style={{
                          background: '#E6F4EA',
                          color: '#137333',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <IconCheck size={14} />
                        Payment Successful
                      </span>
                    )
                  ) : statusKey !== 'CANCELLED' ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          background: '#FEF6E0',
                          color: '#B45309',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <IconClock size={14} />
                        Payment Pending
                      </span>
                      <button
                        className="btn btn-sm"
                        style={{
                          background: '#1D9E75',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 4px rgba(29, 158, 117, 0.25)',
                        }}
                        onClick={() =>
                          navigate('/pay', {
                            state: {
                              appointmentId:   appt.appointmentId,
                              doctorName:      doctorName,
                              appointmentDate: appt.appointmentDate,
                              startTime:       appt.startTime,
                            },
                          })
                        }
                        title="Click to complete payment"
                      >
                        <IconCreditCard size={14} />
                        Pay Now
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Task 9: Cancellation Confirmation Modal ─────────── */}
      <ConfirmModal
        open={!!cancelTarget}
        title="Cancel appointment"
        message="This will permanently remove this appointment"
        confirmLabel="Yes, cancel appointment"
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTarget(null)}
        loading={cancelling}
      />
    </div>
  );
}

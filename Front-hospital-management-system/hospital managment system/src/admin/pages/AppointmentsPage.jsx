import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import PaginatedTable from '../components/PaginatedTable';
import StatusPill from '../components/StatusPill';
import {
  getAppointments,
  getAppointmentsByStatus,
  updateAppointmentStatus,
} from '../api/adminApi';

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function AppointmentsPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const size = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res =
        activeFilter === 'ALL'
          ? await getAppointments(page, size)
          : await getAppointmentsByStatus(activeFilter, page, size);
      setData(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [page, activeFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (status) => {
    setActiveFilter(status);
    setPage(0);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      toast.success('Appointment status updated');
      fetchData(); // Refresh
    } catch {
      toast.error('Failed to update status');
    }
  };

  const columns = [
    { header: 'Patient' },
    { header: 'Doctor' },
    { header: 'Date' },
    { header: 'Time' },
    { header: 'Type' },
    { header: 'Status' },
    { header: 'Change status', width: '140px' },
  ];

  const renderRow = (appt, i) => {
    // Handle both flat DTO (after backend extension) and nested entity shapes
    const patientName =
      appt.patientName ||
      (appt.patient?.user
        ? `${appt.patient.user.firstName || ''} ${appt.patient.user.lastName || ''}`
        : '—');

    const doctorName =
      appt.doctorName ||
      (appt.doctor?.user
        ? `Dr. ${appt.doctor.user.firstName || ''} ${appt.doctor.user.lastName || ''}`
        : `Doctor #${appt.doctorId || '—'}`);

    const date = appt.appointmentDate || '—';
    const time = appt.appointmentTime || appt.startTime || '—';
    const status = appt.status || '—';
    const type = appt.appointmentType || '—';
    const id = appt.appointmentId || appt.id;

    const patientInitial =
      typeof patientName === 'string' && patientName !== '—'
        ? patientName.charAt(0).toUpperCase()
        : '?';

    return (
      <tr key={id || i}>
        <td>
          <div className="admin-cell-user">
            <div
              className="admin-cell-avatar"
              style={{ background: '#8B5CF6' }}
            >
              {patientInitial}
            </div>
            <span className="admin-cell-name">{patientName}</span>
          </div>
        </td>
        <td>{doctorName}</td>
        <td>{date}</td>
        <td>{time}</td>
        <td>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              textTransform: 'capitalize',
            }}
          >
            {typeof type === 'string'
              ? type.toLowerCase().replace('_', ' ')
              : type}
          </span>
        </td>
        <td>
          <StatusPill status={status} />
        </td>
        <td>
          {id ? (
            <select
              className="admin-status-select"
              value={status}
              onChange={(e) => handleStatusChange(id, e.target.value)}
            >
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          ) : (
            '—'
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Appointments</h1>
        <p className="admin-page-subtitle">
          View and manage all appointment bookings
        </p>
      </div>

      {/* Filter pills */}
      <div className="admin-filters">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`admin-filter-pill${activeFilter === s ? ' active' : ''}`}
            onClick={() => handleFilterChange(s)}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <PaginatedTable
        columns={columns}
        data={data}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        size={size}
        onPageChange={setPage}
        loading={loading}
        emptyMessage="No appointments found"
        renderRow={renderRow}
      />
    </div>
  );
}

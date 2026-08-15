import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IconUsers,
  IconStethoscope,
  IconHeartbeat,
  IconBuildingHospital,
  IconCalendarEvent,
  IconClock,
  IconCircleCheck,
  IconCheck,
  IconX,
  IconReceipt,
  IconRefresh,
} from '@tabler/icons-react';
import StatCard from '../components/StatCard';
import StatusPill from '../components/StatusPill';
import PaymentDetailModal from '../../components/PaymentDetailModal';
import patientAxios from '../../patient/api/patientAxios';
import { formatCurrency, formatDate } from '../../utils/formatUtils';
import { getDashboard, getAppointments } from '../api/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentAppts, setRecentAppts] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const [dashData, apptsData, paymentsRes] = await Promise.all([
        getDashboard(),
        getAppointments(0, 5),
        patientAxios.get('/payment/all?page=0&size=5').catch(() => ({ data: { content: [] } })),
      ]);
      setStats(dashData);
      setRecentAppts(apptsData.content || []);
      setRecentPayments(paymentsRes.data?.content || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = stats
    ? [
        {
          icon: <IconHeartbeat size={22} />,
          value: stats.totalPatients,
          label: 'Total patients',
          color: '#E5503E',
          bgColor: '#FDEDEB',
        },
        {
          icon: <IconStethoscope size={22} />,
          value: stats.totalDoctors,
          label: 'Total doctors',
          color: '#3B82F6',
          bgColor: '#EBF2FE',
        },
        {
          icon: <IconBuildingHospital size={22} />,
          value: stats.totalDepartments,
          label: 'Departments',
          color: '#8B5CF6',
          bgColor: '#F0EBFE',
        },
        {
          icon: <IconCalendarEvent size={22} />,
          value: stats.totalAppointments,
          label: 'Total appointments',
          color: '#1D9E75',
          bgColor: '#E6F7F1',
        },
        {
          icon: <IconUsers size={22} />,
          value: stats.totalUsers,
          label: 'Registered users',
          color: '#E5A820',
          bgColor: '#FEF6E0',
        },
      ]
    : [];

  const appointmentStatCards = stats
    ? [
        {
          icon: <IconClock size={22} />,
          value: stats.pendingAppointments,
          label: 'Pending',
          color: '#E5A820',
          bgColor: '#FEF6E0',
        },
        {
          icon: <IconCircleCheck size={22} />,
          value: stats.confirmedAppointments,
          label: 'Confirmed',
          color: '#1D9E75',
          bgColor: '#E6F7F1',
        },
        {
          icon: <IconCheck size={22} />,
          value: stats.completedAppointments,
          label: 'Completed',
          color: '#3B82F6',
          bgColor: '#EBF2FE',
        },
        {
          icon: <IconX size={22} />,
          value: stats.cancelledAppointments,
          label: 'Cancelled',
          color: '#E5503E',
          bgColor: '#FDEDEB',
        },
      ]
    : [];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">
          Overview of your hospital management system
        </p>
      </div>

      {/* Main stat cards */}
      {loading ? (
        <div className="admin-stats-grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="admin-stat-card">
              <div
                className="admin-skeleton"
                style={{ width: '44px', height: '44px', borderRadius: '10px' }}
              />
              <div
                className="admin-skeleton"
                style={{ width: '60px', height: '28px' }}
              />
              <div
                className="admin-skeleton"
                style={{ width: '100px', height: '14px' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-stats-grid admin-stats-grid-5">
          {statCards.map((card, i) => (
            <StatCard key={i} {...card} />
          ))}
        </div>
      )}

      {/* Appointment breakdown */}
      {!loading && stats && (
        <>
          <div style={{ marginBottom: '8px', marginTop: '8px' }}>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '12px',
              }}
            >
              Appointment breakdown
            </h3>
          </div>
          <div className="admin-stats-grid">
            {appointmentStatCards.map((card, i) => (
              <StatCard key={i} {...card} />
            ))}
          </div>
        </>
      )}

      {/* Recent Appointments Table */}
      <div className="admin-table-wrapper" style={{ marginTop: '8px' }}>
        <div className="admin-table-header">
          <div className="admin-table-title">Recent appointments</div>
        </div>

        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="admin-skeleton-row">
                <div className="admin-skeleton admin-skeleton-circle" />
                <div
                  className="admin-skeleton admin-skeleton-line"
                  style={{ width: '120px', flex: 1 }}
                />
                <div
                  className="admin-skeleton admin-skeleton-line"
                  style={{ width: '80px' }}
                />
                <div
                  className="admin-skeleton admin-skeleton-line"
                  style={{ width: '60px' }}
                />
              </div>
            ))}
          </>
        ) : recentAppts.length === 0 ? (
          <div className="admin-empty">
            <IconCalendarEvent size={48} />
            <div className="admin-empty-title">No appointments yet</div>
            <div className="admin-empty-text">
              Appointments will appear here once created.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppts.map((appt, i) => {
                  // Handle both flat DTO and nested entity shapes
                  const patientName =
                    appt.patientName ||
                    (appt.patient?.user
                      ? `${appt.patient.user.firstName || ''} ${appt.patient.user.lastName || ''}`
                      : '—');
                  const doctorName =
                    (appt.doctorName && appt.doctorName.trim() !== 'Dr.' && appt.doctorName.trim() !== '')
                      ? appt.doctorName
                      : appt.doctor?.user
                      ? `Dr. ${appt.doctor.user.firstName || ''} ${appt.doctor.user.lastName || ''}`.trim()
                      : appt.doctorId
                      ? `Doctor #${appt.doctorId}`
                      : 'Unassigned Doctor';
                  const date = appt.appointmentDate || '—';
                  const time =
                    appt.appointmentTime || appt.startTime || '—';
                  const status = appt.status || '—';

                  return (
                    <tr key={appt.appointmentId || i}>
                      <td>
                        <div className="admin-cell-user">
                          <div
                            className="admin-cell-avatar"
                            style={{ background: '#8B5CF6' }}
                          >
                            {typeof patientName === 'string'
                              ? patientName.charAt(0).toUpperCase()
                              : '?'}
                          </div>
                          <span className="admin-cell-name">{patientName}</span>
                        </div>
                      </td>
                      <td>{doctorName}</td>
                      <td>{date}</td>
                      <td>{time}</td>
                      <td>
                        <StatusPill status={status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Payments Table */}
      <div className="admin-table-wrapper" style={{ marginTop: '24px' }}>
        <div className="admin-table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="admin-table-title">Recent payments</div>
          <Link to="/admin/payments" style={{ fontSize: '13px', color: '#1D9E75', fontWeight: 600, textDecoration: 'none' }}>
            View all payments →
          </Link>
        </div>

        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="admin-skeleton-row">
                <div className="admin-skeleton admin-skeleton-circle" />
                <div
                  className="admin-skeleton admin-skeleton-line"
                  style={{ width: '120px', flex: 1 }}
                />
                <div
                  className="admin-skeleton admin-skeleton-line"
                  style={{ width: '80px' }}
                />
              </div>
            ))}
          </>
        ) : recentPayments.length === 0 ? (
          <div className="admin-empty">
            <IconReceipt size={48} />
            <div className="admin-empty-title">No payments yet</div>
            <div className="admin-empty-text">
              System payment records will appear here.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Receipt / ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => {
                  const payStatus = (p.paymentStatus || '').toUpperCase();
                  const isRefunded = payStatus === 'REFUNDED' || p.refundStatus === 'PROCESSED';
                  const isSuccess = payStatus === 'SUCCESS';

                  return (
                    <tr key={p.paymentId}>
                      <td>
                        <button
                          onClick={() => setSelectedPaymentId(p.paymentId)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#1D9E75',
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: 0,
                            textDecoration: 'underline',
                            fontFamily: 'monospace',
                          }}
                        >
                          {p.receiptNumber || `PAY-${p.paymentId}`}
                        </button>
                      </td>
                      <td>{p.patientName || 'Unknown patient'}</td>
                      <td>{p.doctorName || 'Unknown doctor'}</td>
                      <td style={{ fontWeight: 600, color: '#0B1F3F' }}>
                        {formatCurrency(p.amount)}
                      </td>
                      <td>
                        <span
                          className={`status-pill ${
                            isRefunded
                              ? 'gray'
                              : isSuccess
                              ? 'green'
                              : payStatus === 'PENDING'
                              ? 'amber'
                              : 'red'
                          }`}
                        >
                          {isRefunded ? 'REFUNDED' : payStatus || 'PENDING'}
                        </span>
                      </td>
                      <td>{formatDate(p.paidAt || p.createdAt)}</td>
                      <td>
                        {isRefunded ? (
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#6B7690',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            Refunded
                          </span>
                        ) : isSuccess ? (
                          <button
                            className="refund-btn"
                            onClick={() => setSelectedPaymentId(p.paymentId)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              fontSize: '12px',
                              borderRadius: '6px',
                              border: '1px solid #791F1F',
                              color: '#791F1F',
                              background: '#FFF',
                              cursor: 'pointer',
                            }}
                          >
                            <IconRefresh size={13} /> Refund
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#8C96AD' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPaymentId && (
        <PaymentDetailModal
          paymentId={selectedPaymentId}
          isAdmin={true}
          onClose={() => setSelectedPaymentId(null)}
          onRefundSuccess={() => fetchDashboardData()}
        />
      )}
    </div>
  );
}

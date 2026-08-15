import { useState, useEffect, useCallback } from 'react';
import patientAxios from '../../patient/api/patientAxios';
import PaginatedTable from '../components/PaginatedTable';
import PaymentDetailModal from '../../components/PaymentDetailModal';
import { formatCurrency, formatDate } from '../../utils/formatUtils';
import { IconRefresh, IconAlertCircle } from '@tabler/icons-react';
import toast from 'react-hot-toast';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const size = 10;

  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [refundTarget, setRefundTarget] = useState(null);
  const [refunding, setRefunding] = useState(false);

  const fetchPayments = useCallback(async (pageNum) => {
    try {
      const res = await patientAxios.get(`/payment/all?page=${pageNum}&size=${size}`);
      const data = res.data;
      const rawList = data.content || [];

      const apptGroups = new Map();
      rawList.forEach((p) => {
        if (!p.appointmentId) return;
        if (!apptGroups.has(p.appointmentId)) {
          apptGroups.set(p.appointmentId, []);
        }
        apptGroups.get(p.appointmentId).push(p);
      });

      const filteredList = rawList.filter((p) => {
        if (!p.appointmentId) return true;
        const group = apptGroups.get(p.appointmentId);
        if (group.length <= 1) return true;

        const s = (p.paymentStatus || '').toUpperCase();
        const hasCompletedOrRefunding = group.some((other) => {
          const os = (other.paymentStatus || '').toUpperCase();
          return os === 'SUCCESS' || os === 'REFUNDED' || os === 'REFUNDING';
        });

        if (s === 'PENDING' && hasCompletedOrRefunding) {
          return false;
        }

        if (s === 'PENDING') {
          const latestPending = group
            .filter((o) => (o.paymentStatus || '').toUpperCase() === 'PENDING')
            .sort((a, b) => (b.paymentId || 0) - (a.paymentId || 0))[0];
          return p.paymentId === latestPending.paymentId;
        }

        return true;
      });

      setPayments(filteredList);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching admin payments:', err);
      toast.error('Failed to fetch payments.');
    } finally {
      setLoading(false);
    }
  }, [size]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!ignore) {
        await fetchPayments(page);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [page, fetchPayments]);

  const handleRefund = async () => {
    if (!refundTarget) return;
    setRefunding(true);
    try {
      const res = await patientAxios.post(`/payment/refund/${refundTarget.paymentId}`);
      toast.success(res.data?.message || 'Refund processed successfully');
      setPayments((prev) =>
        prev.map((p) =>
          p.paymentId === refundTarget.paymentId
            ? { ...p, paymentStatus: 'REFUNDED', refundStatus: 'PROCESSED' }
            : p
        )
      );
      setRefundTarget(null);
    } catch (err) {
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || err.message || 'Refund failed';
      toast.error(msg);
    } finally {
      setRefunding(false);
    }
  };

  const renderStatusPill = (status) => {
    const s = (status || '').toUpperCase();
    let className = 'status-pill gray';
    if (s === 'SUCCESS') className = 'status-pill green';
    else if (s === 'PENDING') className = 'status-pill amber';
    else if (s === 'FAILED') className = 'status-pill red';
    else if (s === 'REFUNDED') className = 'status-pill gray';

    return <span className={className}>{s || 'PENDING'}</span>;
  };

  const columns = [
    { header: 'Receipt / ID', width: '160px' },
    { header: 'Patient', width: '130px' },
    { header: 'Doctor', width: '130px' },
    { header: 'Amount', width: '120px' },
    { header: 'Status', width: '130px' },
    { header: 'Date', width: '170px' },
    { header: 'Action', width: '120px' },
  ];

  const renderRow = (row) => {
    const payStatus = (row.paymentStatus || '').toUpperCase();
    const isSuccess = payStatus === 'SUCCESS';
    const isRefunded = payStatus === 'REFUNDED' || row.refundStatus === 'PROCESSED';
    const isRefundable = isSuccess && !isRefunded;

    const tooltipText = isRefunded
      ? 'Refund already processed'
      : isSuccess
        ? 'Refund patient payment and cancel appointment'
        : 'Refund only available for successful payments';

    return (
      <tr key={row.paymentId}>
        <td>
          <button
            onClick={() => setSelectedPaymentId(row.paymentId)}
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
            {row.receiptNumber || `PAY-${row.paymentId}`}
          </button>
        </td>
        <td>{row.patientName || 'Unknown patient'}</td>
        <td>{row.doctorName || 'Unknown doctor'}</td>
        <td style={{ fontWeight: 600, color: '#0B1F3F' }}>
          {formatCurrency(row.amount)}
        </td>
        <td>{renderStatusPill(isRefunded ? 'REFUNDED' : row.paymentStatus)}</td>
        <td>{formatDate(row.paidAt || row.createdAt)}</td>
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
          ) : (
            <button
              className="refund-btn"
              disabled={!isRefundable}
              title={tooltipText}
              onClick={() => setRefundTarget(row)}
            >
              <IconRefresh size={14} /> Refund
            </button>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div style={{ padding: '28px 20px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 700, color: '#0B1F3F' }}>
          All Payments
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#6B7690' }}>
          Admin overview of all system payments and refund management
        </p>
      </div>

      <PaginatedTable
        columns={columns}
        data={payments}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        size={size}
        onPageChange={(newPage) => setPage(newPage)}
        loading={loading}
        emptyMessage="No payments found."
        renderRow={renderRow}
      />

      {/* Shared Detail Modal */}
      {selectedPaymentId && (
        <PaymentDetailModal
          paymentId={selectedPaymentId}
          isAdmin={true}
          onClose={() => setSelectedPaymentId(null)}
          onRefundSuccess={() => fetchPayments(page)}
        />
      )}

      {/* Refund Confirmation Modal */}
      {refundTarget && (
        <div className="confirm-overlay" onClick={() => setRefundTarget(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon warning">
              <IconAlertCircle size={28} />
            </div>
            <h4>Confirm Refund</h4>
            <p>
              Refund <strong>{formatCurrency(refundTarget.amount)}</strong> to {refundTarget.patientName || 'Unknown patient'}? This cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                className="cancel-btn"
                onClick={() => setRefundTarget(null)}
                disabled={refunding}
              >
                Cancel
              </button>
              <button className="danger-btn" onClick={handleRefund} disabled={refunding}>
                {refunding ? 'Processing...' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import patientAxios from '../api/patientAxios';
import PaginatedTable from '../../admin/components/PaginatedTable';
import PaymentDetailModal from '../../components/PaymentDetailModal';
import { formatCurrency, formatDate } from '../../utils/formatUtils';

export default function PatientPaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const size = 10;

  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const fetchPayments = useCallback(async (pageNum) => {
    try {
      const res = await patientAxios.get(`/payment/history?page=${pageNum}&size=${size}`);
      const data = res.data;
      const rawList = data.content || [];
      rawList.sort((a, b) => (b.paymentId || 0) - (a.paymentId || 0));
      setPayments(rawList);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching payment history:', err);
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

  const columns = [
    { header: 'Receipt No.', width: '160px' },
    { header: 'Doctor', width: '150px' },
    { header: 'Date', width: '180px' },
    { header: 'Amount', width: '120px' },
    { header: 'Status', width: '180px' },
  ];

  const renderStatusPill = (status, row) => {
    const s = (status || '').toUpperCase();
    let className = 'status-pill gray';
    let text = s || 'PENDING';

    if (s === 'SUCCESS') {
      if (row?.appointmentStatus === 'CANCELLED') {
        className = 'status-pill amber';
        text = 'REFUNDING';
      } else {
        className = 'status-pill green';
        text = 'SUCCESS';
      }
    } else if (s === 'PENDING') {
      className = 'status-pill amber';
    } else if (s === 'FAILED') {
      className = 'status-pill red';
    } else if (s === 'REFUNDED') {
      className = 'status-pill gray';
      text = 'REFUNDED';
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className={className}>{text}</span>
        {s !== 'SUCCESS' && s !== 'REFUNDED' && row?.appointmentId && row?.appointmentStatus !== 'CANCELLED' && (
          <button
            className="btn btn-sm"
            style={{
              background: '#1D9E75',
              color: '#fff',
              border: 'none',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/pay', {
                state: {
                  appointmentId: row.appointmentId,
                  doctorName: row.doctorName,
                },
              });
            }}
          >
            Pay Now
          </button>
        )}
      </div>
    );
  };

  const renderRow = (row) => (
    <tr key={row.paymentId}>
      <td>
        <button
          className="link-btn font-mono"
          onClick={() => setSelectedPaymentId(row.paymentId)}
          style={{
            background: 'none',
            border: 'none',
            color: '#1D9E75',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          {row.receiptNumber || `PAY-${row.paymentId}`}
        </button>
      </td>
      <td>{row.doctorName || 'Unknown doctor'}</td>
      <td>{formatDate(row.paidAt || row.createdAt)}</td>
      <td style={{ fontWeight: 600, color: '#0B1F3F' }}>
        {formatCurrency(row.amount)}
      </td>
      <td>{renderStatusPill(row.paymentStatus, row)}</td>
    </tr>
  );

  return (
    <div style={{ padding: '28px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 700, color: '#0B1F3F' }}>
          My Payment History
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#6B7690' }}>
          Track and view receipt details for all your consultation payments
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
        emptyMessage="No payments yet."
        renderRow={renderRow}
      />

      {selectedPaymentId && (
        <PaymentDetailModal
          paymentId={selectedPaymentId}
          onClose={() => setSelectedPaymentId(null)}
        />
      )}
    </div>
  );
}

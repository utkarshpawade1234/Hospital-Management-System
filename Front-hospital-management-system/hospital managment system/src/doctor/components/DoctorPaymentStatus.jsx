import { useState, useEffect } from 'react';
import patientAxios from '../../patient/api/patientAxios';
import { formatCurrency, formatDate } from '../../utils/formatUtils';

export default function DoctorPaymentStatus({ appointmentId }) {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notPaid, setNotPaid] = useState(false);

  useEffect(() => {
    if (!appointmentId) return;
    patientAxios
      .get(`/payment/appointment/${appointmentId}`)
      .then((res) => {
        const content = res.data?.content || res.data;
        if (Array.isArray(content) && content.length > 0) {
          const successPayment = content.find((p) => p.paymentStatus === 'SUCCESS');
          setPaymentData(successPayment || content[0]);
        } else if (content && typeof content === 'object' && content.paymentStatus) {
          setPaymentData(content);
        } else {
          setNotPaid(true);
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotPaid(true);
        } else {
          setNotPaid(true);
        }
      })
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const renderStatusPill = (status) => {
    const s = (status || '').toUpperCase();
    let bg = '#F0F2F5';
    let color = '#6B7690';
    if (s === 'SUCCESS') {
      bg = '#E1F5EE';
      color = '#085041';
    } else if (s === 'PENDING') {
      bg = '#FEF6E0';
      color = '#633806';
    } else if (s === 'FAILED') {
      bg = '#FCEBEB';
      color = '#791F1F';
    } else if (s === 'REFUNDED') {
      bg = '#F0F2F5';
      color = '#6B7690';
    }

    return (
      <span
        style={{
          display: 'inline-block',
          padding: '2px 8px',
          borderRadius: '10px',
          fontSize: '11px',
          fontWeight: 600,
          backgroundColor: bg,
          color: color,
        }}
      >
        {s}
      </span>
    );
  };

  return (
    <div
      style={{
        marginTop: '14px',
        padding: '12px 14px',
        backgroundColor: '#F7F9FC',
        borderRadius: '8px',
        border: '1px solid #ECEEF3',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          fontWeight: 600,
          color: '#8C96AD',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '6px',
        }}
      >
        Payment Status
      </div>

      {loading ? (
        <div style={{ fontSize: '12px', color: '#6B7690' }}>Loading payment info...</div>
      ) : notPaid || !paymentData ? (
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#8C96AD' }}>
          Not paid yet
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderStatusPill(paymentData.paymentStatus)}
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0B1F3F' }}>
              {formatCurrency(paymentData.amount)}
            </span>
          </div>
          {paymentData.paidAt && (
            <span style={{ fontSize: '11px', color: '#6B7690' }}>
              {formatDate(paymentData.paidAt)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

import { useLocation, useNavigate } from 'react-router-dom';
import { IconCheck, IconCalendarEvent, IconReceipt } from '@tabler/icons-react';

// ─── palette (same as PaymentPage) ──────────────────────────────────────
const T = {
  navy:   '#0B1F3F',
  teal:   '#1D9E75',
  pageBg: '#F4F6FA',
  card:   '#FFFFFF',
  hair:   '#E5E8EF',
  hair2:  '#ECEEF3',
  label:  '#8C96AD',
  sec:    '#6B7690',
  font:   "'Inter', system-ui, -apple-system, sans-serif",
};

const fmtAmount = (amount, currency) => {
  if (amount == null) return '—';
  const sym = currency === 'INR' ? '₹' : '';
  return `${sym}${(amount / 100).toLocaleString('en-IN')}`;
};

const fmtDate = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return d; }
};

export default function ConfirmPayPage() {
  const location = useLocation();
  const navigate  = useNavigate();

  // Data passed via navigate('/payment-success', { state: { ... } })
  const {
    verifyData,
    order,
    doctorName  = 'Your doctor',
    appointmentDate,
  } = location.state || {};

  // Guard: if someone lands here without state, send them home
  if (!order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.font }}>
        <div style={{ textAlign: 'center', color: T.sec }}>
          <p>No payment information found.</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ marginTop: 16, padding: '10px 20px', background: T.teal, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: T.pageBg,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '48px 16px',
      fontFamily: T.font,
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* ── Success badge ── */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 72, height: 72,
            borderRadius: '50%',
            background: '#E1F5EE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 0 8px #d0f0e4',
          }}>
            <IconCheck size={36} color={T.teal} strokeWidth={2.5} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: T.navy }}>
            Payment Confirmed!
          </div>
          <div style={{ fontSize: '14px', color: T.sec, marginTop: '6px' }}>
            Your appointment has been booked successfully.
          </div>
        </div>

        {/* ── Receipt card ── */}
        <div style={{
          background: T.card,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 4px rgba(11,31,63,0.07)',
          border: `0.5px solid ${T.hair}`,
          marginBottom: '16px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', fontWeight: 700, color: T.label,
            textTransform: 'uppercase', letterSpacing: '0.5px',
            marginBottom: '16px',
          }}>
            <IconReceipt size={15} />
            Payment Receipt
          </div>

          {[
            { label: 'Doctor',         value: doctorName },
            { label: 'Date',           value: fmtDate(appointmentDate) },
            { label: 'Amount Paid',    value: fmtAmount(order?.amount, order?.currency) },
            { label: 'Receipt No.',    value: order?.receiptNumber },
            { label: 'Razorpay Order', value: order?.razorpayOrderId },
            ...(verifyData?.razorpayPaymentId
              ? [{ label: 'Payment ID', value: verifyData.razorpayPaymentId, mono: true }]
              : []),
          ].map((row, i, arr) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '10px 0',
              borderBottom: i < arr.length - 1 ? `1px solid ${T.hair2}` : 'none',
              fontSize: '13px',
              gap: '16px',
            }}>
              <span style={{ color: T.label, flexShrink: 0 }}>{row.label}</span>
              <span style={{
                color: T.navy, fontWeight: 500, textAlign: 'right',
                fontFamily: row.mono ? 'monospace' : 'inherit',
                wordBreak: 'break-all',
              }}>
                {row.value || '—'}
              </span>
            </div>
          ))}
        </div>

        {/* ── Status badge ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: '#E1F5EE', borderRadius: '10px', padding: '10px',
          fontSize: '13px', fontWeight: 600, color: T.teal,
          marginBottom: '24px',
        }}>
          <IconCheck size={16} />
          Payment status: SUCCESS
        </div>

        {/* ── Action buttons ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            id="confirm-view-appointments"
            onClick={() => navigate('/my-appointments')}
            style={{
              width: '100%', background: T.teal, color: '#fff',
              border: 'none', borderRadius: '10px', padding: '13px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: T.font,
            }}
          >
            <IconCalendarEvent size={16} />
            View My Appointments
          </button>

          <button
            id="confirm-go-dashboard"
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%', background: '#fff', color: T.navy,
              border: `1px solid ${T.hair}`, borderRadius: '10px', padding: '13px',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              fontFamily: T.font,
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

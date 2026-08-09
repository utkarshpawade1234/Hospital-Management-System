import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  IconCheck,
  IconLock,
  IconAlertTriangle,
  IconCalendar,
  IconClock,
  IconReceipt,
  IconStethoscope,
  IconShieldCheck,
  IconArrowLeft,
  IconRefresh,
} from '@tabler/icons-react';
import patientAxios from '../api/patientAxios';
import { clearSession } from '../../utils/sessionStorage';
import { formatCurrency } from '../../utils/formatUtils';
import './PaymentPage.css';

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    appointmentId,
    doctorName = 'Consulting Doctor',
    appointmentDate,
    startTime,
  } = location.state || {};

  // UI state machine: 'init' | 'ready' | 'processing' | 'success' | 'failure'
  const [phase, setPhase] = useState('init');
  const [order, setOrder] = useState(null); // CreateOrderResponseDTO
  const [, setVerify] = useState(null);
  const [lastPaymentId, setLastPaymentId] = useState(null);
  const [initError, setInitError] = useState(null);
  const [failureInfo, setFailureInfo] = useState(null);

  // Step 1: Create Order on Mount
  const createOrder = useCallback(async () => {
    if (!appointmentId) {
      setInitError('No appointment selected. Please navigate from booking.');
      return;
    }
    try {
      const res = await patientAxios.post('/payment/create-order', { appointmentId });
      setOrder(res.data);
      setPhase('ready');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || '';
      if (msg.toLowerCase().includes('already done') || msg.toLowerCase().includes('already paid')) {
        setPhase('success');
        return;
      }
      const status = err.response?.status;
      if (status === 401) {
        setInitError('Your session has expired. Please log in again.');
        setTimeout(() => {
          clearSession();
          navigate('/login');
        }, 2000);
        return;
      }
      if (status === 403) {
        setInitError(msg || 'Access denied. You are not authorized to pay for this appointment.');
        return;
      }
      setInitError(msg || 'Failed to create payment order. Please try again.');
    }
  }, [appointmentId, navigate]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!ignore) {
        await createOrder();
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [createOrder]);

  // Step 2: Launch Razorpay Checkout
  const openCheckout = async () => {
    if (!order) return;
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Razorpay SDK failed to load. Please check your network connection.');
      return;
    }

    const options = {
      key: order.razorpayKey,
      order_id: order.razorpayOrderId,
      name: 'Hospital Management System',
      description: `Consultation Fee for ${doctorName}`,
      receipt: order.receiptNumber,
      amount: Math.round(Number(order.amount) * 100),
      currency: order.currency || 'INR',
      theme: { color: '#1D9E75' },

      handler: async (response) => {
        setPhase('processing');
        setLastPaymentId(response.razorpay_payment_id);
        try {
          const vRes = await patientAxios.post('/payment/verify', {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
          setVerify(vRes.data);
          setPhase('success');
        } catch (err) {
          setFailureInfo({
            reason: 'Payment verification failed on server.',
            code: 'VERIFY_FAILED',
            description: err.response?.data?.message || 'Please try again or contact support.',
          });
          setPhase('failure');
        }
      },

      modal: {
        ondismiss: () => {
          setFailureInfo({
            reason: 'Payment window was closed before completion.',
            code: 'MODAL_DISMISSED',
            description: 'No charge was made. You can retry using the same order.',
          });
          setPhase('failure');
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error('Razorpay open error:', e);
    }
  };

  return (
    <div className="payment-page-root">
      <div className="payment-container">
        {/* Back Link */}
        <button className="back-link-btn" onClick={() => navigate('/my-appointments')}>
          <IconArrowLeft size={16} /> Back to My Appointments
        </button>

        {/* ── STATE 0: INITIAL ERROR ─────────────────── */}
        {initError ? (
          <div className="payment-card error-card">
            <div className="card-header-icon error-icon">
              <IconAlertTriangle size={32} />
            </div>
            <h2>Unable to Proceed</h2>
            <p className="error-msg-text">{initError}</p>
            <button className="primary-teal-btn" onClick={() => navigate('/find-doctors')}>
              Book New Appointment
            </button>
          </div>
        ) : phase === 'init' ? (
          /* ── LOADING INITIAL ORDER ─────────────────── */
          <div className="payment-card loading-card">
            <div className="payment-spinner" />
            <p>Initializing payment order...</p>
          </div>
        ) : phase === 'ready' ? (
          /* ── STATE 1: READY TO PAY ─────────────────── */
          <div className="payment-card">
            <div className="payment-card-header">
              <h2>Confirm & Pay</h2>
              <p className="subtitle">Review your appointment summary before completing payment</p>
            </div>

            {/* Summary Card bg #F7F9FC */}
            <div className="appointment-summary-card">
              <div className="summary-row">
                <IconStethoscope size={18} className="summary-icon" />
                <div className="summary-info">
                  <span className="summary-label">Doctor</span>
                  <span className="summary-val">{doctorName}</span>
                </div>
              </div>

              {(appointmentDate || startTime) && (
                <div className="summary-row">
                  <IconCalendar size={18} className="summary-icon" />
                  <div className="summary-info">
                    <span className="summary-label">Date & Time</span>
                    <span className="summary-val">
                      {appointmentDate || 'Today'} {startTime ? `at ${startTime}` : ''}
                    </span>
                  </div>
                </div>
              )}

              <div className="summary-row">
                <IconReceipt size={18} className="summary-icon" />
                <div className="summary-info">
                  <span className="summary-label">Receipt No.</span>
                  <span className="summary-val font-mono">{order?.receiptNumber || '—'}</span>
                </div>
              </div>
            </div>

            {/* Amount Payable */}
            <div className="amount-payable-block">
              <span className="payable-label">Amount Payable</span>
              <span className="payable-amount">{formatCurrency(order?.amount)}</span>
            </div>

            {/* Pay Button */}
            <button className="pay-now-btn" onClick={openCheckout}>
              <IconLock size={18} />
              Pay {formatCurrency(order?.amount)} Now
            </button>

            <div className="security-caption">
              <IconShieldCheck size={16} /> Secured by Razorpay 256-bit Encryption
            </div>
          </div>
        ) : phase === 'processing' ? (
          /* ── STATE 2: PROCESSING / VERIFYING ───────── */
          <div className="payment-card processing-card">
            <div className="payment-spinner large" />
            <h2>Verifying Your Payment</h2>
            <p>Please wait while we confirm your transaction. Don't close this window.</p>
          </div>
        ) : phase === 'success' ? (
          /* ── STATE 3: PAYMENT SUCCESSFUL ────────────── */
          <div className="payment-card success-card">
            <div className="card-header-icon success-icon">
              <IconCheck size={36} />
            </div>
            <h2>Payment Successful!</h2>
            <p className="success-sub">
              <strong>{formatCurrency(order?.amount)}</strong> paid to {doctorName}
            </p>

            <div className="verify-summary-block">
              <div className="v-row">
                <span>Receipt Number:</span>
                <span className="font-mono">{order?.receiptNumber || '—'}</span>
              </div>
              <div className="v-row">
                <span>Payment ID:</span>
                <span className="font-mono">{lastPaymentId || 'Completed'}</span>
              </div>
            </div>

            <button className="navy-btn" onClick={() => navigate('/my-appointments')}>
              View Appointment
            </button>
          </div>
        ) : phase === 'failure' ? (
          /* ── STATE 4: FAILED / DISMISSED ───────────── */
          <div className="payment-card failure-card">
            <div className="card-header-icon failure-icon">
              <IconAlertTriangle size={32} />
            </div>
            <h2>Payment Not Completed</h2>
            <p className="failure-desc">{failureInfo?.reason || 'The transaction was cancelled or incomplete.'}</p>

            {/* Retry uses the SAME order */}
            <button className="pay-now-btn" onClick={openCheckout}>
              <IconRefresh size={18} /> Try Again ({formatCurrency(order?.amount)})
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

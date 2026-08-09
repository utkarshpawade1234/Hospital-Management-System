import { useState, useEffect } from 'react';
import { IconX, IconCheck, IconAlertCircle, IconReceipt, IconRefresh } from '@tabler/icons-react';
import patientAxios from '../patient/api/patientAxios';
import { formatCurrency, formatDate } from '../utils/formatUtils';
import toast from 'react-hot-toast';
import './PaymentDetailModal.css';

export default function PaymentDetailModal({ paymentId, onClose, isAdmin = false, onRefundSuccess }) {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refunding, setRefunding] = useState(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  useEffect(() => {
    if (!paymentId) return;
    patientAxios
      .get(`/payment/${paymentId}`)
      .then((res) => {
        setPayment(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to load payment details.';
        setError(msg);
        setLoading(false);
      });
  }, [paymentId]);

  const handleRefund = async () => {
    setRefunding(true);
    try {
      const res = await patientAxios.post(`/payment/refund/${paymentId}`);
      toast.success(res.data?.message || 'Refund processed successfully');
      setPayment((prev) => prev ? { ...prev, paymentStatus: 'REFUNDED', refundStatus: 'PROCESSED' } : null);
      setShowRefundConfirm(false);
      if (onRefundSuccess) onRefundSuccess(paymentId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Refund failed');
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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="payment-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-title">
            <IconReceipt size={20} className="header-icon" />
            <h3>Payment Details</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <IconX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {loading ? (
            <div className="modal-state-box">
              <div className="spinner" />
              <p>Loading payment info...</p>
            </div>
          ) : error ? (
            <div className="modal-state-box error">
              <IconAlertCircle size={32} />
              <p>{error}</p>
            </div>
          ) : payment ? (
            <div className="payment-detail-grid">
              <div className="detail-item full-width highlight-item">
                <span className="label">Amount Payable</span>
                <span className="value large-amount">
                  {formatCurrency(payment.amount)} {payment.currency || 'INR'}
                </span>
              </div>

              <div className="detail-item">
                <span className="label">Receipt Number</span>
                <span className="value font-mono">{payment.receiptNumber || '—'}</span>
              </div>

              <div className="detail-item">
                <span className="label">Payment Status</span>
                <div className="value">{renderStatusPill(payment.paymentStatus)}</div>
              </div>

              <div className="detail-item">
                <span className="label">Doctor</span>
                <span className="value">{payment.doctorName || 'Unknown doctor'}</span>
              </div>

              <div className="detail-item">
                <span className="label">Patient</span>
                <span className="value">{payment.patientName || 'Unknown patient'}</span>
              </div>

              <div className="detail-item">
                <span className="label">Order Status</span>
                <span className="value">{payment.orderStatus || '—'}</span>
              </div>

              <div className="detail-item">
                <span className="label">Payment Method</span>
                <span className="value">{payment.paymentMethod || '—'}</span>
              </div>

              <div className="detail-item">
                <span className="label">Razorpay Order ID</span>
                <span className="value font-mono">{payment.razorpayOrderId || '—'}</span>
              </div>

              <div className="detail-item">
                <span className="label">Razorpay Payment ID</span>
                <span className="value font-mono">{payment.razorpayPaymentId || '—'}</span>
              </div>

              <div className="detail-item">
                <span className="label">Paid At</span>
                <span className="value">{payment.paidAt ? formatDate(payment.paidAt) : '—'}</span>
              </div>

              <div className="detail-item">
                <span className="label">Created At</span>
                <span className="value">{payment.createdAt ? formatDate(payment.createdAt) : '—'}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          {isAdmin && payment && payment.paymentStatus === 'SUCCESS' && (
            <button
              className="refund-btn"
              onClick={() => setShowRefundConfirm(true)}
              disabled={refunding}
            >
              <IconRefresh size={16} />
              Refund Payment
            </button>
          )}
          <button className="secondary-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Refund Confirm Modal */}
        {showRefundConfirm && (
          <div className="confirm-overlay" onClick={() => setShowRefundConfirm(false)}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon warning">
                <IconAlertCircle size={28} />
              </div>
              <h4>Confirm Refund</h4>
              <p>
                Refund <strong>{formatCurrency(payment?.amount)}</strong> to Patient #{payment?.patientId}? This cannot be undone.
              </p>
              <div className="confirm-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowRefundConfirm(false)}
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
    </div>
  );
}

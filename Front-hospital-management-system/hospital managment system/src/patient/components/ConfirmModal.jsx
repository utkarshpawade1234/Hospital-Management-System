import { IconAlertTriangle } from '@tabler/icons-react';
import '../patient.css';

export default function ConfirmModal({
  open,
  title = 'Confirm action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-status-red-bg)',
            color: 'var(--color-status-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <IconAlertTriangle size={24} />
        </div>
        <div className="modal-title">{title}</div>
        <div className="modal-subtitle" style={{ marginBottom: '24px' }}>{message}</div>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn"
            style={{ backgroundColor: '#E5503E', color: '#fff', width: 'auto' }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <><span className="spinner" /> Processing...</> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

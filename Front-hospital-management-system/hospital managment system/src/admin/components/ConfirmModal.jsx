import React from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';

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
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div
          className="admin-modal-icon"
          style={{
            backgroundColor: 'var(--color-status-red-bg)',
            color: 'var(--color-status-red)',
          }}
        >
          <IconAlertTriangle size={24} />
        </div>
        <div className="admin-modal-title">{title}</div>
        <div className="admin-modal-message">{message}</div>
        <div className="admin-modal-actions">
          <button
            className="admin-btn admin-btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="admin-btn admin-btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

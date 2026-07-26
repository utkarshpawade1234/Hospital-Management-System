import React from 'react';
import { IconX } from '@tabler/icons-react';

export default function DetailDrawer({
  open,
  title = 'Details',
  onClose,
  loading = false,
  children,
}) {
  if (!open) return null;

  return (
    <>
      <div className="admin-drawer-overlay" onClick={onClose} />
      <div className="admin-drawer">
        <div className="admin-drawer-header">
          <h3 className="admin-drawer-title">{title}</h3>
          <button className="admin-drawer-close" onClick={onClose}>
            <IconX size={18} />
          </button>
        </div>
        <div className="admin-drawer-body">
          {loading ? (
            <DrawerSkeleton />
          ) : (
            children
          )}
        </div>
      </div>
    </>
  );
}

export function DrawerField({ label, value }) {
  return (
    <div className="admin-drawer-field">
      <div className="admin-drawer-label">{label}</div>
      <div className="admin-drawer-value">{value ?? '—'}</div>
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="admin-drawer-field">
          <div
            className="admin-skeleton"
            style={{ width: '80px', height: '12px', marginBottom: '8px' }}
          />
          <div
            className="admin-skeleton"
            style={{ width: `${140 + (i % 3) * 40}px`, height: '16px' }}
          />
        </div>
      ))}
    </>
  );
}

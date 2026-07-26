import React from 'react';

const colorMap = {
  // Appointment statuses
  CONFIRMED: 'admin-pill-green',
  PENDING: 'admin-pill-amber',
  CANCELLED: 'admin-pill-red',
  COMPLETED: 'admin-pill-blue',

  // Availability
  AVAILABLE: 'admin-pill-green',
  NOT_AVAILABLE: 'admin-pill-red',
  ON_LEAVE: 'admin-pill-amber',

  // Roles
  ADMIN: 'admin-pill-coral',
  DOCTOR: 'admin-pill-blue',
  PATIENT: 'admin-pill-purple',
};

const labelMap = {
  NOT_AVAILABLE: 'Not available',
  ON_LEAVE: 'On leave',
};

export default function StatusPill({ status }) {
  if (!status) return <span className="admin-pill admin-pill-blue">—</span>;

  const cls = colorMap[status] || 'admin-pill-blue';
  const label =
    labelMap[status] ||
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return <span className={`admin-pill ${cls}`}>{label}</span>;
}

import React from 'react';

export default function StatCard({ icon, value, label, color, bgColor }) {
  return (
    <div className="admin-stat-card">
      <div
        className="admin-stat-icon"
        style={{ backgroundColor: bgColor, color: color }}
      >
        {icon}
      </div>
      <div className="admin-stat-value">{value ?? '—'}</div>
      <div className="admin-stat-label">{label}</div>
    </div>
  );
}

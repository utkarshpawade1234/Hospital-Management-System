import { Link } from 'react-router-dom';
import { IconStethoscope, IconUser, IconCalendarEvent } from '@tabler/icons-react';

export default function DashboardPage() {
  const userEmail = localStorage.getItem('userEmail') || '';
  const firstName = userEmail ? userEmail.split('@')[0] : 'Patient';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {firstName}!</h1>
        <p className="page-subtitle">Here is a quick overview of your account.</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>
          Quick Actions
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Link
            to="/doctors"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              borderRadius: '8px',
              background: 'var(--color-bg)',
              textDecoration: 'none',
              color: 'var(--color-text-primary)',
              fontWeight: 500,
              border: '1px solid var(--color-border)',
              transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-teal)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            <div style={{ background: 'var(--color-teal)', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <IconStethoscope size={20} />
            </div>
            Find Doctors
          </Link>

          <Link
            to="/my-appointments"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              borderRadius: '8px',
              background: 'var(--color-bg)',
              textDecoration: 'none',
              color: 'var(--color-text-primary)',
              fontWeight: 500,
              border: '1px solid var(--color-border)',
              transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-teal)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            <div style={{ background: '#3B82F6', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <IconCalendarEvent size={20} />
            </div>
            My Appointments
          </Link>

          <Link
            to="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              borderRadius: '8px',
              background: 'var(--color-bg)',
              textDecoration: 'none',
              color: 'var(--color-text-primary)',
              fontWeight: 500,
              border: '1px solid var(--color-border)',
              transition: 'border-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-teal)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            <div style={{ background: '#9FB3D4', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <IconUser size={20} />
            </div>
            My Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

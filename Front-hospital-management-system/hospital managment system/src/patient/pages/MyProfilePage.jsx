import { useState, useEffect } from 'react';
import { IconEdit, IconX } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { getProfile, updatePatientDetails } from '../api/patientApi';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getProfile(email);
      setProfile(data);
      setForm(data);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Build partial update — only send changed fields + email
      const payload = { email };
      const fields = [
        'firstName', 'lastName', 'address', 'phoneNumber', 'dob',
        'profilephoto', 'description', 'bloodGroup',
        'emergencyContactName', 'emergencyContactNumber',
        'emergencyContactRelation',
      ];
      fields.forEach((f) => {
        if (form[f] !== profile[f] && form[f] !== undefined) {
          payload[f] = form[f];
        }
      });

      const res = await updatePatientDetails(payload);
      toast.success(res.message || 'Profile updated!');
      await fetchProfile();
      setEditing(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
        </div>
        <div className="card" style={{ maxWidth: '700px' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '28px' }}>
            <div className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '160px', height: '20px', marginBottom: '8px' }} />
              <div className="skeleton" style={{ width: '200px', height: '14px' }} />
            </div>
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '6px' }} />
              <div className="skeleton" style={{ width: `${150 + (i % 3) * 40}px`, height: '16px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const initials = `${(profile.firstName || '?')[0]}${(profile.lastName || '')[0] || ''}`.toUpperCase();

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">View and manage your personal information</p>
        </div>
        {!editing ? (
          <button className="btn btn-outline-teal" onClick={handleEdit}>
            <IconEdit size={16} />
            Edit profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={handleCancel} disabled={saving}>
              <IconX size={16} /> Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ width: 'auto' }}>
              {saving ? <><span className="spinner" /> Saving...</> : 'Save changes'}
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div>
            {editing ? (
              <div className="form-row" style={{ marginBottom: 0 }}>
                <input className="form-input" value={form.firstName || ''} onChange={set('firstName')} placeholder="First name" />
                <input className="form-input" value={form.lastName || ''} onChange={set('lastName')} placeholder="Last name" />
              </div>
            ) : (
              <>
                <div className="profile-name">{profile.firstName} {profile.lastName}</div>
                <div className="profile-email">{profile.email}</div>
              </>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="profile-grid">
          <ProfileField label="Email" value={profile.email} />

          {editing ? (
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</label>
              <input className="form-input" value={form.phoneNumber || ''} onChange={set('phoneNumber')} />
            </div>
          ) : (
            <ProfileField label="Phone" value={profile.phoneNumber} />
          )}

          {editing ? (
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date of birth</label>
              <input className="form-input" type="date" value={form.dob || ''} onChange={set('dob')} />
            </div>
          ) : (
            <ProfileField label="Date of birth" value={profile.dob} />
          )}

          {editing ? (
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Blood group</label>
              <select className="form-select" value={form.bloodGroup || ''} onChange={set('bloodGroup')}>
                <option value="">—</option>
                {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
          ) : (
            <ProfileField label="Blood group" value={profile.bloodGroup} />
          )}

          {editing ? (
            <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
              <label className="form-label" style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Address</label>
              <input className="form-input" value={form.address || ''} onChange={set('address')} />
            </div>
          ) : (
            <ProfileField label="Address" value={profile.address} span />
          )}

          {editing ? (
            <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
              <label className="form-label" style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</label>
              <textarea className="form-textarea" value={form.description || ''} onChange={set('description')} />
            </div>
          ) : (
            <ProfileField label="Description" value={profile.description} span />
          )}
        </div>

        {/* Emergency contact section */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Emergency contact
          </div>
          <div className="profile-grid">
            {editing ? (
              <>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</label>
                  <input className="form-input" value={form.emergencyContactName || ''} onChange={set('emergencyContactName')} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Number</label>
                  <input className="form-input" value={form.emergencyContactNumber || ''} onChange={set('emergencyContactNumber')} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Relation</label>
                  <input className="form-input" value={form.emergencyContactRelation || ''} onChange={set('emergencyContactRelation')} />
                </div>
              </>
            ) : (
              <>
                <ProfileField label="Name" value={profile.emergencyContactName} />
                <ProfileField label="Number" value={profile.emergencyContactNumber} />
                <ProfileField label="Relation" value={profile.emergencyContactRelation} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value, span }) {
  return (
    <div style={span ? { gridColumn: '1 / -1' } : {}}>
      <div className="profile-field-label">{label}</div>
      <div className="profile-field-value">{value || '—'}</div>
    </div>
  );
}

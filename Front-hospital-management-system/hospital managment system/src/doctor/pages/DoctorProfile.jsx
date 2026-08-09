import { useState } from 'react';
import { IconEdit, IconX } from '@tabler/icons-react';
import { useOutletContext } from 'react-router-dom';
import api from '../api';
import PhotoUpload from '../../patient/components/PhotoUpload';
import toast from 'react-hot-toast';

const AVAILABILITY_OPTIONS = [
  { value: 'AVAILABLE',     label: 'Available' },
  { value: 'NOT_AVAILABLE', label: 'Not Available' },
  { value: 'ON_LEAVE',      label: 'On Leave' },
];

// Only the fields updateMyProfile() on the backend actually persists.
const EDITABLE = [
  'firstName', 'lastName', 'phoneNumber',
  'description', 'availabilityStatus', 'profilePhoto',
];

export default function DoctorProfile() {
  const { profile, setProfile } = useOutletContext();
  const [editing, setEditing]   = useState(false);
  const [form, setForm]         = useState({});
  const [saving, setSaving]     = useState(false);

  const [prevProfile, setPrevProfile] = useState(null);
  if (profile && profile !== prevProfile) {
    setPrevProfile(profile);
    const snap = {};
    EDITABLE.forEach((k) => { snap[k] = profile[k] ?? ''; });
    setForm(snap);
  }

  if (!profile) {
    return (
      <div style={{ display: 'flex', gap: '24px', padding: '4px', maxWidth: '1020px', margin: '0 auto' }}>
        <div className="skeleton" style={{ width: '230px', height: '360px', borderRadius: '12px' }} />
        <div className="skeleton" style={{ flex: 1, height: '360px', borderRadius: '12px' }} />
      </div>
    );
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleCancel = () => {
    const snap = {};
    EDITABLE.forEach((k) => { snap[k] = profile[k] ?? ''; });
    setForm(snap);
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const changed = {};
      EDITABLE.forEach((k) => {
        if (String(form[k] ?? '') !== String(profile[k] ?? '')) {
          changed[k] = form[k];
        }
      });
      if (!Object.keys(changed).length) {
        toast('Nothing to save', { icon: 'ℹ️' });
        setEditing(false);
        setSaving(false);
        return;
      }
      const res = await api.put('/doctor/profile', changed);
      setProfile((p) => ({ ...p, ...changed }));
      toast.success(res.data?.message || 'Profile updated successfully');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const initials =
    `${(profile.firstName || '?')[0]}${(profile.lastName || '')[0] || ''}`.toUpperCase();

  const currentPhoto = editing
    ? form.profilePhoto || ''
    : profile.profilePhoto || '';

  const deptName =
    profile.department?.departmentName ||
    profile.departmentName ||
    (typeof profile.department === 'string' ? profile.department : '') ||
    '';

  const displayStatus = editing
    ? (form.availabilityStatus || 'AVAILABLE')
    : (profile.availabilityStatus || 'AVAILABLE');

  const statusLabel =
    AVAILABILITY_OPTIONS.find((o) => o.value === displayStatus)?.label || displayStatus;

  // ── shared micro-styles ────────────────────────────────────────────
  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: '12px',
    border: '0.5px solid #E2E6ED',
    boxShadow: '0 1px 3px rgba(11,31,63,0.04)',
  };

  const kvRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '12px',
    borderTop: '1px solid #EDEFF3',
  };

  const fieldLabelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: '#8C96AD',
    textTransform: 'uppercase',
    letterSpacing: '0.45px',
    marginBottom: '4px',
  };

  const fieldValueStyle = {
    fontSize: '14px',
    color: '#0B1F3F',
    fontWeight: 400,
    paddingBottom: '10px',
    borderBottom: '1px solid #EDEFF3',
  };

  // ── render ─────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* ─── LEFT SUMMARY CARD ─────────────────────────────── */}
        <div style={{ ...cardStyle, width: '230px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Avatar */}
          <PhotoUpload
            value={currentPhoto}
            onChange={(url) => setForm({ ...form, profilePhoto: url })}
            isEditing={editing}
            initials={initials}
            size={64}
          />

          {/* Name */}
          <div style={{ fontSize: '16px', fontWeight: 500, color: '#0B1F3F', marginTop: '12px', textAlign: 'center' }}>
            {editing
              ? `${form.firstName || ''} ${form.lastName || ''}`.trim() || '—'
              : `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || '—'}
          </div>

          {/* Email */}
          <div style={{ fontSize: '12px', color: '#9FB3D4', marginTop: '3px', textAlign: 'center', wordBreak: 'break-all' }}>
            {profile.email || '—'}
          </div>

          {/* Availability pill */}
          <div style={{ marginTop: '12px', marginBottom: '16px' }}>
            {editing ? (
              <select
                value={form.availabilityStatus}
                onChange={set('availabilityStatus')}
                style={{
                  background: '#E1F5EE', color: '#085041',
                  border: 'none', borderRadius: '20px',
                  padding: '3px 11px', fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', outline: 'none',
                }}
              >
                {AVAILABILITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: '#E1F5EE', color: '#085041',
                borderRadius: '20px', padding: '3px 11px',
                fontSize: '12px', fontWeight: 500,
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#1D9E75', display: 'inline-block',
                }} />
                {statusLabel}
              </span>
            )}
          </div>

          {/* Key-value rows */}
          <div style={{ width: '100%', borderTop: '1px solid #EDEFF3' }}>
            <div style={kvRowStyle}>
              <span style={{ color: '#9FB3D4' }}>Phone</span>
              <span style={{ fontWeight: 600, color: '#0B1F3F', fontSize: '12px' }}>
                {(editing ? form.phoneNumber : profile.phoneNumber) || '—'}
              </span>
            </div>
            <div style={kvRowStyle}>
              <span style={{ color: '#9FB3D4' }}>Department</span>
              <span style={{ fontWeight: 600, color: '#0B1F3F', fontSize: '12px', textAlign: 'right', maxWidth: '120px' }}>
                {deptName || '—'}
              </span>
            </div>
            <div style={{ ...kvRowStyle, borderBottom: 'none' }}>
              <span style={{ color: '#9FB3D4' }}>Room</span>
              <span style={{ fontWeight: 600, color: '#0B1F3F', fontSize: '12px' }}>
                {profile.roomNumber || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT DETAILS CARD ─────────────────────────────── */}
        <div style={{ ...cardStyle, flex: 1, minWidth: '320px', padding: '22px' }}>

          {/* Header row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '16px',
            borderBottom: '1px solid #EDEFF3',
            marginBottom: '20px',
          }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#0B1F3F', margin: 0 }}>
                Professional details
              </div>
              <div style={{ fontSize: '12px', color: '#9FB3D4', marginTop: '3px' }}>
                Keep your information up to date
              </div>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                style={{
                  background: '#1D9E75', color: '#fff', border: 'none',
                  borderRadius: '8px', padding: '8px 16px',
                  fontSize: '13px', fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <IconEdit size={15} /> Edit profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCancel} disabled={saving}
                  style={{
                    background: '#fff', color: '#6B7690',
                    border: '1px solid #E2E6ED', borderRadius: '8px',
                    padding: '8px 16px', fontSize: '13px', fontWeight: 500,
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    cursor: 'pointer', opacity: saving ? 0.5 : 1,
                  }}
                >
                  <IconX size={14} /> Cancel
                </button>
                <button
                  onClick={handleSave} disabled={saving}
                  style={{
                    background: '#1D9E75', color: '#fff', border: 'none',
                    borderRadius: '8px', padding: '8px 16px',
                    fontSize: '13px', fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving
                    ? <><span className="spinner" style={{ width: 13, height: 13 }} /> Saving…</>
                    : 'Save changes'}
                </button>
              </div>
            )}
          </div>

          {/* ── EDITABLE FIELDS ─────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            rowGap: '14px',
            columnGap: '20px',
            marginBottom: '20px',
          }}>
            {/* First name */}
            <div>
              <span style={fieldLabelStyle}>First name</span>
              {editing
                ? <input className="form-input" value={form.firstName || ''} onChange={set('firstName')} style={{ height: '36px', marginBottom: 0 }} />
                : <div style={fieldValueStyle}>{profile.firstName || '—'}</div>}
            </div>

            {/* Last name */}
            <div>
              <span style={fieldLabelStyle}>Last name</span>
              {editing
                ? <input className="form-input" value={form.lastName || ''} onChange={set('lastName')} style={{ height: '36px', marginBottom: 0 }} />
                : <div style={fieldValueStyle}>{profile.lastName || '—'}</div>}
            </div>

            {/* Phone — editable in both modes via input/display */}
            <div style={{ gridColumn: editing ? '1 / -1' : undefined }}>
              <span style={fieldLabelStyle}>Phone</span>
              {editing
                ? <input className="form-input" value={form.phoneNumber || ''} onChange={set('phoneNumber')} style={{ height: '36px', marginBottom: 0 }} />
                : <div style={fieldValueStyle}>{profile.phoneNumber || '—'}</div>}
            </div>

            {/* Read-only fields — plain display when NOT editing */}
            {!editing && (
              <>
                <div>
                  <span style={fieldLabelStyle}>Specialization</span>
                  <div style={fieldValueStyle}>{profile.specialization || '—'}</div>
                </div>
                <div>
                  <span style={fieldLabelStyle}>Qualification</span>
                  <div style={fieldValueStyle}>{profile.qualification || '—'}</div>
                </div>
                <div>
                  <span style={fieldLabelStyle}>Years of experience</span>
                  <div style={fieldValueStyle}>
                    {profile.yearsOfExperience != null ? `${profile.yearsOfExperience} yrs` : '—'}
                  </div>
                </div>
                <div>
                  <span style={fieldLabelStyle}>Consultation fee</span>
                  <div style={fieldValueStyle}>
                    {profile.consultationFee != null ? `₹${profile.consultationFee}` : '—'}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── READ-ONLY BLOCK (edit mode only) ─────────────── */}
          {editing && (
            <div style={{
              background: '#F7F9FC',
              borderRadius: '10px',
              border: '0.5px solid #E2E6ED',
              padding: '14px 16px',
              marginBottom: '20px',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: 600,
                color: '#8C96AD', textTransform: 'uppercase',
                letterSpacing: '0.45px', marginBottom: '12px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{
                  display: 'inline-block', width: 6, height: 6,
                  borderRadius: '50%', background: '#9FB3D4',
                }} />
                Read-only · managed by admin
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                rowGap: '12px',
                columnGap: '20px',
              }}>
                {[
                  ['Specialization', profile.specialization],
                  ['Qualification', profile.qualification],
                  ['Years of experience', profile.yearsOfExperience != null ? `${profile.yearsOfExperience} yrs` : null],
                  ['Consultation fee', profile.consultationFee != null ? `₹${profile.consultationFee}` : null],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: '11px', color: '#8C96AD', marginBottom: '3px' }}>{label}</div>
                    <div style={{ fontSize: '13px', color: '#0B1F3F' }}>{val || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About section */}
          <div style={{ borderTop: '1px solid #EDEFF3', paddingTop: '20px' }}>
            <span style={{ ...fieldLabelStyle, display: 'block', marginBottom: '10px' }}>About</span>
            {editing ? (
              <textarea
                value={form.description || ''}
                onChange={set('description')}
                style={{
                  width: '100%', minHeight: '80px',
                  padding: '10px 12px',
                  border: '1px solid #E2E6ED', borderRadius: '8px',
                  fontSize: '13px', lineHeight: '1.6',
                  color: '#0B1F3F', resize: 'none', outline: 'none',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  boxSizing: 'border-box',
                }}
              />
            ) : (
              <div style={{ fontSize: '13px', color: '#6B7690', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {profile.description || 'No description added yet.'}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

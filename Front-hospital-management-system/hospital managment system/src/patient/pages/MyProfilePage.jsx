import { useState, useEffect, useCallback } from 'react';
import { IconEdit, IconX } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { getProfile, updatePatientDetails } from '../api/patientApi';
import PhotoUpload from '../components/PhotoUpload';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const email = localStorage.getItem('userEmail');

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setForm(data);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!ignore) {
        await fetchProfile();
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [fetchProfile]);

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
        'firstName',
        'lastName',
        'address',
        'phoneNumber',
        'dob',
        'profilephoto',
        'profilePhoto',
        'description',
        'bloodGroup',
        'emergencyContactName',
        'emergencyContactNumber',
        'emergencyContactRelation',
      ];
      fields.forEach((f) => {
        if (form[f] !== profile[f] && form[f] !== undefined) {
          payload[f] = form[f];
        }
      });

      const res = await updatePatientDetails(payload);
      toast.success(res.message || 'Profile updated successfully!');
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
      <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <div
            className="skeleton"
            style={{ width: '260px', height: '340px', borderRadius: '12px' }}
          />
          <div
            className="skeleton"
            style={{ flex: 1, height: '340px', borderRadius: '12px' }}
          />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const initials =
    `${(profile.firstName || '?')[0]}${(profile.lastName || '')[0] || ''}`.toUpperCase();

  const currentPhoto = editing
    ? form.profilePhoto || form.profilephoto
    : profile.profilePhoto || profile.profilephoto;

  return (
    <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
      {/* ─── Page Container Layout ─────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* ─── LEFT SUMMARY CARD ───────────────────── */}
        <div
          style={{
            width: '260px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '0.5px solid var(--color-border, #E8ECF1)',
            padding: '24px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Photo Avatar */}
          <PhotoUpload
            value={currentPhoto}
            onChange={(url) =>
              setForm({ ...form, profilePhoto: url, profilephoto: url })
            }
            isEditing={editing}
            initials={initials}
            size={84}
          />

          {/* Full Name */}
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--color-navy, #0B1F3F)',
              margin: '14px 0 2px',
              textAlign: 'center',
            }}
          >
            {editing ? `${form.firstName || ''} ${form.lastName || ''}` : `${profile.firstName || ''} ${profile.lastName || ''}`}
          </h3>

          {/* Email */}
          <p
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary, #6B7A99)',
              margin: '0 0 12px',
              textAlign: 'center',
              wordBreak: 'break-all',
            }}
          >
            {profile.email}
          </p>

          {/* Status Pill */}
          <div style={{ marginBottom: '18px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: '20px',
                background: '#E6F7F1',
                color: '#178A66',
                fontWeight: 600,
              }}
            >
              ● Active patient
            </span>
          </div>

          {/* Key Value List */}
          <div
            style={{
              width: '100%',
              borderTop: '1px solid var(--color-border, #E8ECF1)',
              paddingTop: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #F0F2F5',
                fontSize: '12px',
              }}
            >
              <span style={{ color: 'var(--color-text-secondary, #6B7A99)' }}>
                Patient ID
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: 'var(--color-text-primary, #1A1D26)',
                }}
              >
                #{profile.patientId || '—'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #F0F2F5',
                fontSize: '12px',
              }}
            >
              <span style={{ color: 'var(--color-text-secondary, #6B7A99)' }}>
                Phone
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: 'var(--color-text-primary, #1A1D26)',
                }}
              >
                {(editing ? form.phoneNumber : profile.phoneNumber) || '—'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #F0F2F5',
                fontSize: '12px',
              }}
            >
              <span style={{ color: 'var(--color-text-secondary, #6B7A99)' }}>
                Blood group
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: 'var(--color-text-primary, #1A1D26)',
                }}
              >
                {(editing ? form.bloodGroup : profile.bloodGroup) || '—'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                fontSize: '12px',
              }}
            >
              <span style={{ color: 'var(--color-text-secondary, #6B7A99)' }}>
                Date of birth
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: 'var(--color-text-primary, #1A1D26)',
                }}
              >
                {(editing ? form.dob : profile.dob) || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* ─── RIGHT DETAILS CARD ──────────────────── */}
        <div
          style={{
            flex: 1,
            minWidth: '320px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '0.5px solid var(--color-border, #E8ECF1)',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              borderBottom: '1px solid var(--color-border, #E8ECF1)',
              paddingBottom: '16px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--color-navy, #0B1F3F)',
                  margin: 0,
                }}
              >
                Personal details
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary, #6B7A99)',
                  margin: '3px 0 0',
                }}
              >
                Keep your information up to date
              </p>
            </div>

            {!editing ? (
              <button
                type="button"
                onClick={handleEdit}
                style={{
                  background: '#1D9E75',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                }}
              >
                <IconEdit size={16} />
                Edit profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  style={{
                    background: '#FFFFFF',
                    color: 'var(--color-text-secondary, #6B7A99)',
                    border: '1px solid #E8ECF1',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <IconX size={16} />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    background: '#1D9E75',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {saving ? (
                    <>
                      <span className="spinner" /> Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 2-Column Fields Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px 24px',
              marginBottom: '24px',
            }}
          >
            {/* First Name */}
            <div
              style={{
                borderBottom: '1px solid #F0F2F5',
                paddingBottom: '10px',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary, #6B7A99)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                First name
              </label>
              {editing ? (
                <input
                  className="form-input"
                  value={form.firstName || ''}
                  onChange={set('firstName')}
                  style={{ width: '100%', fontSize: '14px', padding: '6px 10px' }}
                />
              ) : (
                <div style={{ fontSize: '14px', color: '#1A1D26' }}>
                  {profile.firstName || '—'}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div
              style={{
                borderBottom: '1px solid #F0F2F5',
                paddingBottom: '10px',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary, #6B7A99)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Last name
              </label>
              {editing ? (
                <input
                  className="form-input"
                  value={form.lastName || ''}
                  onChange={set('lastName')}
                  style={{ width: '100%', fontSize: '14px', padding: '6px 10px' }}
                />
              ) : (
                <div style={{ fontSize: '14px', color: '#1A1D26' }}>
                  {profile.lastName || '—'}
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div
              style={{
                borderBottom: '1px solid #F0F2F5',
                paddingBottom: '10px',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary, #6B7A99)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Date of birth
              </label>
              {editing ? (
                <input
                  className="form-input"
                  type="date"
                  value={form.dob || ''}
                  onChange={set('dob')}
                  style={{ width: '100%', fontSize: '14px', padding: '6px 10px' }}
                />
              ) : (
                <div style={{ fontSize: '14px', color: '#1A1D26' }}>
                  {profile.dob || '—'}
                </div>
              )}
            </div>

            {/* Blood Group */}
            <div
              style={{
                borderBottom: '1px solid #F0F2F5',
                paddingBottom: '10px',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary, #6B7A99)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Blood group
              </label>
              {editing ? (
                <select
                  className="form-select"
                  value={form.bloodGroup || ''}
                  onChange={set('bloodGroup')}
                  style={{ width: '100%', fontSize: '14px', padding: '6px 10px' }}
                >
                  <option value="">— Select —</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ fontSize: '14px', color: '#1A1D26' }}>
                  {profile.bloodGroup || '—'}
                </div>
              )}
            </div>

            {/* Address (full width span) */}
            <div
              style={{
                gridColumn: '1 / -1',
                borderBottom: '1px solid #F0F2F5',
                paddingBottom: '10px',
              }}
            >
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary, #6B7A99)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Address
              </label>
              {editing ? (
                <input
                  className="form-input"
                  value={form.address || ''}
                  onChange={set('address')}
                  style={{ width: '100%', fontSize: '14px', padding: '6px 10px' }}
                />
              ) : (
                <div style={{ fontSize: '14px', color: '#1A1D26' }}>
                  {profile.address || '—'}
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-text-secondary, #6B7A99)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Emergency contact
            </label>
            <div
              style={{
                background: '#F8FAFC',
                borderRadius: '10px',
                border: '1px solid #E8ECF1',
                padding: '16px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '16px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-secondary, #6B7A99)',
                      marginBottom: '4px',
                    }}
                  >
                    Name
                  </div>
                  {editing ? (
                    <input
                      className="form-input"
                      value={form.emergencyContactName || ''}
                      onChange={set('emergencyContactName')}
                      style={{ width: '100%', fontSize: '13px' }}
                    />
                  ) : (
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1D26' }}>
                      {profile.emergencyContactName || '—'}
                    </div>
                  )}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-secondary, #6B7A99)',
                      marginBottom: '4px',
                    }}
                  >
                    Number
                  </div>
                  {editing ? (
                    <input
                      className="form-input"
                      value={form.emergencyContactNumber || ''}
                      onChange={set('emergencyContactNumber')}
                      style={{ width: '100%', fontSize: '13px' }}
                    />
                  ) : (
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1D26' }}>
                      {profile.emergencyContactNumber || '—'}
                    </div>
                  )}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-secondary, #6B7A99)',
                      marginBottom: '4px',
                    }}
                  >
                    Relation
                  </div>
                  {editing ? (
                    <input
                      className="form-input"
                      value={form.emergencyContactRelation || ''}
                      onChange={set('emergencyContactRelation')}
                      style={{ width: '100%', fontSize: '13px' }}
                    />
                  ) : (
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1D26' }}>
                      {profile.emergencyContactRelation || '—'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-text-secondary, #6B7A99)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              About / Description
            </label>
            {editing ? (
              <textarea
                className="form-textarea"
                value={form.description || ''}
                onChange={set('description')}
                style={{
                  width: '100%',
                  fontSize: '13px',
                  minHeight: '80px',
                  lineHeight: '1.5',
                  resize: 'none',
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: '13px',
                  color: '#4B5563',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line',
                }}
              >
                {profile.description || 'No description added yet.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

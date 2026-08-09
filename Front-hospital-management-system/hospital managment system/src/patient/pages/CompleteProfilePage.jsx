import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  IconClipboardHeart,
  IconDroplet,
  IconPhone,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { registerPatientDetails, getProfile } from '../api/patientApi';
import { getSessionItem, setSessionItem } from '../../utils/sessionStorage';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function CompleteProfilePage() {
  const [form, setForm] = useState({
    description: '',
    bloodGroup: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactRelation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.bloodGroup) e.bloodGroup = 'Blood group is required';
    if (!form.emergencyContactName.trim())
      e.emergencyContactName = 'Name is required';
    if (!form.emergencyContactNumber.trim())
      e.emergencyContactNumber = 'Number is required';
    else if (!/^[0-9]{10}$/.test(form.emergencyContactNumber))
      e.emergencyContactNumber = 'Must be 10 digits';
    if (!form.emergencyContactRelation.trim())
      e.emergencyContactRelation = 'Relation is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const email = getSessionItem('userEmail');
      const res = await registerPatientDetails({ ...form, email });
      toast.success(res.message || 'Profile completed!');

      try {
        const profile = await getProfile(email);
        if (profile.patientId) {
          setSessionItem('patientId', profile.patientId);
        }
      } catch {
        // Ignore secondary profile fetch error
      }

      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to save profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 31, 63, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'var(--color-card, #ffffff)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B1F3F 0%, #1D9E75 100%)',
            padding: '24px 28px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconClipboardHeart size={26} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 2px', color: '#ffffff' }}>
                Complete Your Profile
              </h2>
              <p style={{ fontSize: '13px', margin: 0, opacity: 0.88 }}>
                Please fill in your medical details to get started
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            title="Skip for now"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '28px', overflowY: 'auto' }}>
          <form onSubmit={handleSubmit} noValidate>
            {/* Medical Information */}
            <div style={{ marginBottom: '22px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px',
                  color: 'var(--color-navy, #0B1F3F)',
                  fontWeight: 600,
                  fontSize: '13px',
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                }}
              >
                <IconDroplet size={18} color="var(--color-teal, #1D9E75)" />
                Medical Information
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Blood Group <span style={{ color: '#E5503E' }}>*</span>
                </label>
                <select
                  className={`form-select${errors.bloodGroup ? ' error' : ''}`}
                  value={form.bloodGroup}
                  onChange={set('bloodGroup')}
                  style={{ height: '42px', borderRadius: '8px' }}
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <div className="form-error">{errors.bloodGroup}</div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Medical Conditions / Allergies
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Any medical conditions, allergies, or notes..."
                  rows={3}
                  value={form.description}
                  onChange={set('description')}
                  style={{ borderRadius: '8px', resize: 'vertical', minHeight: '80px' }}
                />
              </div>
            </div>

            <div
              style={{
                height: '1px',
                background: 'var(--color-border, #E2E8F0)',
                margin: '20px 0',
              }}
            />

            {/* Emergency Contact */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px',
                  color: 'var(--color-navy, #0B1F3F)',
                  fontWeight: 600,
                  fontSize: '13px',
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                }}
              >
                <IconPhone size={18} color="var(--color-teal, #1D9E75)" />
                Emergency Contact
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>
                  Contact Name <span style={{ color: '#E5503E' }}>*</span>
                </label>
                <input
                  className={`form-input${errors.emergencyContactName ? ' error' : ''}`}
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={form.emergencyContactName}
                  onChange={set('emergencyContactName')}
                  style={{ height: '42px', borderRadius: '8px' }}
                />
                {errors.emergencyContactName && (
                  <div className="form-error">{errors.emergencyContactName}</div>
                )}
              </div>

              <div
                className="form-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '14px',
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    Contact Number <span style={{ color: '#E5503E' }}>*</span>
                  </label>
                  <input
                    className={`form-input${errors.emergencyContactNumber ? ' error' : ''}`}
                    type="tel"
                    placeholder="10-digit number"
                    value={form.emergencyContactNumber}
                    onChange={set('emergencyContactNumber')}
                    style={{ height: '42px', borderRadius: '8px' }}
                  />
                  {errors.emergencyContactNumber && (
                    <div className="form-error">
                      {errors.emergencyContactNumber}
                    </div>
                  )}
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    Relationship <span style={{ color: '#E5503E' }}>*</span>
                  </label>
                  <input
                    className={`form-input${errors.emergencyContactRelation ? ' error' : ''}`}
                    type="text"
                    placeholder="e.g. Spouse, Parent"
                    value={form.emergencyContactRelation}
                    onChange={set('emergencyContactRelation')}
                    style={{ height: '42px', borderRadius: '8px' }}
                  />
                  {errors.emergencyContactRelation && (
                    <div className="form-error">
                      {errors.emergencyContactRelation}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
                style={{
                  flex: 1,
                  height: '44px',
                  borderRadius: '10px',
                  fontWeight: 600,
                }}
              >
                Skip for now
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
                style={{
                  flex: 2,
                  height: '44px',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderRadius: '10px',
                  boxShadow: '0 4px 14px rgba(29, 158, 117, 0.22)',
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner" /> Saving...
                  </>
                ) : (
                  <>
                    <IconCheck size={18} />
                    Complete Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

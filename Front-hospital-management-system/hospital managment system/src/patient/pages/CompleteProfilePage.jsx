import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerPatientDetails, getProfile } from '../api/patientApi';

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
      const email = localStorage.getItem('userEmail');
      const res = await registerPatientDetails({ ...form, email });
      toast.success(res.message || 'Profile completed!');

      // Fetch profile to get patientId
      try {
        const profile = await getProfile(email);
        if (profile.patientId) {
          localStorage.setItem('patientId', profile.patientId);
        }
      } catch {}

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
    <div>
      <div className="page-header">
        <h1 className="page-title">Complete your profile</h1>
        <p className="page-subtitle">
          Please fill in your medical details to get started
        </p>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Any medical conditions, allergies, or notes..."
              value={form.description}
              onChange={set('description')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Blood group</label>
            <select
              className={`form-select${errors.bloodGroup ? ' error' : ''}`}
              value={form.bloodGroup}
              onChange={set('bloodGroup')}
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

          <div className="auth-divider">Emergency contact</div>

          <div className="form-group">
            <label className="form-label">Contact name</label>
            <input
              className={`form-input${errors.emergencyContactName ? ' error' : ''}`}
              type="text"
              placeholder="e.g. Jane Doe"
              value={form.emergencyContactName}
              onChange={set('emergencyContactName')}
            />
            {errors.emergencyContactName && (
              <div className="form-error">{errors.emergencyContactName}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact number</label>
              <input
                className={`form-input${errors.emergencyContactNumber ? ' error' : ''}`}
                type="tel"
                placeholder="10-digit number"
                value={form.emergencyContactNumber}
                onChange={set('emergencyContactNumber')}
              />
              {errors.emergencyContactNumber && (
                <div className="form-error">
                  {errors.emergencyContactNumber}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Relationship</label>
              <input
                className={`form-input${errors.emergencyContactRelation ? ' error' : ''}`}
                type="text"
                placeholder="e.g. Spouse, Parent"
                value={form.emergencyContactRelation}
                onChange={set('emergencyContactRelation')}
              />
              {errors.emergencyContactRelation && (
                <div className="form-error">
                  {errors.emergencyContactRelation}
                </div>
              )}
            </div>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" /> Saving...
              </>
            ) : (
              'Complete profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

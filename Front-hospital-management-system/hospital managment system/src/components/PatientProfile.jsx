import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const PatientProfile = ({ email }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, [email]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/patient/profile/${email}`);
      setProfile(response.data);
      setFormData(response.data);
      if (response.data.patientId) {
        localStorage.setItem('patientId', response.data.patientId);
      }
      setError('');
    } catch (err) {
      setError('Could not fetch profile or profile does not exist yet. Please add your details.');
      setFormData({ email: email }); // Pre-fill email
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (profile && profile.bloodGroup) {
        // Update existing profile
        await axios.patch('http://localhost:8080/patient/UpdatePatientDetails', formData);
        showToast('Profile updated successfully!', 'success');
      } else {
        // Register medical details for the first time
        await axios.post('http://localhost:8080/patient/patient', formData);
        showToast('Medical details registered successfully!', 'success');
      }
      setEditMode(false);
      fetchProfile(); // Refresh profile data
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save details. Please check your inputs.', 'error');
    }
  };

  if (loading) return <div className="loading-state">Loading profile...</div>;

  return (
    <div className="dashboard-card fade-in">
      <div className="card-header">
        <h2>Personal & Medical Information</h2>
        {!editMode && (
          <button className="btn-secondary" onClick={() => {
            setFormData(profile || { email });
            setEditMode(true);
          }}>
            {profile && profile.bloodGroup ? 'Edit Profile' : 'Add Medical Details'}
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {editMode ? (
        <form onSubmit={handleUpdate} className="profile-form">
          <div className="form-row">
            <div className="form-group half-width">
              <label>First Name</label>
              <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
            </div>
            <div className="form-group half-width">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group half-width">
              <label>Email</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required readOnly />
            </div>
            <div className="form-group half-width">
              <label>Phone Number</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} pattern="^[0-9]{10}$" title="10 digit number required" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group half-width">
              <label>Blood Group</label>
              <input type="text" name="bloodGroup" value={formData.bloodGroup || ''} onChange={handleChange} required placeholder="e.g. O+" />
            </div>
            <div className="form-group half-width">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={formData.address || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Medical Description / Conditions</label>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="3" className="form-textarea"></textarea>
          </div>
          <h4 className="section-title">Emergency Contact</h4>
          <div className="form-row">
            <div className="form-group half-width">
              <label>Name</label>
              <input type="text" name="emergencyContactName" value={formData.emergencyContactName || ''} onChange={handleChange} required />
            </div>
            <div className="form-group half-width">
              <label>Number</label>
              <input type="tel" name="emergencyContactNumber" value={formData.emergencyContactNumber || ''} onChange={handleChange} required pattern="^[0-9]{10}$" />
            </div>
          </div>
          <div className="form-group">
            <label>Relation</label>
            <input type="text" name="emergencyContactRelation" value={formData.emergencyContactRelation || ''} onChange={handleChange} required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          {profile ? (
            <div className="profile-grid">
              <div className="profile-item"><span>Name</span><strong>{profile.firstName} {profile.lastName}</strong></div>
              <div className="profile-item"><span>Email</span><strong>{profile.email}</strong></div>
              <div className="profile-item"><span>Phone</span><strong>{profile.phoneNumber || '-'}</strong></div>
              <div className="profile-item"><span>DOB</span><strong>{profile.dob || '-'}</strong></div>
              <div className="profile-item"><span>Blood Group</span><strong>{profile.bloodGroup || 'Not set'}</strong></div>
              <div className="profile-item"><span>Address</span><strong>{profile.address || '-'}</strong></div>
              <div className="profile-item full-width"><span>Description</span><strong>{profile.description || 'None'}</strong></div>
              <div className="profile-item full-width">
                <span>Emergency Contact</span>
                <strong>{profile.emergencyContactName || '-'} ({profile.emergencyContactRelation || '-'}) - {profile.emergencyContactNumber || '-'}</strong>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No profile data found. Please add your medical details.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientProfile;

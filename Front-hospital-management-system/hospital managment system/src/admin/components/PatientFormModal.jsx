import React, { useState } from 'react';
import PhotoUpload from '../../patient/components/PhotoUpload';

export default function PatientFormModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    dob: '',
    bloodGroup: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactRelation: '',
    description: '',
    profilephoto: '',
    password: '',
  });

  const [prevData, setPrevData] = useState({ open, initialData });
  if (prevData.open !== open || prevData.initialData !== initialData) {
    setPrevData({ open, initialData });
    if (open && initialData) {
      const user = initialData.user || {};
      setFormData({
        email: user.email || initialData.email || '',
        firstName: user.firstName || initialData.firstName || '',
        lastName: user.lastName || initialData.lastName || '',
        phoneNumber: user.contactNumber || initialData.phoneNumber || '',
        address: user.address || initialData.address || '',
        dob: user.dob || initialData.dob || '',
        bloodGroup: initialData.bloodGroup || '',
        emergencyContactName: initialData.emergencyContactName || '',
        emergencyContactNumber: initialData.emergencyContactNumber || '',
        emergencyContactRelation: initialData.emergencyContactRelation || '',
        description: initialData.description || '',
        profilephoto: user.profilePhoto || initialData.profilephoto || '',
        password: '',
      });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      email: formData.email.trim(),
    };

    if (formData.firstName.trim()) payload.firstName = formData.firstName.trim();
    if (formData.lastName.trim()) payload.lastName = formData.lastName.trim();
    if (formData.phoneNumber.trim()) payload.phoneNumber = formData.phoneNumber.trim();
    if (formData.address.trim()) payload.address = formData.address.trim();
    if (formData.dob) payload.dob = formData.dob;
    if (formData.bloodGroup) payload.bloodGroup = formData.bloodGroup;
    if (formData.emergencyContactName.trim()) payload.emergencyContactName = formData.emergencyContactName.trim();
    if (formData.emergencyContactNumber.trim()) payload.emergencyContactNumber = formData.emergencyContactNumber.trim();
    if (formData.emergencyContactRelation.trim()) payload.emergencyContactRelation = formData.emergencyContactRelation.trim();
    if (formData.description.trim()) payload.description = formData.description.trim();
    if (formData.profilephoto.trim()) payload.profilephoto = formData.profilephoto.trim();
    if (formData.password.trim() && formData.password.trim().length >= 5) {
      payload.password = formData.password.trim();
    }

    onSubmit(payload);
  };

  if (!open) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal admin-modal-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="admin-modal-title">Edit Patient Details</div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
          Update details for patient {initialData?.user?.firstName || initialData?.firstName || ''} {initialData?.user?.lastName || initialData?.lastName || ''}.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">First name *</label>
              <input
                className="admin-form-input"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Last name *</label>
              <input
                className="admin-form-input"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Email *</label>
              <input
                className="admin-form-input"
                type="email"
                name="email"
                value={formData.email}
                readOnly
                style={{ backgroundColor: 'var(--color-bg-subtle, #F3F4F6)', cursor: 'not-allowed' }}
                required
              />
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted, #888)', marginTop: '2px', display: 'block' }}>
                Email identifies the patient record and cannot be changed.
              </span>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Phone number</label>
              <input
                className="admin-form-input"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit number"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Date of birth</label>
              <input
                className="admin-form-input"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Blood group</label>
              <select
                className="admin-form-select"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Address</label>
            <input
              className="admin-form-input"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Residential address"
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Emergency contact name</label>
              <input
                className="admin-form-input"
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                placeholder="Contact person"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Emergency contact relation</label>
              <input
                className="admin-form-input"
                type="text"
                name="emergencyContactRelation"
                value={formData.emergencyContactRelation}
                onChange={handleChange}
                placeholder="e.g. Parent, Spouse"
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Emergency contact number</label>
              <input
                className="admin-form-input"
                type="tel"
                name="emergencyContactNumber"
                value={formData.emergencyContactNumber}
                onChange={handleChange}
                placeholder="10-digit number"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">New password (optional)</label>
              <input
                className="admin-form-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <label className="admin-form-label" style={{ marginBottom: '10px' }}>Profile photo</label>
            <PhotoUpload
              value={formData.profilephoto}
              onChange={(url) => setFormData((prev) => ({ ...prev, profilephoto: url }))}
              isEditing={true}
              initials={`${(formData.firstName || '?')[0]}${(formData.lastName || '')[0] || ''}`.toUpperCase()}
              size={80}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Medical notes / Description</label>
            <textarea
              className="admin-form-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Medical history, allergies, or additional notes"
            />
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading || !formData.email.trim()}
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

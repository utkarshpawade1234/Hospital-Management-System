import React, { useState, useEffect } from 'react';
import PhotoUpload from '../../patient/components/PhotoUpload';
import { getDepartmentNames, getDepartments } from '../api/adminApi';

const normalizeDepartments = (list) => {
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => {
      if (typeof item === 'string') {
        return { name: item, id: null };
      }
      if (item && typeof item === 'object') {
        const deptName = item.departmentName || item.name || '';
        const deptId = item.departmentId || item.id || null;
        return { name: deptName, id: deptId };
      }
      return { name: String(item || ''), id: null };
    })
    .filter((item) => Boolean(item.name.trim()));
};

export default function DoctorFormModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const isCreateMode = !initialData;

  const [departmentsList, setDepartmentsList] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    specialization: '',
    qualification: '',
    yearsOfExperience: '',
    consultationFee: '',
    departmentId: '',
    departmentName: '',
    roomNumber: '',
    dateOfBirth: '',
    availabilityStatus: 'AVAILABLE',
    description: '',
    profilePhoto: '',
    licenseNumber: '',
  });

  // Fetch departments when modal opens
  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    Promise.allSettled([getDepartmentNames(), getDepartments()])
      .then(([namesRes, deptsRes]) => {
        if (!isMounted) return;
        let combined = [];
        if (namesRes.status === 'fulfilled') {
          combined = [...combined, ...normalizeDepartments(namesRes.value)];
        }
        if (deptsRes.status === 'fulfilled') {
          combined = [...combined, ...normalizeDepartments(deptsRes.value)];
        }
        // Deduplicate by lowercase department name
        const unique = [];
        const seen = new Set();
        for (const item of combined) {
          const key = item.name.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(item);
          }
        }
        setDepartmentsList(unique);
      })
      .catch(() => {
        if (isMounted) setDepartmentsList([]);
      });

    return () => {
      isMounted = false;
    };
  }, [open]);

  // Synchronize initialData / open into formData
  useEffect(() => {
    if (open) {
      if (initialData) {
        const user = initialData.user || {};
        setFormData({
          doctorId: initialData.doctorId || '',
          email: initialData.email || user.email || '',
          firstName: initialData.firstName || user.firstName || '',
          lastName: initialData.lastName || user.lastName || '',
          phoneNumber: initialData.phoneNumber || user.contactNumber || '',
          specialization: initialData.specialization || '',
          qualification: initialData.qualification || '',
          yearsOfExperience: initialData.yearsOfExperience ?? '',
          consultationFee: initialData.consultationFee ?? '',
          departmentId: initialData.departmentId || initialData.department?.departmentId || '',
          departmentName: initialData.departmentName || initialData.department?.departmentName || '',
          roomNumber: initialData.roomNumber ?? '',
          dateOfBirth: initialData.dateOfBirth || user.dob || '',
          availabilityStatus: initialData.availabilityStatus || 'AVAILABLE',
          description: initialData.description || '',
          profilePhoto: initialData.profilePhoto || user.profilePhoto || '',
          licenseNumber: initialData.licenseNumber || '',
        });
      } else {
        setFormData({
          doctorId: '',
          email: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          specialization: '',
          qualification: '',
          yearsOfExperience: '',
          consultationFee: '',
          departmentId: '',
          departmentName: '',
          roomNumber: '',
          dateOfBirth: '',
          availabilityStatus: 'AVAILABLE',
          description: '',
          profilePhoto: '',
          licenseNumber: '',
        });
      }
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (e) => {
    const selectedVal = e.target.value;
    const matchedDept = departmentsList.find(
      (d) => d.name.toLowerCase() === selectedVal.toLowerCase() || (d.id && String(d.id) === selectedVal)
    );
    setFormData((prev) => ({
      ...prev,
      departmentName: matchedDept ? matchedDept.name : selectedVal,
      departmentId: matchedDept && matchedDept.id ? matchedDept.id : prev.departmentId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = isCreateMode
      ? {
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          specialization: formData.specialization.trim(),
          qualification: formData.qualification.trim(),
          dateOfBirth: formData.dateOfBirth || null,
          yearsOfExperience: formData.yearsOfExperience !== '' ? Number(formData.yearsOfExperience) : 0,
          consultationFee: formData.consultationFee !== '' ? Number(formData.consultationFee) : 0,
          departmentId: formData.departmentId ? Number(formData.departmentId) : null,
          departmentName: formData.departmentName ? formData.departmentName.trim() : null,
          roomNumber: formData.roomNumber !== '' ? Number(formData.roomNumber) : null,
          description: formData.description ? formData.description.trim() : null,
          profilePhoto: formData.profilePhoto ? formData.profilePhoto.trim() : null,
          licenseNumber: formData.licenseNumber ? formData.licenseNumber.trim() : null,
        }
      : {
          doctorId: formData.doctorId ? Number(formData.doctorId) : undefined,
          email: formData.email.trim() || null,
          firstName: formData.firstName.trim() || null,
          lastName: formData.lastName.trim() || null,
          phoneNumber: formData.phoneNumber.trim() || null,
          specialization: formData.specialization.trim() || null,
          qualification: formData.qualification.trim() || null,
          yearsOfExperience: formData.yearsOfExperience !== '' ? Number(formData.yearsOfExperience) : null,
          consultationFee: formData.consultationFee !== '' ? Number(formData.consultationFee) : null,
          departmentId: formData.departmentId ? Number(formData.departmentId) : null,
          departmentName: formData.departmentName ? formData.departmentName.trim() : null,
          roomNumber: formData.roomNumber !== '' ? Number(formData.roomNumber) : null,
          availabilityStatus: formData.availabilityStatus || 'AVAILABLE',
          description: formData.description ? formData.description.trim() : null,
          profilePhoto: formData.profilePhoto ? formData.profilePhoto.trim() : null,
          licenseNumber: formData.licenseNumber ? formData.licenseNumber.trim() : null,
        };

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
        <div className="admin-modal-title">
          {isCreateMode ? 'Add New Doctor' : 'Edit Doctor Details'}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
          {isCreateMode
            ? 'Fill out all required details below to register a new doctor into the system.'
            : `Update Dr. ${initialData?.firstName || ''} ${initialData?.lastName || ''}'s details below.`}
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
                placeholder="e.g. John"
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
                placeholder="e.g. Smith"
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
                onChange={handleChange}
                readOnly={!isCreateMode}
                placeholder="doctor@hospital.com"
                style={!isCreateMode ? { backgroundColor: 'var(--color-bg-subtle, #F3F4F6)', cursor: 'not-allowed' } : {}}
                required={isCreateMode}
              />
              {!isCreateMode && (
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted, #888)', marginTop: '2px', display: 'block' }}>
                  Email identifies the doctor record and cannot be changed.
                </span>
              )}
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Phone number *</label>
              <input
                className="admin-form-input"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit number"
                pattern="^[0-9]{10}$"
                title="Phone number must be exactly 10 digits"
                required
              />
            </div>
          </div>

          <div className="admin-form-row">
            {isCreateMode && (
              <div className="admin-form-group">
                <label className="admin-form-label">Date of Birth *</label>
                <input
                  className="admin-form-input"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required={isCreateMode}
                />
              </div>
            )}
            <div className="admin-form-group">
              <label className="admin-form-label">Department {isCreateMode && '*'}</label>
              <select
                className="admin-form-select"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleDepartmentChange}
                required={isCreateMode}
              >
                <option value="">Select Department</option>
                {formData.departmentName &&
                  !departmentsList.some((d) => d.name.toLowerCase() === formData.departmentName.toLowerCase()) && (
                    <option value={formData.departmentName}>{formData.departmentName}</option>
                  )}
                {departmentsList.map((dept, idx) => (
                  <option key={idx} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            {!isCreateMode && (
              <div className="admin-form-group">
                <label className="admin-form-label">Availability Status</label>
                <select
                  className="admin-form-select"
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleChange}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="NOT_AVAILABLE">Not Available</option>
                  <option value="ON_LEAVE">On Leave</option>
                </select>
              </div>
            )}
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Specialization {isCreateMode && '*'}</label>
              <input
                className="admin-form-input"
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Cardiology"
                required={isCreateMode}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Qualification {isCreateMode && '*'}</label>
              <input
                className="admin-form-input"
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. MBBS, MD"
                required={isCreateMode}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Experience (Years) {isCreateMode && '*'}</label>
              <input
                className="admin-form-input"
                type="number"
                min="0"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="e.g. 5"
                required={isCreateMode}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Consultation Fee (₹) {isCreateMode && '*'}</label>
              <input
                className="admin-form-input"
                type="number"
                min="0"
                step="0.01"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                placeholder="e.g. 500"
                required={isCreateMode}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Room Number {isCreateMode && '*'}</label>
              <input
                className="admin-form-input"
                type="number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g. 102"
                required={isCreateMode}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">License Number</label>
              <input
                className="admin-form-input"
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="e.g. DOC-98765 (Auto-generated if empty)"
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <label className="admin-form-label" style={{ marginBottom: '10px' }}>Profile Photo</label>
            <PhotoUpload
              value={formData.profilePhoto}
              onChange={(url) => setFormData((prev) => ({ ...prev, profilePhoto: url }))}
              isEditing={true}
              initials={`${(formData.firstName || '?')[0]}${(formData.lastName || '')[0] || ''}`.toUpperCase()}
              size={80}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Description / Bio</label>
            <textarea
              className="admin-form-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief professional summary"
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
              disabled={loading || (isCreateMode && !formData.email.trim())}
            >
              {loading ? (isCreateMode ? 'Creating...' : 'Saving...') : (isCreateMode ? 'Create Doctor' : 'Save changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

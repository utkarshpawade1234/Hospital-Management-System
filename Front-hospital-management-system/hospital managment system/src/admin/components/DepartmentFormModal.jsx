import React, { useState, useEffect } from 'react';
import { getDoctors } from '../api/adminApi';

export default function DepartmentFormModal({
  open,
  onClose,
  onSubmit,
  initialData = null, // { departmentName, description, doctorIds }
  loading = false,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDoctorIds, setSelectedDoctorIds] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.departmentName || '');
        setDescription(initialData.description || '');
        setSelectedDoctorIds(initialData.doctorIds || []);
      } else {
        setName('');
        setDescription('');
        setSelectedDoctorIds([]);
      }
      fetchDoctors();
    }
  }, [open, initialData]);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      // Fetch a large page of doctors for the multi-select
      const res = await getDoctors(0, 100);
      setAllDoctors(res.content || []);
    } catch {
      setAllDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const toggleDoctor = (id) => {
    setSelectedDoctorIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEdit) {
      // For update, compute addDoctorIds and removeDoctorIds
      const originalIds = initialData.doctorIds || [];
      const addDoctorIds = selectedDoctorIds.filter(
        (id) => !originalIds.includes(id)
      );
      const removeDoctorIds = originalIds.filter(
        (id) => !selectedDoctorIds.includes(id)
      );
      onSubmit({
        departmentName: name.trim(),
        description: description.trim(),
        addDoctorIds,
        removeDoctorIds,
      });
    } else {
      onSubmit({
        departmentName: name.trim(),
        description: description.trim(),
        doctorIds: selectedDoctorIds,
      });
    }
  };

  if (!open) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal admin-modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-title">
          {isEdit ? 'Edit department' : 'Add department'}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Department name</label>
            <input
              className="admin-form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cardiology"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Description</label>
            <textarea
              className="admin-form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the department"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              Assign doctors{' '}
              <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>
                ({selectedDoctorIds.length} selected)
              </span>
            </label>
            {loadingDoctors ? (
              <div
                className="admin-multi-select"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
              >
                <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                  Loading doctors...
                </span>
              </div>
            ) : (
              <div className="admin-multi-select">
                {allDoctors.length === 0 ? (
                  <div
                    style={{
                      padding: '12px',
                      color: 'var(--color-text-muted)',
                      fontSize: '13px',
                      textAlign: 'center',
                    }}
                  >
                    No doctors available
                  </div>
                ) : (
                  allDoctors.map((doc) => (
                    <label key={doc.doctorId} className="admin-multi-option">
                      <input
                        type="checkbox"
                        checked={selectedDoctorIds.includes(doc.doctorId)}
                        onChange={() => toggleDoctor(doc.doctorId)}
                      />
                      <span>
                        Dr. {doc.firstName} {doc.lastName}
                        <span
                          style={{
                            color: 'var(--color-text-muted)',
                            marginLeft: '6px',
                            fontSize: '12px',
                          }}
                        >
                          — {doc.department ? doc.department.departmentName : 'Unassigned'}
                        </span>
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}
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
              disabled={loading || !name.trim()}
            >
              {loading
                ? isEdit
                  ? 'Saving...'
                  : 'Adding...'
                : isEdit
                ? 'Save changes'
                : 'Add department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

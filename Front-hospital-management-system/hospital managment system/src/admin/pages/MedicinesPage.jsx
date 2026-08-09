import React, { useState, useEffect, useCallback } from 'react';
import { IconPlus, IconEdit, IconCheck, IconPower } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import PaginatedTable from '../components/PaginatedTable';
import SearchBar from '../components/SearchBar';
import ConfirmModal from '../components/ConfirmModal';
import {
  getMedicines,
  searchMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  activateMedicine,
  deactivateMedicine,
} from '../api/adminApi';

export default function MedicinesPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const size = 10;

  // Form modal
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null); // null = add, object = edit
  const [formLoading, setFormLoading] = useState(false);
  const [inlineError, setInlineError] = useState('');

  // Form fields
  const [medicineName, setMedicineName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [strength, setStrength] = useState('');
  const [dosageForm, setDosageForm] = useState('');

  // Deactivate modal
  const [deactivateModal, setDeactivateModal] = useState({ open: false, medicine: null });
  const [deactivating, setDeactivating] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = keyword
        ? await searchMedicines(keyword, page, size)
        : await getMedicines(page, size);
      setData(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
    } catch {
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!ignore) {
        await fetchData();
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [fetchData]);

  const handleSearch = useCallback((val) => {
    setKeyword(val);
    setPage(0);
  }, []);

  const handleAddClick = () => {
    setFormData(null);
    setMedicineName('');
    setGenericName('');
    setManufacturer('');
    setStrength('');
    setDosageForm('');
    setInlineError('');
    setFormOpen(true);
  };

  const handleEditClick = async (medicine) => {
    setInlineError('');
    try {
      const detail = await getMedicineById(medicine.medicineId);
      setFormData(detail);
      setMedicineName(detail.medicineName || '');
      setGenericName(detail.genericName || '');
      setManufacturer(detail.manufacturer || '');
      setStrength(detail.strength || '');
      setDosageForm(detail.dosageForm || '');
      setFormOpen(true);
    } catch {
      toast.error('Failed to load medicine details');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    setFormLoading(true);
    setInlineError('');

    const dto = {
      medicineName: medicineName.trim(),
      genericName: genericName.trim() || null,
      manufacturer: manufacturer.trim() || null,
      strength: strength.trim() || null,
      dosageForm: dosageForm.trim() || null,
    };

    try {
      if (formData) {
        // Edit mode: Send only changed fields
        const changedFields = {};
        if (dto.medicineName !== formData.medicineName) changedFields.medicineName = dto.medicineName;
        if (dto.genericName !== formData.genericName) changedFields.genericName = dto.genericName;
        if (dto.manufacturer !== formData.manufacturer) changedFields.manufacturer = dto.manufacturer;
        if (dto.strength !== formData.strength) changedFields.strength = dto.strength;
        if (dto.dosageForm !== formData.dosageForm) changedFields.dosageForm = dto.dosageForm;

        await updateMedicine(formData.medicineId, changedFields);
        toast.success('Medicine updated successfully');
        setFormOpen(false);
        fetchData();
      } else {
        // Add mode
        await addMedicine(dto);
        toast.success('Medicine added successfully');
        setFormOpen(false);
        fetchData();
      }
    } catch (err) {
      if (err.response && (err.response.status === 400 || err.response.status === 409)) {
        const message = err.response.data?.message || 'Medicine already exists.';
        setInlineError(message);
      } else {
        toast.error(formData ? 'Failed to update medicine' : 'Failed to add medicine');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      const msg = await activateMedicine(id);
      toast.success(typeof msg === 'string' ? msg : 'Medicine activated successfully');
      fetchData();
    } catch {
      toast.error('Failed to activate medicine');
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateModal.medicine) return;
    setDeactivating(true);
    try {
      const msg = await deactivateMedicine(deactivateModal.medicine.medicineId);
      toast.success(typeof msg === 'string' ? msg : 'Medicine deactivated successfully');
      setDeactivateModal({ open: false, medicine: null });
      fetchData();
    } catch {
      toast.error('Failed to deactivate medicine');
    } finally {
      setDeactivating(false);
    }
  };

  const columns = [
    { header: 'Medicine Name' },
    { header: 'Generic Name' },
    { header: 'Manufacturer' },
    { header: 'Strength' },
    { header: 'Dosage Form' },
    { header: 'Status' },
    { header: 'Actions', width: '120px' },
  ];

  const renderRow = (medicine, i) => {
    return (
      <tr key={medicine.medicineId || i} style={!medicine.isActive ? { opacity: 0.65 } : {}}>
        <td>
          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {medicine.medicineName}
          </div>
        </td>
        <td>{medicine.genericName || '—'}</td>
        <td>{medicine.manufacturer || '—'}</td>
        <td>{medicine.strength || '—'}</td>
        <td>{medicine.dosageForm || '—'}</td>
        <td>
          <span
            className="admin-pill"
            style={{
              backgroundColor: medicine.isActive ? '#EAF3DE' : '#FCEBEB',
              color: medicine.isActive ? '#27500A' : '#791F1F',
            }}
          >
            {medicine.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <div className="admin-actions">
            <button
              className="admin-action-btn"
              title="Edit medicine"
              onClick={() => handleEditClick(medicine)}
            >
              <IconEdit size={16} />
            </button>
            {medicine.isActive ? (
              <button
                className="admin-action-btn danger"
                title="Deactivate medicine"
                onClick={() => setDeactivateModal({ open: true, medicine })}
              >
                <IconPower size={16} />
              </button>
            ) : (
              <button
                className="admin-action-btn success"
                style={{ color: 'var(--color-status-green)' }}
                title="Activate medicine"
                onClick={() => handleActivate(medicine.medicineId)}
              >
                <IconCheck size={16} />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Medicines</h1>
          <p className="admin-page-subtitle">
            Manage the hospital medicine catalog
          </p>
        </div>
      </div>

      <PaginatedTable
        columns={columns}
        data={data}
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        size={size}
        onPageChange={setPage}
        loading={loading}
        emptyMessage="No medicines found"
        title="Medicine Catalog"
        headerRight={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="admin-btn admin-btn-primary" onClick={handleAddClick}>
              <IconPlus size={16} style={{ marginRight: '6px' }} />
              Add Medicine
            </button>
            <SearchBar placeholder="Search by name..." onSearch={handleSearch} />
          </div>
        }
        renderRow={renderRow}
      />

      {/* Add / Edit Modal */}
      {formOpen && (
        <div className="admin-modal-overlay" onClick={() => setFormOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-title">
              {formData ? 'Edit Medicine' : 'Add Medicine'}
            </div>

            <form onSubmit={handleFormSubmit}>
              {inlineError && (
                <div
                  style={{
                    backgroundColor: 'var(--color-status-red-bg)',
                    color: 'var(--color-status-red)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '16px',
                    fontWeight: 500,
                  }}
                >
                  {inlineError}
                </div>
              )}

              <div className="admin-form-group">
                <label className="admin-form-label">Medicine Name *</label>
                <input
                  className="admin-form-input"
                  type="text"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="e.g. Amoxicillin"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Generic Name</label>
                <input
                  className="admin-form-input"
                  type="text"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                  placeholder="e.g. Amoxicillin Trihydrate"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Manufacturer</label>
                <input
                  className="admin-form-input"
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. Pfizer"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Strength</label>
                <input
                  className="admin-form-input"
                  type="text"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  placeholder="e.g. 500mg"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Dosage Form</label>
                <input
                  className="admin-form-input"
                  type="text"
                  value={dosageForm}
                  onChange={(e) => setDosageForm(e.target.value)}
                  placeholder="e.g. Tablet, Capsule, Syrup"
                />
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setFormOpen(false)}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={formLoading || !medicineName.trim()}
                >
                  {formLoading ? 'Saving...' : formData ? 'Save changes' : 'Add medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deactivation Modal */}
      <ConfirmModal
        open={deactivateModal.open}
        title="Deactivate Medicine"
        message={`Are you sure you want to deactivate ${deactivateModal.medicine?.medicineName || 'this medicine'}? Doctors will no longer be able to prescribe it.`}
        confirmLabel="Deactivate"
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivateModal({ open: false, medicine: null })}
        loading={deactivating}
      />
    </div>
  );
}

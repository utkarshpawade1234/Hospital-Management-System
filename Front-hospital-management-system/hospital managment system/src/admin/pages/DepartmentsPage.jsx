import React, { useState, useEffect, useCallback } from 'react';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconArrowLeft,
  IconBuildingHospital,
} from '@tabler/icons-react';
import toast from 'react-hot-toast';
import StatusPill from '../components/StatusPill';
import PaginatedTable from '../components/PaginatedTable';
import ConfirmModal from '../components/ConfirmModal';
import DepartmentFormModal from '../components/DepartmentFormModal';
import {
  getDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentDoctors,
} from '../api/adminApi';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState(null); // null = add, object = edit
  const [formLoading, setFormLoading] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, dept: null });
  const [deleting, setDeleting] = useState(false);

  // Drill-down: department doctors
  const [drillDept, setDrillDept] = useState(null);
  const [drillDoctors, setDrillDoctors] = useState([]);
  const [drillPage, setDrillPage] = useState(0);
  const [drillTotalPages, setDrillTotalPages] = useState(0);
  const [drillTotalElements, setDrillTotalElements] = useState(0);
  const [drillLoading, setDrillLoading] = useState(false);
  const drillSize = 10;

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await getDepartments();
      setDepartments(Array.isArray(res) ? res : []);
    } catch {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Drill-down fetch
  const fetchDrillDoctors = useCallback(async () => {
    if (!drillDept) return;
    setDrillLoading(true);
    try {
      const res = await getDepartmentDoctors(
        drillDept.departmentId,
        drillPage,
        drillSize
      );
      setDrillDoctors(res.content || []);
      setDrillTotalPages(res.totalPages || 0);
      setDrillTotalElements(res.totalElements || 0);
    } catch {
      toast.error('Failed to load department doctors');
    } finally {
      setDrillLoading(false);
    }
  }, [drillDept, drillPage]);

  useEffect(() => {
    if (drillDept) fetchDrillDoctors();
  }, [fetchDrillDoctors, drillDept]);

  const handleAdd = () => {
    setFormData(null);
    setFormOpen(true);
  };

  const handleEdit = async (dept) => {
    try {
      const detail = await getDepartmentById(dept.departmentId);
      setFormData(detail);
      setFormOpen(true);
    } catch {
      toast.error('Failed to load department details');
    }
  };

  const handleFormSubmit = async (dto) => {
    setFormLoading(true);
    try {
      if (formData) {
        // Edit mode — use DepartmentUpdateDTO shape
        await updateDepartment(formData.departmentId || formData.departmentName, dto);
        toast.success('Department updated successfully');
      } else {
        await addDepartment(dto);
        toast.success('Department added successfully');
      }
      setFormOpen(false);
      setFormData(null);
      fetchDepartments();
    } catch {
      toast.error(formData ? 'Failed to update department' : 'Failed to add department');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.dept) return;
    setDeleting(true);
    try {
      await deleteDepartment(deleteModal.dept.departmentId);
      toast.success('Department deleted successfully');
      setDeleteModal({ open: false, dept: null });
      fetchDepartments();
    } catch {
      toast.error('Failed to delete department');
    } finally {
      setDeleting(false);
    }
  };

  const handleDrillDown = (dept) => {
    setDrillDept(dept);
    setDrillPage(0);
  };

  // ─── Drill-down View ──────────────────────────────────────
  if (drillDept) {
    const doctorColumns = [
      { header: 'Doctor' },
      { header: 'Specialization' },
      { header: 'Experience' },
      { header: 'Fee' },
      { header: 'Status' },
    ];

    const renderDoctorRow = (doc, i) => {
      const name = `Dr. ${doc.firstName || ''} ${doc.lastName || ''}`.trim();
      const initials = `${(doc.firstName || '?')[0]}${(doc.lastName || '')[0] || ''}`.toUpperCase();

      return (
        <tr key={doc.doctorId || i}>
          <td>
            <div className="admin-cell-user">
              <div
                className="admin-cell-avatar"
                style={{ background: '#3B82F6' }}
              >
                {initials}
              </div>
              <div>
                <div className="admin-cell-name">{name}</div>
                <div className="admin-cell-sub">{doc.email || ''}</div>
              </div>
            </div>
          </td>
          <td>{doc.specialization || '—'}</td>
          <td>
            {doc.yearsOfExperience ? `${doc.yearsOfExperience} yrs` : '—'}
          </td>
          <td>{doc.consultationFee ? `₹${doc.consultationFee}` : '—'}</td>
          <td>
            <StatusPill status={doc.availabilityStatus} />
          </td>
        </tr>
      );
    };

    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => {
              setDrillDept(null);
              setDrillDoctors([]);
            }}
            style={{ marginBottom: '12px' }}
          >
            <IconArrowLeft size={16} />
            Back to departments
          </button>
          <h1 className="admin-page-title">{drillDept.departmentName}</h1>
          <p className="admin-page-subtitle">
            {drillDept.description || 'Doctors assigned to this department'}
          </p>
        </div>

        <PaginatedTable
          columns={doctorColumns}
          data={drillDoctors}
          page={drillPage}
          totalPages={drillTotalPages}
          totalElements={drillTotalElements}
          size={drillSize}
          onPageChange={setDrillPage}
          loading={drillLoading}
          emptyMessage="No doctors in this department"
          title={`Doctors in ${drillDept.departmentName}`}
          renderRow={renderDoctorRow}
        />
      </div>
    );
  }

  // ─── Card Grid View ────────────────────────────────────────
  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="admin-page-title">Departments</h1>
          <p className="admin-page-subtitle">
            Manage hospital departments and their doctors
          </p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleAdd}>
          <IconPlus size={16} />
          Add department
        </button>
      </div>

      {loading ? (
        <div className="admin-dept-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="admin-dept-card">
              <div
                className="admin-skeleton"
                style={{ width: '140px', height: '18px', marginBottom: '10px' }}
              />
              <div
                className="admin-skeleton"
                style={{ width: '100%', height: '14px', marginBottom: '6px' }}
              />
              <div
                className="admin-skeleton"
                style={{ width: '80%', height: '14px', marginBottom: '16px' }}
              />
              <div
                className="admin-skeleton"
                style={{ width: '60px', height: '12px' }}
              />
            </div>
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <IconBuildingHospital size={48} />
            <div className="admin-empty-title">No departments yet</div>
            <div className="admin-empty-text">
              Create your first department to get started.
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-dept-grid">
          {departments.map((dept) => (
            <div
              key={dept.departmentId}
              className="admin-dept-card"
              onClick={() => handleDrillDown(dept)}
            >
              <div className="admin-dept-name">{dept.departmentName}</div>
              <div className="admin-dept-desc">
                {dept.description || 'No description'}
              </div>
              <div className="admin-dept-footer">
                <div className="admin-dept-count">
                  Click to view doctors
                </div>
                <div
                  className="admin-dept-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="admin-action-btn"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(dept);
                    }}
                  >
                    <IconEdit size={16} />
                  </button>
                  <button
                    className="admin-action-btn danger"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({ open: true, dept });
                    }}
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <DepartmentFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setFormData(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={formData}
        loading={formLoading}
      />

      {/* Delete Modal */}
      <ConfirmModal
        open={deleteModal.open}
        title="Delete department"
        message={`Are you sure you want to delete "${deleteModal.dept?.departmentName || ''}"? All doctors will be unassigned from this department.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, dept: null })}
        loading={deleting}
      />
    </div>
  );
}

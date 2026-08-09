import React, { useState, useEffect, useCallback } from 'react';
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import PaginatedTable from '../components/PaginatedTable';
import SearchBar from '../components/SearchBar';
import DetailDrawer, { DrawerField } from '../components/DetailDrawer';
import ConfirmModal from '../components/ConfirmModal';
import PatientFormModal from '../components/PatientFormModal';
import {
  getPatients,
  searchPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from '../api/adminApi';

function calcAge(dob) {
  if (!dob) return '—';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function PatientsPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const size = 10;

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Edit Modal
  const [editModal, setEditModal] = useState({ open: false, patient: null });
  const [saving, setSaving] = useState(false);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState({ open: false, patient: null });
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = keyword
        ? await searchPatients(keyword, page, size)
        : await getPatients(page, size);
      setData(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
    } catch {
      toast.error('Failed to load patients');
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

  const handleView = async (id) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    try {
      const patient = await getPatientById(id);
      setDrawerData(patient);
    } catch {
      toast.error('Failed to load patient details');
      setDrawerOpen(false);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleEditSubmit = async (payload) => {
    setSaving(true);
    try {
      await updatePatient(payload);
      toast.success('Patient details updated successfully');
      setEditModal({ open: false, patient: null });
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update patient details');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.patient) return;
    setDeleting(true);
    try {
      await deletePatient(deleteModal.patient.patientId);
      toast.success('Patient record deleted successfully');
      setDeleteModal({ open: false, patient: null });
      fetchData();
    } catch {
      toast.error('Failed to delete patient record');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { header: 'Name' },
    { header: 'Age' },
    { header: 'Email' },
    { header: 'Contact' },
    { header: 'Blood group' },
    { header: 'Actions', width: '120px' },
  ];

  const renderRow = (patient, i) => {
    const user = patient.user || {};
    const firstName = user.firstName || patient.firstName || '';
    const lastName = user.lastName || patient.lastName || '';
    const name = `${firstName} ${lastName}`.trim() || '—';
    const initials = `${(firstName || '?')[0]}${(lastName || '')[0] || ''}`.toUpperCase();
    const dob = user.dob || patient.dob;
    const age = calcAge(dob);
    const email = user.email || patient.email || '—';
    const contact = user.contactNumber || patient.phoneNumber || patient.emergencyContactNumber || '—';

    return (
      <tr key={patient.patientId || i}>
        <td>
          <div className="admin-cell-user">
            <div
              className="admin-cell-avatar"
              style={{ background: '#8B5CF6' }}
            >
              {initials}
            </div>
            <div>
              <div className="admin-cell-name">{name}</div>
            </div>
          </div>
        </td>
        <td>{age}</td>
        <td>{email}</td>
        <td>{contact}</td>
        <td>{patient.bloodGroup || '—'}</td>
        <td>
          <div className="admin-actions">
            <button
              className="admin-action-btn"
              title="View details"
              onClick={() => handleView(patient.patientId)}
            >
              <IconEye size={16} />
            </button>
            <button
              className="admin-action-btn"
              title="Edit patient"
              onClick={() => setEditModal({ open: true, patient })}
            >
              <IconPencil size={16} />
            </button>
            <button
              className="admin-action-btn danger"
              title="Delete patient"
              onClick={() => setDeleteModal({ open: true, patient })}
            >
              <IconTrash size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Patients</h1>
        <p className="admin-page-subtitle">
          View and manage all patients registered in the system
        </p>
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
        emptyMessage="No patients found"
        title="All patients"
        headerRight={
          <SearchBar placeholder="Search by name..." onSearch={handleSearch} />
        }
        renderRow={renderRow}
      />

      {/* Detail Drawer */}
      <DetailDrawer
        open={drawerOpen}
        title="Patient details"
        onClose={() => {
          setDrawerOpen(false);
          setDrawerData(null);
        }}
        loading={drawerLoading}
      >
        {drawerData && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div
                className="admin-avatar"
                style={{
                  width: '48px',
                  height: '48px',
                  fontSize: '18px',
                  background: '#8B5CF6',
                }}
              >
                {(drawerData.user?.firstName || '?')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>
                  {drawerData.user?.firstName} {drawerData.user?.lastName}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Patient ID: {drawerData.patientId}
                </div>
              </div>
            </div>
            <DrawerField label="Email" value={drawerData.user?.email} />
            <DrawerField label="Contact" value={drawerData.user?.contactNumber} />
            <DrawerField label="Address" value={drawerData.user?.address} />
            <DrawerField
              label="Date of birth"
              value={drawerData.user?.dob}
            />
            <DrawerField
              label="Age"
              value={calcAge(drawerData.user?.dob)}
            />
            <DrawerField label="Blood group" value={drawerData.bloodGroup} />
            <DrawerField
              label="Emergency contact"
              value={
                drawerData.emergencyContactName
                  ? `${drawerData.emergencyContactName} (${drawerData.emergencyContactRelation || '—'}) — ${drawerData.emergencyContactNumber || '—'}`
                  : '—'
              }
            />
            <DrawerField label="Description" value={drawerData.description} />
          </>
        )}
      </DetailDrawer>

      {/* Edit Patient Modal */}
      <PatientFormModal
        open={editModal.open}
        initialData={editModal.patient}
        onClose={() => setEditModal({ open: false, patient: null })}
        onSubmit={handleEditSubmit}
        loading={saving}
      />

      {/* Delete Patient Modal */}
      <ConfirmModal
        open={deleteModal.open}
        title="Delete patient record"
        message={`Are you sure you want to delete patient record for "${deleteModal.patient?.user?.firstName || ''} ${deleteModal.patient?.user?.lastName || ''}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, patient: null })}
        loading={deleting}
      />
    </div>
  );
}

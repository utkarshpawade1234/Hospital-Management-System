import React, { useState, useEffect, useCallback } from 'react';
import { IconEye, IconTrash } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import PaginatedTable from '../components/PaginatedTable';
import SearchBar from '../components/SearchBar';
import StatusPill from '../components/StatusPill';
import ConfirmModal from '../components/ConfirmModal';
import DetailDrawer, { DrawerField } from '../components/DetailDrawer';
import {
  getDoctors,
  searchDoctors,
  getDoctorById,
  deleteDoctor,
} from '../api/adminApi';

export default function DoctorsPage() {
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

  // Delete
  const [deleteModal, setDeleteModal] = useState({ open: false, doc: null });
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = keyword
        ? await searchDoctors(keyword, page, size)
        : await getDoctors(page, size);
      setData(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
    } catch {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback((val) => {
    setKeyword(val);
    setPage(0);
  }, []);

  const handleView = async (id) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    try {
      const doc = await getDoctorById(id);
      setDrawerData(doc);
    } catch {
      toast.error('Failed to load doctor details');
      setDrawerOpen(false);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.doc) return;
    setDeleting(true);
    try {
      await deleteDoctor(deleteModal.doc.doctorId);
      toast.success('Doctor deleted successfully');
      setDeleteModal({ open: false, doc: null });
      fetchData();
    } catch {
      toast.error('Failed to delete doctor');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { header: 'Doctor' },
    { header: 'Department' },
    { header: 'Experience' },
    { header: 'Fee' },
    { header: 'Status' },
    { header: 'Actions', width: '100px' },
  ];

  const renderRow = (doc, i) => {
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
              <div className="admin-cell-sub">{doc.specialization || ''}</div>
            </div>
          </div>
        </td>
        <td>{doc.department || '—'}</td>
        <td>{doc.yearsOfExperience ? `${doc.yearsOfExperience} yrs` : '—'}</td>
        <td>{doc.consultationFee ? `₹${doc.consultationFee}` : '—'}</td>
        <td>
          <StatusPill status={doc.availabilityStatus} />
        </td>
        <td>
          <div className="admin-actions">
            <button
              className="admin-action-btn"
              title="View details"
              onClick={() => handleView(doc.doctorId)}
            >
              <IconEye size={16} />
            </button>
            <button
              className="admin-action-btn danger"
              title="Delete doctor"
              onClick={() => setDeleteModal({ open: true, doc })}
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
        <h1 className="admin-page-title">Doctors</h1>
        <p className="admin-page-subtitle">
          Manage all doctors and their availability
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
        emptyMessage="No doctors found"
        title="All doctors"
        headerRight={
          <SearchBar placeholder="Search by name..." onSearch={handleSearch} />
        }
        renderRow={renderRow}
      />

      {/* Detail Drawer */}
      <DetailDrawer
        open={drawerOpen}
        title="Doctor details"
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
                  background: '#3B82F6',
                }}
              >
                {(drawerData.firstName || '?')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>
                  Dr. {drawerData.firstName} {drawerData.lastName}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {drawerData.specialization}
                </div>
              </div>
            </div>
            <DrawerField label="Email" value={drawerData.email} />
            <DrawerField label="Phone" value={drawerData.phoneNumber} />
            <DrawerField label="Department" value={drawerData.department} />
            <DrawerField label="Qualification" value={drawerData.qualification} />
            <DrawerField
              label="Experience"
              value={
                drawerData.yearsOfExperience
                  ? `${drawerData.yearsOfExperience} years`
                  : '—'
              }
            />
            <DrawerField
              label="Consultation fee"
              value={
                drawerData.consultationFee
                  ? `₹${drawerData.consultationFee}`
                  : '—'
              }
            />
            <DrawerField
              label="Room number"
              value={drawerData.roomNumber || '—'}
            />
            <DrawerField
              label="Availability"
              value={<StatusPill status={drawerData.availabilityStatus} />}
            />
            <DrawerField label="Description" value={drawerData.description} />
          </>
        )}
      </DetailDrawer>

      {/* Delete Modal */}
      <ConfirmModal
        open={deleteModal.open}
        title="Delete doctor"
        message={`Are you sure you want to delete "Dr. ${deleteModal.doc?.firstName || ''} ${deleteModal.doc?.lastName || ''}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, doc: null })}
        loading={deleting}
      />
    </div>
  );
}

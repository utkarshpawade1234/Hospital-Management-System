import React, { useState, useEffect, useCallback } from 'react';
import { IconEye, IconTrash } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import PaginatedTable from '../components/PaginatedTable';
import SearchBar from '../components/SearchBar';
import StatusPill from '../components/StatusPill';
import ConfirmModal from '../components/ConfirmModal';
import DetailDrawer, { DrawerField } from '../components/DetailDrawer';
import { getUsers, searchUsers, getUserById, deleteUser } from '../api/adminApi';

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const size = 10;

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = keyword
        ? await searchUsers(keyword, page, size)
        : await getUsers(page, size);
      setData(res.content || []);
      setTotalPages(res.totalPages || 0);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      toast.error('Failed to load users');
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

  const handleView = async (userId) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    try {
      const user = await getUserById(userId);
      setDrawerData(user);
    } catch {
      toast.error('Failed to load user details');
      setDrawerOpen(false);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setDeleting(true);
    try {
      await deleteUser(deleteModal.user.user_id);
      toast.success('User deleted successfully');
      setDeleteModal({ open: false, user: null });
      fetchData();
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { header: 'Name' },
    { header: 'Email' },
    { header: 'Role' },
    { header: 'Contact' },
    { header: 'Actions', width: '100px' },
  ];

  const renderRow = (user, i) => {
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || '—';
    const initials = `${(user.firstName || '?')[0]}${(user.lastName || '')[0] || ''}`.toUpperCase();

    const roleColors = {
      ADMIN: '#F97066',
      DOCTOR: '#3B82F6',
      PATIENT: '#8B5CF6',
    };
    const avatarColor = roleColors[user.user_role] || '#6B7A99';

    return (
      <tr key={user.user_id || i}>
        <td>
          <div className="admin-cell-user">
            <div className="admin-cell-avatar" style={{ background: avatarColor }}>
              {initials}
            </div>
            <div>
              <div className="admin-cell-name">{name}</div>
            </div>
          </div>
        </td>
        <td>{user.email || '—'}</td>
        <td>
          <StatusPill status={user.user_role} />
        </td>
        <td>{user.contactNumber || '—'}</td>
        <td>
          <div className="admin-actions">
            <button
              className="admin-action-btn"
              title="View details"
              onClick={() => handleView(user.user_id)}
            >
              <IconEye size={16} />
            </button>
            <button
              className="admin-action-btn danger"
              title="Delete user"
              onClick={() =>
                setDeleteModal({ open: true, user })
              }
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
        <h1 className="admin-page-title">Users</h1>
        <p className="admin-page-subtitle">Manage all registered users in the system</p>
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
        emptyMessage="No users found"
        title="All users"
        headerRight={
          <SearchBar placeholder="Search by name..." onSearch={handleSearch} />
        }
        renderRow={renderRow}
      />

      {/* Detail Drawer */}
      <DetailDrawer
        open={drawerOpen}
        title="User details"
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
                style={{ width: '48px', height: '48px', fontSize: '18px' }}
              >
                {(drawerData.firstName || '?')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>
                  {drawerData.firstName} {drawerData.lastName}
                </div>
                <StatusPill status={drawerData.user_role} />
              </div>
            </div>
            <DrawerField label="Email" value={drawerData.email} />
            <DrawerField label="Contact" value={drawerData.contactNumber} />
            <DrawerField label="Address" value={drawerData.address} />
            <DrawerField label="Date of birth" value={drawerData.dob} />
            <DrawerField
              label="Registered on"
              value={
                drawerData.time_of_creation
                  ? new Date(drawerData.time_of_creation).toLocaleDateString()
                  : '—'
              }
            />
          </>
        )}
      </DetailDrawer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        title="Delete user"
        message={`Are you sure you want to delete "${deleteModal.user?.firstName || ''} ${deleteModal.user?.lastName || ''}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, user: null })}
        loading={deleting}
      />
    </div>
  );
}

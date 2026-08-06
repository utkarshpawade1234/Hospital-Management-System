import { useState, useEffect, useCallback } from 'react';
import { IconSearch, IconPill } from '@tabler/icons-react';
import api from '../api';
import toast from 'react-hot-toast';

export default function DoctorMedicines({ selectedId: propSelectedId, onSelect: propOnSelect }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Search state
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // Picker selection state (local state if uncontrolled)
  const [localSelectedId, setLocalSelectedId] = useState(null);
  const isControlled = propSelectedId !== undefined;
  const selectedId = isControlled ? propSelectedId : localSelectedId;

  const size = 20;

  // Debounce keyword change (300ms) and reset page to 0
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(0);
    }, 300);

    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = debouncedKeyword ? '/doctor/medicines/search' : '/doctor/medicines';
      const params = {
        page,
        size,
        ...(debouncedKeyword && { keyword: debouncedKeyword }),
      };

      const res = await api.get(endpoint, { params });
      setData(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 0);
      setTotalElements(res.data?.totalElements || 0);
    } catch (err) {
      toast.error('Failed to load medicine catalog');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedKeyword]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const handleCardClick = (id) => {
    if (propOnSelect) {
      propOnSelect(id);
    } else {
      setLocalSelectedId((prev) => (prev === id ? null : id));
    }
  };

  const start = page * size + 1;
  const end = Math.min((page + 1) * size, totalElements);

  return (
    <div style={{ paddingBottom: '40px' }}>
      <div className="page-header">
        <div>
          <h2>Medicines Catalog</h2>
          <p>Search and view active medicines for prescriptions</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-box-wrap" style={{ maxWidth: '400px', width: '100%', marginBottom: '20px' }}>
        <IconSearch size={18} />
        <input
          type="text"
          placeholder="Search medicines (e.g. paracetamol)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {loading ? (
        /* Loading shimmer skeleton pattern matching grid */
        <div className="medicine-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="card"
              style={{
                height: '110px',
                padding: '14px',
                borderRadius: '12px',
                border: '0.5px solid var(--border)',
                background: 'linear-gradient(90deg, #f9fafc 25%, #f4f6fa 50%, #f9fafc 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          ))}
        </div>
      ) : data.length === 0 ? (
        /* Proper empty state */
        <div className="card" style={{ padding: '40px', textAlign: 'center', marginTop: '16px' }}>
          <IconPill size={40} color="var(--text-secondary)" style={{ marginBottom: '12px' }} />
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600 }}>No Medicines Found</h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            {debouncedKeyword
              ? `No medicines found for '${debouncedKeyword}'`
              : 'No active medicines available.'}
          </p>
        </div>
      ) : (
        <>
          {/* Responsive grid card layout */}
          <div className="medicine-grid">
            {data.map((medicine) => {
              const isSelected = selectedId === medicine.medicineId;
              return (
                <div
                  key={medicine.medicineId}
                  className={`card medicine-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCardClick(medicine.medicineId)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: '0.5px solid var(--border)',
                    background: 'var(--card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '110px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ...(isSelected && {
                      borderColor: 'var(--teal)',
                      backgroundColor: '#F0F7FB',
                    })
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--navy)', marginBottom: '4px' }}>
                      {medicine.medicineName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {medicine.genericName || '—'} {medicine.strength ? `(${medicine.strength})` : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', borderTop: '0.5px solid var(--border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{medicine.dosageForm || '—'}</span>
                    <span>{medicine.manufacturer || '—'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Footer */}
          {totalPages > 0 && (
            <div className="doctor-pagination">
              <div className="doctor-pagination-info">
                Showing {start}–{end} of {totalElements}
              </div>
              <div className="doctor-pagination-buttons">
                <button
                  className="doctor-pagination-btn"
                  disabled={page <= 0}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </button>
                <button
                  className="doctor-pagination-btn"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

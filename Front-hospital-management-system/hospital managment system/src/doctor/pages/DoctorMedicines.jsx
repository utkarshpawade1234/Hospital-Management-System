import { useState, useEffect, useCallback } from 'react';
import { IconSearch, IconPill, IconX } from '@tabler/icons-react';
import api from '../api';
import toast from 'react-hot-toast';

// ─── palette tokens ───────────────────────────────────────────────────
const T = {
  navy:   '#0B1F3F',
  teal:   '#1D9E75',
  muted:  '#9FB3D4',
  sec:    '#6B7690',
  hair:   '#ECEEF3',
};

// ─── Medicine Detail Modal ────────────────────────────────────────────
function MedicineDetailModal({ medicineId, onClose }) {
  const [status, setStatus]   = useState('loading'); // loading | ok | error
  const [detail, setDetail]   = useState(null);

  const fetchDetail = useCallback(async () => {
    try {
      const res = await api.get(`/doctor/medicines/${medicineId}`);
      setDetail(res.data);
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  }, [medicineId]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!ignore) {
        await fetchDetail();
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [fetchDetail]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // ── shared label style ──────────────────────────────────────────────
  const lbl = {
    fontSize: '11px', fontWeight: 600, color: T.muted,
    textTransform: 'uppercase', letterSpacing: '0.45px', marginBottom: '4px',
  };
  const val = {
    fontSize: '14px', color: T.navy, fontWeight: 400,
  };

  return (
    /* Overlay */
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(11,31,63,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      {/* Modal */}
      <div style={{
        width: '420px', maxWidth: '100%',
        background: '#FFFFFF', borderRadius: '14px',
        padding: '24px',
        boxShadow: '0 16px 48px rgba(11,31,63,0.22)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none',
            cursor: 'pointer', color: T.sec, padding: '4px',
            display: 'flex', alignItems: 'center',
          }}
        >
          <IconX size={18} />
        </button>

        {/* ── LOADING ──────────────────────────────────────────── */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{
              width: 36, height: 36, border: `3px solid ${T.hair}`,
              borderTopColor: T.teal, borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
              margin: '0 auto 16px',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ fontSize: '13px', color: T.sec }}>Loading medicine details…</div>
          </div>
        )}

        {/* ── ERROR ────────────────────────────────────────────── */}
        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <IconPill size={36} color={T.muted} style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '14px', fontWeight: 500, color: T.navy, marginBottom: '6px' }}>
              Couldn't load medicine details.
            </div>
            <div style={{ fontSize: '12px', color: T.sec, marginBottom: '20px' }}>
              The server returned an error. Please try again.
            </div>
            <button
              onClick={fetchDetail}
              style={{
                background: T.teal, color: '#fff', border: 'none',
                borderRadius: '8px', padding: '9px 20px',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                marginRight: '8px',
              }}
            >
              Retry
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#fff', color: T.sec,
                border: `1px solid ${T.hair}`, borderRadius: '8px',
                padding: '9px 20px', fontSize: '13px', cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        )}

        {/* ── DETAIL ───────────────────────────────────────────── */}
        {status === 'ok' && detail && (
          <>
            {/* Header */}
            <div style={{ paddingRight: '28px', marginBottom: '10px' }}>
              <div style={{ fontSize: '18px', fontWeight: 500, color: T.navy, lineHeight: 1.3 }}>
                {detail.medicineName || '—'}
              </div>
              <div style={{ fontSize: '13px', color: T.sec, marginTop: '3px' }}>
                {[detail.genericName, detail.strength ? `(${detail.strength})` : ''].filter(Boolean).join(' ') || '—'}
              </div>
            </div>

            {/* Status pill */}
            <div style={{ marginBottom: '16px' }}>
              {detail.isActive
                ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    background: '#E1F5EE', color: '#085041',
                    borderRadius: '20px', padding: '3px 11px',
                    fontSize: '12px', fontWeight: 500,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.teal, display: 'inline-block' }} />
                    Active
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    background: '#F1F3F7', color: T.sec,
                    borderRadius: '20px', padding: '3px 11px',
                    fontSize: '12px', fontWeight: 500,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B0B8C9', display: 'inline-block' }} />
                    Inactive
                  </span>
                )}
            </div>

            {/* Divider */}
            <div style={{ borderTop: `1px solid ${T.hair}`, marginBottom: '18px' }} />

            {/* 2-col detail grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              rowGap: '16px',
              columnGap: '20px',
              marginBottom: '24px',
            }}>
              <div>
                <div style={lbl}>Generic name</div>
                <div style={val}>{detail.genericName || '—'}</div>
              </div>
              <div>
                <div style={lbl}>Strength</div>
                <div style={val}>{detail.strength || '—'}</div>
              </div>
              <div>
                <div style={lbl}>Dosage form</div>
                <div style={val}>{detail.dosageForm || '—'}</div>
              </div>
              <div>
                <div style={lbl}>Manufacturer</div>
                <div style={val}>{detail.manufacturer || '—'}</div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                width: '100%', background: T.teal, color: '#fff',
                border: 'none', borderRadius: '8px', padding: '11px',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main page component ──────────────────────────────────────────────
export default function DoctorMedicines({ selectedId: propSelectedId, onSelect: propOnSelect }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Search state
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // Modal state — only used when this page is NOT a picker
  const [modalId, setModalId] = useState(null);

  // Picker selection state (local state if uncontrolled)
  const isControlled = propSelectedId !== undefined;
  const selectedId = isControlled ? propSelectedId : null;

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
    } catch {
      toast.error('Failed to load medicine catalog');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedKeyword]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!ignore) {
        await fetchMedicines();
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [fetchMedicines]);

  const handleCardClick = (id) => {
    if (propOnSelect) {
      // Picker mode — delegate to parent
      propOnSelect(id);
    } else {
      // Standalone catalog mode — open detail modal
      setModalId(id);
    }
  };

  const start = page * size + 1;
  const end   = Math.min((page + 1) * size, totalElements);

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
        <div className="medicine-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="card"
              style={{
                height: '110px', padding: '14px', borderRadius: '12px',
                border: '0.5px solid var(--border)',
                background: 'linear-gradient(90deg, #f9fafc 25%, #f4f6fa 50%, #f9fafc 75%)',
                backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
              }}
            />
          ))}
        </div>
      ) : data.length === 0 ? (
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
          {/* Responsive grid */}
          <div className="medicine-grid">
            {data.map((medicine) => {
              const isSelected = selectedId === medicine.medicineId;
              return (
                <div
                  key={medicine.medicineId}
                  className={`card medicine-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleCardClick(medicine.medicineId)}
                  title="Click to view details"
                  style={{
                    padding: '14px', borderRadius: '12px',
                    border: '0.5px solid var(--border)',
                    background: 'var(--card)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    minHeight: '110px', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ...(isSelected && { borderColor: 'var(--teal)', backgroundColor: '#F0F7FB' }),
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
                  <div style={{
                    fontSize: '11px', color: 'var(--text-secondary)',
                    borderTop: '0.5px solid var(--border)', paddingTop: '8px',
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span>{medicine.dosageForm || '—'}</span>
                    <span>{medicine.manufacturer || '—'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
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

      {/* Detail modal — rendered at top of component tree via portal would be ideal,
          but inline conditional is fine here since it uses position:fixed */}
      {modalId !== null && (
        <MedicineDetailModal
          medicineId={modalId}
          onClose={() => setModalId(null)}
        />
      )}
    </div>
  );
}

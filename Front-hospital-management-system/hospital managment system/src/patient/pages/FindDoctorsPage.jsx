import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconStethoscope,
  IconSearch,
  IconCalendarEvent,
  IconUser,
  IconBuildingHospital,
  IconCurrencyRupee,
} from '@tabler/icons-react';
import toast from 'react-hot-toast';
import {
  searchDoctorsByName,
  searchDoctorsBySpecialization,
  searchDoctorsByDepartment,
  bookAppointment,
} from '../api/patientApi';

const TABS = [
  { key: 'name', label: 'By Name' },
  { key: 'specialization', label: 'By Specialization' },
  { key: 'department', label: 'By Department' },
];

const STATUS_MAP = {
  AVAILABLE: { cls: 'pill-green', label: 'Available' },
  NOT_AVAILABLE: { cls: 'pill-red', label: 'Not available' },
  ON_LEAVE: { cls: 'pill-amber', label: 'On leave' },
};

// 30-minute time slots between 09:00 and 17:00
const TIME_SLOTS = [
  { value: '09:00:00', label: '09:00 AM' },
  { value: '09:30:00', label: '09:30 AM' },
  { value: '10:00:00', label: '10:00 AM' },
  { value: '10:30:00', label: '10:30 AM' },
  { value: '11:00:00', label: '11:00 AM' },
  { value: '11:30:00', label: '11:30 AM' },
  { value: '12:00:00', label: '12:00 PM' },
  { value: '12:30:00', label: '12:30 PM' },
  { value: '14:00:00', label: '02:00 PM' },
  { value: '14:30:00', label: '02:30 PM' },
  { value: '15:00:00', label: '03:00 PM' },
  { value: '15:30:00', label: '03:30 PM' },
  { value: '16:00:00', label: '04:00 PM' },
  { value: '16:30:00', label: '04:30 PM' },
  { value: '17:00:00', label: '05:00 PM' },
];

export default function FindDoctorsPage() {
  const [tab, setTab] = useState('name');
  const [searchFields, setSearchFields] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    department: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Booking modal state
  const [bookingDoc, setBookingDoc] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    appointmentDate: '',
    appointmentTime: '',
    remarks: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      let results;
      if (tab === 'name') {
        const fn = searchFields.firstName.trim();
        const ln = searchFields.lastName.trim();
        if (!fn && !ln) {
          toast.error('Please enter a first name or last name');
          setLoading(false);
          return;
        }
        results = await searchDoctorsByName(fn, ln);
      } else if (tab === 'specialization') {
        results = await searchDoctorsBySpecialization(
          searchFields.specialization.trim()
        );
      } else {
        results = await searchDoctorsByDepartment(
          searchFields.department.trim()
        );
      }
      setDoctors(Array.isArray(results) ? results : []);
    } catch {
      toast.error('Search failed. Please try again.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.appointmentDate || !bookingForm.appointmentTime) {
      toast.error('Please select both appointment date and time slot.');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await bookAppointment({
        doctorId: bookingDoc.doctorId,
        appointmentDate: bookingForm.appointmentDate,
        appointmentTime: bookingForm.appointmentTime,
        remarks: bookingForm.remarks,
      });

      toast.success(res.message || 'Appointment booked successfully!');
      setBookingDoc(null);
      setBookingForm({ appointmentDate: '', appointmentTime: '', remarks: '' });
      navigate('/my-appointments');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || '';
      
      if (errMsg.toLowerCase().includes('already booked') || errMsg.toLowerCase().includes('exist')) {
        toast.error('That time is no longer available, please pick another');
        // Modal stays open so user can select another slot
      } else if (errMsg.toLowerCase().includes('leave') || errMsg.toLowerCase().includes('unavailable')) {
        toast.error("This doctor isn't taking appointments right now");
        setBookingDoc(null);
      } else {
        toast.error(errMsg || 'Failed to book appointment');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const setField = (field) => (e) =>
    setSearchFields({ ...searchFields, [field]: e.target.value });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Find doctors</h1>
        <p className="page-subtitle">
          Search for doctors and book appointments
        </p>
      </div>

      {/* Tabs */}
      <div className="search-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`search-tab${tab === t.key ? ' active' : ''}`}
            onClick={() => {
              setTab(t.key);
              setDoctors([]);
              setSearched(false);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search form */}
      <form className="search-form" onSubmit={handleSearch}>
        {tab === 'name' && (
          <>
            <input
              className="form-input"
              placeholder="First name (optional)"
              value={searchFields.firstName}
              onChange={setField('firstName')}
            />
            <input
              className="form-input"
              placeholder="Last name (optional)"
              value={searchFields.lastName}
              onChange={setField('lastName')}
            />
          </>
        )}
        {tab === 'specialization' && (
          <input
            className="form-input"
            placeholder="e.g. Cardiology, Dermatology"
            value={searchFields.specialization}
            onChange={setField('specialization')}
            required
          />
        )}
        {tab === 'department' && (
          <input
            className="form-input"
            placeholder="e.g. Cardiology, Neurology"
            value={searchFields.department}
            onChange={setField('department')}
            required
          />
        )}
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: 'auto' }}>
          <IconSearch size={16} />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="doctor-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="doctor-card">
              <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '140px', height: '16px', marginBottom: '6px' }} />
                  <div className="skeleton" style={{ width: '100px', height: '14px' }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: '100%', height: '60px', marginBottom: '16px' }} />
              <div className="skeleton" style={{ width: '120px', height: '32px' }} />
            </div>
          ))}
        </div>
      ) : doctors.length > 0 ? (
        <div className="doctor-grid">
          {doctors.map((doc) => {
            const initials = `${(doc.firstName || '?')[0]}${(doc.lastName || '')[0] || ''}`.toUpperCase();
            const isAvailable = doc.availabilityStatus === 'AVAILABLE';
            const status = STATUS_MAP[doc.availabilityStatus] || {
              cls: 'pill-blue',
              label: doc.availabilityStatus || '—',
            };

            return (
              <div key={doc.doctorId} className="doctor-card">
                <div className="doctor-card-header">
                  <div className="doctor-avatar">{initials}</div>
                  <div>
                    <div className="doctor-name">
                      Dr. {doc.firstName} {doc.lastName}
                    </div>
                    <div className="doctor-spec">{doc.specialization || '—'}</div>
                  </div>
                </div>

                <div className="doctor-details">
                  <div>
                    <div className="doctor-detail-label">Department</div>
                    <div className="doctor-detail-value">
                      {doc.department || '—'}
                    </div>
                  </div>
                  <div>
                    <div className="doctor-detail-label">Experience</div>
                    <div className="doctor-detail-value">
                      {doc.yearsOfExperience
                        ? `${doc.yearsOfExperience} years`
                        : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="doctor-detail-label">Fee</div>
                    <div className="doctor-detail-value">
                      {doc.consultationFee ? `₹${doc.consultationFee}` : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="doctor-detail-label">Status</div>
                    <div className="doctor-detail-value">
                      <span className={`pill ${status.cls}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="doctor-card-footer">
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Room {doc.roomNumber || '—'}
                  </span>
                  <button
                    className="btn btn-outline-teal btn-sm"
                    onClick={() => {
                      if (!isAvailable) {
                        toast.error("This doctor isn't taking appointments right now");
                        return;
                      }
                      setBookingDoc(doc);
                    }}
                    disabled={!isAvailable}
                    title={!isAvailable ? "This doctor isn't taking appointments right now" : "Book appointment"}
                  >
                    <IconCalendarEvent size={14} />
                    Book appointment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : searched ? (
        <div className="card">
          <div className="empty-state">
            <IconStethoscope size={48} />
            <div className="empty-state-title">No doctors found</div>
            <div className="empty-state-text">
              Try a different search term or filter.
            </div>
          </div>
        </div>
      ) : null}

      {/* ─── Task 8: Book Appointment Modal ────────────────────── */}
      {bookingDoc && (
        <div className="modal-overlay" onClick={() => setBookingDoc(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Book appointment</div>
            <div className="modal-subtitle">
              Fill in the details below to schedule your consultation
            </div>

            {/* Read-only Doctor Summary */}
            <div
              style={{
                backgroundColor: 'var(--color-bg)',
                borderRadius: '10px',
                padding: '14px 16px',
                marginBottom: '20px',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-navy)', marginBottom: '4px' }}>
                Dr. {bookingDoc.firstName} {bookingDoc.lastName}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconUser size={14} /> {bookingDoc.specialization || 'General'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconBuildingHospital size={14} /> {bookingDoc.department || 'General'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--color-teal)' }}>
                  <IconCurrencyRupee size={14} /> Fee: {bookingDoc.consultationFee ? `₹${bookingDoc.consultationFee}` : 'Free'}
                </span>
              </div>
            </div>

            <form onSubmit={handleBookSubmit}>
              {/* Date Picker */}
              <div className="form-group">
                <label className="form-label">Appointment Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={bookingForm.appointmentDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      appointmentDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Time Picker (30-minute slots) */}
              <div className="form-group">
                <label className="form-label">Time Slot</label>
                <select
                  className="form-select"
                  value={bookingForm.appointmentTime}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      appointmentTime: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select a time slot</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Remarks */}
              <div className="form-group">
                <label className="form-label">
                  Remarks{' '}
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>
                    (optional)
                  </span>
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe your symptoms or reason for visit..."
                  value={bookingForm.remarks}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, remarks: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setBookingDoc(null)}
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={bookingLoading}
                  style={{ width: 'auto' }}
                >
                  {bookingLoading ? (
                    <>
                      <span className="spinner" /> Confirming...
                    </>
                  ) : (
                    'Confirm booking'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

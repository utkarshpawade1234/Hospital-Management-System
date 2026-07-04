import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const DoctorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { showToast } = useToast();

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    remarks: ''
  });
  const [bookingStatus, setBookingStatus] = useState({ loading: false });

  // Profile View State
  const [profileDoctor, setProfileDoctor] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    
    try {
      const parts = searchQuery.trim().split(/\s+/);
      const fName = parts[0] || '';
      const lName = parts.length > 1 ? parts.slice(1).join(' ') : fName;

      // Query both endpoints concurrently
      const [nameRes, specRes] = await Promise.allSettled([
        axios.post('http://localhost:8080/patient/DoctorByFirstAndLastName', { firstName: fName, lastName: lName }),
        axios.post('http://localhost:8080/patient/DoctorBySpecialization', { specializatin: searchQuery })
      ]);

      let combinedDoctors = [];
      let unexpectedError = null;

      // Process Name results
      if (nameRes.status === 'fulfilled' && nameRes.value.data) {
        combinedDoctors = [...combinedDoctors, ...nameRes.value.data];
      } else if (nameRes.status === 'rejected' && nameRes.reason.response?.status !== 404) {
        unexpectedError = nameRes.reason;
      }

      // Process Specialization results
      if (specRes.status === 'fulfilled' && specRes.value.data) {
        const existingIds = new Set(combinedDoctors.map(d => d.doctorId));
        specRes.value.data.forEach(d => {
          if (!existingIds.has(d.doctorId)) {
            combinedDoctors.push(d);
          }
        });
      } else if (specRes.status === 'rejected' && specRes.reason.response?.status !== 404) {
        unexpectedError = unexpectedError || specRes.reason;
      }

      if (unexpectedError) {
        showToast(unexpectedError.response?.data?.message || 'An unexpected error occurred while searching.', 'error');
        setDoctors([]);
      } else {
        setDoctors(combinedDoctors);
      }

    } catch (err) {
      showToast('An unexpected error occurred while searching.', 'error');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingStatus({ loading: false });
    setBookingData({ appointmentDate: '', appointmentTime: '', remarks: '' });
  };

  const handleViewProfile = async (doctorId) => {
    setProfileLoading(true);
    setProfileDoctor(null);
    try {
      const response = await axios.get(`http://localhost:8080/doctor/profile/${doctorId}`);
      setProfileDoctor(response.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load doctor profile.', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const patientId = localStorage.getItem('patientId');
    if (!patientId) {
      showToast('Patient ID not found. Please ensure you have added your Medical Details in your profile.', 'error');
      return;
    }

    setBookingStatus({ loading: true });
    try {
      // Backend expects 'appointmentTime' to be HH:MM:SS format, so append :00 if it's HH:MM
      const timeWithSeconds = bookingData.appointmentTime.length === 5 
        ? `${bookingData.appointmentTime}:00` 
        : bookingData.appointmentTime;

      // Ensure date format is correct if backend needs specific parsing, usually YYYY-MM-DD works for LocalDate
      await axios.post('http://localhost:8080/appointment/booking', {
        patientId: parseInt(patientId),
        doctorId: selectedDoctor.doctorId,
        appointmentDate: bookingData.appointmentDate,
        appointmentTime: timeWithSeconds,
        remarks: bookingData.remarks || 'No remarks'
      });
      
      const doctorFirstName = selectedDoctor.firstName;
      // Close the booking modal instantly
      setSelectedDoctor(null);
      setBookingStatus({ loading: false });
      
      // Show global success toast popup
      showToast(`Appointment successfully booked with Dr. ${doctorFirstName}!`, 'success');
      
    } catch (err) {
      setBookingStatus({ loading: false });
      showToast(err.response?.data?.message || 'Failed to book appointment. Please try a different slot.', 'error');
    }
  };

  return (
    <div className="dashboard-card fade-in">
      <form onSubmit={handleSearch} className="modern-search-bar fade-in" style={{ marginTop: '1rem' }}>
        <div className="search-input-wrapper" style={{ paddingLeft: '1rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            required 
            placeholder="Search by doctor name or specialization (e.g. Cardiologist, Raj Patil...)"
            className="search-input"
          />
        </div>

        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      <div className="search-results">
        {loading && <div className="loading-state">Searching...</div>}
        
        {!loading && hasSearched && doctors.length === 0 && (
          <div className="empty-state">
            <p>No doctors found matching your criteria.</p>
          </div>
        )}
        
        {!loading && doctors.length > 0 && (
          <div className="doctor-grid">
            {doctors.map((doc, idx) => (
              <div key={idx} className="doctor-card">
                <div 
                  className="doctor-avatar" 
                  onClick={() => handleViewProfile(doc.doctorId)}
                  style={{ cursor: 'pointer' }}
                  title="View Profile"
                >
                  {doc.firstName?.charAt(0)}{doc.lastName?.charAt(0)}
                </div>
                <div className="doctor-info">
                  <h3>Dr. {doc.firstName} {doc.lastName}</h3>
                  <p className="specialty">{doc.specialization || 'Specialization N/A'}</p>
                  <p className="contact">{doc.email}</p>
                  <p className="contact">{doc.phoneNumber}</p>
                  <button className="btn-secondary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => handleBookClick(doc)}>
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDoctor && createPortal(
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Book Appointment with Dr. {selectedDoctor.firstName}</h3>
            
            <form onSubmit={handleBookingSubmit} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  required 
                  value={bookingData.appointmentDate}
                  onChange={(e) => setBookingData({...bookingData, appointmentDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time" 
                  required 
                  value={bookingData.appointmentTime}
                  onChange={(e) => setBookingData({...bookingData, appointmentTime: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Remarks</label>
                <input 
                  type="text" 
                  placeholder="Reason for visit"
                  value={bookingData.remarks}
                  onChange={(e) => setBookingData({...bookingData, remarks: e.target.value})}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" disabled={bookingStatus.loading}>
                  {bookingStatus.loading ? 'Booking...' : 'Confirm Booking'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setSelectedDoctor(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {profileLoading && createPortal(
        <div className="modal-overlay">
          <div className="modal-content" style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <p>Loading profile...</p>
          </div>
        </div>,
        document.body
      )}

      {profileDoctor && createPortal(
        <div className="drawer-overlay" onClick={(e) => {
          if (e.target.className === 'drawer-overlay') setProfileDoctor(null);
        }}>
          <div className="drawer-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="doctor-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                  {profileDoctor.user?.firstName?.charAt(0)}{profileDoctor.user?.lastName?.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', margin: '0' }}>Dr. {profileDoctor.user?.firstName} {profileDoctor.user?.lastName}</h3>
                  <span className="badge-primary" style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '15px', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>
                    {profileDoctor.specialization}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setProfileDoctor(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                &#x2715;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Professional Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Qualification</span>
                    <strong style={{ color: '#0f172a' }}>{profileDoctor.qualification}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Experience</span>
                    <strong style={{ color: '#0f172a' }}>{profileDoctor.yearsOfExperience} Years</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>License Number</span>
                    <strong style={{ color: '#0f172a' }}>{profileDoctor.licenseNumber}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Department</span>
                    <strong style={{ color: '#0f172a' }}>{profileDoctor.department?.departmentName || 'General'}</strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Clinic Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Consultation Fee</span>
                    <strong style={{ color: '#0f52ba', fontSize: '1.1rem' }}>${profileDoctor.consultationFee}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Room Number</span>
                    <strong style={{ color: '#0f172a' }}>{profileDoctor.roomNumber}</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Status</span>
                    <strong style={{ color: profileDoctor.availabilityStatus === 'AVAILABLE' ? '#166534' : '#991b1b' }}>
                      {profileDoctor.availabilityStatus?.replace('_', ' ')}
                    </strong>
                  </div>
                </div>
              </div>

              {profileDoctor.description && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>About</h4>
                  <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5', marginTop: '0.5rem' }}>
                    {profileDoctor.description}
                  </p>
                </div>
              )}

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
                onClick={() => {
                  setProfileDoctor(null);
                  handleBookClick({
                    doctorId: profileDoctor.doctorId,
                    firstName: profileDoctor.user.firstName,
                    lastName: profileDoctor.user.lastName
                  });
                }}
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default DoctorSearch;

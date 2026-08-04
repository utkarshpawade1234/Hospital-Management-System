import patientAxios from '../../patient/api/patientAxios';

// ─── Profile ────────────────────────────────────────────
export const getDoctorProfile = () =>
  patientAxios.get('/doctor/profile').then((r) => r.data);

export const updateDoctorProfile = (data) =>
  patientAxios.put('/doctor/profile', data).then((r) => r.data);

export const updateStatus = (status) =>
  patientAxios.put(`/doctor/status?availabilityStatus=${status}`).then((r) => r.data);

// ─── Appointments ───────────────────────────────────────
export const getDoctorAppointments = (page = 0, size = 10) =>
  patientAxios.get(`/doctor/appointments?page=${page}&size=${size}`).then((r) => r.data);

export const getAppointmentById = (id) =>
  patientAxios.get(`/doctor/appointments/${id}`).then((r) => r.data);

export const confirmAppointment = (id) =>
  patientAxios.put(`/doctor/appointments/${id}/confirm`).then((r) => r.data);

export const completeAppointment = (id) =>
  patientAxios.put(`/doctor/appointments/${id}/complete`).then((r) => r.data);

export const cancelAppointment = (id) =>
  patientAxios.put(`/doctor/appointments/${id}/cancel`).then((r) => r.data);

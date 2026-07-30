import adminAxios from './adminAxios';

// ─── Dashboard ──────────────────────────────────────────────
export const getDashboard = () =>
  adminAxios.get('/dashboard').then((r) => r.data);

// ─── Users ──────────────────────────────────────────────────
export const getUsers = (page = 0, size = 10) =>
  adminAxios.get('/users', { params: { page, size } }).then((r) => r.data);

export const searchUsers = (keyword, page = 0, size = 10) =>
  adminAxios.get('/users/search', { params: { keyword, page, size } }).then((r) => r.data);

export const getUserById = (id) =>
  adminAxios.get(`/users/${id}`).then((r) => r.data);

export const deleteUser = (id) =>
  adminAxios.delete(`/users/${id}`).then((r) => r.data);

// ─── Doctors ────────────────────────────────────────────────
export const getDoctors = (page = 0, size = 10) =>
  adminAxios.get('/doctors', { params: { page, size } }).then((r) => r.data);

export const searchDoctors = (keyword, page = 0, size = 10) =>
  adminAxios.get('/doctors/search', { params: { keyword, page, size } }).then((r) => r.data);

export const getDoctorById = (id) =>
  adminAxios.get(`/doctors/${id}`).then((r) => r.data);

export const deleteDoctor = (id) =>
  adminAxios.delete(`/doctors/${id}`).then((r) => r.data);

// ─── Patients ───────────────────────────────────────────────
export const getPatients = (page = 0, size = 10) =>
  adminAxios.get('/patients', { params: { 
    page, size } }).then((r) => r.data);

export const searchPatients = (keyword, page = 0, size = 10) =>
  adminAxios.get('/patients/search', { params: { keyword, page, size } }).then((r) => r.data);

export const getPatientById = (id) =>
  adminAxios.get(`/patients/${id}`).then((r) => r.data);

// ─── Departments ────────────────────────────────────────────
export const getDepartments = () =>
  adminAxios.get('/departments').then((r) => r.data);

export const getDepartmentById = (id) =>
  adminAxios.get(`/departments/${id}`).then((r) => r.data);

export const addDepartment = (dto) =>
  adminAxios.post('/departments', dto).then((r) => r.data);

export const updateDepartment = (id, dto) =>
  adminAxios.put(`/departments/${id}`, dto).then((r) => r.data);

export const deleteDepartment = (id) =>
  adminAxios.delete(`/departments/${id}`).then((r) => r.data);

export const getDepartmentDoctors = (id, page = 0, size = 10) =>
  adminAxios.get(`/departments/${id}/doctors`, { params: { page, size } }).then((r) => r.data);

// ─── Appointments ───────────────────────────────────────────
export const getAppointments = (page = 0, size = 10) =>
  adminAxios.get('/appointments', { params: { page, size } }).then((r) => r.data);

export const getAppointmentsByStatus = (status, page = 0, size = 10) =>
  adminAxios.get(`/appointments/status/${status}`, { params: { page, size } }).then((r) => r.data);

export const getAppointmentsByDoctor = (doctorId, page = 0, size = 10) =>
  adminAxios.get(`/appointments/doctor/${doctorId}`, { params: { page, size } }).then((r) => r.data);

export const getAppointmentsByPatient = (patientId, page = 0, size = 10) =>
  adminAxios.get(`/appointments/patient/${patientId}`, { params: { page, size } }).then((r) => r.data);

export const updateAppointmentStatus = (id, status) =>
  adminAxios.patch(`/appointments/${id}/status`, null, { params: { status } }).then((r) => r.data);

import patientAxios from './patientAxios';

// ─── Auth (public — no token needed) ────────────────────
export const register = (data) =>
  patientAxios.post('/patient/register', data).then((r) => r.data);

export const login = (data) =>
  patientAxios.post('/patient/login', data).then((r) => r.data);

export const forgotPassword = (email) =>
  patientAxios.post('/patient/forgot-password', { email }).then((r) => r.data);

export const resetPassword = (data) =>
  patientAxios.post('/patient/reset-password', data).then((r) => r.data);

// ─── Profile ────────────────────────────────────────────
export const getProfile = (email) =>
  patientAxios.get(`/patient/profile/${email}`).then((r) => r.data);

export const registerPatientDetails = (data) =>
  patientAxios.post('/patient/patient', data).then((r) => r.data);

export const updatePatientDetails = (data) =>
  patientAxios.patch('/patient/UpdatePatientDetails', data).then((r) => r.data);

// ─── Doctor Search ──────────────────────────────────────
export const searchDoctorsByName = (firstName, lastName) =>
  patientAxios
    .post('/patient/DoctorByFirstAndLastName', { firstName, lastName })
    .then((r) => r.data);

export const searchDoctorsBySpecialization = (specializatin) =>
  patientAxios
    .post('/patient/DoctorBySpecialization', { specializatin })
    .then((r) => r.data);

export const searchDoctorsByDepartment = (departmentName) =>
  patientAxios
    .post('/patient/DoctorByDepartment', { departmentName })
    .then((r) => r.data);

// ─── Appointments ───────────────────────────────────────
export const bookAppointment = (data) =>
  patientAxios.post('/appointment/booking', data).then((r) => r.data);

export const getMyAppointments = (patientId) =>
  patientAxios.get(`/appointment/patient/${patientId}`).then((r) => r.data);

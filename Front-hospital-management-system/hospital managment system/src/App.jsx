import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Patient
import AuthLayout from './patient/components/AuthLayout';
import PatientLayout from './patient/components/PatientLayout';
import LoginPage from './patient/pages/LoginPage';
import RegisterPage from './patient/pages/RegisterPage';
import ForgotPasswordPage from './patient/pages/ForgotPasswordPage';
import ResetPasswordPage from './patient/pages/ResetPasswordPage';
import CompleteProfilePage from './patient/pages/CompleteProfilePage';
import FindDoctorsPage from './patient/pages/FindDoctorsPage';
import MyProfilePage from './patient/pages/MyProfilePage';
import MyAppointmentsPage from './patient/pages/MyAppointmentsPage';

// Admin panel
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import UsersPage from './admin/pages/UsersPage';
import DoctorsPage from './admin/pages/DoctorsPage';
import PatientsPage from './admin/pages/PatientsPage';
import DepartmentsPage from './admin/pages/DepartmentsPage';
import AppointmentsPage from './admin/pages/AppointmentsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes (centered card, no navbar) */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Patient routes (top navbar) */}
        <Route element={<PatientLayout />}>
          <Route path="/dashboard" element={<FindDoctorsPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/find-doctors" element={<FindDoctorsPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
        </Route>

        {/* Admin panel routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

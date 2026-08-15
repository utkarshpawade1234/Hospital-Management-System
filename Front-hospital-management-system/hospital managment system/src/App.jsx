import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Patient
import AuthLayout from './patient/components/AuthLayout';
import PatientLayout from './patient/components/PatientLayout';
import LandingPage from './patient/pages/LandingPage';
import LoginPage from './patient/pages/LoginPage';
import RegisterPage from './patient/pages/RegisterPage';
import ForgotPasswordPage from './patient/pages/ForgotPasswordPage';
import ResetPasswordPage from './patient/pages/ResetPasswordPage';
import DashboardPage from './patient/pages/DashboardPage';
import CompleteProfilePage from './patient/pages/CompleteProfilePage';
import FindDoctorsPage from './patient/pages/FindDoctorsPage';
import MyProfilePage from './patient/pages/MyProfilePage';
import MyAppointmentsPage from './patient/pages/MyAppointmentsPage';
import PatientPrescriptions from './patient/pages/PatientPrescriptions';
import PaymentPage from './patient/pages/PaymentPage';
import PatientPaymentsPage from './patient/pages/PatientPaymentsPage';

// Admin panel
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import DoctorsPage from './admin/pages/DoctorsPage';
import PatientsPage from './admin/pages/PatientsPage';
import DepartmentsPage from './admin/pages/DepartmentsPage';
import AppointmentsPage from './admin/pages/AppointmentsPage';
import MedicinesPage from './admin/pages/MedicinesPage';
import AdminPaymentsPage from './admin/pages/AdminPaymentsPage';

// Doctor panel
import DoctorLayout from './doctor/components/DoctorLayout';
import DoctorDashboard from './doctor/pages/DoctorDashboard';
import DoctorAppointments from './doctor/pages/DoctorAppointments';
import DoctorProfile from './doctor/pages/DoctorProfile';
import DoctorMedicines from './doctor/pages/DoctorMedicines';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Auth routes (centered card layout) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Patient routes (top navbar) */}
        <Route element={<PatientLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/find-doctors" element={<FindDoctorsPage />} />
          <Route path="/doctors" element={<FindDoctorsPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/my-profile" element={<MyProfilePage />} />
          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="/my-payments" element={<PatientPaymentsPage />} />
        </Route>

        {/* Admin panel routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="medicines" element={<MedicinesPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
        </Route>

        {/* Doctor panel routes */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="medicines" element={<DoctorMedicines />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

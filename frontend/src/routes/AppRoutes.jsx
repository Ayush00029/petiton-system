import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import VerifyOtpPage from '../pages/VerifyOtpPage';
import PetitionsPage from '../pages/PetitionsPage';
import PetitionDetailsPage from '../pages/PetitionDetailsPage';
import PetitionSuccessPage from '../pages/PetitionSuccessPage';
import CreatePetitionPage from '../pages/CreatePetitionPage';
import MyPetitionsPage from '../pages/MyPetitionsPage';
import AdminDashboard from '../pages/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/petitions" element={<PetitionsPage />} />
      <Route path="/petitions/:id" element={<PetitionDetailsPage />} />
      <Route path="/petitions/:id/success" element={<PetitionSuccessPage />} />

      {/* Citizen Protected Pages */}
      <Route
        path="/petitions/create"
        element={
          <ProtectedRoute>
            <CreatePetitionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-petitions"
        element={
          <ProtectedRoute>
            <MyPetitionsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Page */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
